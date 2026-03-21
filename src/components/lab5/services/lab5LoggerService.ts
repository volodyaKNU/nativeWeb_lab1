export class LabFiveLoggerService {
  logPoint(methodName: string, x: number, y: number): void {
    // Dedicated logger service required by the assignment.
    console.log(`[${methodName}] x=${x.toFixed(4)} y=${y.toFixed(8)}`);
  }
}
