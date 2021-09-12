export * from './common';
export * from './producer';
export * from './combination';
export * from './filtering';
export * from './mathematical';
export * from './transformation';
export * from './pipe';

import * as producer from './producer';
import * as filtering from './filtering';
import * as mathematical from './mathematical';
import * as transformation from './transformation';
import * as combination from './combination';
const { zip, merge, race, concat, combineLatest, ...combinations } = combination;
export const observables = { zip, merge, race, concat, combineLatest, ...producer };
export const operators = { ...combinations, ...filtering, ...mathematical, ...transformation };
