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

// console.log(evalT(p1, ()=>{}));

test('two properties', () => {
  fc.assert(fc.property(fc.boolean(), data => {
    fc.property(fc.boolean(), data2 => {
      console.log('two properties', data, data2);
      expect(data != data2).toEqual(true);
    });
  }), {verbose: true});
});

test('set', () => {
  fc.assert(
    fc.property(fc.set(fc.boolean(), 2, 2), data => {
      console.log('set', data);
      expect(true).toEqual(true);
    }),
    {verbose: true},
  );
});

test('tuple', () => {
  fc.assert(
    fc.property(fc.tuple(fc.boolean()), data => {
      console.log('tuple', data);
      expect(true).toEqual(true);
    }),
    {verbose: true},
  );
});

test('array', () => {
  fc.assert(
    fc.property(fc.array(fc.boolean(), 2, 2), data => {
      console.log('array', data);
      expect(true).toEqual(true);
    }),
    {verbose: true},
  );
});
