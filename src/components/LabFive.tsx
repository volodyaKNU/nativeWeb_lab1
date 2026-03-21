import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonText,
} from "@ionic/react";
import type {
  IonInputCustomEvent,
  InputChangeEventDetail,
} from "@ionic/core/components";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import { LabFiveLoggerService } from "./lab5/services/lab5LoggerService";
import { LabFiveRecursionService } from "./lab5/services/lab5RecursionService";
import { LabFiveSeriesService } from "./lab5/services/lab5SeriesService";
import { LabFiveTabulationService } from "./lab5/services/lab5TabulationService";
import type { CalculationRow } from "./lab5/services/lab5Types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

type FormKey = "start" | "end" | "step";

const parseNumber = (value: string) => Number(value.replace(",", "."));

const LabFive: React.FC = () => {
  const [form, setForm] = useState({
    start: "-1",
    end: "1",
    step: "0.1",
  });
  const [rows, setRows] = useState<CalculationRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const logger = useMemo(() => new LabFiveLoggerService(), []);
  const tabulationService = useMemo(
    () => new LabFiveTabulationService(logger),
    [logger],
  );
  const seriesService = useMemo(() => new LabFiveSeriesService(logger), [logger]);
  const recursionService = useMemo(
    () => new LabFiveRecursionService(logger),
    [logger],
  );

  const handleInputChange = (
    key: FormKey,
    event: IonInputCustomEvent<InputChangeEventDetail>,
  ) => {
    const value = event.detail.value ?? "";
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCalculate = () => {
    try {
      const start = parseNumber(form.start);
      const end = parseNumber(form.end);
      const step = parseNumber(form.step);

      const tabulation = tabulationService.tabulate(start, end, step);
      const series = seriesService.tabulate(start, end, step);
      const recursion = recursionService.tabulate(start, end, step);

      const nextRows: CalculationRow[] = tabulation.map((point, index) => ({
        x: point.x,
        tabulation: point.y,
        series: series[index].y,
        recursion: recursion[index].y,
      }));

      setRows(nextRows);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Невідома помилка обчислення.";
      setError(message);
      setRows([]);
    }
  };

  const chartData = useMemo(() => {
    if (!rows.length) {
      return null;
    }

    return {
      labels: rows.map((row) => row.x.toFixed(2)),
      datasets: [
        {
          label: "Табуляція tan(x)",
          data: rows.map((row) => row.tabulation),
          borderColor: "rgba(56, 128, 255, 1)",
          backgroundColor: "rgba(56, 128, 255, 0.2)",
          pointRadius: 2,
          tension: 0.2,
        },
        {
          label: "Ряд Тейлора",
          data: rows.map((row) => row.series),
          borderColor: "rgba(45, 211, 111, 1)",
          backgroundColor: "rgba(45, 211, 111, 0.2)",
          pointRadius: 2,
          tension: 0.2,
        },
        {
          label: "Рекурсія",
          data: rows.map((row) => row.recursion),
          borderColor: "rgba(235, 68, 90, 1)",
          backgroundColor: "rgba(235, 68, 90, 0.2)",
          pointRadius: 2,
          tension: 0.2,
        },
      ],
    };
  }, [rows]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index" as const,
        intersect: false,
      },
      plugins: {
        legend: {
          position: "top" as const,
        },
      },
    }),
    [],
  );

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Лабораторна 5: Сервіси (варіант 10)</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonText>
          <p>
            Функція: <strong>tan(x)</strong>
          </p>
          <p>
            Ряд Тейлора: <strong>x + x^3/3 + 2x^5/15 + ...</strong>
          </p>
          <p>
            Область: <strong>-π/2 &lt; x &lt; π/2</strong>
          </p>
        </IonText>

        <IonList>
          <IonItem>
            <IonLabel position="floating">Xn (початок)</IonLabel>
            <IonInput
              type="number"
              value={form.start}
              onIonChange={(event) => handleInputChange("start", event)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Xk (кінець)</IonLabel>
            <IonInput
              type="number"
              value={form.end}
              onIonChange={(event) => handleInputChange("end", event)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">h (крок)</IonLabel>
            <IonInput
              type="number"
              value={form.step}
              onIonChange={(event) => handleInputChange("step", event)}
            />
          </IonItem>
        </IonList>

        <IonButton expand="block" className="ion-margin-top" onClick={handleCalculate}>
          Розрахунок
        </IonButton>

        {error && (
          <IonText color="danger" className="ion-margin-top ion-text-center">
            <p>{error}</p>
          </IonText>
        )}

        {!error && rows.length > 0 && (
          <>
            <div className="lab5-table-wrapper ion-margin-top">
              <table className="lab5-table">
                <thead>
                  <tr>
                    <th>x</th>
                    <th>tan(x)</th>
                    <th>Ряд</th>
                    <th>Рекурсія</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.x.toFixed(10)}>
                      <td>{row.x.toFixed(2)}</td>
                      <td>{row.tabulation.toFixed(6)}</td>
                      <td>{row.series.toFixed(6)}</td>
                      <td>{row.recursion.toFixed(6)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {chartData && (
              <div className="lab5-chart-wrapper ion-margin-top">
                <Line data={chartData} options={chartOptions} />
              </div>
            )}
          </>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default LabFive;
