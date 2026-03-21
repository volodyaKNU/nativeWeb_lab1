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

export class LabFiveSeriesService {
  constructor(private readonly logger: LabFiveLoggerService) {}

  calculate(x: number, epsilon = 1e-10): number {
    let sum = 0;

    for (let index = 0; index < TANGENT_COEFFICIENTS.length; index += 1) {
      const exponent = 2 * index + 1;
      const term = TANGENT_COEFFICIENTS[index] * x ** exponent;
      sum += term;

      if (index > 0 && Math.abs(term) < epsilon) {
        break;
      }
    }

    return sum;
  }

  tabulate(start: number, end: number, step: number): CalculationPoint[] {
    return buildArgumentRange(start, end, step).map((x) => {
      const y = this.calculate(x);
      this.logger.logPoint("Series", x, y);
      return { x, y };
    });
  }
}
