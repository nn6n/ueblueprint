import P from "parsernostrum"
import Configuration from "../Configuration.js"
import pinColor from "../decoding/pinColor.js"
import pinTitle from "../decoding/pinTitle.js"
import Grammar from "../serialization/Grammar.js"
import AlternativesEntity from "./AlternativesEntity.js"
import ArrayEntity from "./ArrayEntity.js"
import BooleanEntity from "./BooleanEntity.js"
import ByteEntity from "./ByteEntity.js"
import ComputedTypeEntity from "./ComputedTypeEntity.js"
import EnumDisplayValueEntity from "./EnumDisplayValueEntity.js"
import EnumEntity from "./EnumEntity.js"
import FormatTextEntity from "./FormatTextEntity.js"
import GuidEntity from "./GuidEntity.js"
import IEntity from "./IEntity.js"
import Integer64Entity from "./Integer64Entity.js"
import IntegerEntity from "./IntegerEntity.js"
import InvariantTextEntity from "./InvariantTextEntity.js"
import LinearColorEntity from "./LinearColorEntity.js"
import LocalizedTextEntity from "./LocalizedTextEntity.js"
import NumberEntity from "./NumberEntity.js"
import ObjectReferenceEntity from "./ObjectReferenceEntity.js"
import PinReferenceEntity from "./PinReferenceEntity.js"
import PinTypeEntity from "./PinTypeEntity.js"
import RBSerializationVector2DEntity from "./RBSerializationVector2DEntity.js"
import RotatorEntity from "./RotatorEntity.js"
import SimpleSerializationRotatorEntity from "./SimpleSerializationRotatorEntity.js"
import SimpleSerializationVector2DEntity from "./SimpleSerializationVector2DEntity.js"
import SimpleSerializationVector4DEntity from "./SimpleSerializationVector4DEntity.js"
import SimpleSerializationVectorEntity from "./SimpleSerializationVectorEntity.js"
import StringEntity from "./StringEntity.js"
import SymbolEntity from "./SymbolEntity.js"
import Vector2DEntity from "./Vector2DEntity.js"
import Vector4DEntity from "./Vector4DEntity.js"
import VectorEntity from "./VectorEntity.js"

const paths = Configuration.paths

/** @template {IEntity} T */
export default class PinEntity extends IEntity {

    static lookbehind = "Pin"
    static #typeEntityMap = {
        "bool": BooleanEntity,
        "byte": ByteEntity,
        "enum": EnumEntity,
        "exec": StringEntity,
        "float": NumberEntity,
        "int": IntegerEntity,
        "int64": Integer64Entity,
        "name": StringEntity,
        "real": NumberEntity,
        "string": StringEntity,
        [paths.linearColor]: LinearColorEntity,
        [paths.niagaraBool]: BooleanEntity,
        [paths.niagaraFloat]: NumberEntity,
        [paths.niagaraPosition]: VectorEntity,
        [paths.rotator]: RotatorEntity,
        [paths.vector]: VectorEntity,
        [paths.vector2D]: Vector2DEntity,
        [paths.vector4f]: Vector4DEntity,
    }
    static #alternativeTypeEntityMap = {
        "enum": EnumDisplayValueEntity,
        "rg": RBSerializationVector2DEntity,
        [paths.niagaraPosition]: SimpleSerializationVectorEntity.flagAllowShortSerialization(),
        [paths.rotator]: SimpleSerializationRotatorEntity,
        [paths.vector]: SimpleSerializationVectorEntity,
        [paths.vector2D]: SimpleSerializationVector2DEntity,
        [paths.vector3f]: SimpleSerializationVectorEntity,
        [paths.vector4f]: SimpleSerializationVector4DEntity,
    }
    static attributes = {
        PinId: GuidEntity.withDefault(),
        PinName: StringEntity.withDefault(),
        PinFriendlyName: AlternativesEntity.accepting(
            LocalizedTextEntity,
            FormatTextEntity,
            InvariantTextEntity,
            StringEntity
        ),
        PinToolTip: StringEntity,
        Direction: StringEntity,
        PinType: PinTypeEntity.withDefault().flagInlined(),
        LinkedTo: ArrayEntity.of(PinReferenceEntity).withDefault().flagSilent(),
        SubPins: ArrayEntity.of(PinReferenceEntity),
        ParentPin: PinReferenceEntity,
        DefaultValue:
            ComputedTypeEntity.from(
                /** @param {PinEntity} pinEntity */
                pinEntity => pinEntity.getEntityType(true)?.flagSerialized() ?? StringEntity
            ),
        AutogeneratedDefaultValue: StringEntity,
        DefaultObject: ObjectReferenceEntity,
        PersistentGuid: GuidEntity,
        bHidden: BooleanEntity,
        bNotConnectable: BooleanEntity,
        bDefaultValueIsReadOnly: BooleanEntity,
        bDefaultValueIsIgnored: BooleanEntity,
        bAdvancedView: BooleanEntity,
        bOrphanedPin: BooleanEntity,
    }
    static grammar = this.createGrammar()

    #recomputesNodeTitleOnChange = false
    set recomputesNodeTitleOnChange(value) {
        this.#recomputesNodeTitleOnChange = value
    }
    get recomputesNodeTitleOnChange() {
        return this.#recomputesNodeTitleOnChange
    }

    /** @type {ObjectEntity} */
    #objectEntity = null
    get objectEntity() {
        try {
            /*
             * Why inside a try block ?
             * It is because of this issue: https://stackoverflow.com/questions/61237153/access-private-method-in-an-overriden-method-called-from-the-base-class-construc
             * super(values) will call IEntity constructor while this instance is not yet fully constructed
             * IEntity will call computedEntity.compute(this) to initialize DefaultValue from this class
             * Which in turn calls pinEntity.getEntityType(true)
             * Which calls this.getType()
             * Which calls this.objectEntity?.isPcg()
             * Which would access #objectEntity through get objectEntity()
             * And this would violate the private access rule (because this class is not yet constructed)
             * If this issue in the future will be fixed in all the major browsers, please remove this try catch
             */
            return this.#objectEntity
        } catch (e) {
            return null
        }
    }
    set objectEntity(value) {
        this.#objectEntity = value
    }

    #pinIndex
    get pinIndex() {
        return this.#pinIndex
    }
    set pinIndex(value) {
        this.#pinIndex = value
    }

    constructor(values = {}) {
        super(values)
        /** @type {InstanceType<typeof PinEntity.attributes.PinId>} */ this.PinId
        /** @type {InstanceType<typeof PinEntity.attributes.PinName>} */ this.PinName
        /** @type {InstanceType<typeof PinEntity.attributes.PinFriendlyName>} */ this.PinFriendlyName
        /** @type {InstanceType<typeof PinEntity.attributes.PinToolTip>} */ this.PinToolTip
        /** @type {InstanceType<typeof PinEntity.attributes.Direction>} */ this.Direction
        /** @type {InstanceType<typeof PinEntity.attributes.PinType>} */ this.PinType
        /** @type {InstanceType<typeof PinEntity.attributes.LinkedTo>} */ this.LinkedTo
        /** @type {T} */ this.DefaultValue
        /** @type {InstanceType<typeof PinEntity.attributes.AutogeneratedDefaultValue>} */ this.AutogeneratedDefaultValue
        /** @type {InstanceType<typeof PinEntity.attributes.DefaultObject>} */ this.DefaultObject
        /** @type {InstanceType<typeof PinEntity.attributes.PersistentGuid>} */ this.PersistentGuid
        /** @type {InstanceType<typeof PinEntity.attributes.bHidden>} */ this.bHidden
        /** @type {InstanceType<typeof PinEntity.attributes.bNotConnectable>} */ this.bNotConnectable
        /** @type {InstanceType<typeof PinEntity.attributes.bDefaultValueIsReadOnly>} */ this.bDefaultValueIsReadOnly
        /** @type {InstanceType<typeof PinEntity.attributes.bDefaultValueIsIgnored>} */ this.bDefaultValueIsIgnored
        /** @type {InstanceType<typeof PinEntity.attributes.bAdvancedView>} */ this.bAdvancedView
        /** @type {InstanceType<typeof PinEntity.attributes.bOrphanedPin>} */ this.bOrphanedPin
        /** @type {ObjectEntity} */ this.objectEntity
    }

    /** @returns {P<PinEntity>} */
    static createGrammar() {
        return Grammar.createEntityGrammar(this)
    }

    /** @param {ObjectEntity} objectEntity */
    static fromLegacyObject(objectEntity) {
        return new PinEntity(objectEntity)
    }

    /** @returns {String} */
    getType() {
        const category = this.PinType.PinCategory?.toString().toLocaleLowerCase()
        if (["struct", "class", "object", "type", "statictype"].includes(category)) {
            return this.PinType.PinSubCategoryObject?.path
        }
        if (this.isEnum()) {
            return "enum"
        }
        if (this.objectEntity?.isPcg()) {
            const pcgSuboject = this.objectEntity.getPcgSubobject()
            const pinObjectReference = this.isInput()
                ? pcgSuboject.InputPins?.valueOf()[this.pinIndex]
                : pcgSuboject.OutputPins?.valueOf()[this.pinIndex]
            if (pinObjectReference) {
                /** @type {ObjectEntity} */
                const pinObject = pcgSuboject[Configuration.subObjectAttributeNameFromReference(pinObjectReference, true)]
                let allowedTypes = pinObject.Properties?.AllowedTypes?.toString() ?? ""
                if (allowedTypes == "") {
                    allowedTypes = this.PinType.PinCategory ?? ""
                    if (allowedTypes == "") {
                        allowedTypes = "Any"
                    }
                }
                if (allowedTypes) {
                    if (
                        pinObject.Properties.bAllowMultipleData?.valueOf() !== false
                        && pinObject.Properties.bAllowMultipleConnections?.valueOf() !== false
                    ) {
                        allowedTypes += "[]"
                    }
                    return allowedTypes
                }
            }
        }
        if (category === "optional") {
            const subCategory = this.PinType.PinSubCategory?.toString()
            switch (subCategory) {
                case "red":
                    return "real"
                case "rg":
                    return "rg"
                case "rgb":
                    return paths.vector
                case "rgba":
                    return paths.linearColor
                default:
                    return subCategory
            }
        }
        return category
    }

    /** @returns {typeof IEntity} */
    getEntityType(alternative = false) {
        const type = this.getType()
        const entity = PinEntity.#typeEntityMap[type]
        const alternativeEntity = PinEntity.#alternativeTypeEntityMap[type]
        return alternative && alternativeEntity !== undefined
            ? alternativeEntity
            : entity
    }

    pinTitle() {
        return pinTitle(this)
    }

    /** @param {PinEntity} other */
    copyTypeFrom(other) {
        this.PinType = other.PinType
    }

    getDefaultValue(maybeCreate = false) {
        if (this.DefaultValue === undefined && maybeCreate) {
            this.DefaultValue = /** @type {T} */(new (this.getEntityType(true))())
        }
        return this.DefaultValue
    }

    isEnum() {
        const type = this.PinType.PinSubCategoryObject?.type
        return type === paths.enum
            || type === paths.userDefinedEnum
            || type?.toLowerCase() === "enum"
    }

    isExecution() {
        return this.PinType.PinCategory.toString() === "exec"
            || this.getType() === paths.niagaraParameterMap
    }

    isHidden() {
        return this.bHidden?.valueOf()
    }

    isInput() {
        return !this.isHidden() && this.Direction?.toString() != "EGPD_Output"
    }

    isOutput() {
        return !this.isHidden() && this.Direction?.toString() == "EGPD_Output"
    }

    isLinked() {
        return this.LinkedTo?.length > 0
    }

    /**
     * @param {String} targetObjectName
     * @param {PinEntity} targetPinEntity
     * @returns true if it was not already linked to the tarket
     */
    linkTo(targetObjectName, targetPinEntity) {
        const linkFound = this.LinkedTo.values?.some(pinReferenceEntity =>
            pinReferenceEntity.objectName.toString() == targetObjectName
            && pinReferenceEntity.pinGuid.toString() == targetPinEntity.PinId.toString()
        )
        if (!linkFound) {
            this.LinkedTo.values.push(new PinReferenceEntity(new SymbolEntity(targetObjectName), targetPinEntity.PinId))
            return true
        }
        return false // Already linked
    }

    /**
     * @param {String} targetObjectName
     * @param {PinEntity} targetPinEntity
     * @returns true if it was linked to the target
     */
    unlinkFrom(targetObjectName, targetPinEntity) {
        const indexElement = this.LinkedTo.values?.findIndex(pinReferenceEntity => {
            return pinReferenceEntity.objectName.toString() == targetObjectName
                && pinReferenceEntity.pinGuid.toString() == targetPinEntity.PinId.toString()
        })
        if (indexElement >= 0) {
            this.LinkedTo.values.splice(indexElement, 1)
            if (this.LinkedTo.length === 0 && PinEntity.attributes.LinkedTo.default === undefined) {
                this.LinkedTo.values = []
            }
            return true
        }
        return false
    }

    getSubCategory() {
        return this.PinType.PinSubCategoryObject?.path
    }

    pinColor() {
        return pinColor(this)
    }
}
