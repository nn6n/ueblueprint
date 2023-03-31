import IdentifierEntity from "./IdentifierEntity.js"
import IEntity from "./IEntity.js"

export default class KeyBindingEntity extends IEntity {

    static attributes = {
        ActionName: "",
        bShift: false,
        bCtrl: false,
        bAlt: false,
        bCmd: false,
        Key: {
            type: IdentifierEntity
        },
    }

    static {
        this.cleanupAttributes(this.attributes)
    }

    constructor(values = {}) {
        super(values)
        /** @type {String} */ this.ActionName
        /** @type {Boolean} */ this.bShift
        /** @type {Boolean} */ this.bCtrl
        /** @type {Boolean} */ this.bAlt
        /** @type {Boolean} */ this.bCmd
        /** @type {IdentifierEntity} */ this.Key
    }
}
