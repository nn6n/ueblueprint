import MouseIgnore from "../../input/mouse/MouseIgnore.js"
import ITemplate from "../ITemplate.js"

/** @extends {ITemplate<InputElement>} */
export default class InputTemplate extends ITemplate {

    #focusHandler = () => {
        this.blueprint.acknowledgeEditText(true)
        if (this.element.selectOnFocus) {
            getSelection().selectAllChildren(this.element)
        }
    }

    #focusoutHandler = () => {
        this.blueprint.acknowledgeEditText(false)
        getSelection().removeAllRanges() // Deselect eventually selected text inside the input
    }

    /** @param {Event} e */
    #inputSingleLineHandler = e =>
        /** @type {HTMLElement} */(e.target).querySelectorAll("br").forEach(br => br.remove())

    /** @param {KeyboardEvent} e */
    #onKeydownBlurOnEnterHandler = e => {
        if (e.code == "Enter" && !e.shiftKey) {
            /** @type {HTMLElement} */(e.target).blur()
        }
    }

    /** @param {InputElement} element */
    initialize(element) {
        super.initialize(element)
        this.element.classList.add("ueb-pin-input-content")
        this.element.setAttribute("role", "textbox")
        if (this.element.contentEditable !== "false") {
            this.element.contentEditable = "true"
        }
    }

    /** @param {PropertyValues} changedProperties */
    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties)
        const event = new Event("input", { bubbles: true })
        this.element.dispatchEvent(event)
    }

    createInputObjects() {
        return [
            ...super.createInputObjects(),
            // Prevents creating links when selecting text and other undesired mouse actions detection
            new MouseIgnore(this.element, this.blueprint),
        ]
    }

    setup() {
        super.setup()
        this.element.addEventListener("focus", this.#focusHandler)
        this.element.addEventListener("focusout", this.#focusoutHandler)
        if (this.element.singleLine) {
            this.element.addEventListener("input", this.#inputSingleLineHandler)
        }
        if (this.element.blurOnEnter) {
            this.element.addEventListener("keydown", this.#onKeydownBlurOnEnterHandler)
        }
    }

    cleanup() {
        super.cleanup()
        this.element.removeEventListener("focus", this.#focusHandler)
        this.element.removeEventListener("focusout", this.#focusoutHandler)
        this.element.removeEventListener("input", this.#inputSingleLineHandler)
        this.element.removeEventListener("keydown", this.#onKeydownBlurOnEnterHandler)
    }
}
