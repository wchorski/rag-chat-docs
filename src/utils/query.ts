import { getCollection } from "./chroma-collections.js"

export async function dbQuery(collectionName:string, question: string, n:number) {

  const colletion = await getCollection(collectionName)

	const res = await colletion.query({
		queryTexts: [question],
		nResults: n,
	})

  return res
}
