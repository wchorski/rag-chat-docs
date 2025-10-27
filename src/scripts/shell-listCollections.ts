import { dbListAllCollections } from "../utils/chroma-collections.js"

async function shell_listCollections() {
	await dbListAllCollections()
}

shell_listCollections()