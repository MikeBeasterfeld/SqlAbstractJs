import { generateSQL } from "./index";

describe("generate select SQL", () => {
  it("should create a simple select statment", () => {
    expect(generateSQL()).toEqual("SELECT * FROM MYTABLE");
  });

  it("should create a select statment with specific columns", () => {
    expect(generateSQL({ columns: ["foo"] })).toEqual(
      "SELECT MYTABLE.foo FROM MYTABLE"
    );
  });

  it("should create a select statement for any table", () => {
    expect(generateSQL({ table: "bar" })).toEqual(
      "SELECT * FROM bar"
    );
  });

  it("should create a select statment with a where clause", () => {
    expect(generateSQL({ where: ["foo", ">", "bar"] })).toEqual(
      "SELECT * FROM MYTABLE WHERE foo > \"bar\""
    );
  });

  it("should create a select statment with a where clause comparing two columns", () => {
    expect(
      generateSQL({ where: ["foo", ">", { col: "bar" }] })
    ).toEqual("SELECT * FROM MYTABLE WHERE foo > bar");
  });

  it("should create a select statement with a order by clause", () => {
    expect(generateSQL({ orderBy: ["foo", "ASC"] })).toEqual(
      "SELECT * FROM MYTABLE ORDER BY foo ASC"
    );
  });

  it("should create a select with a join", () => {
    expect(
      generateSQL({
        join: {
          type: "inner",
          table: "MYTABLE2",
          column: "mytable_id",
          baseTableColumn: "id",
        },
      })
    ).toEqual(
      "SELECT * FROM MYTABLE INNER JOIN MYTABLE2 ON MYTABLE.id = MYTABLE2.mytable_id"
    );
  });

  it("should create a select with a join with limited select columns", () => {
    expect(
      generateSQL({
        columns: ["foo", "MYTABLE2.bar"],
        join: {
          type: "inner",
          table: "MYTABLE2",
          column: "mytable_id",
          baseTableColumn: "id",
        },
      })
    ).toEqual(
      "SELECT MYTABLE.foo, MYTABLE2.bar FROM MYTABLE INNER JOIN MYTABLE2 ON MYTABLE.id = MYTABLE2.mytable_id"
    );
  });
});

describe("generate insert SQL", () => {
  it("should create a simple insert statement", () => {
    expect(
      generateSQL({
        statementType: "insert",
        columns: ["columnFoo"],
        values: ["foo"],
      })
    ).toEqual("INSERT INTO MYTABLE (MYTABLE.columnFoo) VALUES ('foo')");
  });
});

describe("generate update SQL", () => {
  it("should create a simple update statement", () => {
    expect(
      generateSQL({
        statementType: "update",
        columns: ["columnFoo"],
        values: ["foo"],
        where: ["foo", ">", "bar"],
      })
    ).toEqual("UPDATE MYTABLE SET columnFoo = 'foo' WHERE foo > \"bar\"");
  });
});

describe("generate delete SQL", () => {
  it("should create a simple delete statement", () => {
    expect(
      generateSQL({
        statementType: "delete",
        where: ["foo", ">", "bar"],
      })
    ).toEqual("DELETE FROM MYTABLE WHERE foo > \"bar\"");
  });
});

describe("generate table creation SQL", () => {
  it("should crete a create table statement", () => {
    expect(
      generateSQL({
        statementType: "create table",
        table: "test_table",
        createColumns: [["note", "TEXT"]],
      })
    ).toEqual("CREATE TABLE test_table (note TEXT)");
  });
});


