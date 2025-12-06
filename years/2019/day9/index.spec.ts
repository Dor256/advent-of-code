import { describe, it, expect } from "bun:test";
import { solve } from ".";

describe("Part1", () => {
  it("test1", async () => {
    const input = `109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99`;

    const {p1} = await solve(input);
    expect(p1()).toEqual([109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99])
  });

  it("test2", async () => {
    const input = `1102,34915192,34915192,7,4,7,99,0`;

    const {p1} = await solve(input);
    expect(p1()[0].toString()).toHaveLength(16);
  });

  it("test3", async () => {
    const input = `104,1125899906842624,99`;
    const {p1} = await solve(input);
    expect(p1()[0]).toEqual(1125899906842624);
  });

  it("solve", async () => {
    const {p1} = await solve();
    expect(p1([1])).toEqual([2594708277]);
  });
});

describe("Part2", () => {
  it("solve", async () => {
    const {p2} = await solve();
    expect(p2()).toEqual([87721]);
  });
});
