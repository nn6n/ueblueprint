import { expect, testNode } from "./fixtures/test.js"

testNode({
    name: "Niagara ArcCos(D)",
    title: "ArcCos(D)",
    value: String.raw`
        Begin Object Class=/Script/NiagaraEditor.NiagaraNodeOp Name="NiagaraNodeOp_0" ExportPath="/Script/NiagaraEditor.NiagaraNodeOp'/Engine/Transient.NewNiagaraScript:NiagaraScriptSource_0.NiagaraGraph_0.NiagaraNodeOp_0'"
            OpName="Numeric::ArcCosine(Degrees)"
            ChangeId=0C4903A20D0840D5AFA6E8EA05BA7E92
            NodePosX=176
            NodePosY=304
            NodeGuid=B602FBF53547439C961401D1222D7086
            CustomProperties Pin (PinId=FDA289829A9C4C7A99071EBDA8BDADBF,PinName="A",PinFriendlyName=NSLOCTEXT("NiagaraOpInfo", "First Function Param", "A"),PinToolTip="A",PinType.PinCategory="Type",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/Niagara.NiagaraNumeric'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,DefaultValue="1.0",AutogeneratedDefaultValue="1.0",PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
            CustomProperties Pin (PinId=5BF79FDFF3214BB19F93AA9B8B9B5E40,PinName="Result",PinToolTip="Result",Direction="EGPD_Output",PinType.PinCategory="Type",PinType.PinSubCategory="",PinType.PinSubCategoryObject="/Script/CoreUObject.ScriptStruct'/Script/Niagara.NiagaraNumeric'",PinType.PinSubCategoryMemberReference=(),PinType.PinValueType=(),PinType.ContainerType=None,PinType.bIsReference=False,PinType.bIsConst=False,PinType.bIsWeakPointer=False,PinType.bIsUObjectWrapper=False,PinType.bSerializeAsSinglePrecisionFloat=False,PersistentGuid=00000000000000000000000000000000,bHidden=False,bNotConnectable=False,bDefaultValueIsReadOnly=False,bDefaultValueIsIgnored=False,bAdvancedView=False,bOrphanedPin=False,)
        End Object
    `,
    size: [14, 2.5],
    icon: null,
    pins: 2,
    delegate: false,
    development: false,
    additionalTest: async (node, pins, blueprintPage) => {
        expect(await node.evaluate(node => node.classList.contains("ueb-node-style-glass"))).toBeTruthy()
        expect(await node.evaluate(node => node.classList.contains("ueb-node-style-default"))).toBeFalsy()
    },
})
