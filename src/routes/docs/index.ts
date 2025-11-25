import { FastifyPluginAsync } from "fastify"
import path from "node:path"
import fs from "node:fs/promises"
// const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
//   fastify.get('/', async function (request, reply) {
//     return 'this is an example'
//   })
// }

// export default example

const docs: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
	fastify.get("/", async (req, reply) => {
		try {
			const dirPath = path.join(__dirname, "../../../public", "docs")
			const structure = await readDirRecursive(
				dirPath,
				path.join(__dirname, "public")
			)

			const contentHTML = generateHTML(structure)

			const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>File Directory</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 900px;
              margin: 50px auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            h1 {
              color: #333;
              border-bottom: 3px solid #0066cc;
              padding-bottom: 10px;
            }
            h2 {
              color: #0066cc;
              margin-top: 30px;
              margin-bottom: 10px;
              font-size: 24px;
              border-bottom: 2px solid #eee;
              padding-bottom: 5px;
            }
            ul {
              list-style: none;
              padding: 0;
              margin: 10px 0 30px 0;
              background: white;
              border-radius: 5px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            li {
              padding: 12px 20px;
              border-bottom: 1px solid #eee;
            }
            li:last-child {
              border-bottom: none;
            }
            a {
              color: #0066cc;
              text-decoration: none;
              font-size: 16px;
            }
            a:hover {
              text-decoration: underline;
              color: #004499;
            }
          </style>
        </head>
        <body>
          <h1>Document Library</h1>
          ${contentHTML}
        </body>
      </html>
    `

			reply.type("text/html").send(html)
		} catch (err) {
			reply.status(500).send({ error: "Unable to read directory" })
		}
	})
}

export default docs

async function readDirRecursive(dirPath: string, baseDir: string) {
	const entries = await fs.readdir(dirPath, { withFileTypes: true })
	const structure = {}

	for (const entry of entries) {
		const fullPath = path.join(dirPath, entry.name)

		if (entry.isDirectory()) {
			// @ts-ignore
			structure[entry.name] = await readDirRecursive(fullPath, baseDir)
		} else if (entry.isFile()) {
			const relativePath = path.relative(baseDir, fullPath)
			// @ts-ignore
			if (!structure._files) structure._files = []
			// @ts-ignore
			structure._files.push({
				name: entry.name,
				path: relativePath.replace(/\\/g, "/"),
			})
		}
	}

	return structure
}

function generateHTML(structure: Object, level = 0) {
	let html = ""

	for (const [key, value] of Object.entries(structure)) {
		if (key === "_files") {
			// Render files as a list
			html += "<ul>\n"
			for (const file of value) {
				html += `  <li><a href="/files/${file.path.replace("/public", "")}">${
					file.name
				}</a></li>\n`
			}
			html += "</ul>\n"
		} else {
			// Render directory as h2 header
			const folderName = key.replace(/_/g, " ")
			html += `<h2 id="${folderName
				.toLowerCase()
				.replace(" ", "-")}">${folderName}</h2>\n`
			html += generateHTML(value, level + 1)
		}
	}

	return html
}
