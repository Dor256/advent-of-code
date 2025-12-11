import { invariant, sum } from "../../../utils";
import { LinearSystemSolver } from "./linear-alg";

type Manual = {
  diagram: string;
  schematics: string[];
  joltage: number[];
};

function parseInput(input: string): Manual[] {
  return input.split("\n").map((line) => {
    const schematics = line
      .match(/\((\d)(,\d)*\)/g)
      ?.map((schematic) => schematic.replaceAll(/[\(\)]/g, ""));
    const diagram = line
      .match(/\[[\.#]+\]/g)
      ?.map((d) => d.replaceAll(/[\[\]]/g, ""))
      .join();
    const joltage = line
      .match(/\{(\d+)(,\d+)*\}/g)
      ?.flatMap((jolt) => jolt.replaceAll(/[\{\}]/g, "").split(",").map(Number));
    
    invariant(schematics, "No schematics");
    invariant(diagram, "No diagram");
    invariant(joltage, "No Joltage");

    return {
      diagram,
      schematics,
      joltage
    }
  });
}

function flipSwitch(machineSwitch: string) {
  return machineSwitch === "#" ? "." : "#";
}

function calculateLeastPresses(manual: Manual) {
  let presses = 1;
  while (true) {
    const combinations = bfs(manual.schematics, presses);
    for (const combination of combinations) {
      const machineState = manual.diagram.split("").map(() => ".");
      for (const button of combination) {
         button.split(",").forEach((idx) => machineState[+idx] = flipSwitch(machineState[+idx]));
      }
      if (machineState.join("") === manual.diagram) {
        return presses;
      }
    }
    presses++;
  }
}

function part1(manuals: Manual[]) {
  return sum(manuals.map(calculateLeastPresses));
}

function bfs(schematics: string[], repetitions: number) {
  const queue: { combinations: string[], lastIdx: number }[] = [{ combinations: [], lastIdx: 0 }];
  const combinations = [];

  while (queue.length > 0) {
    const state = queue.shift()!;
    if (state.combinations.length > 0) combinations.push(state.combinations);
    if (state.combinations.length === repetitions) continue;
    for (let i = state.lastIdx; i < schematics.length; i++) {
      const newCombo = [...state.combinations, schematics[i]];
      queue.push({ combinations: newCombo, lastIdx: i });
    }
  }
  return combinations;
}

function part2(manuals: Manual[]) {
  return sum(manuals.map((manual) => {
    const solver = new LinearSystemSolver();
    const schematics = manual.schematics.map((buttons) => buttons.split(",").map(Number));
    return solver.solve(manual.joltage, schematics);
  }));
}

export async function solve(input?: string) {
  input ??= await Bun.file(`${import.meta.dir}/input.txt`).text();
  const manuals = parseInput(input);
  return {
    p1: () => part1(manuals),
    p2: () => part2(manuals)
  };
}
