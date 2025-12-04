import { describe, it, expect } from "bun:test";
import { solve } from ".";

describe("Part1", () => {
  it.skip("test1", async () => {
    const input = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;
    const {p1} = await solve(input);

    expect(p1()).toEqual(13);
  });

  it("solves", async () => {
    const {p1} = await solve();

    expect(p1()).toEqual(1449);
  });
});

describe("Part2", () => {
  it("test2", async () => {
    const input = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;

    const {p2} = await solve(input);

    expect(p2()).toEqual(43);
  });

  it("solve", async () => {
    const {p2} = await solve();

    expect(p2()).toEqual(8746);
  });
});
