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

interface CloudBook {
  title: string;
  author: string;
  pages: number | string;
  language?: string;
  genre?: string;
  field?: string;
  type?: "novel" | "science";
}

interface JsonBinResponse {
  record?: CloudBook[];
}

abstract class Book {
  constructor(
    protected readonly title: string,
    protected readonly author: string,
    protected readonly pages: number,
  ) {}

  getPages(): number {
    return this.pages;
  }

  abstract getGroupKey(): string;

  displayInfo(): string {
    return `Назва: ${this.title}; Автор: ${this.author}; Сторінок: ${this.pages}`;
  }
}

class Novel extends Book {
  constructor(
    title: string,
    author: string,
    pages: number,
    private readonly genre: string,
  ) {
    super(title, author, pages);
  }

  getGroupKey(): string {
    return this.genre;
  }

  override displayInfo(): string {
    return `${super.displayInfo()}; Жанр: ${this.genre}`;
  }
}

class ScienceBook extends Book {
  constructor(
    title: string,
    author: string,
    pages: number,
    private readonly field: string,
  ) {
    super(title, author, pages);
  }

  getGroupKey(): string {
    return this.field;
  }

  override displayInfo(): string {
    return `${super.displayInfo()}; Галузь: ${this.field}`;
  }
}

const JSON_BIN_URL = "https://api.jsonbin.io/v3/b/69a19d21d0ea881f40def8e6/latest";

const parsePages = (value: number | string): number => {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? Math.round(num) : 100;
};

const mapToPolymorphicBooks = (data: CloudBook[]): Book[] => {
  return data.map((item, index) => {
    const pages = parsePages(item.pages);
    const isScience = item.type === "science" || Boolean(item.field);

    if (isScience) {
      const field = item.field ?? (item.language ? `Мовознавство (${item.language})` : "Філологія");
      return new ScienceBook(item.title, item.author, pages, field);
    }

    const genre = item.genre ?? `Жанр ${index + 1}`;
    return new Novel(item.title, item.author, pages, genre);
  });
};

const getMinNovelsByGenre = (books: Book[]) => {
  const novels = books.filter((book): book is Novel => book instanceof Novel);
  const minPagesByGenre = new Map<string, number>();
  const result = new Map<string, Novel[]>();

  novels.forEach((novel) => {
    const genre = novel.getGroupKey();
    const pages = novel.getPages();
    const currentMin = minPagesByGenre.get(genre);

    if (currentMin === undefined || pages < currentMin) {
      minPagesByGenre.set(genre, pages);
      result.set(genre, [novel]);
      return;
    }

    if (pages === currentMin) {
      const current = result.get(genre) ?? [];
      result.set(genre, [...current, novel]);
    }
  });

  return result;
};

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

        {!isLoading && !error && books.length > 0 && (
          <>
            <IonText className="ion-margin-top">
              <p>
                <strong>Поточний об&apos;єкт у поліморфному масиві:</strong>
              </p>
              <p>{currentBook.displayInfo()}</p>
            </IonText>

            <IonButton
              expand="block"
              fill="outline"
              className="ion-margin-top"
              onClick={handleNext}
            >
              Наступний об&apos;єкт (циклічно)
            </IonButton>

            <IonText className="ion-margin-top">
              <p>
                <strong>Завдання 2: книги кожного жанру з найменшою кількістю сторінок</strong>
              </p>
            </IonText>

            {minNovelsByGenre.size === 0 && (
              <IonText color="medium">
                <p>У поточному наборі немає книг типу "Роман".</p>
              </IonText>
            )}

            {minNovelsByGenre.size > 0 && (
              <ul className="group-list">
                {Array.from(minNovelsByGenre.entries()).map(([genre, groupedBooks]) => (
                  <li key={genre}>
                    <strong>{genre}</strong>
                    <ul className="lesson-sublist">
                      {groupedBooks.map((book, index) => (
                        <li key={`${genre}-${index}`}>{book.displayInfo()}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default LabThree;
