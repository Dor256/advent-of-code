import { describe, it, expect } from "bun:test";
import { solve } from ".";
  

describe("Part1", () => {
  it("test1", async () => {
    const {p1} = await solve();
    expect(p1()).toEqual(1909);
  });
});

describe("Part2", () => {
  it("test1", async () => {
    const {p2} = await solve();
    p2();
  });
});
