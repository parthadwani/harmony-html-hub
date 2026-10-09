import { describe, expect, it } from "vitest";
import { teammateNumbers } from "./event-rules";

describe("Hack-JECRC team composition", () => {
  it("allows only 2 to 4 registered members including the leader", () => {
    expect(teammateNumbers(2)).toEqual([2]);
    expect(teammateNumbers(3)).toEqual([2, 3]);
    expect(teammateNumbers(4)).toEqual([2, 3, 4]);
    expect(() => teammateNumbers(1)).toThrow(RangeError);
    expect(() => teammateNumbers(5)).toThrow(RangeError);
  });
});
