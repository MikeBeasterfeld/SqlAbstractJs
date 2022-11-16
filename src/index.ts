export class SqlAbstract {
    generateSQL(args?: GenerateSQLArgs): string {
        const columns = args?.columns?.length ? args.columns.join(",") : "*";
        const table = args?.table ? args.table : "MYTABLE";
        const where = args?.where?.length ? " WHERE " + args.where.join(" ") : "";
        const orderBy = args?.orderBy?.length ? " ORDER BY " + args.orderBy.join(" ") : "";
        const values = args?.values?.length ? args.values.map(value => `'${value}'`).join(",") : "";

        if (args?.statementType == "insert") {
            return `INSERT INTO ${table} (${columns}) VALUES (${values})`;
        }

        return `SELECT ${columns} FROM ${table}${where}${orderBy}`;
    }
}

type GenerateSQLArgs = {
    statementType?: "select" | "insert",
    columns?: string[],
    values?: string[],
    table?: string,
    where?: string[],
    orderBy?: string[]
;}

