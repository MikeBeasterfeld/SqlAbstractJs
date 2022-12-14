"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSQL = exports.select = void 0;
function whereThirdArg(arg) {
    if (typeof arg === "object") {
        return arg.col;
    }
    return `"${arg}"`;
}
function selectColumns(columns, table) {
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
function select(args) {
    var _a, _b, _c;
    const columns = selectColumns(args.columns, args.table);
    const joins = (args === null || args === void 0 ? void 0 : args.join)
        ? (_a = args === null || args === void 0 ? void 0 : args.join) === null || _a === void 0 ? void 0 : _a.reduce((prev, tableJoin) => {
            return `${prev} ${tableJoin.type.toUpperCase()} JOIN ${tableJoin.table} ON ${args.table}.${tableJoin.baseTableColumn} = ${tableJoin.table}.${tableJoin.column}`;
        }, "")
        : "";
    const where = ((_b = args === null || args === void 0 ? void 0 : args.where) === null || _b === void 0 ? void 0 : _b.length) === 3
        ? ` WHERE ${args.where.shift()} ${args.where.shift()} ${whereThirdArg(args.where.shift())}`
        : "";
    const orderBy = ((_c = args === null || args === void 0 ? void 0 : args.orderBy) === null || _c === void 0 ? void 0 : _c.length)
        ? " ORDER BY " + args.orderBy.join(" ")
        : "";
    return `SELECT ${columns} FROM ${args.table}${joins}${where}${orderBy}`;
}
exports.select = select;
function generateSQL(args) {
    var _a, _b, _c, _d, _e, _f;
    const table = (args === null || args === void 0 ? void 0 : args.table) ? args.table : "MYTABLE";
    const columns = ((_a = args === null || args === void 0 ? void 0 : args.columns) === null || _a === void 0 ? void 0 : _a.length)
        ? selectColumns(args.columns, table)
        : "*";
    const where = ((_b = args === null || args === void 0 ? void 0 : args.where) === null || _b === void 0 ? void 0 : _b.length) === 3
        ? ` WHERE ${args.where.shift()} ${args.where.shift()} ${whereThirdArg(args.where.shift())}`
        : "";
    const orderBy = ((_c = args === null || args === void 0 ? void 0 : args.orderBy) === null || _c === void 0 ? void 0 : _c.length)
        ? " ORDER BY " + args.orderBy.join(" ")
        : "";
    const values = ((_d = args === null || args === void 0 ? void 0 : args.values) === null || _d === void 0 ? void 0 : _d.length)
        ? args.values.map((value) => `'${value}'`).join(",")
        : "";
    const setValues = ((_e = args === null || args === void 0 ? void 0 : args.columns) === null || _e === void 0 ? void 0 : _e.length)
        ? args.columns.map((column, i) => {
            if ((args === null || args === void 0 ? void 0 : args.values) && args.values[i]) {
                console.log("column", column);
                console.log("value", args.values[i]);
                return [column, args.values[i]];
            }
        })
        : [];
    const join = (args === null || args === void 0 ? void 0 : args.join)
        ? ` ${args.join.type.toUpperCase()} JOIN ${args.join.table} ON ${table}.${args.join.baseTableColumn} = ${args.join.table}.${args.join.column}`
        : "";
    if ((args === null || args === void 0 ? void 0 : args.statementType) == "insert") {
        return `INSERT INTO ${table} (${columns}) VALUES (${values})`;
    }
    if ((args === null || args === void 0 ? void 0 : args.statementType) == "update") {
        const sets = setValues.map((set) => {
            if (set) {
                return `${set[0]} = '${set[1]}'`;
            }
        });
        return `UPDATE ${table} SET ${sets.join(",")}${where}`;
    }
    if ((args === null || args === void 0 ? void 0 : args.statementType) == "delete") {
        return `DELETE FROM ${table}${where}`;
    }
    if ((args === null || args === void 0 ? void 0 : args.statementType) == "create table") {
        return `CREATE TABLE ${table} (${(_f = args.createColumns) === null || _f === void 0 ? void 0 : _f.map((element) => element.join(" ")).join(", ")})`;
    }
    return `SELECT ${columns} FROM ${table}${join}${where}${orderBy}`;
}
exports.generateSQL = generateSQL;
