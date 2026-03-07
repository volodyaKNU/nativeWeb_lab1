import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSpinner,
  IonText,
} from "@ionic/react";
import { useMemo, useState } from "react";
import {
  type Book,
  type CloudBook,
  getMinNovelsByGenre,
  mapToPolymorphicBooks,
} from "./labThreeDomain";

interface JsonBinResponse {
  record?: CloudBook[];
}

const JSON_BIN_URL =
  "https://api.jsonbin.io/v3/b/69a19d21d0ea881f40def8e6/latest";

const LabThree: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(JSON_BIN_URL);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = (await response.json()) as JsonBinResponse;
      const booksFromBin = payload.record;

      if (!Array.isArray(booksFromBin) || booksFromBin.length === 0) {
        throw new Error("Порожній або некоректний JSON.");
      }

      setBooks(mapToPolymorphicBooks(booksFromBin));
      setCurrentIndex(0);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Невідома помилка завантаження.";
      setError(`Не вдалося завантажити книги: ${message}`);
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentBook = books[currentIndex];
  const minNovelsByGenre = useMemo(() => getMinNovelsByGenre(books), [books]);

  const handleNext = () => {
    if (!books.length) {
      return;
    }
    setCurrentIndex((prev) => (prev + 1) % books.length);
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Лабораторна робота 3: Абстрактні класи</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton expand="block" onClick={() => void fetchBooks()}>
          Завантажити з JSONBin
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

        {books.map((el, index) => (
          <li key={index}>
            <strong>{el.displayInfo()}</strong>
          </li>
        ))}

        {!isLoading && !error && books.length > 0 && (
          <>
            <IonText className="ion-margin-top">
              <p>
                <strong>Поточний об'єкт у поліморфному масиві:</strong>
              </p>
              <p>{currentBook.displayInfo()}</p>
            </IonText>

            <IonButton
              expand="block"
              fill="outline"
              className="ion-margin-top"
              onClick={handleNext}
            >
              Наступний об'єкт (циклічно)
            </IonButton>

            <IonText className="ion-margin-top">
              <p>
                <strong>
                  Завдання 2: книги кожного жанру з найменшою кількістю сторінок
                </strong>
              </p>
            </IonText>

            {minNovelsByGenre.size === 0 && (
              <IonText color="medium">
                <p>У поточному наборі немає книг типу "Роман".</p>
              </IonText>
            )}

            {minNovelsByGenre.size > 0 && (
              <ul className="group-list">
                {Array.from(minNovelsByGenre.entries()).map(
                  ([genre, groupedBooks]) => (
                    <li key={genre}>
                      <strong>{genre}</strong>
                      <ul className="lesson-sublist">
                        {groupedBooks.map((book, index) => (
                          <li key={`${genre}-${index}`}>
                            {book.displayInfo()}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ),
                )}
              </ul>
            )}
          </>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default LabThree;
