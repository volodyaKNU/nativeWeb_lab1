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

const TaskOne: React.FC = () => {
  const [numbers, setNumbers] = useState({
    first: "",
    second: "",
    third: "",
  });
  const [result, setResult] = useState<number | null>(null);

  const [negativeNum, setNegativeNum] = useState<number | null>(null);

  const handleChange = (
    key: "first" | "second" | "third",
    event: IonInputCustomEvent<InputChangeEventDetail>,
  ) => {
    const value = event.detail.value ?? "";
    setNumbers((prev) => ({ ...prev, [key]: value }));
  };

  const handleCalculate = () => {
    const values = [numbers.first, numbers.second, numbers.third].map(Number);
    const divisibleCount = values.filter(
      (value) => !Number.isNaN(value) && value % 27 === 0,
    ).length;
    const negativeCount = values.filter(
      (values) => !Number.isNaN(values) && values < 0,
    ).length;
    setNegativeNum(negativeCount);
    setResult(divisibleCount);
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Три числа: скільки з них кратні 27?</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList>
          <IonItem>
            <IonLabel position="floating">Перше число</IonLabel>
            <IonInput
              type="number"
              value={numbers.first}
              onIonChange={(event) => handleChange("first", event)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Друге число</IonLabel>
            <IonInput
              type="number"
              value={numbers.second}
              onIonChange={(event) => handleChange("second", event)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Третє число</IonLabel>
            <IonInput
              type="number"
              value={numbers.third}
              onIonChange={(event) => handleChange("third", event)}
            />
          </IonItem>
        </IonList>

        <IonButton
          expand="block"
          className="ion-margin-top"
          onClick={handleCalculate}
        >
          Обчислити
        </IonButton>

        {result !== null && (
          <IonText className="ion-margin-top ion-text-center" color="primary">
            <p>
              Кількість чисел, кратних 27: <strong>{result}</strong>
            </p>
          </IonText>
        )}

        {result !== null && (
          <IonText>
            <p>
              <p>Кількість від'ємних : {negativeNum}</p>
            </p>
          </IonText>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default TaskOne;
