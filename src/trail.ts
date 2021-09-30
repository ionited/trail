import { TrailCore } from './core';
import { Step } from './step';

export function Trail(steps?: Step[]) {
  return new TrailCore(steps);
}
