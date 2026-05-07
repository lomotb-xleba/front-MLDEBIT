export const KpiCard = ({ title, value }: { title: string; value: string }) => (
  <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
    <p className="text-sm text-slate-400">{title}</p>
    <p className="mt-2 text-2xl font-semibold">{value}</p>
  </article>
);
