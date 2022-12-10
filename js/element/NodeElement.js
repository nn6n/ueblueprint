import CommentNodeTemplate from "../template/CommentNodeTemplate"
import Configuration from "../Configuration"
import IdentifierEntity from "../entity/IdentifierEntity"
import ISelectableDraggableElement from "./ISelectableDraggableElement"
import KnotNodeTemplate from "../template/KnotNodeTemplate"
import NodeTemplate from "../template/NodeTemplate"
import ObjectEntity from "../entity/ObjectEntity"
import PinEntity from "../entity/PinEntity"
import PinReferenceEntity from "../entity/PinReferenceEntity"
import SerializerFactory from "../serialization/SerializerFactory"
import Utility from "../Utility"
import VariableAccessNodeTemplate from "../template/VariableAccessNodeTemplate"

/** @typedef {import("./IElement").default} IElement */

/** @extends {ISelectableDraggableElement<ObjectEntity, NodeTemplate>} */
export default class NodeElement extends ISelectableDraggableElement {

    static #typeTemplateMap = {
        [Configuration.nodeType.comment]: CommentNodeTemplate,
        [Configuration.nodeType.knot]: KnotNodeTemplate,
        [Configuration.nodeType.variableGet]: VariableAccessNodeTemplate,
        [Configuration.nodeType.variableSet]: VariableAccessNodeTemplate,
    }

    static properties = {
        ...ISelectableDraggableElement.properties,
        typePath: {
            type: String,
            attribute: "data-type",
            reflect: true,
        },
        nodeName: {
            type: String,
            attribute: "data-name",
            reflect: true,
        },
        advancedPinDisplay: {
            type: String,
            attribute: "data-advanced-display",
            converter: IdentifierEntity.attributeConverter,
            reflect: true,
        },
        enabledState: {
            type: String,
            attribute: "data-enabled-state",
            reflect: true,
        },
        nodeDisplayName: {
            type: String,
            attribute: false,
        },
        pureFunction: {
            type: Boolean,
            converter: Utility.booleanConverter,
            attribute: "data-pure-function",
            reflect: true,
        },
    }
    static dragEventName = Configuration.nodeDragEventName
    static dragGeneralEventName = Configuration.nodeDragGeneralEventName

    get blueprint() {
        return super.blueprint
    }
    set blueprint(v) {
        super.blueprint = v
        this.#pins.forEach(p => p.blueprint = v)
    }

    /** @type {HTMLElement} */
    #nodeNameElement
    get nodeNameElement() {
        return this.#nodeNameElement
    }
    set nodeNameElement(value) {
        this.#nodeNameElement = value
    }

    #pins
    #boundComments

    /**
     * @param {ObjectEntity} entity
     * @param {NodeTemplate} template
     */
    constructor(entity, template = undefined) {
        super(entity, template ?? new (NodeElement.getTypeTemplate(entity))())
        this.#pins = this.template.createPinElements()
        this.typePath = this.entity.getType()
        this.nodeName = this.entity.getObjectName()
        this.advancedPinDisplay = this.entity.AdvancedPinDisplay?.toString()
        this.enabledState = this.entity.EnabledState
        this.nodeDisplayName = this.entity.getDisplayName()
        this.pureFunction = this.entity.bIsPureFunc
        this.dragLinkObjects = []
        super.setLocation([this.entity.NodePosX.value, this.entity.NodePosY.value])
        this.entity.subscribe("AdvancedPinDisplay", value => this.advancedPinDisplay = value)
        this.entity.subscribe("Name", value => this.nodeName = value)
        if (this.entity.NodeWidth && this.entity.NodeHeight) {
            this.sizeX = this.entity.NodeWidth.value
            this.sizeY = this.entity.NodeHeight.value
        } else {
            Promise.all([this.updateComplete, ...this.#pins.map(p => p.updateComplete)]).then(() => this.computeSizes())
        }
    }

    /**
     * @param {ObjectEntity} nodeEntity
     * @return {new () => NodeTemplate}
     */
    static getTypeTemplate(nodeEntity) {
        let result = NodeElement.#typeTemplateMap[nodeEntity.getClass()]
        return result ?? NodeTemplate
    }

    /** @param {String} str */
    static fromSerializedObject(str) {
        str = str.trim()
        let entity = SerializerFactory.getSerializer(ObjectEntity).deserialize(str)
        // @ts-expect-error
        return new NodeElement(entity)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.acknowledgeDelete()
    }

    getType() {
        return this.entity.getType()
    }

    getNodeName() {
        return this.entity.getObjectName()
    }

    getNodeDisplayName() {
        return this.entity.getDisplayName()
    }

    /** @param {Number} value */
    setNodeWidth(value) {
        this.entity.setNodeWidth(value)
        this.sizeX = value
        this.acknowledgeReflow()
    }

    /** @param {Number} value */
    setNodeHeight(value) {
        this.entity.setNodeHeight(value)
        this.sizeY = value
        this.acknowledgeReflow()
    }

    /** @param  {IElement[]} nodesWhitelist */
    sanitizeLinks(nodesWhitelist = []) {
        this.getPinElements().forEach(pin => pin.sanitizeLinks(nodesWhitelist))
    }

    /** @param {String} name */
    rename(name) {
        if (this.entity.Name == name) {
            return false
        }
        for (let sourcePinElement of this.getPinElements()) {
            for (let targetPinReference of sourcePinElement.getLinks()) {
                this.blueprint.getPin(targetPinReference).redirectLink(sourcePinElement, new PinReferenceEntity({
                    objectName: name,
                    pinGuid: sourcePinElement.entity.PinId,
                }))
            }
        }
        this.entity.Name = name
    }

    getPinElements() {
        return this.#pins
    }

    /** @returns {PinEntity[]} */
    getPinEntities() {
        return this.entity.CustomProperties.filter(v => v instanceof PinEntity)
    }

    setLocation(value = [0, 0]) {
        let nodeConstructor = this.entity.NodePosX.constructor
        // @ts-expect-error
        this.entity.NodePosX = new nodeConstructor(value[0])
        // @ts-expect-error
        this.entity.NodePosY = new nodeConstructor(value[1])
        super.setLocation(value)
    }

    acknowledgeDelete() {
        let deleteEvent = new CustomEvent(Configuration.nodeDeleteEventName)
        this.dispatchEvent(deleteEvent)
    }

    acknowledgeReflow() {
        this.addNextUpdatedCallbacks(() => this.computeSizes(), true)
        let reflowEvent = new CustomEvent(Configuration.nodeReflowEventName)
        this.dispatchEvent(reflowEvent)
    }

    setShowAdvancedPinDisplay(value) {
        this.entity.AdvancedPinDisplay = new IdentifierEntity(value ? "Shown" : "Hidden")
    }

    toggleShowAdvancedPinDisplay() {
        this.setShowAdvancedPinDisplay(this.entity.AdvancedPinDisplay?.toString() != "Shown")
    }
}
