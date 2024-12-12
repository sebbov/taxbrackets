export type FilingStatus =
    | "Single"
    | "Married filing jointly"
    | "Married filing separately"
    | "Head of household";
export type TaxYear = "2023" | "2024" | "2025";

type Bracket = { taxableIncome: number; taxRate: number }
type Brackets = Record<
    TaxYear,
    Record<FilingStatus, Bracket[]>
>;

export const brackets: Brackets = {
    "2023": {
        "Single": [
            { taxableIncome: 0, taxRate: 0.10 },
            { taxableIncome: 11000, taxRate: 0.12 },
            { taxableIncome: 44725, taxRate: 0.22 },
            { taxableIncome: 95375, taxRate: 0.24 },
            { taxableIncome: 182100, taxRate: 0.32 },
            { taxableIncome: 231250, taxRate: 0.35 },
            { taxableIncome: 578125, taxRate: 0.37 },
        ],
        "Married filing jointly": [
            { taxableIncome: 0, taxRate: 0.10 },
            { taxableIncome: 22000, taxRate: 0.12 },
            { taxableIncome: 89450, taxRate: 0.22 },
            { taxableIncome: 190750, taxRate: 0.24 },
            { taxableIncome: 364200, taxRate: 0.32 },
            { taxableIncome: 462500, taxRate: 0.35 },
            { taxableIncome: 693750, taxRate: 0.37 },
        ],
        "Married filing separately": [
            { taxableIncome: 0, taxRate: 0.10 },
            { taxableIncome: 11000, taxRate: 0.12 },
            { taxableIncome: 44725, taxRate: 0.22 },
            { taxableIncome: 95375, taxRate: 0.24 },
            { taxableIncome: 182100, taxRate: 0.32 },
            { taxableIncome: 231250, taxRate: 0.35 },
            { taxableIncome: 346875, taxRate: 0.37 },
        ],
        "Head of household": [
            { taxableIncome: 0, taxRate: 0.10 },
            { taxableIncome: 15700, taxRate: 0.12 },
            { taxableIncome: 59850, taxRate: 0.22 },
            { taxableIncome: 95350, taxRate: 0.24 },
            { taxableIncome: 182100, taxRate: 0.32 },
            { taxableIncome: 231250, taxRate: 0.35 },
            { taxableIncome: 578100, taxRate: 0.37 },
        ],
    },

    "2024": {
        "Single": [
            { taxableIncome: 0, taxRate: 0.10 },
            { taxableIncome: 11600, taxRate: 0.12 },
            { taxableIncome: 47150, taxRate: 0.22 },
            { taxableIncome: 100525, taxRate: 0.24 },
            { taxableIncome: 191950, taxRate: 0.32 },
            { taxableIncome: 243725, taxRate: 0.35 },
            { taxableIncome: 609350, taxRate: 0.37 },
        ],
        "Married filing jointly": [
            { taxableIncome: 0, taxRate: 0.10 },
            { taxableIncome: 23200, taxRate: 0.12 },
            { taxableIncome: 94300, taxRate: 0.22 },
            { taxableIncome: 201050, taxRate: 0.24 },
            { taxableIncome: 383900, taxRate: 0.32 },
            { taxableIncome: 487450, taxRate: 0.35 },
            { taxableIncome: 731200, taxRate: 0.37 },
        ],
        "Married filing separately": [
            { taxableIncome: 0, taxRate: 0.10 },
            { taxableIncome: 11600, taxRate: 0.12 },
            { taxableIncome: 47150, taxRate: 0.22 },
            { taxableIncome: 100525, taxRate: 0.24 },
            { taxableIncome: 191950, taxRate: 0.32 },
            { taxableIncome: 243725, taxRate: 0.35 },
            { taxableIncome: 365600, taxRate: 0.37 },
        ],
        "Head of household": [
            { taxableIncome: 0, taxRate: 0.10 },
            { taxableIncome: 16550, taxRate: 0.12 },
            { taxableIncome: 63100, taxRate: 0.22 },
            { taxableIncome: 100500, taxRate: 0.24 },
            { taxableIncome: 191950, taxRate: 0.32 },
            { taxableIncome: 243700, taxRate: 0.35 },
            { taxableIncome: 609350, taxRate: 0.37 },
        ],
    },

    "2025": {
        "Single": [
            { taxableIncome: 0, taxRate: 0.10 },
            { taxableIncome: 11925, taxRate: 0.12 },
            { taxableIncome: 48475, taxRate: 0.22 },
            { taxableIncome: 103350, taxRate: 0.24 },
            { taxableIncome: 197300, taxRate: 0.32 },
            { taxableIncome: 250525, taxRate: 0.35 },
            { taxableIncome: 626350, taxRate: 0.37 },
        ],
        "Married filing jointly": [
            { taxableIncome: 0, taxRate: 0.10 },
            { taxableIncome: 23850, taxRate: 0.12 },
            { taxableIncome: 96950, taxRate: 0.22 },
            { taxableIncome: 206700, taxRate: 0.24 },
            { taxableIncome: 394600, taxRate: 0.32 },
            { taxableIncome: 501050, taxRate: 0.35 },
            { taxableIncome: 751600, taxRate: 0.37 },
        ],
        "Married filing separately": [
            { taxableIncome: 0, taxRate: 0.10 },
            { taxableIncome: 11925, taxRate: 0.12 },
            { taxableIncome: 48475, taxRate: 0.22 },
            { taxableIncome: 103350, taxRate: 0.24 },
            { taxableIncome: 197300, taxRate: 0.32 },
            { taxableIncome: 250525, taxRate: 0.35 },
            { taxableIncome: 375800, taxRate: 0.37 },
        ],
        "Head of household": [
            { taxableIncome: 0, taxRate: 0.10 },
            { taxableIncome: 17000, taxRate: 0.12 },
            { taxableIncome: 64850, taxRate: 0.22 },
            { taxableIncome: 103350, taxRate: 0.24 },
            { taxableIncome: 197300, taxRate: 0.32 },
            { taxableIncome: 250500, taxRate: 0.35 },
            { taxableIncome: 626350, taxRate: 0.37 },
        ],
    },
}

export const interpolate = (data: Bracket[], taxableIncome: number): { taxesOwed: number, marginalTaxRate: number } => {
    let taxesOwed = 0;
    let marginalTaxRate = 0;
    for (let i = 0; i < data.length; i++) {
        marginalTaxRate = data[i].taxRate;
        if (i == data.length - 1 || taxableIncome <= data[i + 1].taxableIncome) {
            taxesOwed += (taxableIncome - data[i].taxableIncome) * marginalTaxRate;
            break;
        }
        taxesOwed += (data[i + 1].taxableIncome - data[i].taxableIncome) * marginalTaxRate;
    }
    return { taxesOwed, marginalTaxRate };
}
