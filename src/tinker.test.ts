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
      as: string;
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

type Subquery = {
  selectStatement: SelectCore;
  as: string;
};

function isSubquery(
  expression: TableOrSubqueryOrJoinClause
): expression is Subquery {
  return (
    (expression as Subquery).selectStatement !== undefined &&
    (expression as Subquery).as !== undefined
  );
}
type TableOrSubqueryOrJoinClause =
  | JoinOperator
  | Table
  | Subquery
  | JoinConstraint;

type Select = {
  compoundOperator: "UNION" | "UNION ALL" | "INTERSECT" | "EXCEPT" | undefined;
  selectCores: SelectCore[];
  orderBy: Expression;
  limit: number;
  offset: number;
};

type SelectCore = {
  modifier: "DISTINCT" | "ALL";
  resultColumns: ResultColumn[];
  from: TableOrSubqueryOrJoinClause[];
  where: WhereExpression[];
  groupBy?: Expression;
  having?: Expression;
  window?: Expression;
  values?: Expression;
};

function select(select: Select): string {
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
        if (isSubquery(fromTable)) {
          throw new Error("Subquery unimplemented");
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
  it("Select without compound", () => {
    const object: Select = {
      compoundOperator: undefined,
      limit: 1,
      offset: 1,
      orderBy: "id",
      selectCores: [
        {
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
        },
      ],
    };

    expect(select(object)).toEqual(
      "SELECT id AS id, name AS name, email AS email " +
        "FROM Users AS Users " +
        "WHERE 1=1 " +
        "LIMIT 1 OFFSET 1"
    );
  });

  it("Select with Union", () => {
    const object: Select = {
      compoundOperator: "UNION",
      limit: 1,
      offset: 1,
      orderBy: "id",
      selectCores: [
        {
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
        },
        {
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
        },
      ],
    };

    expect(select(object)).toEqual(
      "SELECT id AS id, name AS name, email AS email " +
        "FROM Users AS Users " +
        "WHERE 1=1 " +
        "UNION " +
        "SELECT id AS id, name AS name, email AS email " +
        "FROM Users AS Users " +
        "WHERE 1=1 " +
        "LIMIT 1 OFFSET 1"
    );
  });
});
