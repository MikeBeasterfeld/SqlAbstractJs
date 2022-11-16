export class SqlAbstract {
    generateSQL(args?: Record<string, string[] | string>): string {
        const columns = args && Array.isArray(args.columns) && args.columns.length > 0 ? args.columns.join(",") : "*";
        const table = args && args.table ? args.table : "MYTABLE";
        const where = args && Array.isArray(args.where) && args.where.length > 0 ? " WHERE " + args.where.join(" ") : "";
        
        return `SELECT ${columns} FROM ${table}${where}`;
    }
}

