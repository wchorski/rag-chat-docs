import fs from "fs/promises"
import path from "path"
import crypto from "crypto"
import matter from "gray-matter" // <-- install with: npm i gray-matter
import { getCollection } from "./chroma-collections.js"

const DOCS_DIR = "./docs"
const DB_COLLECTION = "dogs"

async function ingestMarkdownDocs() {
	const files = await fs.readdir(DOCS_DIR)
	const mdFiles = files.filter((f) => f.endsWith(".md"))
	console.log(`📄 Found ${mdFiles.length} markdown files in './docs/*`)

	const docs = await Promise.all(
		mdFiles.map(async (filename) => {
			const filepath = path.join(DOCS_DIR, filename)
			const raw = await fs.readFile(filepath, "utf-8")

			// Parse frontmatter
			const { data: frontmatter, content } = matter(raw)
			const id = crypto.createHash("md5").update(filename).digest("hex") // stable per file

			return {
				id,
				document: content.trim(),
				// todo add file type `.md` etc
				metadata: {
					...frontmatter,
					filename,
					filepath,
				},
				// uris:
			}
		})
	)

	// console.log(`📄 Ingest markdown files into vector db`)
	// docs.map((doc) => console.log(`  ├─ ${doc.metadata.filename}`))

	// TODO only use for dev. remove later
	// await deleteCollection(DB_COLLECTION)

	const collection = await getCollection(DB_COLLECTION)
	const prevCount = await collection.count()
	console.log(`📀 prevCount db: ${prevCount}`)

	// TODO Optional: clear collection before adding (only for dev/testing)
	// await collection.delete({ ids: docs.map((doc) => doc.id) })

	await collection.add({
		ids: docs.map((d) => d.id),
		documents: docs.map((d) => d.document),
		metadatas: docs.map((d) => d.metadata),
		// TODO add on by filepath sluggified
		// uris:
	})

	const currCount = await collection.count()
	console.log(`💿 currCount db: ${currCount}`)

	const peek = await collection.peek({})
	console.log("✅ Collection peek.metadatas:\n", peek.metadatas)
}

ingestMarkdownDocs().catch(console.error)
