import { PRICE } from "../lib/build";

export default function MethodCard({ method, selected, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={
        "flex items-center justify-between rounded-xl border-2 p-4 text-left transition " +
        (selected ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40" : "border-transparent bg-white dark:bg-slate-900")
      }
    >
      <span>
        <span className="block font-semibold">{method.name}</span>
        <span className="text-xs text-slate-500">{method.note}</span>
      </span>
      <span className={"text-sm font-semibold " + (selected ? "text-indigo-600" : "text-slate-400")}>
        {selected ? "✓ " : ""}₹{PRICE}
      </span>
    </button>
  );
}
