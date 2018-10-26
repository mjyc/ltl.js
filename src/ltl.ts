export enum LTLOperator {
  var = 'var',
  not = 'not',
  and = 'and',
  or = 'or',
}

export type LTLFormula = {
  type: LTLOperator,
  value: any// string | [LTLFormula],
} | boolean;

export function evalT(formula: LTLFormula, lookup?: (key: string) => boolean) {
  if (typeof formula === 'boolean') {
    return formula;
  }

  switch (formula.type) {
    case LTLOperator.var:
      return lookup(formula.value as string);
    case LTLOperator.not:
      const f = evalT(formula, lookup);
      return typeof formula.value === 'boolean'
        ? !formula.value : f;
    case LTLOperator.and:
      const fs = formula.value
        .map(f => evalT(f, lookup))
      if (fs.indexOf(false) !== -1)  // conjunction contains a false
        return false;
      const fsWOBool = fs.filter(f => typeof f !== 'boolean');
      return fsWOBool.length === 0
        ? true  // an empty conjunction is true
        : {
          type: LTLOperator.and,
          value: fsWOBool,
        };
    default:
      throw new Error(`Unknown type: ${formula.type}`);
  }
}
