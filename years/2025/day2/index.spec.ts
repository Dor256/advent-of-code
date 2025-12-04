import { expect, it, describe } from "bun:test";
import { solve } from ".";

describe.skip("Part1", () => {
  it("test1", async () => {
    const input = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,
1698522-1698528,446443-446449,38593856-38593862,565653-565659,
824824821-824824827,2121212118-2121212124`;

    const {p1} = await solve(input);

    expect(p1()).toEqual(1227775554);
  });

  it("solve", async () => {
    const {p1} = await solve();

    expect(p1()).toEqual(54641809925);
  });
});

describe("Part2", () => {
  it("test1", async () => {
      const input = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,
1698522-1698528,446443-446449,38593856-38593862,565653-565659,
824824821-824824827,2121212118-2121212124`;

    const {p2} = await solve(input);

    expect(p2()).toEqual(4174379265);
  });

  it("solve", async () => {
    const {p2} = await solve();
    expect(p2()).toEqual(73694270688);
  });
});
