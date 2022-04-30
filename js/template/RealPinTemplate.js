// @ts-check

import Utility from "../Utility"
import IInputPinTemplate from "./IInputPinTemplate"

/**
 * @typedef {import("../element/PinElement").default} PinElement
 */

export default class RealPinTemplate extends IInputPinTemplate {

    /**
     * @param {PinElement} pin
     * @param {String[]?} values
     */
    setInputs(pin, values = []) {
        let num = parseFloat(values.length ? values[0] : this.getInput(pin))
        if (isNaN(num)) {
            num = parseFloat(pin.entity.AutogeneratedDefaultValue)
        }
        values[0] = Utility.minDecimals(num)
        super.setInputs(pin, values)
    }
}
