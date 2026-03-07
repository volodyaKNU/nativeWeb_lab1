import {
  Biography,
  BookFactory,
  BookValidationError,
  Novel,
  ScienceBook,
  getMinNovelsByGenre,
  mapToPolymorphicBooks,
  parsePages,
} from "./labThreeDomain";

describe("LabThree domain: descendants creation", () => {
  test("creates Novel", () => {
    const novel = new Novel("Dune", "Frank Herbert", 412, "Sci-Fi");

    expect(novel).toBeInstanceOf(Novel);
    expect(novel.getPages()).toBe(412);
    expect(novel.getGroupKey()).toBe("Sci-Fi");
  });

  test("creates ScienceBook", () => {
    const science = new ScienceBook("Astrophysics", "Neil Tyson", 250, "Physics");

    expect(science).toBeInstanceOf(ScienceBook);
    expect(science.getPages()).toBe(250);
    expect(science.getGroupKey()).toBe("Physics");
  });

  test("creates Biography", () => {
    const biography = new Biography("Long Walk to Freedom", "Nelson Mandela", 300, "Nelson Mandela");

    expect(biography).toBeInstanceOf(Biography);
    expect(biography.getPages()).toBe(300);
    expect(biography.getGroupKey()).toBe("Nelson Mandela");
  });
});

describe("LabThree domain: methods", () => {
  test("returns detailed info for each descendant", () => {
    const novel = new Novel("Dune", "Frank Herbert", 412, "Sci-Fi");
    const science = new ScienceBook("Astrophysics", "Neil Tyson", 250, "Physics");
    const biography = new Biography("Long Walk to Freedom", "Nelson Mandela", 300, "Nelson Mandela");

    expect(novel.displayInfo()).toContain("Genre: Sci-Fi");
    expect(science.displayInfo()).toContain("Field: Physics");
    expect(biography.displayInfo()).toContain("Person: Nelson Mandela");
  });

  test("estimates reading hours", () => {
    const novel = new Novel("Dune", "Frank Herbert", 400, "Sci-Fi");

    expect(novel.estimateReadingHours(50)).toBe(8);
  });

  test("throws from method when invalid reading speed", () => {
    const novel = new Novel("Dune", "Frank Herbert", 400, "Sci-Fi");

    expect(() => novel.estimateReadingHours(0)).toThrow(BookValidationError);
  });
});

describe("LabThree domain: constructor exceptions", () => {
  test("throws for empty title", () => {
    expect(() => new Novel("", "Author", 100, "Drama")).toThrow(BookValidationError);
  });

  test("throws for invalid pages", () => {
    expect(() => new ScienceBook("Book", "Author", 0, "Math")).toThrow(
      BookValidationError,
    );
  });

  test("throws for empty specific field", () => {
    expect(() => new Biography("Book", "Author", 100, " ")).toThrow(
      BookValidationError,
    );
  });
});

describe("LabThree domain: factory", () => {
  test("creates objects via factory per type", () => {
    const novel = BookFactory.createBook({
      title: "Dune",
      author: "Frank Herbert",
      pages: 412,
      type: "novel",
      genre: "Sci-Fi",
    });
    const science = BookFactory.createBook({
      title: "Astrophysics",
      author: "Neil Tyson",
      pages: "250",
      type: "science",
      field: "Physics",
    });
    const biography = BookFactory.createBook({
      title: "Long Walk to Freedom",
      author: "Nelson Mandela",
      pages: 300,
      type: "biography",
      person: "Nelson Mandela",
    });

    expect(novel).toBeInstanceOf(Novel);
    expect(science).toBeInstanceOf(ScienceBook);
    expect(biography).toBeInstanceOf(Biography);
  });

  test("creates object array via factory helper", () => {
    const data = [
      { title: "Dune", author: "Frank Herbert", pages: 412, genre: "Sci-Fi" },
      { title: "Astrophysics", author: "Neil Tyson", pages: 250, field: "Physics" },
      {
        title: "Long Walk to Freedom",
        author: "Nelson Mandela",
        pages: 300,
        person: "Nelson Mandela",
      },
    ];

    const books = mapToPolymorphicBooks(data);

    expect(books).toHaveLength(3);
    expect(books[0]).toBeInstanceOf(Novel);
    expect(books[1]).toBeInstanceOf(ScienceBook);
    expect(books[2]).toBeInstanceOf(Biography);
  });

  test("throws when factory source is empty", () => {
    expect(() => BookFactory.createBooks([])).toThrow(BookValidationError);
  });
});

describe("LabThree domain: utility functions", () => {
  test("parsePages falls back to default for invalid values", () => {
    expect(parsePages("abc")).toBe(100);
    expect(parsePages(-5)).toBe(100);
  });

  test("groups novels by minimum pages", () => {
    const books = [
      new Novel("N1", "A1", 120, "Drama"),
      new Novel("N2", "A2", 100, "Drama"),
      new Novel("N3", "A3", 100, "Drama"),
      new ScienceBook("S1", "A4", 80, "Math"),
    ];

    const grouped = getMinNovelsByGenre(books);
    const drama = grouped.get("Drama");

    expect(grouped.size).toBe(1);
    expect(drama).toBeDefined();
    expect(drama).toHaveLength(2);
    expect(drama?.[0].displayInfo()).toContain("N2");
    expect(drama?.[1].displayInfo()).toContain("N3");
  });
});
