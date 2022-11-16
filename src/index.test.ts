import { SqlAbstract } from ".";

describe("generate SQL", () =>  {
    const sqlabstract = new SqlAbstract;
    it("should create a simple select statment", () => {
        expect(sqlabstract.generateSQL()).toEqual("SELECT * FROM MYTABLE");
    });

    it("should create a select statment with specific columns", () => {
        expect(sqlabstract.generateSQL({ columns: ["foo"] })).toEqual("SELECT foo FROM MYTABLE");
    });

    it("should create a select statement for any table", () => {
        expect(sqlabstract.generateSQL({ table: "bar" })).toEqual("SELECT * FROM bar");
    });

    it("should create a select statment with a where clause", () => {
        expect(sqlabstract.generateSQL({ where: ["foo", ">", "bar"]})).toEqual("SELECT * FROM MYTABLE WHERE foo > bar");
    });
});
