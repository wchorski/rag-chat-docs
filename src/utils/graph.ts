import { StateGraph, END } from "@langchain/langgraph"
import { ChatOllama } from "@langchain/ollama"
import { getCollection } from "./chroma-collections.js"

const OLLAMA_URL = "http://localhost:11434"

// Define the state interface
interface GraphState {
	collection: string
	question: string
	context: string | null
	answer: string | null
}

// Initialize clients

const llm = new ChatOllama({
	model: "llama3.2",
	baseUrl: OLLAMA_URL,
	temperature: 0.2,
})

// Node 1: Retrieve relevant documents
async function retrieve(state: GraphState): Promise<GraphState> {
	console.log("🔍 Retrieving relevant documents...")

	const collection = await getCollection(state.collection)
	if (!collection) throw new Error("collection not found")

	// Query using text directly - ChromaDB handles embeddings
	const results = await collection.query({
		queryTexts: [state.question],
		nResults: 5,
	})
	console.log({ results })

  process.exit(0);

	const context = JSON.stringify(results)

	return { ...state, context }
}

// TODO fine tune prompt
const INSTRUCTIONS = `
  You are a helpful assistant. Answer the question based on the provided context. 
  Use direct quotes from the referenced documents when applicable.
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

	const response = await llm.invoke(prompt)
	const answer =
		typeof response.content === "string"
			? response.content
			: JSON.stringify(response.content)

	return { ...state, answer }
}

// Build the graph
const workflow = new StateGraph<GraphState>({
	channels: {
		collection: null,
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

export const app = workflow.compile()
