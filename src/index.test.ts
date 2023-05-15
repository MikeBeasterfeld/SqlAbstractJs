import { Select, SelectCore } from "./types";
import { select } from "./index";

describe("what is SQL", () => {
  const baseSelectCore: SelectCore = {
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

  const baseSelect: Select = {
    compoundOperator: undefined,
    limit: 1,
    offset: 1,
    orderBy: "id",
    selectCores: [baseSelectCore],
  };

  it("Select without compound", () => {
    const object: Select = baseSelect;

    expect(select(object)).toEqual(
      "SELECT id AS id, name AS name, email AS email " +
        "FROM Users AS Users " +
        "WHERE 1=1 " +
        "LIMIT 1 OFFSET 1"
    );
  });

  it("Select with Subselect", () => {
    const object: Select = {
      ...baseSelect,
      selectCores: [{ ...baseSelectCore, from: [baseSelect] }],
    };

    expect(select(object)).toEqual(
      "SELECT id AS id, name AS name, email AS email " +
        "FROM (SELECT id AS id, name AS name, email AS email FROM Users AS Users WHERE 1=1 LIMIT 1 OFFSET 1) " +
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
