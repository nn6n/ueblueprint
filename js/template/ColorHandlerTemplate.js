import IDraggableControlTemplate from "./IDraggableControlTemplate"
import Utility from "../Utility"

/** @typedef {import("../element/ColorHandlerElement").default} ColorHandlerElement */

/** @extends {IDraggableControlTemplate<ColorHandlerElement>} */
export default class ColorHandlerTemplate extends IDraggableControlTemplate {

    /**  @param {[Number, Number]} param0 */
    adjustLocation([x, y]) {
        const radius = Math.round(this.movementSpaceSize[0] / 2)
        x = x - radius
        y = -(y - radius)
        let [r, theta] = Utility.getPolarCoordinates([x, y])
        r = Math.min(r, radius), [x, y] = Utility.getCartesianCoordinates([r, theta])
        x = Math.round(x + radius)
        y = Math.round(-y + radius)
        const hsva = this.getColor().toHSVA()
        this.locationChangeCallback?.([x, y], radius, hsva[2], hsva[3])
        return [x, y]
    }

    getColor() {
        return this.element.windowElement.template.color
    }
}
