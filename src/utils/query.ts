import { getCollection } from "./chroma-collections.js"

const dogCollection = await getCollection("dogs")

export async function dogQuery(question: string, n:number) {

	const res = await dogCollection.query({
		queryTexts: [question],
		nResults: n,
	})

	// console.log(JSON.stringify(res, null, 2))

  return res
}
