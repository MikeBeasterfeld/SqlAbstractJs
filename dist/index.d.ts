type SelectArgs = {
    table: string;
    columns?: string[];
    where?: (string | {
        col: string;
    })[];
    orderBy?: string[];
    join?: {
        type: "inner" | "outer" | "cross";
        table: string;
        column: string;
        baseTableColumn: string;
    }[];
};
export declare function select(args: SelectArgs): string;
export declare function generateSQL(args: GenerateSQLArgs): string;
type GenerateSQLArgs = {
    statementType?: "insert" | "update" | "delete" | "create table";
    columns?: string[];
    createColumns?: string[][];
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
