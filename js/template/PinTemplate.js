import html from "./html"
import ITemplate from "./ITemplate"
import sanitizeText from "./sanitizeText"
import Utility from "../Utility"
import NodeElement from "../element/NodeElement"

/**
 * @typedef {import("../element/NodeElement").default} NodeElement
 * @typedef {import("../element/PinElement").default} PinElement
 */
export default class PinTemplate extends ITemplate {

    /**
     * Computes the html content of the pin.
     * @param {PinElement} pin html element
     * @returns The result html
     */
    render(pin) {
        if (pin.isInput()) {
            return html`
                <span class="ueb-pin-icon"></span>
                ${sanitizeText(pin.getPinDisplayName())}
            `
        } else {
            return html`
                ${sanitizeText(pin.getPinDisplayName())}
                <span class="ueb-pin-icon"></span>
            `
        }
    }

    /**
     * Applies the style to the element.
     * @param {PinElement} pin element of the graph
     */
    apply(pin) {
        super.apply(pin)
        pin.classList.add(
            "ueb-node-" + (pin.isInput() ? "input" : pin.isOutput() ? "output" : "hidden"),
            "ueb-pin-" + sanitizeText(pin.getType())
        )
        pin.clickableElement = pin
        pin.nodeElement = pin.closest(NodeElement.tagName)
        if (!pin.nodeElement) {
            window.customElements.whenDefined(linkMessage.constructor.tagName).then(linkMessage)
        }
        pin.getLin
    }

    /**
     * Applies the connection style to the element.
     * @param {PinElement} pin
     */
    applyConnected(pin) {
        if (pin.isConnected()) {
            pin.classList.add("ueb-pin-fill")
        } else {
            pin.classList.remove("ueb-pin-fill")
        }
    }

    /**
     * @param {PinElement} pin
     */
    getLinkLocation(pin) {
        const rect = pin.querySelector(".ueb-pin-icon").getBoundingClientRect()
        return pin.blueprint.compensateTranslation(Utility.convertLocation(
            [(rect.left + rect.right) / 2, (rect.top + rect.bottom) / 2],
            pin.blueprint.gridElement))
    }
}
