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
  const formula = {
    type: LTLOperator.until,
    value: ['0', '1'] as any,
  };
  fc.assert(
    fc.property(fc.array(fc.tuple(fc.boolean(), fc.boolean())), data => {
      console.log('===', data);
      const r = data.reduce((f, tup) => {
        console.log('---', f, tup, tup[0], tup[1]);
        return evalT(f, (key) => tup[parseInt(key)]) as any;
      }, formula);
      // console.log('r', r);
      let r2 = true;
      for (let i = 0; i < data.length; i++) {
        const tup = data[i];
        r2 = r2 && (tup[0] || tup[1]);
        if (r2 && tup[1]) {
          break;
        }
      }
      // const r2 = data.reduceRight((f, tup) => {
      //   return f && (tup[0] || tup[1]);
      //   // return evalT(f, (key) => tup[key]) as any;
      // }, {cur: true, done: false});
      // if (r)
      if (r !== r2) 
        console.log('xxx', r, r2, data);
    }),
    {verbose: true},
  );
});
