import * as fc from 'fast-check';
import {evalT, LTLOperator} from '../src/ltl';

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

// console.log(evalT(p1, ()=>{}));

test('array', () => {
  fc.assert(
    fc.property(fc.array(fc.boolean(), 2, 2), data => {
      expect(evalT({
        type: LTLOperator.and,
        value: data as any,
      })).toEqual(data.indexOf(false) === -1);
    }),
    {verbose: true},
  );
});

