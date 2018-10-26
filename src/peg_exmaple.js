var peg = require('pegjs');

var parser = peg.generate(`
start
  = additive

additive
  = left:multiplicative _ "+" _ right:additive { return left + right; }
  / multiplicative

multiplicative
  = left:primary "*" right:multiplicative { return left * right; }
  / primary

primary
  = integer
  / "(" additive:additive ")" { return additive; }

integer "integer"
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

_ = [ \\t\\r\\n]*
`);

console.log(parser.parse('1 + 1'));
