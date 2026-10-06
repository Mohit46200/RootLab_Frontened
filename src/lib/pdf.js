import { jsPDF } from "jspdf";

export function makePdf(eq, a, b, results, ref) {
  
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = 595, M = 40, LH = 11.5; let y = M;
  const nl = (h = LH) => { y += h; if (y > 800) { doc.addPage(); y = M; } };
  const line = (t, size = 9, font = "courier", style = "normal") => {
    doc.setFont(font, style); doc.setFontSize(size);
    const rows = doc.splitTextToSize(t.replace(/\t/g, "    "), W - 2 * M);
    rows.forEach((r) => { doc.text(r, M, y); nl(size + 3); });
  };
  line("Numerical Methods - Root Finding Report", 17, "helvetica", "bold");
  line("Equation: f(x) = " + eq, 11, "helvetica");
  line("Interval / guesses: a = " + a + ", b = " + b, 11, "helvetica");
  line("Payment ref: " + ref + "   |   Date: " + new Date().toLocaleString(), 9, "helvetica");
  results.forEach((r) => {
    nl(10); line(r.name + " Method", 14, "helvetica", "bold");
    line("C++ Code", 11, "helvetica", "bold");
    r.code.split("\n").forEach((l) => line(l, 8.5));
    nl(4); line("Output", 11, "helvetica", "bold");
    r.output.split("\n").forEach((l) => line(l || " ", 8.5));
  });
  return doc;
}
