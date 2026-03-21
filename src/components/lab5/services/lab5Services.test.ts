import { LabFiveLoggerService } from "./lab5LoggerService";
import { LabFiveRecursionService } from "./lab5RecursionService";
import { LabFiveSeriesService } from "./lab5SeriesService";
import { LabFiveTabulationService } from "./lab5TabulationService";
import { vi } from "vitest";

describe("Lab 5 services (variant 10: tan(x))", () => {
  const logger = new LabFiveLoggerService();
  const tabulationService = new LabFiveTabulationService(logger);
  const seriesService = new LabFiveSeriesService(logger);
  const recursionService = new LabFiveRecursionService(logger);

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("tabulation service calculates tan(x)", () => {
    const result = tabulationService.calculate(0.1);
    expect(result).toBeCloseTo(Math.tan(0.1), 12);
  });

  test("series service approximates tan(x)", () => {
    const result = seriesService.calculate(0.5);
    expect(result).toBeCloseTo(Math.tan(0.5), 6);
  });

  test("recursion service approximates tan(x)", () => {
    const result = recursionService.calculate(0.5);
    expect(result).toBeCloseTo(Math.tan(0.5), 6);
  });

  test("tabulate logs computed points through logger service", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => undefined);

    const points = tabulationService.tabulate(-0.3, 0.3, 0.3);

    expect(points).toHaveLength(3);
    expect(spy).toHaveBeenCalledTimes(3);
  });

  test("throws for invalid tan(x) input range", () => {
    expect(() => tabulationService.tabulate(-2, 1, 0.1)).toThrow();
    expect(() => seriesService.tabulate(-1, 1, 0)).toThrow();
    expect(() => recursionService.tabulate(1, -1, 0.1)).toThrow();
  });
});
