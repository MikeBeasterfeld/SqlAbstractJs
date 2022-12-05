function whereThirdArg(arg: string | { col: string } | undefined): string {
  if (typeof arg === "object") {
    return arg.col;
  }

  return `"${arg}"`;
}

function selectColumns(columns: string[] | undefined, table: string): string {
  if (columns) {
    return columns
      .map((col) => {
        if (col.split(".").length < 2) {
          return `${table}.${col}`;
        }

        return col;
      })
      .join(", ");
  }

  return "*";
}

type SelectArgs = {
  table: string;
  columns?: string[];
  where?: (string | { col: string })[];
  orderBy?: string[];
  join?: {
    type: "inner" | "outer" | "cross";
    table: string;
    column: string;
    baseTableColumn: string;
  }[];
};

export function select(args: SelectArgs): string {
  const columns = selectColumns(args.columns, args.table);

  const joins = args?.join
    ? args?.join?.reduce((prev, tableJoin) => {
        return `${prev} ${tableJoin.type.toUpperCase()} JOIN ${
          tableJoin.table
        } ON ${args.table}.${tableJoin.baseTableColumn} = ${tableJoin.table}.${
          tableJoin.column
        }`;
      }, "")
    : "";

  const where =
    args?.where?.length === 3
      ? ` WHERE ${args.where.shift()} ${args.where.shift()} ${whereThirdArg(
          args.where.shift()
        )}`
      : "";

  const orderBy = args?.orderBy?.length
    ? " ORDER BY " + args.orderBy.join(" ")
    : "";

  return `SELECT ${columns} FROM ${args.table}${joins}${where}${orderBy}`;
}

export function generateSQL(args: GenerateSQLArgs): string {
  const table = args?.table ? args.table : "MYTABLE";
  const columns = args?.columns?.length
    ? selectColumns(args.columns, table)
    : "*";
  const where =
    args?.where?.length === 3
      ? ` WHERE ${args.where.shift()} ${args.where.shift()} ${whereThirdArg(
          args.where.shift()
        )}`
      : "";
  const orderBy = args?.orderBy?.length
    ? " ORDER BY " + args.orderBy.join(" ")
    : "";
  const values = args?.values?.length
    ? args.values.map((value) => `'${value}'`).join(",")
    : "";
  const setValues = args?.columns?.length
    ? args.columns.map((column, i) => {
        if (args?.values && args.values[i]) {
          console.log("column", column);
          console.log("value", args.values[i]);
          return [column, args.values[i]];
        }
      })
    : [];
  const join = args?.join
    ? ` ${args.join.type.toUpperCase()} JOIN ${args.join.table} ON ${table}.${
        args.join.baseTableColumn
      } = ${args.join.table}.${args.join.column}`
    : "";

  if (args?.statementType == "insert") {
    return `INSERT INTO ${table} (${columns}) VALUES (${values})`;
  }

  if (args?.statementType == "update") {
    const sets = setValues.map((set) => {
      if (set) {
        return `${set[0]} = '${set[1]}'`;
      }
    });

    return `UPDATE ${table} SET ${sets.join(",")}${where}`;
  }

  if (args?.statementType == "delete") {
    return `DELETE FROM ${table}${where}`;
  }

  if (args?.statementType == "create table") {
    return `CREATE TABLE ${table} (${args.createColumns
      ?.map((element) => element.join(" "))
      .join(", ")})`;
  }

  return `SELECT ${columns} FROM ${table}${join}${where}${orderBy}`;
}

type GenerateSQLArgs = {
  statementType?: "insert" | "update" | "delete" | "create table";
  columns?: string[];
  createColumns?: string[][];
  values?: string[];
  table?: string;
  where?: (string | { col: string })[];
  orderBy?: string[];
  join?: {
    type: "inner";
    table: string;
    column: string;
    baseTableColumn: string;
  };
};
