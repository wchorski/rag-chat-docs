import fs from "fs/promises"
import path from "path"
import crypto from "crypto"
import matter from "gray-matter" // <-- install with: npm i gray-matter
import { getCollection } from "./chroma-collections.js"

export async function ingestMarkdownDocs(
	directory_path: string,
	collection_name: string,
	uri_base: string | undefined
) {
	const files = await fs.readdir(directory_path)
	const mdFiles = files.filter((f) => f.endsWith(".md"))
	console.log(
		`📄 Found ${mdFiles.length} markdown files in '${directory_path}/*`
	)

	const docs = await Promise.all(
		mdFiles.map(async (filename) => {
			const filepath = path.join(directory_path, filename)
			const raw = await fs.readFile(filepath, "utf-8")
			const uri = uriBuilder(uri_base || "", filepath)

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
				uri,
			}
		})
	)

	// console.log(`📄 Ingest markdown files into vector db`)
	// docs.map((doc) => console.log(`  ├─ ${doc.metadata.filename}`))

	// TODO only use for dev. remove later
	// await deleteCollection(DB_COLLECTION)

	const collection = await getCollection(collection_name)
	const prevCount = await collection.count()
	console.log(`📀 prevCount db: ${prevCount}`)

	// TODO Optional: clear collection before adding (only for dev/testing)
	// await collection.delete({ ids: docs.map((doc) => doc.id) })

	await collection.add({
		ids: docs.map((d) => d.id),
		documents: docs.map((d) => d.document),
		metadatas: docs.map((d) => d.metadata),
		// TODO add on by filepath sluggified
		uris: docs.map((d) => d.uri),
	})

	const currCount = await collection.count()
	console.log(`💿 currCount db: ${currCount}`)

	const peek = await collection.peek({})
	console.log(
		"✅ Collection peek.metadatas names:\n",
		peek.metadatas.flatMap((meta) => meta?.name)
	)
}

// todo may need to add in base path for external sources (not hosted by same api app)
const uriBuilder = (base: string, path: string) => {
	const removedPrefix = removePublicPrefix(path)
	return base + removedPrefix
}

const removePublicPrefix = (str: string) => str.replace(/^public\/?/, "/")
