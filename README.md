# Advent of Code Solutions

## Setup

To set up a new day run `bun setup`.
<br>
This script will prompt you for a year and a day if, for instance, you are about to solve day 11 of year 2026 provide 2026 for the year prompt and 11 for the day prompt.

Each day will be set up with the following files:
- `index.ts` - The file that will contain the solution
- `index.spec.ts` - The file for testing examples and running solutions
- `input.txt` - Your puzzle input from Advent of Code

The `index.ts` file will be set up with the following code:

```ts
// index.ts
export async function solve(input?: string) {
  input ??= await Bun.file(`${import.meta.dir}/input.txt`).text();
  return {
    p1: () => {},
    p2: () => {}
  }
}
```

The `index.spec.ts` file will be set up with the following code:

```ts
// index.spec.ts
import { describe, it, expect } from "bun:test";
import { solve } from ".";
  

describe("Part1", () => {
  it("test1", async () => {
  });
```

You can later create a variable for your test input and pass it into the `solve` function to see the solution for your input.
Running the `solve` function with no input will attempt to solve the puzzle with the contents of your `input.txt` file.

## Solving

After writing your solution you can attempt to solve the puzzle by running `bun solve <year> <day>`.
<br>
Example:

`bun solve 2025 15` Will execute the file under `/years/2025/day15/index.spec.ts` in watch mode.

You may make changes to your solutions as you please and your test file will rerun on changes.
