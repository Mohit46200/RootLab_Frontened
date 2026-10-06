import { useState } from "react";
import MethodCard from "./components/MethodCard";
import { METHODS, PRICE, build } from "./lib/build";
import { makePdf } from "./lib/pdf";
import { payForMethods } from "./lib/payment";

const input =
  "w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500";

export default function App() {
  const [eq, setEq] = useState("x^3 - 2x - 5");
  const [a, setA] = useState("2");
  const [b, setB] = useState("3");
  const [g, setG] = useState("");
  const [phone, setPhone] = useState("");
  const [sel, setSel] = useState(["bisection"]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);

  const total = sel.length * PRICE;
  const reset = () => setDone(null);
  const toggle = (id) => {
    reset();
    setSel(sel.includes(id) ? sel.filter((s) => s !== id) : [...sel, id]);
  };

  // Builds the code + output for every selected method; returns null (and sets an error) if input is bad.
  const prepare = () => {
    setError("");
    const A = parseFloat(a), B = parseFloat(b);
    if (!eq.trim()) return setError("Enter an equation in x."), null;
    if (!sel.length) return setError("Select at least one method."), null;
    if (isNaN(A) || isNaN(B)) return setError("Enter numbers for a and b."), null;
    if (!/^\d{10}$/.test(phone)) return setError("Enter your 10-digit phone number (needed by Cashfree)."), null;
    try {
      return build(eq, A, B, g, METHODS.map((m) => m.id).filter((id) => sel.includes(id)));
    } catch (e) {
      return setError("Could not read the equation: " + e.message), null;
    }
  };

  const payAndDownload = async () => {
    const results = prepare();
    if (!results) return;
    setBusy(true);
    try {
      const ref = await payForMethods(sel, phone);
      const doc = makePdf(eq.trim(), a, b, results, ref);
      const fn = "root-finder-report.pdf";
      doc.save(fn); // automatic download after successful payment
      setDone({ ref, doc, fn });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Root<span className="text-indigo-600">Lab</span>
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Enter an equation, pick methods, pay ₹{PRICE} per method, and get a PDF with the C++ code and its output.
        </p>
      </header>

      <section className="space-y-4 rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-900">
        <div>
          <label className="text-sm font-medium">Equation f(x) = 0</label>
          <input className={input + " mt-1 font-mono"} value={eq} onChange={(e) => { setEq(e.target.value); reset(); }} placeholder="x^3 - 2x - 5" />
          <p className="mt-1 text-xs text-slate-500">Use x, + - * / ^, sin, cos, tan, exp, log (natural), sqrt, pi, e. Example: x*exp(x) - 2</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">a (first value)</label>
            <input className={input} value={a} onChange={(e) => { setA(e.target.value); reset(); }} />
          </div>
          <div>
            <label className="text-sm font-medium">b (second value)</label>
            <input className={input} value={b} onChange={(e) => { setB(e.target.value); reset(); }} />
          </div>
        </div>
        {sel.includes("iterative") && (
          <div>
            <label className="text-sm font-medium">g(x) for the iterative method <span className="text-slate-400">(optional, x = g(x))</span></label>
            <input className={input + " mt-1 font-mono"} value={g} onChange={(e) => setG(e.target.value)} placeholder="2*exp(-x), or leave blank to auto-generate" />
          </div>
        )}
        <div>
          <label className="text-sm font-medium">Phone number</label>
          <input className={input} inputMode="numeric" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} placeholder="10-digit mobile number" />
        </div>
      </section>

      <section className="mt-5">
        <h2 className="mb-2 text-sm font-semibold text-slate-500">Choose methods</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {METHODS.map((m) => (
            <MethodCard key={m.id} method={m} selected={sel.includes(m.id)} onToggle={() => toggle(m.id)} />
          ))}
        </div>
      </section>

      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-900">
        <div>
          <div className="text-xs text-slate-500">Total</div>
          <div className="text-2xl font-bold">₹{total}</div>
        </div>
        <button onClick={payAndDownload} disabled={busy || !sel.length} className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">
          {busy ? "Waiting for payment…" : "Pay & download PDF"}
        </button>
      </div>

      {done && (
        <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
          Payment successful (order {done.ref}). Your PDF has been downloaded.
          <button onClick={() => done.doc.save(done.fn)} className="ml-2 font-medium underline">Download again</button>
        </div>
      )}
    </div>
  );
}
