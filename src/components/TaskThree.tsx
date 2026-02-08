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
import { useMemo, useState } from "react";

const MIN_SIZE = 1;
const MAX_SIZE = 10;

const randomValue = () => Math.floor(Math.random() * 41) - 20;

const TaskThree: React.FC = () => {
  const [size, setSize] = useState("3");
  const [matrix, setMatrix] = useState<number[][]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: IonInputCustomEvent<InputChangeEventDetail>) => {
    setSize(event.detail.value ?? "");
  };

  const handleGenerate = () => {
    const parsed = Number(size);
    if (!Number.isInteger(parsed) || parsed < MIN_SIZE || parsed > MAX_SIZE) {
      setError(
        `Введіть ціле N у діапазоні від ${MIN_SIZE} до ${MAX_SIZE}, щоб мати зручну матрицю.`,
      );
      setMatrix([]);
      return;
    }

    const nextMatrix = Array.from({ length: parsed }, () =>
      Array.from({ length: parsed }, randomValue),
    );

    setMatrix(nextMatrix);
    setError(null);
  };

  const highlightedCount = useMemo(() => {
    return matrix.flat().filter(isHighlighted).length;
  }, [matrix]);

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          Генерація матриці NxN з підсвіткою від’ємних непарних елементів
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList>
          <IonItem>
            <IonLabel position="floating">Розмір матриці (N)</IonLabel>
            <IonInput
              type="number"
              value={size}
              min={MIN_SIZE}
              max={MAX_SIZE}
              onIonChange={handleChange}
            />
          </IonItem>
        </IonList>
        <IonButton
          expand="block"
          className="ion-margin-top"
          onClick={handleGenerate}
        >
          Згенерувати матрицю
        </IonButton>
        <IonText color="medium" className="ion-margin-top ion-text-center">
          <p>
            Значення генеруються випадково в діапазоні [-20, 20]. Елементи, що є
            від’ємними непарними числами й більші за -10, підсвічуються.
          </p>
        </IonText>
        {error && (
          <IonText color="danger" className="ion-margin-top ion-text-center">
            <p>{error}</p>
          </IonText>
        )}
        {!error && matrix.length > 0 && (
          <>
            <div
              className="matrix-grid ion-margin-top"
              style={{
                gridTemplateColumns: `repeat(${matrix.length}, minmax(48px, 1fr))`,
              }}
            >
              {matrix.flatMap((row, rowIndex) =>
                row.map((value, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`matrix-cell ${
                      isHighlighted(value) ? "matrix-cell--highlight" : ""
                    }`}
                  >
                    {value}
                  </div>
                )),
              )}
            </div>
            <IonText className="ion-margin-top ion-text-center" color="primary">
              <p>
                Кількість підсвічених елементів:{" "}
                <strong>{highlightedCount}</strong>
              </p>
            </IonText>
          </>
        )}
      </IonCardContent>
    </IonCard>
  );
};

const isHighlighted = (value: number) =>
  value < 0 && value % 2 !== 0 && value > -10;

export default TaskThree;
