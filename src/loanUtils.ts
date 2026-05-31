export interface LoanInputs {
  principal: number;
  annualRate: number;
  durationValue: number;
  durationUnit: "years" | "months";
}

export interface LoanResults {
  monthlyPayment: number;
  totalCost: number;
  totalInterest: number;
  nMonths: number;
  principal: number;
}

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export function computeLoan(inputs: LoanInputs): LoanResults | null {
  const { principal, annualRate, durationValue, durationUnit } = inputs;
  if (principal <= 0 || durationValue <= 0) return null;

  const n = durationUnit === "years" ? durationValue * 12 : durationValue;
  const r = annualRate / 100 / 12;

  let monthlyPayment: number;

  if (r === 0) {
    monthlyPayment = principal / n;
  } else {
    const pow = Math.pow(1 + r, n);
    monthlyPayment = (principal * r * pow) / (pow - 1);
  }

  const totalCost = monthlyPayment * n;
  const totalInterest = totalCost - principal;

  return {
    monthlyPayment,
    totalCost,
    totalInterest,
    nMonths: n,
    principal,
  };
}

export function computeAmortization(inputs: LoanInputs): AmortizationRow[] {
  const result = computeLoan(inputs);
  if (!result) return [];

  const { nMonths, monthlyPayment, principal } = result;
  const r = inputs.annualRate / 100 / 12;

  const rows: AmortizationRow[] = [];
  let balance = principal;

  for (let i = 1; i <= nMonths; i++) {
    const interestPart = balance * r;
    const principalPart = monthlyPayment - interestPart;
    balance = Math.max(0, balance - principalPart);

    rows.push({
      month: i,
      payment: monthlyPayment,
      principal: principalPart,
      interest: interestPart,
      remainingBalance: balance,
    });
  }

  return rows;
}

export function formatEur(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
