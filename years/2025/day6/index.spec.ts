import { describe, it, expect } from "bun:test";
import { solve } from ".";
  

describe("Part1", () => {
  it("test1", async () => {
    const input = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `;

    const {p1} = await solve(input);
    expect(p1()).toEqual(4277556);
  });

  it("solve", async () => {
    const {p1} = await solve();
    expect(p1()).toEqual(6891729672676);
  });
});

describe("Part2", () => {
  it("test1", async () => {
    const input = `123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `;

    const {p2} = await solve(input);
    expect(p2()).toEqual(3263827);
  })

  it('solve', async () => {
    const {p2} = await solve();
    expect(p2()).toEqual(9770311947567);
  });
});
