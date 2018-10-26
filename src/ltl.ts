export enum LTLOperator {
  var = 'var',
  not = 'not',
  and = 'and',
  or = 'or',
}

export type LTLFormula = {
  type: LTLOperator,
  value: string | [LTLFormula],
} | boolean;

export function evalT(formula: LTLFormula, lookup?: (key: string) => boolean) {
  if (typeof formula === 'boolean') {
    return formula;
  }

  if (formula.type === LTLOperator.var) {
    return lookup(formula.value as string);

  } else if (formula.type === LTLOperator.not) {
    const f = evalT(formula, lookup);
    return typeof formula.value === 'boolean'
      ? !formula.value : f;

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
        value: fsWOBool,
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
        value: fsWOBool,
      };

  } else {
    throw new Error(`Unknown type: ${formula.type}`);
  }
}
