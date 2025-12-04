import { sum } from "../../../utils";

type BatteryBank = number[];

function parseInput(input: string): BatteryBank[] {
  return input.split("\n").map((bank) => bank.split("").map(Number));
}

function findMaxJoltage(bank: BatteryBank, target: number, batteries: number[]) {
  if (target === 0) return batteries;
  const availableBatteries = bank.slice(0, bank.length - target + 1);
  const optimalBattery = Math.max(...availableBatteries);
  const optimalBatteryIdx = bank.indexOf(optimalBattery);
  const updatedBank = bank.slice(optimalBatteryIdx + 1);

  return findMaxJoltage(updatedBank, target - 1, [...batteries, optimalBattery]);
}

function part1(batteryBanks: BatteryBank[], batteryCount: number) {
  const joltages = batteryBanks.map((bank) => {
    return +findMaxJoltage(bank, batteryCount, []).join("");
  });
  return sum(joltages);
}

function part2(batteryBanks: BatteryBank[]) {
  return part1(batteryBanks, 12);
}

export async function solve(input?: string) {
  input ??= await Bun.file(`${import.meta.dir}/input.txt`).text();
  const batteryBanks = parseInput(input);
  return {
    p1: () => part1(batteryBanks, 2),
    p2: () => part2(batteryBanks)
  };
}
