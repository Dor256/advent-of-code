import { describe, it, expect } from "bun:test";
import { solve } from ".";
  

describe("Part1", () => {
  it("test1", async () => {
    const input = `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`;

    const {p1} = await solve(input);
    expect(p1()).toEqual(5);
  });

  it("solves", async () => {
    const {p1} = await solve();
    expect(p1()).toEqual(508);
  });
});

describe("Part2", () => {
  it("test1", async () => {
    const input = `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`;

    const {p2} = await solve(input);
    expect(p2()).toEqual(2);
  });

  it("solves", async () => {
    const {p2} = await solve();
    expect(p2()).toEqual(315116216513280);
  });
});
