import { json, type MetaFunction } from '@remix-run/cloudflare';
import { useMemo, useState } from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Clinician BMI + GLP-1 Eligibility Tool' },
    {
      name: 'description',
      content: 'Simple BMI calculator with GLP-1 eligibility guidance for clinicians.',
    },
  ];
};

export const loader = () => json({});

function formatBmi(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return '--';
  }

  return value.toFixed(1);
}

function getBmiCategory(bmi: number) {
  if (bmi < 18.5) {
    return 'Underweight';
  }

  if (bmi < 25) {
    return 'Normal weight';
  }

  if (bmi < 30) {
    return 'Overweight';
  }

  if (bmi < 35) {
    return 'Obesity class I';
  }

  if (bmi < 40) {
    return 'Obesity class II';
  }

  return 'Obesity class III';
}

export default function Index() {
  const [heightCm, setHeightCm] = useState('170');
  const [weightKg, setWeightKg] = useState('90');
  const [hasComorbidity, setHasComorbidity] = useState(false);

  const bmi = useMemo(() => {
    const heightMeters = Number(heightCm) / 100;
    const weight = Number(weightKg);

    if (!heightMeters || !weight || heightMeters <= 0 || weight <= 0) {
      return Number.NaN;
    }

    return weight / (heightMeters * heightMeters);
  }, [heightCm, weightKg]);

  const bmiCategory = Number.isFinite(bmi) ? getBmiCategory(bmi) : '--';

  const eligibility = useMemo(() => {
    if (!Number.isFinite(bmi)) {
      return 'Enter a valid height and weight to assess eligibility.';
    }

    if (bmi >= 30) {
      return 'Likely eligible: BMI ≥ 30 kg/m² meets common anti-obesity GLP-1 prescribing criteria.';
    }

    if (bmi >= 27 && hasComorbidity) {
      return 'Likely eligible: BMI ≥ 27 kg/m² with a weight-related comorbidity meets common criteria.';
    }

    return 'May not meet common GLP-1 obesity criteria (typically BMI ≥ 30, or ≥ 27 with comorbidity).';
  }, [bmi, hasComorbidity]);

  return (
    <main className="mx-auto flex h-full w-full max-w-3xl flex-col gap-6 p-6 text-bolt-elements-textPrimary">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Clinician BMI + GLP-1 Eligibility Tool</h1>
        <p className="text-sm text-bolt-elements-textSecondary">
          Use this quick calculator to estimate BMI and review common GLP-1 eligibility thresholds.
        </p>
      </header>

      <section className="grid gap-4 rounded-xl border border-bolt-elements-borderColor bg-bolt-elements-background-depth-1 p-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm">
          Height (cm)
          <input
            className="rounded-md border border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 px-3 py-2"
            inputMode="decimal"
            min="0"
            step="0.1"
            type="number"
            value={heightCm}
            onChange={(event) => setHeightCm(event.target.value)}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          Weight (kg)
          <input
            className="rounded-md border border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 px-3 py-2"
            inputMode="decimal"
            min="0"
            step="0.1"
            type="number"
            value={weightKg}
            onChange={(event) => setWeightKg(event.target.value)}
          />
        </label>

        <label className="sm:col-span-2 flex items-center gap-3 rounded-md border border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 p-3 text-sm">
          <input
            checked={hasComorbidity}
            className="h-4 w-4"
            type="checkbox"
            onChange={(event) => setHasComorbidity(event.target.checked)}
          />
          Has at least one weight-related comorbidity (e.g., hypertension, dyslipidemia, OSA, prediabetes).
        </label>
      </section>

      <section className="grid gap-4 rounded-xl border border-bolt-elements-borderColor bg-bolt-elements-background-depth-1 p-4 sm:grid-cols-2">
        <article className="space-y-1">
          <h2 className="text-sm font-medium text-bolt-elements-textSecondary">Calculated BMI</h2>
          <p className="text-3xl font-semibold">{formatBmi(bmi)} kg/m²</p>
        </article>

        <article className="space-y-1">
          <h2 className="text-sm font-medium text-bolt-elements-textSecondary">BMI Category</h2>
          <p className="text-xl font-medium">{bmiCategory}</p>
        </article>
      </section>

      <section className="rounded-xl border border-bolt-elements-borderColor bg-bolt-elements-background-depth-1 p-4">
        <h2 className="mb-2 text-sm font-medium text-bolt-elements-textSecondary">GLP-1 Eligibility Suggestion</h2>
        <p className="text-base">{eligibility}</p>
      </section>

      <p className="rounded-md border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-200">
        Clinical reminder: this tool is educational support and not a substitute for clinician judgment, contraindication
        screening, payer policy checks, or local prescribing guidance.
      </p>
    </main>
  );
}
