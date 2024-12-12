import React from "react";
import { brackets, TaxYear, FilingStatus } from "./brackets";

interface RateTableProps {
    taxYear: TaxYear;
    filingStatus: FilingStatus;
}

const RateTable: React.FC<RateTableProps> = ({ taxYear, filingStatus }) => {
    const data = brackets[taxYear]?.[filingStatus];

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
                {taxYear} - {filingStatus}
            </h2>

            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">Rate</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                            Income Range
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((bracket, index) => {
                        const nextBracket = data[index + 1];
                        const incomeRange = nextBracket
                            ? `$${bracket.taxableIncome.toLocaleString()} - $${(nextBracket.taxableIncome).toLocaleString()}`
                            : `$${bracket.taxableIncome.toLocaleString()}+`;

                        return (
                            <tr key={index}>
                                <td className="border border-gray-300 px-4 py-2">
                                    {(bracket.taxRate * 100).toFixed(0)}%
                                </td>
                                <td className="border border-gray-300 px-4 py-2">{incomeRange}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default RateTable;
