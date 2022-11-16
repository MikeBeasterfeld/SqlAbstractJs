import { SqlAbstract } from ".";

describe("generate SQL", () =>  {
    it("should create a simple select statment", () => {
        const sqlabstract = new SqlAbstract;
        expect(sqlabstract.generateSQL()).toEqual("SELECT * FROM MYTABLE");
    });
});
