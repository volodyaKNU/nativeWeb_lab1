import { buildArgumentRange } from "./lab5Common";
import { LabFiveLoggerService } from "./lab5LoggerService";
import type { CalculationPoint } from "./lab5Types";

export class LabFiveTabulationService {
  constructor(private readonly logger: LabFiveLoggerService) {}

  calculate(x: number): number {
    return Math.tan(x);
  }

  tabulate(start: number, end: number, step: number): CalculationPoint[] {
    return buildArgumentRange(start, end, step).map((x) => {
      const y = this.calculate(x);
      this.logger.logPoint("Tabulation", x, y);
      return { x, y };
    });
  }
}
