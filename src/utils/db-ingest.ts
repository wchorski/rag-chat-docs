import { readFile, readdir } from "node:fs/promises"
import path from "path"
import crypto from "crypto"
import matter from "gray-matter" // <-- install with: npm i gray-matter
import { getOrCreateCollection } from "./chroma-collections.js"
import { MarkdownTextSplitter } from "@langchain/textsplitters"

export async function ingestMarkdownDocs(
	collection_name: string,
	directory_path: string,
	uri_base: string | undefined
) {
	const splitter = new MarkdownTextSplitter({
		// chunkSize: 1000,
		chunkOverlap: 200,
	})

	try {
		const files = await readdir(directory_path)
		const mdFiles = files.filter((f) => f.endsWith(".md"))
		console.log(
			`📄 Found ${mdFiles.length} markdown files in '${directory_path}/*`
		)

		// ! Chunks FUNKY
		// Process all files and create chunks
		const allChunks = await Promise.all(
			mdFiles.map(async (filename) => {
				const filepath = path.join(directory_path, filename)
				const raw = await readFile(filepath, "utf-8")
				const uri = uriBuilder(uri_base || "", filepath)

				// Parse frontmatter
				const { data: frontmatter, content } = matter(raw)

				// Split content into chunks
				const chunks = await splitter.splitText(content.trim())
				console.log(`  ├─ ${filename}: ${chunks.length} chunks`)

				// Create a doc entry for each chunk, all sharing the same metadata & URI
				return chunks.map((chunk, idx) => {
					// Unique ID per chunk: hash of filename + chunk index
					const id = crypto
						.createHash("md5")
						.update(`${filename}-chunk-${idx}`)
						.digest("hex")

					// TODO parse first line in chunk document as header. use as anchor in uri
					// console.log({chunk});
					return {
						id,
						document: chunk,
						metadata: {
							...frontmatter,
							filename,
							filepath,
							chunkIndex: idx,
							totalChunks: chunks.length,
						},
						uri,
					}
				})
			})
		)

		// Flatten array of arrays into single array of chunks
		const docs = allChunks.flat()

		console.log(`📦 Total chunks created: ${docs.length}`)

		//! before added text splitting into chunks. remove later
		// const docs = await Promise.all(
		// 	mdFiles.map(async (filename) => {
		// 		const filepath = path.join(directory_path, filename)
		// 		const raw = await fs.readFile(filepath, "utf-8")
		// 		const uri = uriBuilder(uri_base || "", filepath)

		// 		// Parse frontmatter
		// 		const { data: frontmatter, content } = matter(raw)
		// 		const id = crypto.createHash("md5").update(filename).digest("hex") // stable per file

		// 		return {
		// 			id,
		// 			document: content.trim(),
		// 			metadata: {
		// 				...frontmatter,
		// 				filename,
		// 				filepath,
		//         filetype: ".md"
		// 			},
		// 			uri,
		// 		}
		// 	})
		// )

		const collection = await getOrCreateCollection(collection_name)
		const prevCount = await collection.count()
		// console.log(`📀 db prevCount: ${prevCount}`)

		// // TODO Optional: clear collection before adding (only for dev/testing)
		// // await collection.delete({ ids: docs.map((doc) => doc.id) })

		// const transformData = {
		// 	ids: docs.map((d) => d.id),
		// 	documents: docs.map((d) => d.document),
		// 	metadatas: docs.map((d) => d.metadata),
		// 	uris: docs.map((d) => d.uri),
		// }
		// console.log(transformData)
		// process.abort()

		startSpinner("Adding to collection...")

		await collection.add({
			ids: docs.map((d) => d.id),
			documents: docs.map((d) => d.document),
			metadatas: docs.map((d) => d.metadata),
			uris: docs.map((d) => d.uri),
		})

		stopSpinner("Database additions complete!", true)

		const currCount = await collection.count()
		console.log(`💿 db: ${currCount - prevCount} documents added`)

		const peek = await collection.peek({})
		console.log(`✅ "${collection_name}" Collection Peek: `, {
			documents: peek.documents.length,
			embeddings: peek.embeddings.length,
			ids: peek.ids.length,
			include: peek.include,
			metadatas: peek.metadatas.length,
			uris: peek.uris.length,
		})
		// console.log(
		// 	"✅ Collection peek.metadatas names:\n",
		// 	peek.metadatas.flatMap((meta) => meta?.name)
		// )
	} catch (error) {
		stopSpinner("Database additions failed!", false)
		console.log("❌ db-ingest.ts ERROR: ", error)
	}
}

// todo may need to add in base path for external sources (not hosted by same api app)
const uriBuilder = (base: string, path: string) => {
	const removedPrefix = removePublicPrefix(path)
	return base + removedPrefix
}

const removePublicPrefix = (str: string) => str.replace(/^public\/?/, "/")

const spinners = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
let i = 0
let interval: NodeJS.Timeout

function startSpinner(message = "Processing...") {
	i = 0
	interval = setInterval(() => {
		process.stdout.write(`\r${spinners[i]} ${message}`)
		i = (i + 1) % spinners.length
	}, 80)
}

function stopSpinner(message = "Done!", success = true) {
	clearInterval(interval)
	const icon = success ? "✓" : "✗"
	process.stdout.write(`\r${icon} ${message}         \n`)
}
