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
import { useState } from "react";

const TaskTwo: React.FC = () => {
  const [range, setRange] = useState({ start: "", end: "" });
  const [error, setError] = useState<string | null>(null);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleChange =
    (key: "start" | "end") =>
    (event: IonInputCustomEvent<InputChangeEventDetail>) => {
      const value = event.detail.value ?? "";
      setRange((prev) => ({ ...prev, [key]: value }));
    };

  const handleCalculate = () => {
    const start = Number(range.start);
    const end = Number(range.end);

    if (Number.isNaN(start) || Number.isNaN(end)) {
      setError("Будь ласка, введіть коректні числа для проміжку [a, b].");
      setNumbers([]);
      setHasCalculated(false);
      return;
    }

    const [from, to] = start <= end ? [start, end] : [end, start];
    const selected: number[] = [];

    for (let current = from; current <= to; current += 1) {
      const isEven = current % 2 === 0;
      const hasRemainderTwo = current % 3 === 2;
      if (isEven && hasRemainderTwo) {
        selected.push(current);
      }
    }

    setNumbers(selected);
    setError(null);
    setHasCalculated(true);
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          Парні числа, що при діленні на 3 дають остачу 2
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList>
          <IonItem>
            <IonLabel position="floating">Початок проміжку (a)</IonLabel>
            <IonInput
              type="number"
              value={range.start}
              onIonChange={handleChange("start")}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Кінець проміжку (b)</IonLabel>
            <IonInput
              type="number"
              value={range.end}
              onIonChange={handleChange("end")}
            />
          </IonItem>
        </IonList>
        <IonButton
          expand="block"
          className="ion-margin-top"
          onClick={handleCalculate}
        >
          Знайти числа
        </IonButton>
        {error && (
          <IonText color="danger" className="ion-margin-top ion-text-center">
            <p>{error}</p>
          </IonText>
        )}
        {hasCalculated && !error && numbers.length > 0 && (
          <IonText className="ion-margin-top ion-text-center" color="primary">
            <p>
              Знайдені числа: <strong>{numbers.join(", ")}</strong>
            </p>
            <p>Кількість чисел: {numbers.length}</p>
          </IonText>
        )}
        {hasCalculated && !error && numbers.length === 0 && (
          <IonText className="ion-margin-top ion-text-center">
            <p>На цьому проміжку немає чисел, що задовольняють умову.</p>
          </IonText>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default TaskTwo;
