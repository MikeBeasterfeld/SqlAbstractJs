export type ResultColumn = {
  expression: string;
  as: string; // may need to be improved
};

type Expression =
  | string
  | {
      expression: string;
      as: string; // may need to be improved
    };

export type WhereExpression =
  | string
  | {
      expression: string;
      as: string;
    };

type JoinConstraint = {
  on: Expression;
  using: string[];
};

export function isJoinConstraint(
  expression: TableOrSelectOrJoinClause
): expression is JoinConstraint {
  return (
    (expression as JoinConstraint).on !== undefined &&
    (expression as JoinConstraint).using !== undefined
  );
}

type JoinTypes =
  | "INNER"
  | "CROSS"
  | "LEFT"
  | "RIGHT"
  | "FULL"
  | "LEFT OUTER"
  | "LEFT RIGHT"
  | "LEFT FULL"
  | "NATURAL LEFT OUTER"
  | "NATURAL LEFT RIGHT"
  | "NATURAL LEFT FULL"
  | "NATURAL LEFT"
  | "NATURAL RIGHT"
  | "NATURAL FULL"
  | "NATURAL INNER"
  | "CROSS";

type JoinOperator = {
  natural: boolean;
  type: JoinTypes;
};

export function isJoinOperator(
  expression: TableOrSelectOrJoinClause
): expression is JoinOperator {
  return (
    (expression as JoinOperator).natural !== undefined &&
    (expression as JoinOperator).type !== undefined
  );
}

type Table = {
  name: string;
  as: string;
};

export function isTable(
  expression: TableOrSelectOrJoinClause
): expression is Table {
  return (
    (expression as Table).name !== undefined &&
    (expression as Table).as !== undefined
  );
}

export type TableOrSelectOrJoinClause =
  | JoinOperator
  | Table
  | Select
  | JoinConstraint;

export type Select = {
  compoundOperator: "UNION" | "UNION ALL" | "INTERSECT" | "EXCEPT" | undefined;
  selectCores: SelectCore[];
  orderBy: Expression;
  limit: number;
  offset: number;
};

export function isSelect(
  expression: TableOrSelectOrJoinClause
): expression is Select {
  return (expression as Select).selectCores !== undefined;
}

export type SelectCore = {
  modifier: "DISTINCT" | "ALL";
  resultColumns: ResultColumn[];
  from: TableOrSelectOrJoinClause[];
  where: WhereExpression[];
  groupBy?: Expression;
  having?: Expression;
  window?: Expression;
  values?: Expression;
};
