export type ReportFormat = "XLSX" | "CSV" | "PDF";

export type RecommendationStatus = "в работе" | "выполнено";
export type OperatorResult = "Обещание платежа" | "Отказ" | "Перезвонить";

export type SystemSettings = {
  rocAlertThreshold: number;
  dataRefreshHours: number;
  autoRetryEnabled: boolean;
};

const wait = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export const reportService = {
  async exportReport(reportName: string, format: ReportFormat): Promise<Blob> {
    await wait();
    const payload = `Отчёт: ${reportName}\nФормат: ${format}\nДата: ${new Date().toISOString()}\n`;
    return new Blob([payload], { type: "text/plain;charset=utf-8" });
  }
};

export const recommendationService = {
  async setStatus(recommendationId: string, status: RecommendationStatus): Promise<{ id: string; status: RecommendationStatus }> {
    await wait();
    return { id: recommendationId, status };
  }
};

export const operationService = {
  async submitAction(action: { debtorId: string; result: OperatorResult; comment?: string }): Promise<{ ok: true; actionId: string }> {
    await wait();
    return { ok: true, actionId: `${action.debtorId}-${Date.now()}` };
  }
};

export const settingsService = {
  async save(settings: SystemSettings): Promise<SystemSettings> {
    await wait();
    return settings;
  }
};
