import fs from "fs";

import "@/utils/array";
import { toKey } from "@/utils/common";

type Particle = {
  n: number;
  p: number[];
  v: number[];
  a: number[];
};

function parseInput() {
  return fs
    .readFileSync("src/inputs/2017/20/day.20.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map(parseParticle);
}

function parseParticle(value: string, n: number): Particle {
  const [p, v, a] = value
    .split(", ")
    .map((x) => x.slice(3, -1).split(",").map(Number));

  return {
    n,
    p,
    v,
    a,
  };
}

export function part1() {
  const particles = parseInput();

  return particles
    .map((particle) => [particle.n, getDistance(particle, 400)])
    .sort((x, y) => x[1] - y[1])[0][0];
}

export function part2() {
  let particles = parseInput();

  for (let i = 0; i < 50; i++) {
    const lookup = new Map<string, Particle[]>();

    for (const particle of particles) {
      for (let j = 0; j < 3; j++) {
        particle.v[j] += particle.a[j];
        particle.p[j] += particle.v[j];
      }

      const key = toKey(particle.p);

      if (!lookup.has(key)) {
        lookup.set(key, []);
      }

      lookup.get(key)!.push(particle);
    }

    particles = [...lookup.entries()]
      .filter(([, particles]) => particles.length === 1)
      .flatMap(([, particles]) => particles);
  }

  return particles.length;
}

function getDistance(particle: Particle, t: number) {
  return getPosition(particle, t)
    .map((x) => Math.abs(x))
    .sum();
}

function getPosition({ p, v, a }: Particle, t: number) {
  const position: number[] = [];

  for (let i = 0; i < 3; i++) {
    position.push(0.5 * a[i] * t * t + (0.5 * a[i] + v[i]) * t + p[i]);
  }

  return position;
}
