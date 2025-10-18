import { formHandler } from "./form.js"
import { compose, transforms } from "./transforms.js"

const searchForm = document.forms.namedItem("searchForm")
const chatForm = document.forms.namedItem("chatForm")
if (!searchForm || !chatForm) throw new Error("form(s) not found")

const searchResListEl = document.getElementById("search-results-list")
const chatResponseEl = document.getElementById("chat-response")
const searchQuestionEl = document.getElementById("search-question")
const preHealth = document.getElementById("pre-health")
if (!preHealth) throw new Error("preHealth not found in dom")
// const preSearch = document.querySelector("#pre-search")
const searchResultCardTemplate = document.getElementById(
	"template-search-result-card"
)

// Get all TODOs and display them on the screen
async function fetchHealthStats(collection) {
	try {
		const res = await fetch(`/api/health/:${collection}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			// body: JSON.stringify({}),
		})
		const data = await res.json()

		preHealth.textContent = JSON.stringify(data, null, 2)
		// console.log(data)

		// uiRenderTodoEls(data)
	} catch (error) {
		console.log(error)
	}
}

/**
 *
 * @param {{distances: number[], documents: string[], embeddings: string[], ids: string[], include: string[], metadatas: {title:string, filename: string}[], uris: string[]}} data
 * @param {{question:string, collection:string}} values
 */
function uiRenderSearchResultEls(data, values) {
	searchResListEl.innerHTML = ""
	if (!searchResultCardTemplate)
		throw new Error("searchResultCardTemplate missing")

	searchQuestionEl.textContent = `Question: ${values.question}`

	data.documents[0].forEach((doc, i) => {
		const metadata = data.metadatas[0][i]
		// const distance = data.distances[0][i]
		const matchDecimal = 1 - data.distances[0][i]
		const id = data.ids[0][i]

		const template = searchResultCardTemplate.content.cloneNode(true)
		template.id = id
		const titleEl = template.querySelector(".title")
		titleEl.textContent = metadata.title

		const distanceLabelEl = template.querySelector("label.distance")
		const distanceSpanEl = distanceLabelEl.querySelector("span")
		const distanceMeterEl = distanceLabelEl.querySelector("meter")
		distanceSpanEl.textContent = `${(matchDecimal * 100).toFixed(1)}% match`
		distanceMeterEl.value = matchDecimal

		const documentEl = template.querySelector("p.document")
		documentEl.textContent = doc

		const metadataTableEl = template.querySelector("table.meta-data")
		let innerHTML = ""
		for (const [key, value] of Object.entries(metadata)) {
			innerHTML += "  <tr>\n"
			innerHTML += `    <th>${key}</th>\n`
			innerHTML += `    <td>${value}</td>\n`
			innerHTML += "  </tr>\n"
		}
		metadataTableEl.innerHTML = innerHTML
		// metadataTableEl.innerHTML = `
		//   <tr>
		//     <th>id:</th>
		//     <td>${id}</td>
		//   </tr>
		//   <tr>
		//     <th>filename:</th>
		//     <td>${metadata.filename}</td>
		//   </tr>
		//   <tr>
		//     <th>uri:</th>
		//     <td>http://moeits.net/docs/${metadata.filename}</td>
		//   </tr>
		// `
		const li = document.createElement("li")
		li.appendChild(template)
		searchResListEl.appendChild(li)

		fetchHealthStats(values.collection)
	})
}

/**
 *
 * @param {{question: string, answer:string, context: {distances: number[], documents: string[], embeddings: string[], ids: string[], include: string[], metadatas: {title:string, filename: string}[], uris: string[]}}} data
 */
function uiRenderChatResponse(data) {
	const questionPEl = chatResponseEl.querySelector("p.question")
	questionPEl.textContent = `Question: ${data.question}`

	const answerPEl = chatResponseEl.querySelector("p.answer")
	answerPEl.textContent = data.answer

	const contextListEl = chatResponseEl.querySelector("ul.context")
	const context = JSON.parse(data.context)
	console.log(context)
	const metadataEls = context.metadatas[0].map((metadata) => {
		const li = document.createElement("li")
		li.textContent = `${metadata.title} | ${metadata.filename}`

		return li
	})
	contextListEl.append(...metadataEls)
}

/**
 * @param {{question: string}} values
 */
async function chatQuery(values) {
	try {
		const res = await fetch("/api/chat", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		})
		const data = await res.json()
		// console.log(JSON.stringify(data, null, 2))
		// console.log(data)
		// chatResponseEl.textContent = data.answer
		uiRenderChatResponse(data)

		// TODO stop being lazy
		return {
			...values,
			data,
		}
	} catch (error) {
		console.log(error)
	}
}

/**
 * @param {{question: string}} values
 */
async function searchQuery(values) {
	try {
		const res = await fetch("/api/search", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		})
		const data = await res.json()
    
		uiRenderSearchResultEls(data, values)

		// TODO stop being lazy
		return {
			...values,
			data,
		}
	} catch (error) {
		console.log(error)
	}
}

// update TODO
// function updateTodo(todo) {
// 	todo.completed = !todo.completed
// 	fetch(`http://localhost:3000/todos/${todo.id}`, {
// 		method: "PUT",
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify(todo),
// 	}).then(fetchTodos)
// }

// // remove TODO
// function deleteTodo(todo) {
// 	fetch(`http://localhost:3000/todos/${todo.id}`, {
// 		method: "DELETE",
// 	}).then(fetchTodos)
// }

// searchBtn.addEventListener("click", searchQuery)

async function ini() {
	formHandler(chatForm, {
		onSubmit: chatQuery,
		onSuccess: "reset",
		/** @param {{question:string}} values */
		validate: (values) => {
			//TODO validate min max of text
			if (!values.question) throw new Error("missing question text")
		},
		transform: (raw) => {
			return compose(
				transforms.trimStrings,
				transforms.addTimestamp
				// transforms.metadata({
				// 	authorId: uuid,
				// })
			)(raw)
		},
	})

	formHandler(searchForm, {
		onSubmit: searchQuery,
		onSuccess: "reset",
		/** @param {{question:string}} values */
		validate: (values) => {
			//TODO validate min max of text
			if (!values.question) throw new Error("missing question text")
		},
		transform: (raw) => {
			return compose(
				transforms.trimStrings,
				transforms.addTimestamp
				// transforms.metadata({
				// 	authorId: uuid,
				// })
			)(raw)
		},
	})
}

document.addEventListener("DOMContentLoaded", function () {
	ini()
	// fetchHealthStats()
})
