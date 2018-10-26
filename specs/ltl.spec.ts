import * as fc from 'fast-check';
import { evalT } from '../src/ltl';

const p1 = {
  type: 'prop',
  value: true,  // boolean
};

const p2 = {
  type: 'prop',
  value: false,  // boolean
};

const p3 = {
  type: 'prop',
  value: () => true,  // function (propositional logic)
};

console.log(evalT(p1, ()=>{}));

test('test', () => {
  fc.assert(fc.property(fc.boolean(), data => {
      expect(true).toEqual(true)
  }));
});
