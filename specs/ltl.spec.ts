import * as fc from 'fast-check';
import {evalT, LTLOperator} from '../src/ltl';

test('and', () => {
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

test('or', () => {
  fc.assert(
    fc.property(fc.array(fc.boolean(), 2, 2), data => {
      expect(evalT({
        type: LTLOperator.or,
        value: data as any,
      })).toEqual(data.indexOf(true) !== -1);
    }),
    {verbose: true},
  );
});

