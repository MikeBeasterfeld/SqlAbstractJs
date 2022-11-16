export class SqlAbstract {
    generateSQL(args?: GenerateSQLArgs): string {
        const columns = args?.columns?.length ? args.columns.join(",") : "*";
        const table = args?.table ? args.table : "MYTABLE";
        const where = args?.where?.length ? " WHERE " + args.where.join(" ") : "";
        const orderBy = args?.orderBy?.length ? " ORDER BY " + args.orderBy.join(" ") : "";
        
        return `SELECT ${columns} FROM ${table}${where}${orderBy}`;
    }
}

type GenerateSQLArgs = {
    columns?: string[],
    table?: string,
    where?: string[],
    orderBy?: string[]
;}

