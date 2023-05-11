// SQL statements can accept '*'
// but we will be explict in the columns selected
type ResultColumn = {
  expression: string;
  as: string; // may need to be improved
};

type Expression =
  | string
  | {
      expression: string;
      as: string; // may need to be improved
    };

type WhereExpression =
  | string
  | {
      expression: string;
      as: string; // may need to be improved
    };

type JoinConstraint = {
  on: Expression;
  using: string[];
};

function isJoinConstraint(
  expression: TableOrSubqueryOrJoinClause
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

function isJoinOperator(
  expression: TableOrSubqueryOrJoinClause
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

function isTable(expression: TableOrSubqueryOrJoinClause): expression is Table {
  return (
    (expression as Table).name !== undefined &&
    (expression as Table).as !== undefined
  );
}

type TableOrSubqueryOrJoinClause = JoinOperator | Table | JoinConstraint;

type SelectCore = {
  modifier: "DISTINCT" | "ALL";
  resultColumns: ResultColumn[];
  from: Table[];
  where: WhereExpression[];
  groupBy?: Expression;
  having?: Expression;
};

function select(select: SelectCore) {
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

function selectTables(fromTables: TableOrSubqueryOrJoinClause[]): string {
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

describe("what is SQL", () => {
  it("SELECT", () => {
    const object: SelectCore = {
      modifier: "DISTINCT",
      resultColumns: [
        { expression: "id", as: "id" },
        { expression: "name", as: "name" },
        { expression: "email", as: "email" },
      ],
      from: [
        {
          name: "Users",
          as: "Users",
        },
      ],
      where: ["1=1"],
    };

    expect(select(object)).toEqual(
      "SELECT id AS id, name AS name, email AS email FROM Users AS Users WHERE 1=1"
    );
  });
});
