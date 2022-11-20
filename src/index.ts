export class SqlAbstract {

  static whereThirdArg(arg: string | { col: string } | undefined): string {
    if (typeof arg === "object") {
      return arg.col;
    }

    return `"${arg}"`;
  }

  generateSQL(args?: GenerateSQLArgs): string {
    const columns = args?.columns?.length ? args.columns.join(",") : "*";
    const table = args?.table ? args.table : "MYTABLE";
    const where = args?.where?.length === 3 ? ` WHERE ${args.where.shift()} ${args.where.shift()} ${SqlAbstract.whereThirdArg(args.where.shift())}` : "";
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

    return `SELECT ${columns} FROM ${table}${join}${where}${orderBy}`;
  }
}

type GenerateSQLArgs = {
  statementType?: "select" | "insert" | "update" | "delete";
  columns?: string[];
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
