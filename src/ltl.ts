export function evalT(formula, lookup) {
  switch (formula.type) {
    // case 'prop':
    // case 'and':
    // case 'or':
    // case 'not':
    default:
      return formula;
  }
}

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

const por1 = {
  type: 'or',
  value: [p1, p2]
};

// console.log(evalT(p1, ()=>{}));
// console.log(evalT(p2, ()=>{}));
// console.log(evalT(p3, ()=>{}));
