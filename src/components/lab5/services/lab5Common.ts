export const TAN_DOMAIN_LIMIT = Math.PI / 2;
const RANGE_EPSILON = 1e-10;

export const isInTanDomain = (x: number) =>
  Number.isFinite(x) && x > -TAN_DOMAIN_LIMIT && x < TAN_DOMAIN_LIMIT;

export const formatFixed = (value: number, digits = 6) =>
  Number(value.toFixed(digits));

export const buildArgumentRange = (
  start: number,
  end: number,
  step: number,
): number[] => {
  if (!Number.isFinite(start) || !Number.isFinite(end) || !Number.isFinite(step)) {
    throw new Error("Параметри мають бути числами.");
  }
  if (step <= 0) {
    throw new Error("Крок h має бути більше 0.");
  }
  if (start >= end) {
    throw new Error("Потрібно, щоб Xn було менше за Xk.");
  }
  if (!isInTanDomain(start) || !isInTanDomain(end)) {
    throw new Error("Для tan(x) потрібно: -π/2 < x < π/2.");
  }

  const result: number[] = [];
  for (let x = start; x <= end + RANGE_EPSILON; x += step) {
    result.push(formatFixed(x, 10));
  }
  return result;
};
