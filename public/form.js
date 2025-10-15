/**
 * @typedef {import('types/Vote.js').VoteFormData} VoteFormData
 * @typedef {import('types/Elements.js').InputEls} InputEls
 * @typedef {import('types/Vote.js').VoteSubmitData} VoteSubmitData
 * @typedef {import("./transforms.js").TransformFunction} TransformFunction
 * @typedef {Object} FormSubmitResponse
 * @property {boolean} ok - Whether the submission was successful
 * @property {string} [id] - Optional ID of the submitted record
 */

// import { compose, transforms } from "./transforms.js"

// TODO figure out this typing for options.onSubmit for better stuff
//  * @param {(data: any) => Promise<FormSubmitResponse>} options.onSubmit - Async function to handle form data
/**
 * Creates a reusable form submit handler
 * @param {HTMLFormElement} form - The form element
 * @param {Object} options - Configuration options
 * @param {Function} options.onSubmit - Async function to handle form data
 * @param {Function} [options.transform] - Optional transform function for raw form data
 * @param {Function} [options.validate] - Optional validation function
 * @param {Function|string} [options.onSuccess] - Success handler (function or preset name)
 * @param {number} [options.successTimeout=3000] - Time to show success state
 * @param {string} [options.messageSel=".response-message"] - Message element selector
 */
export function formHandler(form, options) {
	const {
		onSubmit,
		onSuccess,
		transform,
		validate,
		successTimeout = 3000,
		messageSel = ".response-message",
	} = options
	if (!form) throw new Error("form not found")

	form.addEventListener("submit", async (e) => {
		e.preventDefault()
    form.setAttribute("data-state", "pending")

		const resMsgEl = form.querySelector(messageSel)
		if (!resMsgEl) throw new Error(`No element found: ${messageSel}`)

		const submitData = Object.fromEntries(
			//@ts-ignore
			new FormData(e.target)
		)

		try {
			//? if tranform doesn't contain async func then it will run as synchronous
			const transData = transform ? await transform(submitData) : submitData

			// Run validation if provided
			if (validate) validate(transData)

			// Execute submit handler
			const res = await onSubmit(transData)
			if (!res) throw new Error("No response returned")

			// Handle success
			const successHandler =
				typeof onSuccess === "string" ? successHandlers[onSuccess] : onSuccess

			if (successHandler) {
				successHandler(form, res, { resMsgEl, successTimeout })
			} else {
				// Default success behavior
				form.reset()
				form.setAttribute("data-state", "success")
				resMsgEl.textContent = `ok: ${res.ok} | timestamp: ${res.dateCreated}`

				setTimeout(() => {
					form.setAttribute("data-state", "idle")
				}, successTimeout)
			}
		} catch (error) {
			form.setAttribute("data-state", "error")
			console.error("Form submit error:", error)
			resMsgEl.textContent = String(error)
			throw new Error(String(error))
		}
	})
}

/**
 * @typedef {Object} SuccessContext
 * @property {HTMLElement} resMsgEl - The response message element
 * @property {number} successTimeout - Timeout duration for success state
 */

/**
 * Pre-defined success handlers for common form patterns
 * @type {Object.<string, Function>}
 */
export const successHandlers = {
	/**
	 * Reset form and show temporary success message
	 * @param {HTMLFormElement} form - The form element
	 * @param {FormSubmitResponse} res - Response from onSubmit
	 * @param {SuccessContext} context - Additional context
	 */
	reset: (form, res, { resMsgEl, successTimeout }) => {
		form.reset()
		form.setAttribute("data-state", "success")
		resMsgEl.textContent = `Success! | timestamp: ${new Date(res.dateCreated).toLocaleString()}`

		setTimeout(() => {
			form.setAttribute("data-state", "idle")
		}, successTimeout)
	},

	/**
	 * Disable form after successful submission
	 * @param {HTMLFormElement} form - The form element
	 * @param {Object} res - Response from onSubmit
	 * @param {SuccessContext} context - Additional context
	 */
	disable: (form, res, { resMsgEl }) => {
		form.setAttribute("data-state", "success")
		form.setAttribute("disabled", "true")

		// Disable all form inputs
		/** @type {InputEls} */
		const inputs = form.querySelectorAll(
			"fieldset, input, textarea, select, button"
		)
		// TODO add this back in after you prevent double submissions (with voterId local storage / finger print flag)
		inputs.forEach((input) => (input.disabled = true))

		resMsgEl.textContent = `Submitted successfully!`
	},

	/**
	 * Reset and disable form
	 * @param {HTMLFormElement} form - The form element
	 * @param {Object} res - Response from onSubmit
	 * @param {SuccessContext} context - Additional context
	 */
	resetAndDisable: (form, res, { resMsgEl }) => {
		form.reset()
		form.setAttribute("data-state", "success")
		form.setAttribute("disabled", "true")

		/** @type {InputEls} */
		const inputs = form.querySelectorAll("input, textarea, select, button")
		inputs.forEach((input) => (input.disabled = true))

		resMsgEl.textContent = `Thank you! Your submission has been recorded.`
	},

	/**
	 * Just show success state without resetting
	 * @param {HTMLFormElement} form - The form element
	 * @param {FormSubmitResponse} res - Response from onSubmit
	 * @param {SuccessContext} context - Additional context
	 */
	keepData: (form, res, { resMsgEl, successTimeout }) => {
		form.setAttribute("data-state", "success")
		resMsgEl.textContent = `Saved! ID: ${res.id || "N/A"}`

		setTimeout(() => {
			form.setAttribute("data-state", "idle")
		}, successTimeout)
	},

	/**
	 * Redirect to another page after success
	 * @param {string} url - URL to redirect to
	 * @returns {Function} Success handler function
	 */
	redirect:
		(url) =>
		/**
		 * @param {HTMLFormElement} form - The form element
		 * @param {Object} res - Response from onSubmit
		 * @param {SuccessContext} context - Additional context
		 * @returns {void}
		 */
		(form, res, { resMsgEl }) => {
			form.setAttribute("data-state", "success")
			resMsgEl.textContent = `Success! Redirecting...`

			setTimeout(() => {
				window.location.href = url
			}, 1500)
		},

	/**
	 * Hide form and show success message
	 * @param {HTMLFormElement} form - The form element
	 * @param {Object} res - Response from onSubmit
	 * @param {SuccessContext} context - Additional context
	 */
	hideForm: (form, res, { resMsgEl }) => {
		form.setAttribute("data-state", "success")
		form.style.display = "none"
		resMsgEl.textContent = `Thank you! Your submission has been received.`
		resMsgEl.style.display = "block"
	},

	/**
	 * Show custom success message based on response
	 * @param {Function} messageFormatter - Function to format success message
	 * @returns {Function} Success handler function
	 */
	customMessage:
		(messageFormatter) =>
		/**
		 * @param {HTMLFormElement} form - The form element
		 * @param {Object} res - Response from onSubmit
		 * @param {SuccessContext} context - Additional context
		 * @returns {void}
		 */
		(form, res, { resMsgEl, successTimeout }) => {
			form.reset()
			form.setAttribute("data-state", "success")
			resMsgEl.textContent = messageFormatter(res)

			setTimeout(() => {
				form.setAttribute("data-state", "idle")
			}, successTimeout)
		},
}
