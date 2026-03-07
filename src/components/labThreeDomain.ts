export interface CloudBook {
  title: string;
  author: string;
  pages: number | string;
  language?: string;
  genre?: string;
  field?: string;
  subject?: string;
  person?: string;
  type?: "novel" | "science" | "biography";
}

export class BookValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BookValidationError";
  }
}

const isNonEmptyString = (value: string) => value.trim().length > 0;

export abstract class Book {
  constructor(
    protected readonly title: string,
    protected readonly author: string,
    protected readonly pages: number,
  ) {
    if (!isNonEmptyString(title)) {
      throw new BookValidationError("Title must not be empty.");
    }
    if (!isNonEmptyString(author)) {
      throw new BookValidationError("Author must not be empty.");
    }
    if (!Number.isInteger(pages) || pages <= 0) {
      throw new BookValidationError("Pages must be a positive integer.");
    }
  }

  getPages(): number {
    return this.pages;
  }

  estimateReadingHours(pagesPerHour: number): number {
    if (!Number.isFinite(pagesPerHour) || pagesPerHour <= 0) {
      throw new BookValidationError("Reading speed must be greater than zero.");
    }
    return Number((this.pages / pagesPerHour).toFixed(2));
  }

  abstract getGroupKey(): string;

  displayInfo(): string {
    return `Title: ${this.title}; Author: ${this.author}; Pages: ${this.pages}`;
  }
}

export class Novel extends Book {
  constructor(
    title: string,
    author: string,
    pages: number,
    private readonly genre: string,
  ) {
    super(title, author, pages);
    if (!isNonEmptyString(genre)) {
      throw new BookValidationError("Genre must not be empty.");
    }
  }

  getGroupKey(): string {
    return this.genre;
  }

  override displayInfo(): string {
    return `${super.displayInfo()}; Genre: ${this.genre}`;
  }
}

export class ScienceBook extends Book {
  constructor(
    title: string,
    author: string,
    pages: number,
    private readonly field: string,
  ) {
    super(title, author, pages);
    if (!isNonEmptyString(field)) {
      throw new BookValidationError("Field must not be empty.");
    }
  }

  getGroupKey(): string {
    return this.field;
  }

  override displayInfo(): string {
    return `${super.displayInfo()}; Field: ${this.field}`;
  }
}

export class Biography extends Book {
  constructor(
    title: string,
    author: string,
    pages: number,
    private readonly person: string,
  ) {
    super(title, author, pages);
    if (!isNonEmptyString(person)) {
      throw new BookValidationError("Person must not be empty.");
    }
  }

  getGroupKey(): string {
    return this.person;
  }

  override displayInfo(): string {
    return `${super.displayInfo()}; Person: ${this.person}`;
  }
}

const DEFAULT_PAGES = 100;

export const parsePages = (value: number | string): number => {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? Math.round(num) : DEFAULT_PAGES;
};

export class BookFactory {
  static createBook(item: CloudBook, index = 0): Book {
    const pages = parsePages(item.pages);
    const isScience = item.type === "science" || Boolean(item.field);
    const isBiography = item.type === "biography" || Boolean(item.person);

    if (isScience) {
      const field =
        item.field ??
        (item.language ? `Linguistics (${item.language})` : "Philology");
      return new ScienceBook(item.title, item.author, pages, field);
    }

    if (isBiography) {
      const person = item.person ?? `Person #${index + 1}`;
      return new Biography(item.title, item.author, pages, person);
    }

    const genre = item.genre ?? `Genre #${index + 1}`;
    return new Novel(item.title, item.author, pages, genre);
  }

  static createBooks(data: CloudBook[]): Book[] {
    if (!Array.isArray(data) || data.length === 0) {
      throw new BookValidationError("Book source array must not be empty.");
    }

    return data.map((item, index) => BookFactory.createBook(item, index));
  }
}

export const mapToPolymorphicBooks = (data: CloudBook[]): Book[] => {
  return BookFactory.createBooks(data);
};

export const getMinNovelsByGenre = (books: Book[]) => {
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
