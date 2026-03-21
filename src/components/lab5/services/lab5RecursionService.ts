import { buildArgumentRange } from "./lab5Common";
import { LabFiveLoggerService } from "./lab5LoggerService";
import type { CalculationPoint } from "./lab5Types";

const TANGENT_COEFFICIENTS = [
  1,
  1 / 3,
  2 / 15,
  17 / 315,
  62 / 2835,
  1382 / 155925,
  21844 / 6081075,
  929569 / 638512875,
  6404582 / 10854718875,
  443861162 / 1856156927625,
];

export class LabFiveRecursionService {
  constructor(private readonly logger: LabFiveLoggerService) {}

  private sumRecursively(
    x: number,
    index: number,
    currentSum: number,
    epsilon: number,
  ): number {
    if (index >= TANGENT_COEFFICIENTS.length) {
      return currentSum;
    }

    const exponent = 2 * index + 1;
    const term = TANGENT_COEFFICIENTS[index] * x ** exponent;
    const nextSum = currentSum + term;

    if (index > 0 && Math.abs(term) < epsilon) {
      return nextSum;
    }

    return this.sumRecursively(x, index + 1, nextSum, epsilon);
  }

  calculate(x: number, epsilon = 1e-10): number {
    return this.sumRecursively(x, 0, 0, epsilon);
  }

  tabulate(start: number, end: number, step: number): CalculationPoint[] {
    return buildArgumentRange(start, end, step).map((x) => {
      const y = this.calculate(x);
      this.logger.logPoint("Recursion", x, y);
      return { x, y };
    });
  }
}
