// Runs the same algorithms as the C++ programs and returns the text the program would print.
export const P = (v, p) => String(parseFloat(Number(v).toPrecision(p)));
const FX = (v, p) => Number(v).toFixed(p);
export function simulate(id, F, DF, G, a, b, eq) {
  const o = [];
  const head = "f(x)=" + eq;
  const ask2 = (l) => "Enter two initial approximate roots " + l + " : " + a + " " + b;
  if (id === "bisection") {
    const max = 50, err = 1e-6; let i = 1, x, x1;
    o.push(head, ask2("a,b"), "Enter max no of iterations: " + max, "Iterations\tRoot");
    if (F(a) * F(b) > 0) o.push("(Warning: f(a) and f(b) have the same sign - root may not be bracketed.)");
    x = (a + b) / 2; let A = a, B = b;
    while (i < max) {
      o.push(i + "\t\t" + P(x, 10));
      if (F(A) * F(x) < 0) B = x; else A = x;
      x1 = (A + B) / 2; i++;
      if (Math.abs(x1 - x) < err) { o.push("", "Root after " + i + " iterations=" + P((A + B) / 2, 10)); return o.join("\n"); }
      x = x1;
    }
    o.push("", "Solution Does not cover: " + i + " iteration not sufficient");
  } else if (id === "regula") {
    const max = 50, err = 1e-4; let i = 1, x0 = a, x1 = b;
    const R = (p, q) => p - ((q - p) / (F(q) - F(p)) * F(p));
    o.push(head, ask2("x0,x1"), "Enter max No of iterations: " + max, "Iterations\tRoot");
    let x2 = R(x0, x1), x3;
    while (i < max) {
      o.push(i + "\t\t" + P(x2, 6));
      if (F(x0) * F(x2) < 0) x1 = x2; else x0 = x2;
      x3 = R(x0, x1); i++;
      if (Math.abs(x3 - x2) < err) { o.push("", "Root after " + i + " iterations=" + P(R(x0, x1), 5)); return o.join("\n"); }
      x2 = x3;
    }
    o.push("", "Solution Does not cover: " + i + " iteration not sufficient");
  } else if (id === "secant") {
    const err = 1e-4; let i = 2, x0 = a, x1 = b;
    const S = (p, q) => q - ((q - p) / (F(q) - F(p)) * F(q));
    o.push(head, ask2("x0,x1"), "Iterations\tRoot");
    let x2 = S(x0, x1), x3;
    while (Math.abs(x2 - x1) > err && i < 100 && isFinite(x2)) {
      o.push("X" + i + "\t\t" + P(x2, 6));
      x3 = S(x1, x2); x1 = x2; x2 = x3; i++;
    }
    o.push("", "After " + (i - 1) + " iterations Root =" + P(x2, 6));
  } else if (id === "newton") {
    const aerr = 0.0001, maxitr = 50; let x0 = a;
    o.push(head, "Enter x0, allowed error, maximum iterations", a + " " + aerr + " " + maxitr);
    for (let itr = 1; itr <= maxitr; itr++) {
      const h = F(x0) / DF(x0), x1 = x0 - h;
      o.push("Iteration no." + String(itr).padStart(3) + " X = " + FX(x1, 6).padStart(9));
      if (Math.abs(h) < aerr) { o.push("After" + String(itr).padStart(3) + " iterations, root = " + FX(x1, 6).padStart(8)); return o.join("\n"); }
      if (!isFinite(x1)) break;
      x0 = x1;
    }
    o.push("Iterations not sufficient, solution does not converge");
  } else {
    const err = 1e-4; let i = 1, x0 = a, x1 = G(x0);
    o.push(head, "Enter the first approximation " + a, "Iteration\t\tRoot");
    while (Math.abs(x1 - x0) > err && i < 100 && isFinite(x1)) {
      o.push("X" + i + "\t" + P(x1, 6));
      x0 = x1; x1 = G(x0); i++;
    }
    o.push("Root after " + i + " iteration=" + P(x1, 6) + (isFinite(x1) && Math.abs(x1 - x0) <= err ? "" : "   (did not converge - try another g(x))"));
  }
  return o.join("\n");
}

const METHODS = [
  { id: "bisection", name: "Bisection", note: "Needs an interval [a, b]" },
  { id: "newton", name: "Newton-Raphson", note: "Starts from a" },
  { id: "regula", name: "Regula Falsi", note: "Needs an interval [a, b]" },
  { id: "iterative", name: "Iterative (fixed point)", note: "Starts from a" },
  { id: "secant", name: "Secant", note: "Needs two guesses a, b" },
];

