import { client } from "../utils/chroma-collections.js"

async function shellDBCollectionDestroy() {
	// command line arg override
	const name = process.argv
		.find((arg) => arg.startsWith("--name="))
		?.split("=")[1]
	if (!name) throw new Error("col_name not set")

	try {
		await client.deleteCollection({ name })

		console.log(`🚮 Collection Destroyed: ${name}`)
	} catch (error) {
		console.log(error)
	}
}

shellDBCollectionDestroy()
