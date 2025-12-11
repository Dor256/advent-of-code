import { describe, it, expect } from "bun:test";
import { solve } from ".";
  

describe("Part1", () => {
  it("test1", async () => {
    const input = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`;
    const {p1} = await solve(input);
    expect(p1()).toEqual(50);
  });

  it("solves", async () => {
    const {p1} = await solve();
    expect(p1()).toEqual(4781235324);
  })
});

describe("Part2", () => {
  it.only("test1", async () => {
    const input = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`;
    const {p2} = await solve(input);
    expect(p2()).toEqual(24);
  });

  it("solves", async () => {
    const {p2} = await solve();
    expect(p2()).toEqual(1566935900);
  });
});
