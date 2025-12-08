import { describe, it, expect } from "bun:test";
import { solve } from ".";
  

describe("Part1", () => {
  it("test1", async () => {
    const input = `<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`;

    const {p1} = await solve(input);
    expect(p1(10)).toEqual(179);
  });

  it("solves", async () => {
    const {p1} = await solve();
    expect(p1(1000)).toEqual(10664);
  });
});

describe("Part2", async () => {
  it("test1", async () => {
    const input = `<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`;

    const {p2} = await solve(input);
    expect(p2()).toEqual(2772);
  });

  it("solves", async () => {
    const {p2} = await solve();
    expect(p2()).toEqual(303459551979256);
  });
});
