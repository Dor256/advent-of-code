import { describe, it, expect } from "bun:test";
import { solve } from ".";

describe("Part1", () => {
  it("test1", async () => {
    const input = `3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0`;

    const {p1} = await solve(input);

    expect(p1()).toEqual(43210);
  });

  it("test2", async () => {
    const input = `3,23,3,24,1002,24,10,24,1002,23,-1,23,
101,5,23,23,1,24,23,23,4,23,99,0,0`;

    const {p1} = await solve(input);
    expect(p1()).toEqual(54321);
  });

    it("test3", async () => {
    const input = `3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,
1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0`;

    const {p1} = await solve(input);
    expect(p1()).toEqual(65210);
  });

  it("solves", async () => {
    const {p1} = await solve();
    expect(p1()).toEqual(567045);
  });
});

describe("Part2", () => {
  it("test1", async () => {
    const input = `3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,
27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5`;

    const {p2} = await solve(input);
    expect(p2()).toEqual(139629729);
  });

  it("solves", async () => {
    const {p2} = await solve();
    expect(p2()).toEqual(39016654);
  });
});
