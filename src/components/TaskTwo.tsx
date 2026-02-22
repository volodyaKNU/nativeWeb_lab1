import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSpinner,
  IonText,
} from "@ionic/react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";

interface Lesson {
  date: string;
  day_of_week: string;
  subject: string;
  room: string;
  period: number;
}

interface GroupData {
  group_id: string;
  lessons: Lesson[];
}

interface DailyLoadStat {
  day: string;
  lesson_count: number;
}

interface TeacherSchedule {
  teacher_name: string;
  semester: string;
  groups_data: GroupData[];
  daily_load_stats: DailyLoadStat[];
}

interface JsonBinResponse {
  teacher_schedule?: TeacherSchedule;
  record?: {
    teacher_schedule?: TeacherSchedule;
  };
}

const BIN_ID = "699b246e43b1c97be993f7e1";
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`;
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const TaskTwo: React.FC = () => {
  const [schedule, setSchedule] = useState<TeacherSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortAscending, setSortAscending] = useState(true);

  const fetchSchedule = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(BIN_URL);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = (await response.json()) as JsonBinResponse;
      const teacherSchedule =
        payload.record?.teacher_schedule ?? payload.teacher_schedule;

      if (
        !teacherSchedule ||
        !Array.isArray(teacherSchedule.groups_data) ||
        !Array.isArray(teacherSchedule.daily_load_stats)
      ) {
        throw new Error("Некоректна структура даних у JSON.");
      }

      setSchedule(teacherSchedule);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Невідома помилка завантаження.";
      setError(`Не вдалося завантажити дані: ${message}`);
      setSchedule(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchSchedule();
  }, []);

  const sortedGroups = useMemo(() => {
    if (!schedule) {
      return [];
    }
    return [...schedule.groups_data].sort((a, b) => {
      const compare = a.group_id.localeCompare(b.group_id, "uk");
      return sortAscending ? compare : -compare;
    });
  }, [schedule, sortAscending]);

  const dailyLoadChartData = useMemo(() => {
    if (!schedule) {
      return null;
    }

    return {
      labels: schedule.daily_load_stats.map((item) => item.day),
      datasets: [
        {
          label: "Кількість занять",
          data: schedule.daily_load_stats.map((item) => item.lesson_count),
          backgroundColor: "rgba(56, 128, 255, 0.5)",
          borderColor: "rgba(56, 128, 255, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, [schedule]);

  const dailyLoadChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
          },
        },
      },
    }),
    [],
  );

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Лабораторна робота 2: Розклад викладача</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton expand="block" onClick={() => void fetchSchedule()}>
          Оновити дані
        </IonButton>

        {schedule && (
          <IonText className="ion-margin-top">
            <p>
              <strong>Викладач:</strong> {schedule.teacher_name}
            </p>
            <p>
              <strong>Семестр:</strong> {schedule.semester}
            </p>
          </IonText>
        )}

        <IonButton
          expand="block"
          fill="outline"
          className="ion-margin-top"
          disabled={!schedule || isLoading}
          onClick={() => setSortAscending((prev) => !prev)}
        >
          Сортувати за group_id ({sortAscending ? "A->Я" : "Я->A"})
        </IonButton>

        {isLoading && (
          <div className="ion-text-center ion-margin-top">
            <IonSpinner name="crescent" />
          </div>
        )}

        {error && (
          <IonText color="danger" className="ion-margin-top ion-text-center">
            <p>{error}</p>
          </IonText>
        )}

        {!isLoading && !error && schedule && (
          <>
            <ul className="group-list ion-margin-top">
              {sortedGroups.map((group) => (
                <li key={group.group_id}>
                  <strong>{group.group_id}</strong>
                  <ul className="lesson-sublist">
                    {group.lessons.map((lesson) => (
                      <li key={`${group.group_id}-${lesson.date}-${lesson.period}`}>
                        {lesson.day_of_week}, {lesson.date}: {lesson.subject},
                        ауд. {lesson.room}, пара {lesson.period}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>

            {dailyLoadChartData && (
              <div className="daily-chart-wrapper ion-margin-top">
                <Bar data={dailyLoadChartData} options={dailyLoadChartOptions} />
              </div>
            )}
          </>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default TaskTwo;
