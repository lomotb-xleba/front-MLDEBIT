import { useState } from "react";
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
  operationService,
  recommendationService,
  reportService,
  settingsService,
  type OperatorResult,
  type ReportFormat,
  type SystemSettings
} from "../shared/services";
import { KpiCard } from "../shared/ui/KpiCard";

const abChartData = [
  { группа: "Контрольная", recoveryRate: 48, cashToCash: 41 },
  { группа: "Тестовая", recoveryRate: 62, cashToCash: 34 }
];

const overdueData = [
  { name: "0–30 дней", value: 26 },
  { name: "31–60 дней", value: 38 },
  { name: "61+ дней", value: 36 }
];

const segmentData = [
  { name: "Крупный бизнес", value: 44 },
  { name: "Средний бизнес", value: 33 },
  { name: "Малый бизнес", value: 23 }
];

const pieColors = ["#3b82f6", "#6366f1", "#a855f7"];

const trendData = [
  { период: "Янв", вРиске: 112, взыскано: 42 },
  { период: "Фев", вРиске: 118, взыскано: 46 },
  { период: "Мар", вРиске: 121, взыскано: 51 },
  { период: "Апр", вРиске: 110, взыскано: 54 },
  { период: "Май", вРиске: 104, взыскано: 57 }
];

const channelData = [
  { канал: "SMS", roi: 124, взыскание: 6.4 },
  { канал: "Email", roi: 98, взыскание: 4.9 },
  { канал: "Звонок", roi: 156, взыскание: 8.2 },
  { канал: "Автодозвон", roi: 131, взыскание: 7.1 }
];

const confusionData = [
  { x: 1, y: 92, name: "Модель рекомендовала, оператор подтвердил" },
  { x: 2, y: 38, name: "Модель рекомендовала, результат отрицательный" },
  { x: 3, y: 49, name: "Оператор выбрал лучше" },
  { x: 4, y: 27, name: "Оператор выбрал хуже" }
];

export const DashboardPage = () => (
  <div className="space-y-6">
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <KpiCard title="Recovery Rate" value="72%" />
      <KpiCard title="Цикл Cash-to-Cash" value="34 дня" />
      <KpiCard title="Финансовый эффект" value={formatCurrency(12340000)} />
      <KpiCard title="Экономия бюджета" value={formatCurrency(2100000)} />
      <KpiCard title="Задолженность в риске" value={formatCurrency(96400000)} />
      <KpiCard title="Статус модели" value="Стабильна" />
    </section>

    <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <h3 className="text-lg font-semibold">Результаты A/B тестов</h3>
      <p className="mt-1 text-sm text-slate-400">
        Сравнение контрольной группы без ML-рекомендаций и тестовой группы с ML-рекомендациями.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-slate-800/70 p-4">
          <p className="text-sm text-slate-400">Recovery Rate</p>
          <p className="mt-2 text-xl font-semibold">Контроль: 48% • Тест: 62%</p>
        </div>
        <div className="rounded-lg bg-slate-800/70 p-4">
          <p className="text-sm text-slate-400">Финансовый uplift</p>
          <p className="mt-2 text-xl font-semibold">{formatCurrency(4350000)}</p>
        </div>
        <div className="rounded-lg bg-slate-800/70 p-4">
          <p className="text-sm text-slate-400">Стоимость взыскания</p>
          <p className="mt-2 text-xl font-semibold">
            Контроль: {formatCurrency(1520000)} • Тест: {formatCurrency(1210000)}
          </p>
        </div>
        <div className="rounded-lg bg-slate-800/70 p-4">
          <p className="text-sm text-slate-400">Цикл Cash-to-Cash</p>
          <p className="mt-2 text-xl font-semibold">Контроль: 41 день • Тест: 34 дня</p>
        </div>
      </div>

      <div className="mt-5 h-72 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={abChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="группа" stroke="#94a3b8" />
            <YAxis yAxisId="left" stroke="#94a3b8" />
            <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 12 }} />
            <Legend />
            <Bar yAxisId="left" dataKey="recoveryRate" name="Recovery Rate, %" fill="#22c55e" radius={[8, 8, 0, 0]} />
            <Bar yAxisId="right" dataKey="cashToCash" name="Цикл Cash-to-Cash, дней" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>

    <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <h3 className="text-lg font-semibold">Динамика «было / стало»</h3>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="период" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 12 }} />
            <Legend />
            <Line type="monotone" dataKey="вРиске" name="Задолженность в риске, млн ₽" stroke="#f97316" strokeWidth={2} />
            <Line type="monotone" dataKey="взыскано" name="Сумма взыскания, млн ₽" stroke="#22c55e" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  </div>
);

export const ReceivablesPage = () => (
  <div className="space-y-6">
    <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <KpiCard title="Общий объём задолженности" value={formatCurrency(128400000)} />
      <KpiCard title="Просроченная задолженность" value={formatCurrency(96400000)} />
      <KpiCard title="Доля просроченной задолженности" value="75%" />
      <KpiCard title="Средний срок просрочки" value="43 дня" />
    </section>

    <section className="grid grid-cols-1 gap-3 md:grid-cols-3 xl:grid-cols-4">
      <label className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
        <span className="mb-2 block text-sm text-slate-400">Регион</span>
        <select className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm">
          <option>Все регионы</option>
          <option>Центр</option>
          <option>Северо-Запад</option>
          <option>Поволжье</option>
        </select>
      </label>
      <label className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
        <span className="mb-2 block text-sm text-slate-400">Сегмент</span>
        <select className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm">
          <option>Все сегменты</option>
          <option>Крупный бизнес</option>
          <option>Средний бизнес</option>
          <option>Малый бизнес</option>
        </select>
      </label>
      <label className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
        <span className="mb-2 block text-sm text-slate-400">Срок просрочки</span>
        <select className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm">
          <option>Любой срок</option>
          <option>0–30 дней</option>
          <option>31–60 дней</option>
          <option>61+ дней</option>
        </select>
      </label>
      <label className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
        <span className="mb-2 block text-sm text-slate-400">Канал коммуникации</span>
        <select className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm">
          <option>Все каналы</option>
          <option>SMS</option>
          <option>Email</option>
          <option>Звонок оператора</option>
        </select>
      </label>
    </section>

    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="text-base font-semibold">Распределение по срокам просрочки</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={overdueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 12 }} />
              <Legend />
              <Bar dataKey="value" name="Доля задолженности, %" fill="#60a5fa" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="text-base font-semibold">Распределение по сегментам</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={segmentData} dataKey="value" nameKey="name" outerRadius={100} label>
                {segmentData.map((entry, index) => (
                  <Cell key={entry.name} fill={pieColors[index]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 12 }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-3 text-sm text-slate-400">Легенда: доля задолженности в каждом клиентском сегменте.</p>
      </article>
    </section>
  </div>
);

export const RecommendationsPage = () => {
  const [selectedId, setSelectedId] = useState("C-1042");
  const [status, setStatus] = useState<"в работе" | "выполнено">("в работе");
  const [loading, setLoading] = useState(false);

  const items = [
    { id: "C-1042", name: "ООО «Альянс Логистик»", rec: "звонок оператора", priority: "высокий", success: "78%" },
    { id: "C-1188", name: "АО «Сфера Трейд»", rec: "SMS", priority: "средний", success: "61%" },
    { id: "C-1326", name: "ИП Власов", rec: "передача в юридический блок", priority: "высокий", success: "53%" }
  ];
  const selected = items.find((item) => item.id === selectedId) ?? items[0];

  const handleComplete = async () => {
    setLoading(true);
    const result = await recommendationService.setStatus(selected.id, "выполнено");
    setStatus(result.status);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_1fr]">
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="text-lg font-semibold">Список должников с рекомендациями</h3>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  setSelectedId(item.id);
                  setStatus("в работе");
                }}
                className={`w-full rounded-lg p-3 text-left ${selectedId === item.id ? "bg-blue-600/20 ring-1 ring-blue-500" : "bg-slate-800/70"}`}
              >
                <p className="font-medium">ID {item.id} • {item.name}</p>
                <p className="text-slate-400">Рекомендация: {item.rec} • Приоритет: {item.priority} • Вероятность успеха: {item.success}</p>
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="text-lg font-semibold">Карточка рекомендации</h3>
        <div className="mt-4 space-y-2 text-sm">
          <p><span className="text-slate-400">Клиент:</span> {selected.name}</p>
          <p><span className="text-slate-400">Договор:</span> D-90331</p>
          <p><span className="text-slate-400">Сумма задолженности:</span> {formatCurrency(840000)}</p>
          <p><span className="text-slate-400">Риск невозврата:</span> 0.62</p>
          <p><span className="text-slate-400">Рекомендованный канал:</span> {selected.rec}</p>
          <p><span className="text-slate-400">Ожидаемый финансовый эффект:</span> {formatCurrency(124000)}</p>
          <p><span className="text-slate-400">Статус выполнения:</span> {status}</p>
        </div>
        <button
          type="button"
          onClick={handleComplete}
          disabled={loading || status === "выполнено"}
          className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "Сохранение..." : status === "выполнено" ? "Выполнено" : "Отметить выполненной"}
        </button>
      </section>
    </div>
  );
};

export const OperationsPage = () => {
  const [selectedDebtor, setSelectedDebtor] = useState("C-1042");
  const [lastAction, setLastAction] = useState<string>("Нет действий");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tasks = [
    { id: "C-1042", name: "ООО «Альянс Логистик»", priority: "высокий", overdue: "42 дня", amount: 840000 },
    { id: "C-1188", name: "АО «Сфера Трейд»", priority: "средний", overdue: "19 дней", amount: 460000 },
    { id: "C-1326", name: "ИП Власов", priority: "высокий", overdue: "67 дней", amount: 320000 }
  ];
  const current = tasks.find((task) => task.id === selectedDebtor) ?? tasks[0];

  const submitAction = async (result: OperatorResult) => {
    setIsSubmitting(true);
    await operationService.submitAction({ debtorId: selectedDebtor, result });
    setLastAction(result);
    setIsSubmitting(false);
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_1fr]">
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="text-lg font-semibold">Список задач</h3>
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
                <p className="font-medium">{task.name} — приоритет {task.priority}</p>
                <p className="text-slate-400">Просрочка: {task.overdue} • Сумма: {formatCurrency(task.amount)}</p>
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="text-lg font-semibold">Карточка должника</h3>
        <div className="mt-4 space-y-2 text-sm">
          <p><span className="text-slate-400">Клиент:</span> {current.name}</p>
          <p><span className="text-slate-400">Сумма задолженности:</span> {formatCurrency(current.amount)}</p>
          <p><span className="text-slate-400">Срок просрочки:</span> {current.overdue}</p>
          <p><span className="text-slate-400">Рекомендованный канал:</span> звонок оператора</p>
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
      </section>
    </div>
  );
};

export const ChannelsPage = () => (
  <div className="space-y-6">
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <KpiCard title="Средний ROI по каналам" value="127%" />
      <KpiCard title="Стоимость успешного взыскания" value={formatCurrency(1320)} />
      <KpiCard title="Доля безрезультатных контактов" value="19%" />
    </section>
    <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <h3 className="text-lg font-semibold">Сравнение каналов взыскания</h3>
      <div className="mt-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={channelData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="канал" stroke="#94a3b8" />
            <YAxis yAxisId="left" stroke="#94a3b8" />
            <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 12 }} />
            <Legend />
            <Bar yAxisId="left" dataKey="roi" name="ROI, %" fill="#22c55e" radius={[8, 8, 0, 0]} />
            <Bar yAxisId="right" dataKey="взыскание" name="Сумма взыскания, млн ₽" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  </div>
);

export const AbTestsPage = () => (
  <div className="space-y-6">
    <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <KpiCard title="Recovery Rate (тест)" value="62%" />
      <KpiCard title="Recovery Rate (контроль)" value="48%" />
      <KpiCard title="Статистическая разница" value="+14 п.п." />
      <KpiCard title="Финансовый uplift" value={formatCurrency(4350000)} />
    </section>
    <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <h3 className="text-lg font-semibold">Метрики A/B-теста</h3>
      <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 text-sm">
        <li className="rounded-lg bg-slate-800/70 p-3">Сумма взыскания: тест {formatCurrency(17800000)}, контроль {formatCurrency(14300000)}</li>
        <li className="rounded-lg bg-slate-800/70 p-3">Стоимость взыскания: тест {formatCurrency(1210000)}, контроль {formatCurrency(1520000)}</li>
        <li className="rounded-lg bg-slate-800/70 p-3">ROI: тест 148%, контроль 117%</li>
        <li className="rounded-lg bg-slate-800/70 p-3">Среднее время до оплаты: тест 12 дней, контроль 17 дней</li>
      </ul>
    </section>
  </div>
);

const statusClassMap = {
  "Стабильна": "bg-emerald-950/40 text-emerald-300 border-emerald-800",
  "Требует внимания": "bg-amber-950/40 text-amber-300 border-amber-800",
  "Критическая ошибка": "bg-rose-950/40 text-rose-300 border-rose-800"
} as const;

export const MlMonitoringPage = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Состояние ML-модели и качество</h3>
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <KpiCard title="ROC-AUC" value="0.81" />
      <KpiCard title="Precision / Recall" value="0.77 / 0.71" />
      <KpiCard title="F1-score" value="0.74" />
    </section>
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {(Object.keys(statusClassMap) as Array<keyof typeof statusClassMap>).map((status) => (
        <article key={status} className={`rounded-xl border p-4 ${statusClassMap[status]}`}>
          <p className="text-sm">Статус модели</p>
          <p className="mt-1 text-lg font-semibold">{status}</p>
        </article>
      ))}
    </div>
    <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <h3 className="text-lg font-semibold">Confusion Matrix (сравнение модели и оператора)</h3>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid stroke="#334155" />
            <XAxis dataKey="x" name="Категория" tick={false} stroke="#94a3b8" />
            <YAxis dataKey="y" name="Количество кейсов" stroke="#94a3b8" />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              formatter={(value: number, _name, item) => [value, item?.payload?.name ?? "Категория"]}
              contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 12 }}
            />
            <Scatter name="Кейсы" data={confusionData} fill="#60a5fa" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-slate-300">
        {confusionData.map((item) => (
          <li key={item.x}>• {item.name}</li>
        ))}
      </ul>
    </section>
  </div>
);

export const ReportsPage = () => {
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const reportTitles = [
    "Отчёт по дебиторской задолженности",
    "Отчёт по взысканию за период",
    "Отчёт по эффективности каналов",
    "Отчёт по работе операторов",
    "Отчёт по рекомендациям модели",
    "Отчёт по A/B-тестам",
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
              <div className="mt-2 flex gap-2">
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

export const SettingsPage = () => {
  const [form, setForm] = useState<SystemSettings>({ rocAlertThreshold: 0.75, dataRefreshHours: 24, autoRetryEnabled: true });
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string>("");

  const saveSettings = async () => {
    setSaving(true);
    const next = await settingsService.save(form);
    setForm(next);
    setSavedAt(new Date().toLocaleTimeString("ru-RU"));
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h3 className="text-lg font-semibold">Настройки системы</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-2 block text-slate-400">Порог ROC-AUC для алерта</span>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={form.rocAlertThreshold}
              onChange={(event) => setForm((prev) => ({ ...prev, rocAlertThreshold: Number(event.target.value) }))}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
            />
          </label>
          <label className="text-sm">
            <span className="mb-2 block text-slate-400">Интервал обновления данных (часы)</span>
            <input
              type="number"
              min="1"
              value={form.dataRefreshHours}
              onChange={(event) => setForm((prev) => ({ ...prev, dataRefreshHours: Number(event.target.value) }))}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2"
            />
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.autoRetryEnabled}
              onChange={(event) => setForm((prev) => ({ ...prev, autoRetryEnabled: event.target.checked }))}
            />
            Автоматическая повторная загрузка при ошибках
          </label>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button type="button" onClick={saveSettings} disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-60">
            {saving ? "Сохранение..." : "Сохранить настройки"}
          </button>
          {savedAt ? <span className="text-xs text-slate-400">Сохранено: {savedAt}</span> : null}
        </div>
      </section>
    </div>
  );
};

