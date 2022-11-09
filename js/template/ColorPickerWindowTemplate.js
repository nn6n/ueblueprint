import { html } from "lit"
import { styleMap } from "lit/directives/style-map.js"
import ColorHandlerElement from "../element/ColorHandlerElement"
import ColorSliderElement from "../element/ColorSliderElement"
import Configuration from "../Configuration"
import LinearColorEntity from "../entity/LinearColorEntity"
import Utility from "../Utility"
import WindowTemplate from "./WindowTemplate"

/** @typedef {import("../element/WindowElement").default} WindowElement */

export default class ColorPickerWindowTemplate extends WindowTemplate {

    #wheelHandler = new ColorHandlerElement()
    get wheelHandler() {
        return this.#wheelHandler
    }

    #saturationSlider = new ColorSliderElement()
    get saturationSlider() {
        return this.#saturationSlider
    }

    #valueSlider = new ColorSliderElement()
    get valueSlider() {
        return this.#valueSlider
    }

    #rSlider = new ColorSliderElement()
    get rSlider() {
        return this.#rSlider
    }

    #gSlider = new ColorSliderElement()
    get gSlider() {
        return this.#gSlider
    }

    #bSlider = new ColorSliderElement()
    get bSlider() {
        return this.#bSlider
    }

    #aSlider = new ColorSliderElement()
    get aSlider() {
        return this.#aSlider
    }

    #hSlider = new ColorSliderElement()
    get hSlider() {
        return this.#hSlider
    }

    #sSlider = new ColorSliderElement()
    get sSlider() {
        return this.#sSlider
    }

    #vSlider = new ColorSliderElement()
    get vSlider() {
        return this.#vSlider
    }

    #hexRGBHandler =
        /** @param {UIEvent} v */
        v => {
            // Faster than innerText which causes reflow
            const input = Utility.clearHTMLWhitespace(/** @type {HTMLElement} */(v.target).innerHTML)
            const RGBAValue = parseInt(input, 16)
            if (isNaN(RGBAValue)) {
                return
            }
            this.color.setFromRGBANumber(RGBAValue)
            this.element.requestUpdate()
        }

    #hexSRGBHandler =
        /** @param {UIEvent} v */
        v => {
            // Faster than innerText which causes reflow
            const input = Utility.clearHTMLWhitespace(/** @type {HTMLElement} */(v.target).innerHTML)
            const sRGBAValue = parseInt(input, 16)
            if (isNaN(sRGBAValue)) {
                return
            }
            this.color.setFromSRGBANumber(sRGBAValue)
            this.element.requestUpdate()
        }

    #doOnEnter =
        /** @param {(e: UIEvent) => void} action */
        action =>
            /** @param {KeyboardEvent} e */
            e => {
                if (e.code == "Enter") {
                    action(e)
                    e.preventDefault()
                }
            }

    #color = new LinearColorEntity()
    get color() {
        return this.#color
    }
    /** @param {LinearColorEntity} value */
    set color(value) {
        if (value.toNumber() == this.color?.toNumber()) {
            return
        }
        this.element.requestUpdate("color", this.#color)
        this.#color = value
    }

    #fullColor = new LinearColorEntity()
    get fullColor() {
        return this.#fullColor
    }

    /** @type {LinearColorEntity} */
    #initialColor
    get initialColor() {
        return this.#initialColor
    }

    #tempColor = new LinearColorEntity()

    #colorHexReplace(channel, value, opaque = false) {
        const colorHex = this.color.toRGBAString()
        const result = `${colorHex.substring(0, 2 * channel)}${value}${colorHex.substring(2 + 2 * channel)}`
        return opaque ? `${result.substring(0, 6)}FF` : result
    }

    connectedCallback() {
        super.connectedCallback()
        this.#initialColor = this.element.windowOptions.getPinColor()
        this.color.setFromHSVA(
            this.initialColor.H.value,
            this.initialColor.S.value,
            this.initialColor.V.value,
            this.initialColor.A.value,
        )
        this.fullColor.setFromHSVA(this.color.H.value, 1, 1, 1)
    }

    /** @param {Map} changedProperties */
    firstUpdated(changedProperties) {
        this.wheelHandler.template.locationChangeCallback =
            /**
             * @param {Number} x in the range [0, 1]
             * @param {Number} y in the range [0, 1]
             */
            (x, y) => {
                this.color.setFromWheelLocation([x, y], this.color.V.value, this.color.A.value)
                this.fullColor.setFromHSVA(this.color.H.value, 1, 1, 1)
                this.element.requestUpdate()
            }
        this.saturationSlider.template.locationChangeCallback =
            /** @param {Number} x in the range [0, 1] */
            (x, y) => {
                this.color.setFromHSVA(this.color.H.value, y, this.color.V.value, this.color.A.value)
                this.element.requestUpdate()
            }
        this.valueSlider.template.locationChangeCallback =
            /** @param {Number} x in the range [0, 1] */
            (x, y) => {
                this.color.setFromHSVA(this.color.H.value, this.color.S.value, y, this.color.A.value)
                this.element.requestUpdate()
            }
        this.rSlider.template.locationChangeCallback =
            /** @param {Number} x in the range [0, 1] */
            (x, y) => {
                this.color.setFromRGBA([x, this.color.G.value, this.color.B.value, this.color.A.value])
                this.element.requestUpdate()
            }
        this.gSlider.template.locationChangeCallback =
            /** @param {Number} x in the range [0, 1] */
            (x, y) => {
                this.color.setFromRGBA([this.color.R.value, x, this.color.B.value, this.color.A.value])
                this.element.requestUpdate()
            }
        this.bSlider.template.locationChangeCallback =
            /** @param {Number} x in the range [0, 1] */
            (x, y) => {
                this.color.setFromRGBA([this.color.R.value, this.color.G.value, x, this.color.A.value])
                this.element.requestUpdate()
            }
        this.aSlider.template.locationChangeCallback =
            /** @param {Number} x in the range [0, 1] */
            (x, y) => {
                this.color.setFromRGBA([this.color.R.value, this.color.G.value, this.color.B.value, x])
                this.element.requestUpdate()
            }
        this.hSlider.template.locationChangeCallback =
            /** @param {Number} x in the range [0, 1] */
            (x, y) => {
                this.color.setFromHSVA(x, this.color.S.value, this.color.V.value, this.color.A.value)
                this.element.requestUpdate()
            }
        this.sSlider.template.locationChangeCallback =
            /** @param {Number} x in the range [0, 1] */
            (x, y) => {
                this.color.setFromHSVA(this.color.H.value, x, this.color.V.value, this.color.A.value)
                this.element.requestUpdate()
            }
        this.vSlider.template.locationChangeCallback =
            /** @param {Number} x in the range [0, 1] */
            (x, y) => {
                this.color.setFromHSVA(this.color.H.value, this.color.S.value, x, this.color.A.value)
                this.element.requestUpdate()
            }
        this.element.querySelector(".ueb-color-picker-wheel").appendChild(this.wheelHandler)
        this.element.querySelector(".ueb-color-picker-saturation").appendChild(this.saturationSlider)
        this.element.querySelector(".ueb-color-picker-value").appendChild(this.valueSlider)
        this.element.querySelector(".ueb-color-picker-r .ueb-horizontal-slider").appendChild(this.rSlider)
        this.element.querySelector(".ueb-color-picker-g .ueb-horizontal-slider").appendChild(this.gSlider)
        this.element.querySelector(".ueb-color-picker-b .ueb-horizontal-slider").appendChild(this.bSlider)
        this.element.querySelector(".ueb-color-picker-a .ueb-horizontal-slider").appendChild(this.aSlider)
        this.element.querySelector(".ueb-color-picker-h .ueb-horizontal-slider").appendChild(this.hSlider)
        this.element.querySelector(".ueb-color-picker-s .ueb-horizontal-slider").appendChild(this.sSlider)
        this.element.querySelector(".ueb-color-picker-v .ueb-horizontal-slider").appendChild(this.vSlider)
    }

    /** @param {Number} channel */
    renderSlider(channel) {
        let channelLetter = ""
        let channelValue = 0
        let background = ""
        const getCommonBackground = channel =>
            `linear-gradient(to right, #${this.#colorHexReplace(channel, '00', true)}, #${this.#colorHexReplace(channel, 'ff', true)})`
        switch (channel) {
            case 0:
                channelLetter = "r"
                channelValue = this.color.R.value
                background = getCommonBackground(channel)
                break
            case 1:
                channelLetter = "g"
                channelValue = this.color.G.value
                background = getCommonBackground(channel)
                break
            case 2:
                channelLetter = "b"
                channelValue = this.color.B.value
                background = getCommonBackground(channel)
                break
            case 3:
                channelLetter = "a"
                channelValue = this.color.A.value
                background = `${Configuration.alphaPattern}, ${getCommonBackground(channel)}`
                break
            case 4:
                channelLetter = "h"
                channelValue = this.color.H.value * 360
                background = "linear-gradient(to right, #f00 0%, #ff0 16.666%, #0f0 33.333%, #0ff 50%, #00f 66.666%, #f0f 83.333%, #f00 100%)"
                break
            case 5:
                channelLetter = "s"
                channelValue = this.color.S.value
                background = "linear-gradient("
                    + "to right,"
                    + `#${this.#tempColor.setFromHSVA(
                        this.color.H.value,
                        0,
                        this.color.V.value,
                        1
                    ), this.#tempColor.toRGBAString()},`
                    + `#${this.#tempColor.setFromHSVA(
                        this.color.H.value,
                        1,
                        this.color.V.value,
                        1,
                    ), this.#tempColor.toRGBAString()})`
                break
            case 6:
                channelLetter = "v"
                channelValue = this.color.V.value
                background = `linear-gradient(to right, #000, #${this.fullColor.toRGBAString()})`
                break
        }
        background = `background: ${background};`
        return html`
            <div class="ueb-color-picker-${channelLetter.toLowerCase()}">
                <span class="ueb-color-control-label">${channelLetter.toUpperCase()}</span>
                <div>
                    <div class="ueb-horizontal-slider">
                        <span class="ueb-horizontal-slider-text"
                            .innerText="${Utility.minDecimals(Utility.roundDecimals(channelValue, 3))}">
                        </span>
                    </div>
                    <div class="ueb-color-picker-gradient" style="${background}"></div>
                </div>
            </div>
        `
    }

    renderContent() {
        const theta = this.color.H.value * 2 * Math.PI
        const wheelRadius = Math.max(
            this.#wheelHandler.template.movementSpaceSize[0],
            this.#wheelHandler.template.movementSpaceSize[1],
        ) / 2
        const style = {
            "--ueb-color-r": this.color.R.toString(),
            "--ueb-color-g": this.color.G.toString(),
            "--ueb-color-b": this.color.B.toString(),
            "--ueb-color-a": this.color.A.toString(),
            "--ueb-color-h": this.color.H.toString(),
            "--ueb-color-s": this.color.S.toString(),
            "--ueb-color-v": this.color.V.toString(),
            "--ueb-color-wheel-x": `${Math.round(this.color.S.value * Math.cos(theta) * wheelRadius + wheelRadius)}px`,
            "--ueb-color-wheel-y": `${Math.round(this.color.S.value * Math.sin(theta) * wheelRadius + wheelRadius)}px`,
        }
        const colorRGB = this.color.toRGBAString()
        const colorSRGB = this.color.toSRGBAString()
        const fullColorHex = this.fullColor.toRGBAString()
        return html`
            <div class="ueb-color-picker" style="${styleMap(style)}">
                <div class="ueb-color-picker-toolbar">
                    <div class="ueb-color-picker-theme"></div>
                    <div class="ueb-color-picker-srgb"></div>
                </div>
                <div class="ueb-color-picker-main">
                    <div class="ueb-color-picker-wheel"></div>
                    <div class="ueb-color-picker-saturation ueb-vertical-slider"
                        style="background-color: #${fullColorHex}">
                    </div>
                    <div class="ueb-color-picker-value ueb-vertical-slider"
                        style="background-color: #${fullColorHex}"></div>
                    <div class="ueb-color-picker-preview">
                        Old
                        <div class="ueb-color-picker-preview-old "
                            style="background: #${this.#initialColor.toRGBAString()}">
                        </div>
                        <div class="ueb-color-picker-preview-new">
                            <div class="ueb-color-picker-preview-1"
                                style="background: #${this.#colorHexReplace(3, "FF")}">
                            </div>
                            <div class="ueb-color-picker-preview-2"
                                style="background: ${`linear-gradient(#${colorRGB}, #${colorRGB}),${Configuration.alphaPattern}`}">
                            </div>
                        </div>
                        New
                    </div>
                </div>
                <div class="ueb-color-picker-advanced-toggle ueb-toggle-control">
                    Advanced
                </div>
                <div class="ueb-color-picker-advanced">
                    <div class="ueb-color-picker-column">
                        ${this.renderSlider(0)}
                        ${this.renderSlider(1)}
                        ${this.renderSlider(2)}
                        ${this.renderSlider(3)}
                    </div>
                    <div class="ueb-color-picker-column">
                        ${this.renderSlider(4)}
                        ${this.renderSlider(5)}
                        ${this.renderSlider(6)}
                        <div class="ueb-color-control">
                            <span class="ueb-color-control-label">Hex Linear</span>
                            <div class="ueb-color-picker-hex-linear ueb-text-input">
                                <span class="ueb-pin-input-content" role="textbox" contenteditable="true"
                                    .innerText="${colorRGB}"
                                    @focusout="${this.#hexRGBHandler}"
                                    @keydown="${this.#doOnEnter(this.#hexRGBHandler)}">
                                </span>
                            </div>
                        </div>
                        <div class="ueb-color-control">
                             <span class="ueb-color-control-label">Hex sRGB</span>
                            <div class="ueb-color-picker-hex-srgb ueb-text-input">
                                <span class="ueb-pin-input-content" role="textbox" contenteditable="true"
                                    .innerText="${colorSRGB}"
                                    @focusout="${this.#hexSRGBHandler}"
                                    @keydown="${this.#doOnEnter(this.#hexSRGBHandler)}">
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ueb-buttons">
                    <div class="ueb-color-picker-ok ueb-button" @click="${() => this.apply()}">OK</div>
                    <div class="ueb-color-picker-cancel ueb-button" @click="${() => this.cancel()}">Cancel</div>
                </div>
            </div>
        `
    }

    renderWindowName() {
        return html`Color Picker`
    }
}
