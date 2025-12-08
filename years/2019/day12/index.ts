import { invariant, lcm, sum, type Point } from "../../../utils";

type Moon = {
  pos: Point & { z: number };
  vel: Point & { z: number };
};

type Axis = 'x' | 'y' | 'z';

function parseInput(input: string) {
  return input.split("\n").map((line) => {
    const groups = /<x=(?<x>-?\d+), y=(?<y>-?\d+), z=(?<z>-?\d+)>/g.exec(line)?.groups;
    invariant(groups, "No groups found");

    return { pos: { x: +groups.x, y: +groups.y, z: +groups.z }, vel: { x: 0, y: 0, z: 0 } };
  });
}

function calculatePull(a: number, b: number) {
  if (a > b) return -1;
  if (a < b) return 1;
  return 0;
}

function applyGravity(moons: Moon[]) {
  for (let i = 0; i < moons.length; i++) {
    for (let j = i + 1; j < moons.length; j++) {
      const velA = {
        x: calculatePull(moons[i].pos.x, moons[j].pos.x),
        y: calculatePull(moons[i].pos.y, moons[j].pos.y),
        z: calculatePull(moons[i].pos.z, moons[j].pos.z)
      };
      const velB = {
        x: -velA.x,
        y: -velA.y,
        z: -velA.z
      };

      moons[i].vel = { x: moons[i].vel.x + velA.x, y: moons[i].vel.y + velA.y, z: moons[i].vel.z + velA.z };
      moons[j].vel = { x: moons[j].vel .x + velB.x, y: moons[j].vel .y + velB.y, z: moons[j].vel .z + velB.z };
    }
  }
  return moons;
}

function applyVelocity(moons: Moon[]) {
  for (let i = 0; i < moons.length; i++) {
    moons[i].pos.x += moons[i].vel.x;
    moons[i].pos.y += moons[i].vel.y;
    moons[i].pos.z += moons[i].vel.z;
  }
  return moons;
}

function potentialEnergy(moon: Moon) {
  return sum([
    Math.abs(moon.pos.x),
    Math.abs(moon.pos.y),
    Math.abs(moon.pos.z)
  ]);
}

function kineticEnergy(moon: Moon) {
   return sum([
    Math.abs(moon.vel.x),
    Math.abs(moon.vel.y),
    Math.abs(moon.vel.z)
  ]);
}

function part1(moons: Moon[], steps: number) {
  for (let i = 0; i < steps; i++) {
    applyGravity(moons);
    applyVelocity(moons);
  }
  return sum(moons.map((moon) => kineticEnergy(moon) * potentialEnergy(moon)));
}

function stringifyMoons(moons: Moon[], axis: Axis) {
  return moons
    .map((moon) => `pos=${axis}:${moon.pos[axis]}|vel=${axis}:${moon.vel[axis]}`)
    .join("\n");
}

function applyGravityPerAxis(moons: Moon[], axis: Axis) {
  for (let i = 0; i < moons.length; i++) {
    for (let j = i + 1; j < moons.length; j++) {
      const velA = { [axis]: calculatePull(moons[i].pos[axis], moons[j].pos[axis]) };
      const velB = { [axis]: -velA[axis] };

      moons[i].vel[axis] += velA[axis];
      moons[j].vel[axis] += velB[axis];
    }
  }
  return moons;
}

function applyVelocityPerAxis(moons: Moon[], axis: Axis) {
  for (let i = 0; i < moons.length; i++) {
    moons[i].pos[axis] += moons[i].vel[axis];
  }
  return moons;
}

function calculateAxisCycles(moons: Moon[], axis: Axis) {
  const original = stringifyMoons(moons, axis);
  let steps = 0;
  while (true) {
    const hash = steps !== 0 ? stringifyMoons(moons, axis) : '';
    if (original === hash) return steps;
    applyGravityPerAxis(moons, axis);
    applyVelocityPerAxis(moons, axis);
    steps++;
  }
}

function part2(moons: Moon[]) {
  const dx = calculateAxisCycles([...moons], 'x');
  const dy = calculateAxisCycles([...moons], 'y');
  const dz = calculateAxisCycles([...moons], 'z');
  return lcm(lcm(dx, dy), dz);
}

export async function solve(input?: string) {
  input ??= await Bun.file(`${import.meta.dir}/input.txt`).text();
  const moons = parseInput(input);
  return {
    p1: (steps: number) => part1(moons, steps),
    p2: () => part2(moons)
  };
}
