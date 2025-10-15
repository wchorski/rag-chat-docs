import { StateGraph, END } from "@langchain/langgraph"
import { ChatOllama } from "@langchain/ollama"
import { client, getCollection } from "./chroma-collections.js"

const OLLAMA_URL = "http://localhost:11434"
const COLLECTION_NAME = "dogs"

// Define the state interface
interface GraphState {
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

	const collection = await getCollection(COLLECTION_NAME)

	// Query using text directly - ChromaDB handles embeddings
	const results = await collection.query({
		queryTexts: [state.question],
		nResults: 3,
	})

	const context = JSON.stringify(results)

	return { ...state, context }
}

// TODO fine tune prompt
const INSTRUCTIONS = `
  You are a helpful assistant. Answer the question based on the provided context.
`

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
		question: null,
		context: null,
		answer: null,
	},
})

workflow.addNode("retrieve", retrieve)
workflow.addNode("generate", generate)

workflow.setEntryPoint("retrieve")
workflow.addEdge("retrieve", "generate")
workflow.addEdge("generate", END)

export const app = workflow.compile()
