import * as fc from 'fast-check';
import {evalT} from '../src/ltl';
import {LTLOperator, LTLFormula} from '../src/ltl'

test('not', () => {
  fc.assert(
    fc.property(fc.boolean(), data => {
      expect(evalT({
        type: LTLOperator.not,
        value: data as LTLFormula,
      })).toEqual(!data);
    }),
    {verbose: true},
  );
});

test('and', () => {
  fc.assert(
    fc.property(fc.array(fc.boolean()), data => {
      expect(evalT({
        type: LTLOperator.and,
        value: data as [LTLFormula],
      })).toEqual(data.indexOf(false) === -1);
    }),
    {verbose: true},
  );
});

test('or', () => {
  fc.assert(
    fc.property(fc.array(fc.boolean()), data => {
      expect(evalT({
        type: LTLOperator.or,
        value: data as [LTLFormula],
      })).toEqual(data.indexOf(true) !== -1);
    }),
    {verbose: true},
  );
});

