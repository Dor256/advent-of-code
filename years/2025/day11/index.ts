type Graph = Record<string, string[]>;

function parseInput(input: string) {
  const graph: Graph = {};
  input.split("\n").map((line) => {
    const [source, dests] = line.split(": ");
    const destinations = dests.split(" ");
    graph[source] = destinations; 
  });
  return graph;
}

function dfs(graph: Graph, node: string, fft: boolean, dac: boolean, cache: Map<string, [number, number]>): [number, number] {
  let paths1 = 0;
  let paths2 = 0;
  if (cache.has(`${node}${fft}${dac}`)) {
    return cache.get(`${node}${fft}${dac}`)!;
  }
  if (node === "fft") fft = true;
  if (node === "dac") dac = true;

  const neighbors = graph[node] ?? [];
  for (const neighbor of neighbors) {
    if (neighbor === "out") {
      if (fft && dac) paths2++;
      paths1++;
      cache.set(`${node}${fft}${dac}`, [paths1, paths2]);
    } else {
      const [res1, res2] = dfs(graph, neighbor, fft, dac, cache);
      paths2 += res2;
      paths1 += res1;
      cache.set(`${node}${fft}${dac}`, [paths1, paths2]);
    }
  }
  return [paths1, paths2];
}


function part1(graph: Graph) {
  const cache = new Map<string, [number, number]>();
  return dfs(graph, "you", false, false, cache)[0];
}

function part2(graph: Graph) {
  const cache = new Map<string, [number, number]>();
  return dfs(graph, "svr", false, false, cache)[1];
}

export async function solve(input?: string) {
  input ??= await Bun.file(`${import.meta.dir}/input.txt`).text();
  const graph = parseInput(input);
  return {
    p1: () => part1(graph),
    p2: () => part2(graph)
  };
}
