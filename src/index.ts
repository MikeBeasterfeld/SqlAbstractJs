import {
  ResultColumn,
  Select,
  SelectCore,
  TableOrSelectOrJoinClause,
  WhereExpression,
  isJoinConstraint,
  isJoinOperator,
  isSelect,
  isTable,
} from "./types";

export function select(select: Select): string {
  return (
    select.selectCores
      .map((selectCore) => {
        return selectStatement(selectCore);
      })
      .join(" " + select.compoundOperator + " ") +
    " LIMIT " +
    select.limit +
    " OFFSET " +
    select.offset
  );
}

function selectStatement(select: SelectCore) {
  const selectStatement = ["SELECT"];

  selectStatement.push(selectResultColumns(select.resultColumns));
  selectStatement.push(selectTables(select.from));
  selectStatement.push(selectWhere(select.where));

  return selectStatement.join(" ");
}

function selectResultColumns(resultColumns: ResultColumn[]): string {
  return resultColumns
    .map((resultColumn) => {
      return `${resultColumn.expression} AS ${resultColumn.as}`;
    })
    .join(", ");
}

function selectTables(fromTables: TableOrSelectOrJoinClause[]): string {
  return (
    "FROM " +
    fromTables
      .map((fromTable) => {
        if (isTable(fromTable)) {
          return `${fromTable.name} AS ${fromTable.as}`;
        }
        if (isJoinOperator(fromTable)) {
          throw new Error("JoinOperator unimplemented");
        }
        if (isSelect(fromTable)) {
          return "(" + select(fromTable) + ")";
        }
        if (isJoinConstraint(fromTable)) {
          throw new Error("JoinConstraint unimplemented");
        }
      })
      .join(", ")
  );
}

function selectWhere(where: WhereExpression[]): string {
  if (where.length === 0) {
    return "";
  }

  return (
    "WHERE " +
    where
      .map((whereClause) => {
        return whereClause;
      })
      .join(" AND ")
  );
}
