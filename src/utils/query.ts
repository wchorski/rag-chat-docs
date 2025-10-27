import { dbGetCollection } from "./chroma-collections.js"

export async function dbQuery(
	collectionName: string,
	question: string,
	n: number
) {
	try {
		const colletion = await dbGetCollection(collectionName)
		if (!colletion) throw new Error(`❌ collection ${collectionName} not found`)

		const res = await colletion.query({
			queryTexts: [question],
			nResults: n,
		})

		return res
	} catch (error) {
		console.log(error)
	}
}
