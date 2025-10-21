import type { FastifyInstance } from "fastify"

const path = require("node:path")

export default async function route(fastify: FastifyInstance, _opts: Object) {
	// Upload single or multiple files endpoint
	fastify.post("/upload", async (request, reply) => {
		try {
			const files = await request.files()
			const allDocuments = []
			const results = []

			console.log({ files })

			for await (const file of files) {
				try {
					const buffer = await file.toBuffer()
					const documents = parseFile(buffer, file.filename)
					allDocuments.push(...documents)
					results.push({
						filename: file.filename,
						documentsFound: documents.length,
						status: "parsed",
					})
				} catch (error: any) {
					fastify.log.error(`Error parsing ${file.filename}:`, error.toString())
					results.push({
						filename: file.filename,
						status: "error",
						error: error.message,
					})
				}
			}

			if (allDocuments.length === 0) {
				return reply.code(400).send({
					error: "No valid documents found",
					files: results,
				})
			}

			// const result = await insertDocuments(allDocuments)
			// console.log(result)

			return reply.send({
				message: "Documents inserted successfully",
				// totalDocuments: result.count,
				totalDocuments: "debug",
				files: results,
				success: true,
			})
		} catch (error: any) {
			fastify.log.error(error)
			return reply.code(500).send({ error: error.message })
		}
	})
}

function parseFile(data: any, filename: string) {
	const ext = path.extname(filename).toLowerCase()
	const content = data.toString("utf-8")
	const baseName = path.basename(filename, ext)
	console.log({ baseName })

	switch (ext) {
		case ".json":
			return JSON.parse(content)

		// case '.csv':
		//   const records = csvParse(content, { columns: true, skip_empty_lines: true })
		//   return records.map(row => ({
		//     title: row.title || row.Title || 'Untitled',
		//     content: row.content || row.Content || JSON.stringify(row),
		//   }))

		case ".html":
		case ".htm":
			return parseHTML(content, filename)

		// case ".md":
		// case ".txt":
		// 	// Parse frontmatter if it exists
		// 	const { frontmatter, content: bodyContent } = parseFrontmatter(content)

		// 	// Priority 1: Use frontmatter title if it exists
		// 	if (frontmatter && frontmatter.title) {
		// 		return [
		// 			{
		// 				title: frontmatter.title,
		// 				content: bodyContent.trim(),
		// 			},
		// 		]
		// 	}

		// 	// Priority 2: Look for a single H1 heading
		// 	const h1Match = bodyContent.match(/^#\s+(.+)$/m)
		// 	if (h1Match) {
		// 		const title = h1Match[1].trim()
		// 		// Remove the H1 from content
		// 		const contentWithoutH1 = bodyContent.replace(/^#\s+.+$/m, "").trim()
		// 		return [
		// 			{
		// 				title: title,
		// 				content: contentWithoutH1,
		// 			},
		// 		]
		// 	}

		// 	// Priority 3: Use filename
		// 	return [
		// 		{
		// 			title: baseName,
		// 			content: bodyContent.trim(),
		// 		},
		// 	]

		default:
			throw new Error(`Unsupported file type: ${ext}`)
	}
}

function parseHTML(htmlContent: string, filename: string) {
	const baseName = path.basename(filename, ".html")

	// Remove script and style tags
	let cleanedHTML = htmlContent
		.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
		.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")

	// Extract H1 title
	const h1Match = cleanedHTML.match(/<h1[^>]*>(.*?)<\/h1>/i)
	const title = h1Match ? h1Match[1].replace(/<[^>]+>/g, "").trim() : baseName

	// Remove H1 from content if found
	if (h1Match) {
		cleanedHTML = cleanedHTML.replace(/<h1[^>]*>.*?<\/h1>/i, "")
	}

	// Extract text content (remove all HTML tags)
	const textContent = cleanedHTML
		.replace(/<[^>]+>/g, " ")
		.replace(/\s+/g, " ")
		.trim()

	return [
		{
			title: title,
			content: textContent,
		},
	]
}
