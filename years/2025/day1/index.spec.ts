import { expect, it, describe } from "bun:test";
import { solve } from ".";

describe.skip("Part1", () => {
  it("test1", async () => {
    const input = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;
    const p1 = await solve(input);

    expect(p1).toEqual(3);
  });

  it("solves", async () => {
    const p1 = await solve();
    expect(p1).toEqual(5);
  });
});

describe("Part2", () => {
  it("test1", async () => {
    const input = `R1000
L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;
    const p2 = await solve(input);

    expect(p2).toEqual(16);
  });

  it("solves", async () => {
    const p2 = await solve();

    expect(p2).toEqual(5872);
  });
});
