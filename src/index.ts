export class SqlAbstract {
    generateSQL(args?: Record<string, string[]>): string {
        const columns = args && args.columns ? args.columns.join(",") : "*";
        return `SELECT ${columns} FROM MYTABLE`;
    }
}

