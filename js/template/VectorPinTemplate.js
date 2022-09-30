import { html } from "lit"
import IInputPinTemplate from "./IInputPinTemplate"
import RealPinTemplate from "./RealPinTemplate"
import Utility from "../Utility"
import VectorEntity from "../entity/VectorEntity"

/**
 * @typedef {import("../element/PinElement").default} PinElement
 * @typedef {import("../entity/LinearColorEntity").default} LinearColorEntity}
 */

export default class VectorPinTemplate extends RealPinTemplate {

    setDefaultValue(values = [], rawValues = values) {
        if (!(this.element.entity.DefaultValue instanceof VectorEntity)) {
            throw new TypeError("Expected DefaultValue to be a VectorEntity")
        }
        let vector = this.element.entity.DefaultValue
        vector.X = values[0]
        vector.Y = values[1]
        vector.Z = values[2]
    }

    renderInput() {
        if (this.element.isInput()) {
            return html`
                <div class="ueb-pin-input-wrapper">
                    <span class="ueb-pin-input-label">X</span>
                    <div class="ueb-pin-input">
                        <span class="ueb-pin-input-content ueb-pin-input-x" role="textbox" contenteditable="true" .innerText="${IInputPinTemplate.stringFromUEToInput(
                                Utility.minDecimals(
                                    this.element.entity.getDefaultValue().X
                                )
                            )}"></span>
                    </div>
                    <span class="ueb-pin-input-label">Y</span>
                    <div class="ueb-pin-input">
                        <span class="ueb-pin-input-content ueb-pin-input-y" role="textbox" contenteditable="true" .innerText="${IInputPinTemplate.stringFromUEToInput(
                                Utility.minDecimals(
                                    this.element.entity.getDefaultValue().Y
                                )
                            )}"></span>
                    </div>
                    <span class="ueb-pin-input-label">Z</span>
                    <div class="ueb-pin-input">
                        <span class="ueb-pin-input-content ueb-pin-input-z" role="textbox" contenteditable="true" .innerText="${IInputPinTemplate.stringFromUEToInput(
                                Utility.minDecimals(
                                    this.element.entity.getDefaultValue().Z
                                )
                            )}"></span>
                    </div>
                </div>
            `
        }
        return html``
    }
}
