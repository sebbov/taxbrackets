import React, { useState } from "react";
import ReactDOM from 'react-dom/client';
import Chart from "./chart";
import Cards from "./cards";
import { PointsProvider } from "./points";
import "./index.css";
import { TaxYear, FilingStatus } from "./brackets";

const App: React.FC = () => {
  const [taxYear, setTaxYear] = useState("2024" as TaxYear);
  const [filingStatus, setFilingStatus] = useState("Married filing jointly" as FilingStatus);

  const taxYears = ["2023", "2024", "2025"] as TaxYear[];
  const filingStatuses = [
    "Single",
    "Married filing jointly",
    "Married filing separately",
    "Head of household",
  ] as FilingStatus[];

  return (
    <PointsProvider>
      <div className="flex flex-col h-screen">
        {/* Dropdowns */}
        <div className="flex items-center p-4 border-b border-gray-200 bg-gray-100">
          {/* Tax Year Dropdown */}
          <div className="mr-4">
            <label htmlFor="tax-year" className="block text-sm font-medium text-gray-700">
              Income Tax Year
            </label>
            <select
              id="tax-year"
              value={taxYear}
              onChange={(e) => setTaxYear(e.target.value as TaxYear)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {taxYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Filing Status Dropdown */}
          <div>
            <label htmlFor="filing-status" className="block text-sm font-medium text-gray-700">
              Filing Status
            </label>
            <select
              id="filing-status"
              value={filingStatus}
              onChange={(e) => setFilingStatus(e.target.value as FilingStatus)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {filingStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row flex-1">
          <div className="h-[65vh] lg:h-full lg:w-3/4 p-4 border-b lg:border-b-0 lg:border-r border-gray-200">
            <Chart taxYear={taxYear} filingStatus={filingStatus} />
          </div>
          <div className="flex-1 lg:w-1/4 p-4 overflow-y-auto">
            <Cards />
          </div>
        </div>
      </div>
    </PointsProvider>
  );
};

ReactDOM.createRoot(document.getElementById('app')!).render(<App />);
