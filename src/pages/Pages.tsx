import { useEffect, useState } from "react";
import { PhoneCall } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { formatCurrency } from "../shared/format";
import {
  channelService,
  dashboardService,
  operationService,
  recommendationService,
  receivablesService,
  reportService,
  modelService,
  type OperatorResult,
  type ReportFormat
} from "../shared/services";
import { KpiCard } from "../shared/ui/KpiCard";
import type {
  ChannelMetric,
  DashboardMetrics,
  ModelQuality,
  OperationTask,
  RecommendationItem,
  ReceivablesSummary
} from "../shared/mockData";

const pieColors = ["#3b82f6", "#6366f1", "#a855f7"];

export const DashboardPage = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    dashboardService.getMetrics().then(setMetrics);
  }, []);

  if (!metrics) {
    return <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 text-slate-400">Загрузка данных...</div>;
  }

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <KpiCard title="Recovery Rate" value={`${metrics.recoveryRate}%`} />
        <KpiCard title="Цикл Cash-to-Cash" value={metrics.cashToCash} />
        <KpiCard title="Ожидаемый эффект" value={formatCurrency(metrics.expectedEffect)} />
        <KpiCard title="Счётов в работе" value={`${metrics.accountsInWork}`} />
        <KpiCard title="Счётов в риске" value={`${metrics.atRiskAccounts}`} />
        <KpiCard title="Статус модели" value={metrics.modelStatus} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Динамика возврата</h3>
              <p className="mt-1 text-sm text-slate-400">Изменение Recovery Rate и собранной суммы по лицевым счётам.</p>
            </div>
          </div>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="period" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 12 }} />
                <Legend />
                <Line type="monotone" dataKey="recoveryRate" name="Recovery Rate, %" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="collected" name="Сумма взыскания" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <h3 className="text-lg font-semibold">Фокус каналов</h3>
          <p className="mt-1 text-sm text-slate-400">Оценка эффективности каналов взыскания для лицевых счётов.</p>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.channels}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="channel" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 12 }} />
                <Legend />
                <Bar dataKey="roi" name="ROI, %" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>
    </div>
  );
};

export const ReceivablesPage = () => {
  const [summary, setSummary] = useState<ReceivablesSummary | null>(null);

  useEffect(() => {
    receivablesService.getSummary().then(setSummary);
  }, []);

  if (!summary) {
    return <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 text-slate-400">Загрузка данных...</div>;
  }

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <KpiCard title="Общий объём задолженности" value={formatCurrency(summary.totalDebt)} />
        <KpiCard title="Просроченная задолженность" value={formatCurrency(summary.overdueDebt)} />
        <KpiCard title="Доля просроченной" value={`${summary.overdueShare}%`} />
        <KpiCard title="Средний срок просрочки" value={`${summary.avgOverdueDays} дня`} />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Распределение по срокам</h3>
              <p className="mt-1 text-sm text-slate-400">Процент задолженности по периоду просрочки.</p>
            </div>
          </div>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.overdueDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 12 }} />
                <Bar dataKey="value" name="Доля, %" fill="#60a5fa" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <h3 className="text-lg font-semibold">Сегменты счетов</h3>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={summary.segmentDistribution} dataKey="value" nameKey="name" outerRadius={100} label>
                  {summary.segmentDistribution.map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-slate-400">Топ регионов по сумме задолженности.</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {summary.topRegions.map((item) => (
              <li key={item.region} className="flex items-center justify-between rounded-xl bg-slate-950/60 px-3 py-2">
                <span>{item.region}</span>
                <span>{formatCurrency(item.amount)}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
};

export const RecommendationsPage = () => {
  const [items, setItems] = useState<RecommendationItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [status, setStatus] = useState<"в работе" | "выполнено">("в работе");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    recommendationService.list().then((data) => {
      setItems(data);
      setSelectedId(data[0]?.id ?? "");
      setStatus(data[0]?.status ?? "в работе");
    });
  }, []);

  const selected = items.find((item) => item.id === selectedId) ?? items[0];

  const handleComplete = async () => {
    if (!selected) {
      return;
    }

    setLoading(true);
    const result = await recommendationService.setStatus(selected.id, "выполнено");
    setItems((prev) => prev.map((item) => (item.id === selected.id ? { ...item, status: result.status } : item)));
    setStatus(result.status);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_1fr]">
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="text-lg font-semibold">Список лицевых счетов с рекомендациями</h3>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  setSelectedId(item.id);
                  setStatus(item.status);
                }}
                className={`w-full rounded-lg p-3 text-left ${selectedId === item.id ? "bg-blue-600/20 ring-1 ring-blue-500" : "bg-slate-800/70"}`}
              >
                <p className="font-medium">ID {item.id} • {item.account}</p>
                <p className="text-slate-400">Рекомендация: {item.recommendation} • Приоритет: {item.priority} • Успех: {item.successRate}</p>
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="text-lg font-semibold">Карточка рекомендации</h3>
        {selected ? (
          <>
            <div className="mt-4 space-y-2 text-sm">
              <p><span className="text-slate-400">Счёт:</span> {selected.account}</p>
              <p><span className="text-slate-400">Сумма задолженности:</span> {formatCurrency(selected.debt)}</p>
              <p><span className="text-slate-400">Риск невозврата:</span> {selected.riskScore}</p>
              <p><span className="text-slate-400">Канал:</span> {selected.recommendation}</p>
              <p><span className="text-slate-400">Регион:</span> {selected.region}</p>
              <p><span className="text-slate-400">Статус:</span> {status}</p>
            </div>
            <button
              type="button"
              onClick={handleComplete}
              disabled={loading || status === "выполнено"}
              className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {loading ? "Сохранение..." : status === "выполнено" ? "Выполнено" : "Отметить выполненной"}
            </button>
          </>
        ) : (
          <p className="text-sm text-slate-400">Выберите счёт слева.</p>
        )}
      </section>
    </div>
  );
};

export const OperationsPage = () => {
  const [tasks, setTasks] = useState<OperationTask[]>([]);
  const [selectedDebtor, setSelectedDebtor] = useState<string>("");
  const [lastAction, setLastAction] = useState<string>("Нет действий");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    operationService.listTasks().then((data) => {
      setTasks(data);
      setSelectedDebtor(data[0]?.id ?? "");
    });
  }, []);

  const current = tasks.find((task) => task.id === selectedDebtor);

  const submitAction = async (result: OperatorResult) => {
    if (!selectedDebtor) {
      return;
    }
    setIsSubmitting(true);
    await operationService.submitAction({ debtorId: selectedDebtor, result });
    setLastAction(result);
    setIsSubmitting(false);
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_1fr]">
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="text-lg font-semibold">Операционные задачи по лицевым счетам</h3>
        <ul className="mt-4 space-y-3 text-sm">
          {tasks.map((task) => (
            <li key={task.id}>
              <button
                type="button"
                onClick={() => {
                  setSelectedDebtor(task.id);
                  setLastAction("Нет действий");
                }}
                className={`w-full rounded-lg p-3 text-left ${selectedDebtor === task.id ? "bg-blue-600/20 ring-1 ring-blue-500" : "bg-slate-800/70"}`}
              >
                <p className="font-medium">{task.account} — приоритет {task.priority}</p>
                <p className="text-slate-400">Просрочка: {task.overdue} • Сумма: {formatCurrency(task.amount)}</p>
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="text-lg font-semibold">Карточка счёта</h3>
        {current ? (
          <>
            <div className="mt-4 space-y-2 text-sm">
              <p><span className="text-slate-400">Счёт:</span> {current.account}</p>
              <p><span className="text-slate-400">Задолженность:</span> {formatCurrency(current.amount)}</p>
              <p><span className="text-slate-400">Просрочка:</span> {current.overdue}</p>
              <p><span className="text-slate-400">Канал:</span> {current.channel}</p>
              <p><span className="text-slate-400">Статус:</span> {current.status}</p>
              <p><span className="text-slate-400">Последнее действие:</span> {lastAction}</p>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-2">
              <button disabled={isSubmitting} onClick={() => submitAction("Обещание платежа")} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60">Обещание платежа</button>
              <button disabled={isSubmitting} onClick={() => submitAction("Отказ")} className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60">Отказ</button>
              <button disabled={isSubmitting} onClick={() => submitAction("Перезвонить")} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60">
                <PhoneCall size={16} />
                Перезвонить
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-400">Выберите счёт из списка.</p>
        )}
      </section>
    </div>
  );
};

export const ChannelsPage = () => {
  const [metrics, setMetrics] = useState<ChannelMetric[]>([]);

  useEffect(() => {
    channelService.getMetrics().then(setMetrics);
  }, []);

  if (!metrics.length) {
    return <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 text-slate-400">Загрузка данных...</div>;
  }

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard title="Средний ROI" value="127%" />
        <KpiCard title="Средний отклик" value="16%" />
        <KpiCard title="Успешных контактов" value="72%" />
      </section>
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="text-lg font-semibold">Канал взыскания</h3>
        <p className="mt-1 text-sm text-slate-400">Показатели эффективности по каналам для лицевых счетов.</p>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="channel" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 12 }} />
              <Legend />
              <Bar dataKey="roi" name="ROI, %" fill="#22c55e" radius={[8, 8, 0, 0]} />
              <Bar dataKey="responseRate" name="Отклик, %" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};

const statusClassMap = {
  "Стабильна": "bg-emerald-950/40 text-emerald-300 border-emerald-800",
  "Требует внимания": "bg-amber-950/40 text-amber-300 border-amber-800",
  "Критическая ошибка": "bg-rose-950/40 text-rose-300 border-rose-800"
} as const;

export const MlMonitoringPage = () => {
  const [quality, setQuality] = useState<ModelQuality | null>(null);

  useEffect(() => {
    modelService.getQuality().then(setQuality);
  }, []);

  if (!quality) {
    return <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 text-slate-400">Загрузка данных...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Мониторинг модели</h3>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard title="ROC-AUC" value={quality.rocAuc.toFixed(2)} />
        <KpiCard title="Precision" value={quality.precision.toFixed(2)} />
        <KpiCard title="Recall" value={quality.recall.toFixed(2)} />
      </section>
      <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <KpiCard title="ROC-AUC" value={quality.rocAuc.toFixed(2)} />
        <KpiCard title="Precision" value={quality.precision.toFixed(2)} />
        <KpiCard title="Recall" value={quality.recall.toFixed(2)} />
      </section>
      <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-sm text-slate-400">Модель</p>
          <p className="mt-2 text-lg font-semibold">{quality.status}</p>
          <p className="mt-1 text-sm text-slate-400">{quality.modelSource}</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-sm text-slate-400">Версия</p>
          <p className="mt-2 text-lg font-semibold">{quality.version}</p>
          <p className="mt-1 text-sm text-slate-400">Обучено: {quality.trainedOn}</p>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-sm text-slate-400">F1 Score</p>
          <p className="mt-2 text-lg font-semibold">{quality.f1Score.toFixed(2)}</p>
        </article>
      </section>
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="text-lg font-semibold">Confusion matrix</h3>
        <p className="mt-1 text-sm text-slate-400">Представлено в формате горизонтальной диаграммы для лучшей читаемости.</p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={quality.confusion} layout="vertical" margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" width={120} />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 12 }} />
              <Bar dataKey="value" fill="#60a5fa" radius={[8, 0, 0, 8]}>
                <Cell />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-slate-300">
          {quality.confusion.map((item) => (
            <li key={item.name}>• {item.name}: {item.value}</li>
          ))}
        </ul>
      </section>
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="text-lg font-semibold">Алерты drift</h3>
        <div className="mt-4 space-y-3 text-sm">
          {quality.driftAlerts.map((alert) => (
            <div key={alert.name} className="flex items-center justify-between rounded-xl bg-slate-950/70 px-4 py-3">
              <span>{alert.name}</span>
              <span className={`rounded-full px-2 py-1 text-xs ${alert.level === "high" ? "bg-rose-600 text-white" : alert.level === "medium" ? "bg-amber-500 text-slate-950" : "bg-emerald-600 text-white"}`}>
                {alert.level === "high" ? "High" : alert.level === "medium" ? "Medium" : "OK"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export const ReportsPage = () => {
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const reportTitles = [
    "Отчёт по дебиторской задолженности",
    "Отчёт по взысканию за период",
    "Отчёт по эффективности каналов",
    "Отчёт по работе операторов",
    "Отчёт по рекомендациям модели",
    "Отчёт по качеству ML-модели",
    "Executive-отчёт для руководства"
  ];

  const handleExport = async (reportName: string, format: ReportFormat) => {
    const key = `${reportName}-${format}`;
    setBusyKey(key);
    const blob = await reportService.exportReport(reportName, format);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${reportName}.${format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setBusyKey(null);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="text-lg font-semibold">Выгрузка отчётов</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {reportTitles.map((title) => (
            <div key={title} className="rounded-lg bg-slate-800/70 p-3">
              <p className="text-sm">{title}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["XLSX", "CSV", "PDF"] as ReportFormat[]).map((format) => {
                  const key = `${title}-${format}`;
                  return (
                    <button
                      key={format}
                      type="button"
                      onClick={() => handleExport(title, format)}
                      disabled={busyKey === key}
                      className="rounded-md bg-blue-600 px-3 py-1 text-xs text-white disabled:opacity-60"
                    >
                      {busyKey === key ? "..." : format}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
