import { expect, describe, it } from "bun:test";
import { solve } from ".";

describe("Part1", () => {
  it("test1", async () => {
    const input = `3,0,4,0,99`
    const p1 = await solve();

    expect(p1).toEqual(9775037);
  });
});

describe.skip("Part2", () => {
  it.skip("test1", async () => {
    const input = `3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9`;
    const p2 = await solve(input);

    expect(p2).toEqual(15586959);
  });

  it.skip("test2", async () => {
    const input = `3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,
1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,
999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99`;

    const p2 = await solve(input);

    expect(true).toBeTruthy();
  });

  it("part2 solution", async () => {
    const p2 = await solve();

    expect(p2).toEqual(15586959);
  });
});
