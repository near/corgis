import { createCorgi, deleteCorgi, displayGlobalCorgis } from "../main";
import { Corgi } from "../model";

describe("displayGlobalCorgis", () => {

    it('displays global list of corgis', () => {
        expect(displayGlobalCorgis().length).toBe(0);
    })

});

describe("createCorgi & displayGlobalCorgi", () => {

    it("creates a corgi", () => {
        expect(displayGlobalCorgis().length).toBe(0);

        const cid = createCorgi("doggy", "blue", "green", "la vida loca");
        expect(cid[0]).toBe("doggy");

        expectAllCorgisHaveId(displayGlobalCorgis(), 1);
    });

    it("creates a few corgis", () => {
        expect(displayGlobalCorgis().length).toBe(0);

        const cids = new Array<string>(5);
        for (let i = 0; i < cids.length; i++) {
            cids[i] = createCorgi("doggy" + i.toString(), "blue", "green", "la vida local")[1];
        }

        expectAllCorgisHaveId(displayGlobalCorgis(), cids.length);
    });

    it("creates several corgis", () => {
        expect(displayGlobalCorgis().length).toBe(0);

        const cids = new Array<string>(20);
        for (let i = 0; i < cids.length; i++) {
            cids[i] = createCorgi("doggy" + i.toString(), "blue", "green", "la vida local")[1];
        }

        expectAllCorgisHaveId(displayGlobalCorgis(), 8);
    });

});

describe("createCorgi, deleteCorgi & displayGlobalCorgi", () => {

    it("creates and deletes a corgi", () => {
        expect(displayGlobalCorgis().length).toBe(0);

        const cid = createCorgi("doggy", "blue", "green", "la vida loca");
        expect(cid[0]).toBe("doggy");

        expectAllCorgisHaveId(displayGlobalCorgis(), 1);

        deleteCorgi(cid[1]);

        expect(displayGlobalCorgis().length).toBe(0);
    });

    it("creates and deletes a few corgis", () => {
        expect(displayGlobalCorgis().length).toBe(0);

        const cids = new Array<string>(5);
        for (let i = 0; i < cids.length; i++) {
            cids[i] = createCorgi("doggy" + i.toString(), "blue", "green", "la vida local")[1];
        }

        deleteCorgi(cids[1]);
        deleteCorgi(cids[4]);

        expectAllCorgisHaveId(displayGlobalCorgis(), cids.length - 2);
    });

    it("creates and deletes several corgis", () => {
        expect(displayGlobalCorgis().length).toBe(0);

        const cids = new Array<string>(20);
        for (let i = 0; i < cids.length; i++) {
            cids[i] = createCorgi("doggy" + i.toString(), "blue", "green", "la vida local")[1];
        }

        deleteCorgi(cids[7]);
        deleteCorgi(cids[11]);
        deleteCorgi(cids[15]);
        deleteCorgi(cids[19]);

        expectAllCorgisHaveId(displayGlobalCorgis(), 8);
    });

});

function expectAllCorgisHaveId(corgis: Corgi[], expectedLength: i32): void {
    expect(corgis.length).toBe(expectedLength);
    for (let i = 0; i < corgis.length; i++) {
        const corgi = corgis[i];
        expect(corgi.id).not.toBe("");
    }
}
