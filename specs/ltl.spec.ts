import * as fc from 'fast-check';
import {evalT} from '../src/ltl';
import {LTLOperator, LTLFormula} from '../src/ltl';

test('boolean', () => {
  fc.property(fc.boolean(), data => {
    expect(evalT(data)).toEqual(data);
  });
});

test('variable', () => {
  const alphabet = () => fc.oneof(
    fc.integer(0x41, 0x5a),
    fc.integer(0x61, 0x7a),
  ).map(String.fromCharCode);
  fc.assert(
    fc.property(fc.tuple(alphabet(), fc.boolean()), data => {
      expect(evalT(data[0], key => data[1])).toEqual(data[1]);
    }),
    {verbose: true},
  );
  fc.assert(
    fc.property(fc.tuple(alphabet(), fc.boolean()), data => {
      expect(() => {
        evalT(data[0]);
      }).toThrow();
    }),
    {verbose: true},
  );
});

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

test('next', () => {
  fc.assert(
    fc.property(fc.boolean(), data => {
      const f = {
        type: LTLOperator.next,
        value: data,
      };
      expect(evalT(evalT(f))).toEqual(data);
    }),
    {verbose: true},
  );
});

test('until', () => {
  fc.assert(
    fc.property(fc.array(fc.boolean()), data => {
      const f = {
        type: LTLOperator.until,
        value: ['a', 'b'],
      };
      console.log(data);
      expect(true).toEqual(true);
    }),
    {verbose: true},
  );
});
