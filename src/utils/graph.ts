import { StateGraph, END } from "@langchain/langgraph"
import { ChatOllama } from "@langchain/ollama"
import { dbQuery } from "./query.js"
// import fastify from "fastify"

// TODO how to use fastify envs?
const OLLAMA_URL = process.env.OLLAMA_URL
const OLLAMA_CHAT_MODEL = process.env.OLLAMA_CHAT_MODEL
// const OLLAMA_URL = "http://localhost:11434"
// const OLLAMA_CHAT_MODEL = "mistral"

// Define the state interface
interface GraphState {
	collection: string
	searchResults: Object
	question: string
	context: string | null
	answer: string | null
}

const ollama = new ChatOllama({
	model: OLLAMA_CHAT_MODEL,
	baseUrl: OLLAMA_URL,
	temperature: 0.2,
})

// Node 1: Retrieve relevant documents
async function retrieve(state: GraphState): Promise<GraphState> {
	console.log("🔍 Retrieving relevant documents...")

	// TODO add n as variable and set default to 7
	const results = await dbQuery(state.collection, state.question, 7)

	// TODO moved logic to helper function dbQuery()
	// const collection = await getCollection(state.collection)
	// if (!collection) throw new Error("collection not found")
	// Query using text directly - ChromaDB handles embeddings
	// const results = await collection.query({
	// 	queryTexts: [state.question],
	// 	nResults: 7,
	// })
	// console.log({ results })
	// process.exit(0);

	const searchResults = JSON.stringify(results)
	const context = formatContextForLLM(results)

	return { ...state, searchResults, context }
}

// TODO fine tune prompt
const INSTRUCTIONS = `
  You are a helpful assistant. Answer the question based on the provided context.
  Use direct quotes from the referenced documents when applicable.

  IMPORTANT GUIDELINES:
  - Each document is clearly separated and numbered
  - Reference specific documents by title when providing information
  - Some documents are split into chunks noted by its "Chunk Index". Documents with the same title are referencing the same resource. 
  - If multiple documents are relevant, synthesize information from them
  - Use direct quotes when applicable, citing the game title
  - If documents conflict, acknowledge the different perspectives
  - If no documents adequately answer the question, say so
`

// TODO use the manifest.json
// Node 2: Generate answer using LLM
async function generate(state: GraphState): Promise<GraphState> {
	console.log("💭 Generating answer...")

	const prompt = `
	  Instructions:
	  ${INSTRUCTIONS}

	  Context:
	  ${state.context}

	  Question: ${state.question}

	  Answer:
	`

	console.log("👀 Prompt length:", prompt.length, "characters")
	console.log("👀 Estimated tokens:", Math.ceil(prompt.length / 4))
	// console.log({ prompt, llm })
	// const response = {
	// 	content: `DEBUG: this is just a fake answer. db collection: ${state.collection}`,
	// }
	const response = await ollama.invoke(prompt)

	const answer =
		typeof response.content === "string"
			? response.content
			: JSON.stringify(response.content)

	console.log(" 🧠🧠🧠🧠🧠🧠🧠 am i working????????")
	console.log({ answer })

	return { ...state, answer }
}

// Build the graph
const workflow = new StateGraph<GraphState>({
	channels: {
		collection: null,
		searchResults: null,
		question: null,
		context: null,
		answer: null,
	},
})

workflow.addNode("retrieve", retrieve)
workflow.addNode("generate", generate)

// TODO why is TS mad?
//@ts-ignore
workflow.setEntryPoint("retrieve")
//@ts-ignore
workflow.addEdge("retrieve", "generate")
//@ts-ignore
workflow.addEdge("generate", END)

export const llm = workflow.compile()

//? Claud.ai suggested using XML format for "very structured data that is easily referenced by LLMS"
function formatContextForLLM(results: any): string {
	const documents = results.documents?.[0] || []
	const metadatas = results.metadatas?.[0] || []
	const distances = results.distances?.[0] || []

	if (documents.length === 0) {
		return "No relevant documents found."
	}

	// const priorityFields = ['title', 'platform', 'genre', 'year', 'rating']

	let formattedContext = "<retrieved_documents>\n\n"

	documents.forEach((doc: string, index: number) => {
		const metadata = metadatas[index] || {}
		const distance = distances[index]

		formattedContext += `<document id="${index + 1}">\n`
		formattedContext += `  <metadata>\n`

		Object.entries(metadata).forEach(([key, value]) => {
			// Convert camelCase or snake_case to Title Case
			const formattedKey = key.toLowerCase()
			// const formattedKey = key
			// 	.replace(/([A-Z])/g, " $1")
			// 	.replace(/_/g, " ")
			// 	.replace(/\b\w/g, (char) => char.toUpperCase())
			// 	.trim()

			formattedContext += `    <${formattedKey}>${value}</${formattedKey}>\n`
		})

		if (distance !== undefined) {
			formattedContext += `    <relevance_score>${(1 - distance).toFixed(
				3
			)}</relevance_score>\n`
		}

		formattedContext += `  </metadata>\n`
		formattedContext += `  <content>\n${doc}\n  </content>\n`
		formattedContext += `</document>\n\n`
	})

	formattedContext += "</retrieved_documents>"
	return formattedContext
}

// TODO remove later. moving to XML format
// function formatContextForLLM(results: any): string {
// 	const documents = results.documents?.[0] || []
// 	const metadatas = results.metadatas?.[0] || []
// 	const distances = results.distances?.[0] || []

// 	if (documents.length === 0) {
// 		return "No relevant documents found."
// 	}

// 	let formattedContext = "### Retrieved Documents\n\n"

// 	documents.forEach((doc: string, index: number) => {
// 		const metadata = metadatas[index] || {}
// 		const distance = distances[index]

// 		formattedContext += `#### Document ${index + 1}\n`

// 		// Dynamically format all metadata fields
// 		Object.entries(metadata).forEach(([key, value]) => {
// 			// Convert camelCase or snake_case to Title Case
// 			const formattedKey = key
// 				.replace(/([A-Z])/g, " $1")
// 				.replace(/_/g, " ")
// 				.replace(/\b\w/g, (char) => char.toUpperCase())
// 				.trim()

// 			formattedContext += `**${formattedKey}:** ${value}\n`
// 		})

// 		// Add relevance score if available
// 		if (distance !== undefined) {
// 			formattedContext += `**Relevance Score:** ${(1 - distance).toFixed(3)}\n`
// 		}

// 		formattedContext += `\n**Content:**\n${doc}\n`
// 		//? divider line
// 		formattedContext += `\n${"-".repeat(80)}\n\n`
// 	})

// 	return formattedContext
// }
