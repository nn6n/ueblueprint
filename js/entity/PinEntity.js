import ByteEntity from "./ByteEntity.js"
import ComputedType from "./ComputedType.js"
import Configuration from "../Configuration.js"
import EnumEntity from "./EnumEntity.js"
import FormatTextEntity from "./FormatTextEntity.js"
import GuidEntity from "./GuidEntity.js"
import IEntity from "./IEntity.js"
import Integer64Entity from "./Integer64Entity.js"
import IntegerEntity from "./IntegerEntity.js"
import LinearColorEntity from "./LinearColorEntity.js"
import LocalizedTextEntity from "./LocalizedTextEntity.js"
import ObjectReferenceEntity from "./ObjectReferenceEntity.js"
import PinReferenceEntity from "./PinReferenceEntity.js"
import PinTypeEntity from "./PinTypeEntity.js"
import RotatorEntity from "./RotatorEntity.js"
import SimpleSerializationRotatorEntity from "./SimpleSerializationRotatorEntity.js"
import SimpleSerializationVector2DEntity from "./SimpleSerializationVector2DEntity.js"
import SimpleSerializationVectorEntity from "./SimpleSerializationVectorEntity.js"
import UnionType from "./UnionType.js"
import Utility from "../Utility.js"
import Vector2DEntity from "./Vector2DEntity.js"
import VectorEntity from "./VectorEntity.js"

/**
 * @typedef {import("./IEntity").AnyValue} AnyValue
 * @typedef {import("lit").CSSResult} CSSResult
 */

/** @template {AnyValue} T */
export default class PinEntity extends IEntity {

    static #typeEntityMap = {
        "/Script/CoreUObject.LinearColor": LinearColorEntity,
        "/Script/CoreUObject.Rotator": RotatorEntity,
        "/Script/CoreUObject.Vector": VectorEntity,
        "/Script/CoreUObject.Vector2D": Vector2DEntity,
        "bool": Boolean,
        "byte": ByteEntity,
        "enum": EnumEntity,
        "exec": String,
        "int": IntegerEntity,
        "int64": Integer64Entity,
        "name": String,
        "real": Number,
        "string": String,
    }
    static #alternativeTypeEntityMap = {
        "/Script/CoreUObject.Vector2D": SimpleSerializationVector2DEntity,
        "/Script/CoreUObject.Vector": SimpleSerializationVectorEntity,
        "/Script/CoreUObject.Rotator": SimpleSerializationRotatorEntity,
    }
    static lookbehind = "Pin"
    static attributes = {
        PinId: {
            type: GuidEntity,
        },
        PinName: {
            default: "",
        },
        PinFriendlyName: {
            type: new UnionType(LocalizedTextEntity, FormatTextEntity, String),
            showDefault: false,
        },
        PinToolTip: {
            type: String,
            showDefault: false,
        },
        Direction: {
            type: String,
            showDefault: false,
        },
        PinType: {
            type: PinTypeEntity,
            inlined: true,
        },
        LinkedTo: {
            type: [PinReferenceEntity],
            showDefault: false,
        },
        SubPins: {
            type: [PinReferenceEntity],
            showDefault: false,
        },
        ParentPin: {
            type: PinReferenceEntity,
            showDefault: false,
        },
        DefaultValue: {
            /** @param {PinEntity} pinEntity */
            type: new ComputedType(pinEntity => pinEntity.getEntityType(true) ?? String),
            serialized: true,
            showDefault: false,
        },
        AutogeneratedDefaultValue: {
            type: String,
            showDefault: false,
        },
        DefaultObject: {
            type: ObjectReferenceEntity,
            showDefault: false,
            default: null,
        },
        PersistentGuid: {
            type: GuidEntity,
        },
        bHidden: {
            default: false,
        },
        bNotConnectable: {
            default: false,
        },
        bDefaultValueIsReadOnly: {
            default: false,
        },
        bDefaultValueIsIgnored: {
            default: false,
        },
        bAdvancedView: {
            default: false,
        },
        bOrphanedPin: {
            default: false,
        },
    }

    static {
        this.cleanupAttributes(this.attributes)
    }

    constructor(values = {}, suppressWarns = false) {
        super(values, suppressWarns)
        /** @type {GuidEntity} */ this.PinId
        /** @type {String} */ this.PinName
        /** @type {LocalizedTextEntity | String} */ this.PinFriendlyName
        /** @type {String} */ this.PinToolTip
        /** @type {String} */ this.Direction
        /** @type {PinTypeEntity} */ this.PinType
        /** @type {PinReferenceEntity[]} */ this.LinkedTo
        /** @type {T} */ this.DefaultValue
        /** @type {String} */ this.AutogeneratedDefaultValue
        /** @type {ObjectReferenceEntity} */ this.DefaultObject
        /** @type {GuidEntity} */ this.PersistentGuid
        /** @type {Boolean} */ this.bHidden
        /** @type {Boolean} */ this.bNotConnectable
        /** @type {Boolean} */ this.bDefaultValueIsReadOnly
        /** @type {Boolean} */ this.bDefaultValueIsIgnored
        /** @type {Boolean} */ this.bAdvancedView
        /** @type {Boolean} */ this.bOrphanedPin
    }

    getType() {
        const subCategory = this.PinType.PinSubCategoryObject
        if (this.PinType.PinCategory === "struct" || this.PinType.PinCategory === "object") {
            return subCategory.path
        }
        if (
            this.PinType.PinCategory === "byte"
            && (
                subCategory.type === Configuration.nodeType.enum
                || subCategory.type === Configuration.nodeType.userDefinedEnum
            )
        ) {
            return "enum"
        }
        return this.PinType.PinCategory
    }

    getEntityType(alternative = false) {
        const typeString = this.getType()
        const entity = PinEntity.#typeEntityMap[typeString]
        const alternativeEntity = PinEntity.#alternativeTypeEntityMap[typeString]
        return alternative && alternativeEntity !== undefined
            ? alternativeEntity
            : entity
    }

    getDisplayName() {
        let matchResult = null
        if (
            this.PinToolTip
            // Match up until the first \n excluded or last character
            && (matchResult = this.PinToolTip.match(/\s*(.+?(?=\n)|.+\S)\s*/))
        ) {
            return matchResult[1]
        }
        if (this.PinFriendlyName) {
            return Utility.formatStringName(this.PinFriendlyName.toString())
        }
        return Utility.formatStringName(this.PinName)
    }

    /** @param {PinEntity} other */
    copyTypeFrom(other) {
        this.PinType.PinCategory = other.PinType.PinCategory
        this.PinType.PinSubCategory = other.PinType.PinSubCategory
        this.PinType.PinSubCategoryObject = other.PinType.PinSubCategoryObject
        this.PinType.PinSubCategoryMemberReference = other.PinType.PinSubCategoryMemberReference
        this.PinType.PinValueType = other.PinType.PinValueType
        this.PinType.ContainerType = other.PinType.ContainerType
        this.PinType.bIsReference = other.PinType.bIsReference
        this.PinType.bIsConst = other.PinType.bIsConst
        this.PinType.bIsWeakPointer = other.PinType.bIsWeakPointer
        this.PinType.bIsUObjectWrapper = other.PinType.bIsUObjectWrapper
        this.PinType$bSerializeAsSinglePrecisionFloat = other.PinType$bSerializeAsSinglePrecisionFloat
    }

    getDefaultValue(maybeCreate = false) {
        if (this.DefaultValue === undefined && maybeCreate) {
            this.DefaultValue = new (this.getEntityType(true))()
        }
        return this.DefaultValue
    }

    isExecution() {
        return this.PinType.PinCategory === "exec"
    }

    isHidden() {
        return this.bHidden
    }

    isInput() {
        return !this.bHidden && this.Direction != "EGPD_Output"
    }

    isOutput() {
        return !this.bHidden && this.Direction == "EGPD_Output"
    }

    isLinked() {
        return this.LinkedTo?.length > 0 ?? false
    }

    /**
     * @param {String} targetObjectName
     * @param {PinEntity} targetPinEntity
     */
    linkTo(targetObjectName, targetPinEntity) {
        const linkFound = this.LinkedTo?.some(pinReferenceEntity =>
            pinReferenceEntity.objectName.toString() == targetObjectName
            && pinReferenceEntity.pinGuid.valueOf() == targetPinEntity.PinId.valueOf()
        )
        if (!linkFound) {
            (this.LinkedTo ??= []).push(new PinReferenceEntity({
                objectName: targetObjectName,
                pinGuid: targetPinEntity.PinId,
            }))
            return true
        }
        return false // Already linked
    }

    /**
     * @param {String} targetObjectName
     * @param {PinEntity} targetPinEntity
     */
    unlinkFrom(targetObjectName, targetPinEntity) {
        const indexElement = this.LinkedTo?.findIndex(pinReferenceEntity => {
            return pinReferenceEntity.objectName.toString() == targetObjectName
                && pinReferenceEntity.pinGuid.valueOf() == targetPinEntity.PinId.valueOf()
        })
        if (indexElement >= 0) {
            this.LinkedTo.splice(indexElement, 1)
            if (this.LinkedTo.length === 0 && !PinEntity.attributes.LinkedTo.showDefault) {
                this.LinkedTo = undefined
            }
            return true
        }
        return false
    }

    getSubCategory() {
        return this.PinType.PinSubCategoryObject.path
    }

    /** @return {CSSResult} */
    pinColor() {
        return Configuration.pinColor[this.getType()]
            ?? Configuration.pinColor[this.PinType.PinCategory.toLowerCase()]
            ?? Configuration.pinColor["default"]
    }
}
