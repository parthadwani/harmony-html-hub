export function teammateNumbers(teamSize: number) {
  if (!Number.isInteger(teamSize) || teamSize < 2 || teamSize > 4) {
    throw new RangeError('Teams must contain 2 to 4 members.');
  }
  return Array.from({ length: teamSize - 1 }, (_, index) => index + 2);
}