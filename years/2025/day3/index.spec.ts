import { describe, it, expect } from "bun:test";
import { solve } from ".";

describe("Part1", () => {
  it("test1", async () => {
    const input = `987654321111111
811111111111119
234234234234278
818181911112111`;
    const {p1} = await solve(input);

    expect(p1()).toEqual(357);
  });

  it("solve", async () => {
    const {p1} = await solve();
    expect(p1()).toEqual(17109);
  });
});

describe("Part2", () => {
  it("test1", async () => {
    const input = `987654321111111
811111111111119
234234234234278
818181911112111`;
    const {p2} = await solve(input);

    expect(p2()).toEqual(3121910778619);
  });

  it("solve", async () => {
    const {p2} = await solve();

    expect(p2()).toEqual(169347417057382);
  });
});

