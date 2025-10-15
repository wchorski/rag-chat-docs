import { formHandler } from "./form.js"
import { compose, transforms } from "./transforms.js"

const searchForm = document.forms.namedItem("searchForm")
if (!searchForm) throw new Error("form(s) not found")

const searchResListEl = document.querySelector("#search-results-list")
const preHealth = document.querySelector("#pre-health")
// const preSearch = document.querySelector("#pre-search")
const searchResultCardTemplate = document.querySelector(
	"#template-search-result-card"
)

// Get all TODOs and display them on the screen
async function fetchHealthStats() {
	try {
		const res = await fetch("/api/health", {
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
 */
function uiRenderSearchResultEls(data) {
	searchResListEl.innerHTML = ""
	if (!searchResultCardTemplate)
		throw new Error("searchResultCardTemplate missing")

	data.documents[0].forEach((doc, i) => {
		const metadata = data.metadatas[0][i]
		// const distance = data.distances[0][i]
		const matchDecimal = 1 - data.distances[0][i]
		const id = data.ids[0][i]

		const template = searchResultCardTemplate.content.cloneNode(true)
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
		metadataTableEl.innerHTML = `
      <tr>
        <th>id:</th>
        <td>${id}</td>
      </tr>
      <tr>
        <th>filename:</th>
        <td>${metadata.filename}</td>
      </tr>
      <tr>
        <th>uri:</th>
        <td>http://?????</td>
      </tr>
    `
		const li = document.createElement("li")
		li.appendChild(template)
		searchResListEl.appendChild(li)
	})
}

/**
 *
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
		// preSearch.textContent = JSON.stringify(data, null, 2)
		uiRenderSearchResultEls(data)

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
	fetchHealthStats()
})
