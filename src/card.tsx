import React from "react";
import { FilingStatus, TaxYear } from "./brackets";
import { Color } from "./points";

type CardProps = {
    color: Color;
    taxYear: TaxYear;
    filingStatus: FilingStatus;
    taxableIncome: number;
    taxesOwed: number;
    marginalTaxRate: number;
    onRemove: () => void;
};

const Card: React.FC<CardProps> = ({ color, taxYear, filingStatus, taxableIncome, taxesOwed, marginalTaxRate, onRemove }) => {
    return (
        <div className={`relative ${color.tailwind} rounded-2xl p-4 shadow-lg w-fit mx-auto my-4 group`}>
            <button
                onClick={onRemove}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
                X
            </button>

            <p className="text-md font-semibold text-gray-900">
                {taxYear} - {filingStatus}
            </p>

            <table className="min-w-full table-auto">
                <tbody>
                    <tr>
                        <td className="px-1 font-semibold text-gray-600">Income</td>
                        <td className="px-1">${(Math.round(taxableIncome / 1000) * 1000).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td className="px-1 font-semibold text-gray-600">Owed</td>
                        <td className="px-1">${(Math.round(taxesOwed / 1000) * 1000).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td className="px-1 font-semibold text-gray-600">Effective Rate</td>
                        <td className="px-1">{Math.round(taxesOwed * 10000 / taxableIncome) / 100}%</td>
                    </tr>
                    <tr>
                        <td className="px-1 font-semibold text-gray-600">Marginal Rate</td>
                        <td className="px-1">{Math.round(marginalTaxRate * 10000) / 100}%</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Card;
