import * as math from "mathjs";
import { toCpp } from "./toCpp";
import { T } from "./templates";
import { simulate, P } from "./simulate";

export const PRICE = 5;
export const METHODS = [
  { id: "bisection", name: "Bisection", note: "Needs an interval [a, b]" },
  { id: "newton", name: "Newton-Raphson", note: "Starts from a" },
  { id: "regula", name: "Regula Falsi", note: "Needs an interval [a, b]" },
  { id: "iterative", name: "Iterative (fixed point)", note: "Starts from a" },
  { id: "secant", name: "Secant", note: "Needs two guesses a, b" },
];

export function build(eqRaw, a, b, gRaw, ids) {
  const eq = eqRaw.trim().replace(/"/g, "");
  const node = math.parse(eq.replace(/\bln\b/g, "log"));
  const code = node.compile();
  const F = (x) => code.evaluate({ x });
  const dn = math.derivative(node, "x");
  const dcode = dn.compile();
  const DF = (x) => dcode.evaluate({ x });
  let G, gCpp;
  if (gRaw && gRaw.trim()) {
    const gn = math.parse(gRaw.trim()); const gc = gn.compile();
    G = (x) => gc.evaluate({ x }); gCpp = toCpp(gn);
  } else {
    let d = DF(a); if (!isFinite(d) || Math.abs(d) < 1e-9) d = 1;
    G = (x) => x - F(x) / d; gCpp = "x-f(x)/(" + P(d, 8) + ")";
  }
  if (!isFinite(F(a)) || !isFinite(F(b))) throw new Error("f(x) is not defined at a or b");
  const c = { eq, f: toCpp(node), df: toCpp(dn), g: gCpp };
  return ids.map((id) => ({ id, name: METHODS.find((m) => m.id === id).name, code: T[id](c), output: simulate(id, F, DF, G, a, b, eq) }));
}

