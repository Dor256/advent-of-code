import { describe, it, expect } from "bun:test";
import { solve } from ".";

describe("Part1", () => {
  it.skip("input1", async () => {
    const input = `1,9,10,3,2,3,11,0,99,30,40,50`;
    const p1 = await solve(input);
    expect(p1).toEqual(5);
  });

  it("solve", async () => {
    const p1 = await solve();
    expect(p1).toEqual(5866663);
  });
});

describe.skip("Part2", () => {
  it("solve", async () => {
    const p2 = await solve();
    expect(p2).toEqual(4259);
  });
});

