import { describe, expect, it } from 'bun:test';
import { solve } from '.';

describe.skip('Part1', () => {
  it('input1', async () => {
    const input = `.#..#
.....
#####
....#
...##`;

    const p1 = await solve(input);
    expect(p1).toEqual(8);
  });

  it('input2', async () => {
    const input = `......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####`;

    const p1 = await solve(input);
    expect(p1).toEqual(33);
  });

  it("solution", async () => {
    const p1 = await solve();
    expect(p1).toEqual(309);
  });
});

describe("Part2", () => {
  it("input1", async () => {
    const input = `.#....#####...#..
##...##.#####..##
##...#...#.#####.
..#.....#...###..
..#.#.....#....##`;

    const p2 = await solve(input);
    expect(p2).toEqual(5);
  });

  it("input2", async () => {
    const input = `.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`;

    const p2 = await solve(input);
    expect(p2).toEqual(802);
  });

  it("solution", async () => {
    const p2 = await solve();
    expect(p2).toEqual(416);
  })
});

