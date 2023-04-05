/// <reference types="cypress" />

import ComplexEntity from "../fixtures/ComplexEntity"
import GeneralSerializer from "../../js/serialization/GeneralSerializer.js"
import initializeSerializerFactory from "../../js/serialization/initializeSerializerFactory.js"
import SerializerFactory from "../../js/serialization/SerializerFactory.js"
import SimpleEntity from "../fixtures/SimpleEntity"
import SimpleObject from "../fixtures/SimpleObject"

describe("Entity initialization", () => {
    before(() => {
        expect(SimpleEntity).to.be.a("function")
        expect(ComplexEntity).to.be.a("function")
    })

    context("SimpleEntity", () => {
        const entity = new SimpleEntity()
        before(() => {
            initializeSerializerFactory()
            SerializerFactory.registerSerializer(
                SimpleEntity,
                new GeneralSerializer(
                    v => `{\n${v}\n}`,
                    SimpleEntity,
                    "    ",
                    "\n",
                    false,
                    ": ",
                    undefined
                )
            )
        })
        it("has 7 keys", () => expect(Object.keys(entity).length).to.equal(7))
        it("has someNumber equal to 567", () => expect(entity)
            .to.have.property("someNumber")
            .which.is.a("number")
            .and.is.equal(567)
        )
        it("has someString equal to alpha", () => expect(entity)
            .to.have.property("someString")
            .which.is.a("string")
            .and.is.equal("alpha")
        )
        it("has someString2 equal to beta", () => expect(entity)
            .to.have.property("someString2")
            .which.is.a("string")
            .and.is.equal("beta")
        )
        it("has someBoolean true", () => expect(entity)
            .to.have.property("someBoolean")
            .which.is.a("boolean")
            .and.is.true
        )
        it("has someBoolean2 false", () => expect(entity)
            .to.have.property("someBoolean2")
            .which.is.a("boolean")
            .and.is.false
        )
        it("has someObjectString equal to gamma", () => expect(entity)
            .to.have.property("someObjectString")
            .which.is.a("string")
            .and.is.equal("gamma")
        )
        it("has someArray with numbers", () => expect(entity)
            .to.have.property("someArray")
            .which.is.an("array")
            .and.is.deep.equal([400, 500, 600, 700, 800])
        )
        it("is equal to another empty SimpleEntity", () => expect(entity.equals(new SimpleEntity()))
            .to.be.true
        )
        const other = new SimpleEntity({
            someString2: "gamma"
        })
        it("is not equal to another empty SimpleEntity", () => expect(entity.equals(other))
            .to.be.false
        )
        const other1 = new SimpleEntity({
            someNumber: 123,
            someString: "a",
            someString2: "b",
            someBoolean: false,
            someBoolean2: false,
            someObjectString: new String("delta"),
            someArray: [-1, -2, -3],
        })
        const other2 = new SimpleEntity({
            someNumber: 123,
            someString: "a",
            someString2: "b",
            someBoolean: false,
            someBoolean2: false,
            someObjectString: "delta",
            someArray: [-1, -2, -3],
        })
        it("compares equal entities as equal", () => expect(other1.equals(other2))
            .to.be.true
        )
        it("can serialize", () => {
            expect(SerializerFactory.getSerializer(SimpleEntity).write(entity))
                .to.equal(`{
    someNumber: 567
    someString: "alpha"
    someString2: "beta"
    someBoolean: True
    someBoolean2: False
    someObjectString: "gamma"
    someArray: (400,500,600,700,800,)
}`
                )
        })
    })

    context("ComplexEntity", () => {
        const entity = new ComplexEntity()
        const keys = [
            "alpha",
            "bravo",
            "charlie",
            "delta",
            "echo",
            "foxtrot",
            "golf",
            "hotel",
            "india",
            "juliett",
            "kilo",
            "lima",
            "mike",
            "november",
            "oscar",
            "papa",
            "quebec",
            "romeo",
        ]
        before(() => {
            initializeSerializerFactory()
            SerializerFactory.registerSerializer(
                ComplexEntity,
                new GeneralSerializer(
                    v => `[[\n${v}\n]]`,
                    ComplexEntity,
                    "    ",
                    "\n",
                    false,
                    ": ",
                    undefined
                )
            )
            SerializerFactory.registerSerializer(
                SimpleObject,
                new GeneralSerializer(
                    v => `SimpleObject(${v})`,
                    SimpleObject,
                    "",
                    ", ",
                    false,
                    "=",
                    undefined
                )
            )
        })
        it(`has ${keys.length} keys`, () => expect(Object.keys(entity).length).to.equal(keys.length))
        it("has specific keys names", () => expect(Object.keys(entity)).to.be.deep.equal(keys))
        it("has alpha equal to 32", () => expect(entity)
            .to.have.property("alpha")
            .which.is.a("number")
            .and.is.equal(32)
        )
        it("has bravo equal to 78", () => expect(entity)
            .to.have.property("bravo")
            .which.is.a("number")
            .and.is.equal(78)
        )
        it("has charlie equal to beta", () => expect(entity)
            .to.have.property("charlie")
            .which.is.a("string")
            .and.is.equal("Charlie")
        )
        it("has delta null", () => expect(entity)
            .to.have.property("delta")
            .which.is.null
        )
        it("has echo equal to echo", () => expect(entity)
            .to.have.property("echo")
            .which.is.a("string")
            .and.is.equal("echo")
        )
        it("has foxtrot false", () => expect(entity)
            .to.have.property("foxtrot")
            .which.is.a("boolean")
            .and.is.false
        )
        it("has golf empty array", () => expect(entity)
            .to.have.property("golf")
            .which.is.an("array")
            .and.is.empty
        )
        it("has hotel null", () => expect(entity)
            .to.have.property("hotel")
            .which.is.null
        )
        it("has india empty array", () => expect(entity)
            .to.have.property("india")
            .which.is.an("array")
            .and.is.empty
        )
        it("has juliett array of strings", () => expect(entity)
            .to.have.property("juliett")
            .which.is.an("array")
            .and.is.deep.equal(["a", "b", "c", "d", "e"])
        )
        it("has kilo array of booleans", () => expect(entity)
            .to.have.property("kilo")
            .which.is.an("array")
            .and.is.deep.equal([true, false, false, true, true])
        )
        it("has lima undefined", () => expect(entity)
            .to.have.property("lima")
            .which.is.undefined
        )
        it("has mike equal to Foo", () => expect(entity)
            .to.have.property("mike")
            .which.is.a("string")
            .and.is.equal("Bar")
        )
        it("has november equal to 0", () => expect(entity)
            .to.have.property("november")
            .which.is.a("number")
            .and.is.equal(0)
        )
        it("has oscar a SimpleObject", () => expect(entity)
            .to.have.property("oscar")
            .which.is.instanceOf(SimpleObject)
            .and.is.deep.equal({ a: 8, b: 9 })
        )
        it("has papa a SimpleObject", () => expect(entity)
            .to.have.property("papa")
            .which.is.instanceOf(SimpleObject)
            .and.is.deep.equal({ a: 12, b: 13 })
        )
        it("has quebec undefined", () => expect(entity)
            .to.have.property("quebec")
            .which.is.undefined
        )
        it("quebec can be assigned and it always filtered", () => {
            const entity = new ComplexEntity()
            entity.quebec = 2
            expect(entity.quebec, "assigned 2").to.be.equal(2)
            entity["quebec"] = 7
            expect(entity.quebec, "assigned 7").to.be.equal(7)
            entity.quebec = 1
            expect(entity.quebec, "assigned 1").to.be.equal(1)
            entity["quebec"] = 10
            expect(entity.quebec, "assigned 10").to.be.equal(10)
            entity.quebec = 0
            expect(entity.quebec, "assigned 0").to.be.equal(10)
            entity["quebec"] = 11
            expect(entity.quebec, "assigned 11").to.be.equal(10)
            entity.quebec = -1
            expect(entity.quebec, "assigned -1").to.be.equal(10)
            entity.quebec = 6
            expect(entity.quebec, "assigned 6").to.be.equal(6)
        })
        it("can serialize", () => {
            expect(SerializerFactory.getSerializer(ComplexEntity).write(entity))
                .to.equal(`[[
    alpha: 32
    bravo: 78
    charlie: "Charlie"
    delta: ()
    echo: "echo"
    foxtrot: False
    golf: ()
    hotel: ()
    india: ()
    juliett: ("a","b","c","d","e",)
    kilo: (True,False,False,True,True,)
    mike: "Bar"
    november: 0
    oscar: SimpleObject(a=8, b=9)
    papa: SimpleObject(a=12, b=13)
    romeo.a: 8
    romeo.b: 9
]]`
                )
        })
    })
})
