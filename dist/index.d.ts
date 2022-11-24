export declare class SqlAbstract {
    static whereThirdArg(arg: string | {
        col: string;
    } | undefined): string;
    static whereColumns(columns: string[] | undefined, table: string): string;
    generateSQL(args?: GenerateSQLArgs): string;
}
declare type GenerateSQLArgs = {
    statementType?: "select" | "insert" | "update" | "delete";
    columns?: string[];
    values?: string[];
    table?: string;
    where?: (string | {
        col: string;
    })[];
    orderBy?: string[];
    join?: {
        type: "inner";
        table: string;
        column: string;
        baseTableColumn: string;
    };
};
export {};
