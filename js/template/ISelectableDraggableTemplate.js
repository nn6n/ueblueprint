import IDraggablePositionedTemplate from "./IDraggablePositionedTemplate"
import MouseMoveNodes from "../input/mouse/MouseMoveNodes"

/**
 * @typedef {import("../element/NodeElement").default} NodeElement
 * @typedef {import("../input/mouse/MouseMoveDraggable").default} MouseMoveDraggable
 */

/**
 * @template {NodeElement} T
 * @extends {IDraggablePositionedTemplate<T>}
 */
export default class ISelectableDraggableTemplate extends IDraggablePositionedTemplate {

    getDraggableElement() {
        return /** @type {Element} */ (this.element)
    }

    createDraggableObject() {
        return /** @type {MouseMoveDraggable} */ (new MouseMoveNodes(this.element, this.element.blueprint, {
            draggableElement: this.getDraggableElement(),
        }))
    }

    /** @param {Map} changedProperties */
    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties)
        if (this.element.selected && !this.element.listeningDrag) {
            this.element.setSelected(true)
        }
    }
}
