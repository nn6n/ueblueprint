import Context from "../Context"

export default class Unfocus extends Context {

    constructor(target, blueprint, options = {}) {
        options.wantsFocusCallback = true
        super(target, blueprint, options)

        let self = this
        this.clickHandler = e => self.clickedSomewhere(e)
        if (this.blueprint.focuse) {
            document.addEventListener("click", this.clickHandler)
        }
    }

    /**
     * 
     * @param {MouseEvent} e 
     */
    clickedSomewhere(e) {
        // If target is inside the blueprint grid
        if (e.target.closest("ueb-blueprint")) {
            return
        }
        this.blueprint.setFocused(false)
    }

    listenEvents() {
        document.addEventListener("click", this.clickHandler)
    }

    unlistenEvents() {
        document.removeEventListener("click", this.clickHandler)
    }
}
