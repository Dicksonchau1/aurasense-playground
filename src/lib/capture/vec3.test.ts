import { describe, it, expect } from "vitest";
import { sub, dot, cross, norm, normalize, angleDeg } from "./vec3";

describe("vec3", () => {
  it("sub returns vector from a to b", () => {
    expect(sub({ x: 1, y: 2, z: 3 }, { x: 4, y: 6, z: 9 })).toEqual({
      x: 3,
      y: 4,
      z: 6,
    });
  });

  it("dot product of orthogonal vectors is zero", () => {
    expect(dot({ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 })).toBe(0);
  });

  it("cross product follows right-hand rule (i x j = k)", () => {
    expect(cross({ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 })).toEqual({
      x: 0,
      y: 0,
      z: 1,
    });
  });

  it("norm of unit vector is 1", () => {
    expect(norm({ x: 1, y: 0, z: 0 })).toBe(1);
  });

  it("normalize produces unit length", () => {
    const n = normalize({ x: 3, y: 4, z: 0 });
    expect(norm(n)).toBeCloseTo(1, 6);
  });

  it("angleDeg between i and j is 90 degrees", () => {
    expect(angleDeg({ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 })).toBeCloseTo(90, 3);
  });

  it("angleDeg between parallel vectors is 0", () => {
    expect(angleDeg({ x: 1, y: 1, z: 0 }, { x: 2, y: 2, z: 0 })).toBeCloseTo(0, 3);
  });

  it("angleDeg between antiparallel vectors is 180", () => {
    expect(angleDeg({ x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 })).toBeCloseTo(180, 3);
  });
});
