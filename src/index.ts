export class SqlAbstract {
    generateSQL(args?: GenerateSQLArgs): string {
        const columns = args?.columns?.length ? args.columns.join(",") : "*";
        const table = args?.table ? args.table : "MYTABLE";
        const where = args?.where?.length ? " WHERE " + args.where.join(" ") : "";
        const orderBy = args?.orderBy?.length ? " ORDER BY " + args.orderBy.join(" ") : "";
        const values = args?.values?.length ? args.values.map(value => `'${value}'`).join(",") : "";
        const setValues = args?.columns?.length ? args.columns.map((column, i) => {
            if(args?.values && args.values[i]) {
                console.log("column", column);
                console.log("value", args.values[i]);
                return [column, args.values[i]];
            }
        }) : [];

        if (args?.statementType == "insert") {
            return `INSERT INTO ${table} (${columns}) VALUES (${values})`;
        }

        if (args?.statementType == "update") {
            const sets = setValues.map((set) => {
                if(set) {
                    return `${set[0]} = '${set[1]}'`;
                }
            });

            return `UPDATE ${table} SET ${sets.join(",")}${where}`;
        }

        if (args?.statementType == "delete") {
            return `DELETE FROM ${table}${where}`;
        }

        return `SELECT ${columns} FROM ${table}${where}${orderBy}`;
    }
}

type GenerateSQLArgs = {
    statementType?: "select" | "insert" | "update" | "delete",
    columns?: string[],
    values?: string[],
    table?: string,
    where?: string[],
    orderBy?: string[]
;}

