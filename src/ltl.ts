export enum LTLOperator {
  not = 'not',
  and = 'and',
  or = 'or',
  next = 'next',
  until = 'until',
}

export type LTLFormula = {
  type: LTLOperator,
  value: LTLFormula | [LTLFormula],
} | boolean | string;

export function evalT(
  formula: LTLFormula,
  lookup?: (key: string) => boolean
): LTLFormula {
  if (typeof formula === 'boolean') {
    return formula;
  } else if (typeof formula === 'string') {
    if (typeof lookup === 'undefined') {
      throw new Error('Argument lookup is undefined');
    }
    return !!lookup(formula);
  }

  if (formula.type === LTLOperator.not) {
    const f = evalT(formula.value as LTLFormula, lookup);
    return typeof f === 'boolean'
      ? !f : {type: LTLOperator.not, value: f};

  } else if (formula.type === LTLOperator.and) {
    const fs = (formula.value as [LTLFormula])
      .map(f => evalT(f, lookup));
    if (fs.indexOf(false) !== -1)  // conjunction contains a false
      return false;
    const fsWOBool = fs.filter(f => typeof f !== 'boolean');
    return fsWOBool.length === 0
      ? true  // an empty conjunction is a conjunction of trues
      : {
        type: LTLOperator.and,
        value: fsWOBool as [LTLFormula],
      };

  } else if (formula.type === LTLOperator.or) {
    const fs = (formula.value as [LTLFormula])
      .map(f => evalT(f, lookup));
    if (fs.indexOf(true) !== -1)  // disjunction contains a true
      return true;
    const fsWOBool = fs.filter(f => typeof f !== 'boolean');
    return fsWOBool.length === 0
      ? false  // an empty disjunction is a disjunction of falses
      : {
        type: LTLOperator.or,
        value: fsWOBool as [LTLFormula],
      };

  } else if (formula.type === LTLOperator.next) {
    return formula.value as LTLFormula;

  } else if (formula.type === LTLOperator.until) {
    const f1 = evalT(formula.value[0], lookup);
    const f2 = evalT(formula.value[1], lookup);

    if (typeof f1 == 'boolean' && !f1) {
      return f1;
    } else if (typeof f2 == 'boolean' && f2) {
      return f2;
    }

    // const a: LTLFormula = {
    //   type: LTLOperator.or,
    //   value: [f1 as LTLFormula, formula.value[1]] as any,
    // };
    // console.log(a);

    return {
      type: LTLOperator.until,
      value: [{
        type: LTLOperator.and,
        value: [f1, formula.value[0]],
      }, {
        type: LTLOperator.or,
        value: [f1, formula.value[1]],
      }] as any,
    };
  } else {
    throw new Error(`Unknown type: ${formula.type}`);
  }
}
