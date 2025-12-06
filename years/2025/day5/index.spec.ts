import { describe, it, expect } from "bun:test";
import { solve } from ".";

describe.skip("Part1", () => {
  it("test1", async () => {
    const input = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;

    const {p1} = await solve(input);
    expect(p1()).toEqual(3);
  });

  it("solves", async () => {
    const {p1} = await solve();
    expect(p1()).toEqual(5);
  });
});

describe("Part2", () => {
  it.skip("test1", async () => {
    const input = `3-5
10-14
12-18
16-20

1
5
8
11
17
32`;

    const {p2} = await solve(input);
    expect(p2()).toEqual(14);
  });

  it("solves", async () => {
    const {p2} = await solve();
    expect(p2()).toEqual(344378119285354);
  });
});
