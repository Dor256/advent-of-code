import { describe, it, expect } from "bun:test";
import { solve } from ".";
  

describe.skip("Part1", () => {
  it("test1", async () => {
    const input = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`;
    const {p1} = await solve(input);
    expect(p1()).toEqual(7);
  });

  it("solves", async () => {
    const {p1} = await solve();
    expect(p1()).toEqual(434);
  });
});

describe("Part2", () => {
  it("test1", async () => {
 const input = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`;
    const {p2} = await solve(input);
    expect(p2()).toEqual(33);
  });

  it("solves", async () => {
    const {p2} = await solve();
    expect(p2()).toEqual(15132);
  });
});
