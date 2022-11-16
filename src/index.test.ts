import { SqlAbstract } from ".";

describe("generate SQL", () =>  {
    it("should create a simple select statment", () => {
        const sqlabstract = new SqlAbstract;
        
        expect(sqlabstract.generateSQL()).toEqual("SELECT * FROM MYTABLE");
    });

    it("should create a select statment with limited columns", () => {
        const sqlabstract = new SqlAbstract;

        expect(sqlabstract.generateSQL({ columns: ["foo"] })).toEqual("SELECT foo FROM MYTABLE");
    });
});
