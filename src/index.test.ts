import { SqlAbstract } from ".";

describe("generate select SQL", () =>  {
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

    it("should create a select statement with a order by clause", () => {
        expect(sqlabstract.generateSQL({ orderBy: [ "foo", "ASC" ]})).toEqual("SELECT * FROM MYTABLE ORDER BY foo ASC");        
    });
});

describe("generate insert SQL", () =>  {
    const sqlabstract = new SqlAbstract;
    it("should create a simple insert statement", () => {
        expect(sqlabstract.generateSQL({ statementType: "insert", columns: ["columnFoo"], values: ["foo"]})).toEqual("INSERT INTO MYTABLE (columnFoo) VALUES ('foo')");
    });
});

describe("generate update SQL", () => {
    const sqlabstract = new SqlAbstract;
    it("should create a simple update statement", () => {
        expect(sqlabstract.generateSQL({ statementType: "update", columns: ["columnFoo"], values: ["foo"], where: ["foo", ">", "bar"]})).toEqual("UPDATE MYTABLE SET columnFoo = 'foo' WHERE foo > bar");
    });
});

