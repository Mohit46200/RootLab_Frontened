const FN = { ln:"log", log:"log", log10:"log10", abs:"fabs", exp:"exp", sin:"sin", cos:"cos", tan:"tan", sqrt:"sqrt", asin:"asin", acos:"acos", atan:"atan", sinh:"sinh", cosh:"cosh", tanh:"tanh" };
export function toCpp(n) {
  switch (n.type) {
    case "ConstantNode": return String(n.value);
    case "SymbolNode": return n.name === "pi" ? "3.14159265358979" : n.name === "e" ? "2.71828182845905" : n.name;
    case "ParenthesisNode": return "(" + toCpp(n.content) + ")";
    case "OperatorNode":
      if (n.args.length === 1) return n.fn + toCpp(n.args[0]);
      if (n.op === "^") return "pow(" + toCpp(n.args[0]) + "," + toCpp(n.args[1]) + ")";
      return toCpp(n.args[0]) + n.op + toCpp(n.args[1]);
    case "FunctionNode": {
      const nm = n.fn.name;
      if (!FN[nm]) throw new Error("Unsupported function: " + nm);
      return FN[nm] + "(" + n.args.map(toCpp).join(",") + ")";
    }
    default: throw new Error("Unsupported expression");
  }
}

