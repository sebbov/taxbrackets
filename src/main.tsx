import React, { useState } from "react";
import ReactDOM from 'react-dom/client';
import Chart from "./chart";
import Cards from "./cards";
import { PointsProvider } from "./points";
import "./index.css";
import { TaxYear, TaxYears, FilingStatus, FilingStatuses } from "./brackets";

const defaultYear = "2024" as TaxYear;
const defaultFilingStatusSlug = "married-joint";

const statusSlugMap: Record<string, FilingStatus> = {
  "single": "Single",
  "married-joint": "Married Filing Jointly",
  "married-separate": "Married Filing Separately",
  "head-household": "Head of Household",
};

const getSlugFromStatus = (status: FilingStatus): string => {
  const entry = Object.entries(statusSlugMap).find(([, value]) => value === status);
  return entry ? entry[0] : "";
};

const getStatusFromSlug = (slug: string | null): FilingStatus => {
  return statusSlugMap[slug || defaultFilingStatusSlug];
};


const App: React.FC = () => {
  const url = new URL(window.location.href);
  const [taxYear, setTaxYear] = useState(url.searchParams.get("year") as TaxYear || defaultYear);
  const [filingStatus, setFilingStatus] = useState(getStatusFromSlug(url.searchParams.get("status")));

  window.addEventListener("popstate", (): void => {
    const url = new URL(window.location.href);
    setTaxYear(url.searchParams.get("year") as TaxYear || defaultYear);
    setFilingStatus(getStatusFromSlug(url.searchParams.get("status")));
  });

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
              onChange={(e) => {
                const year = e.target.value as TaxYear;
                setTaxYear(year);
                const url = new URL(window.location.href);
                url.searchParams.set("year", year);
                window.history.pushState({}, "", url.toString());
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {TaxYears.map((year) => (
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
              onChange={(e) => {
                const status = e.target.value as FilingStatus;
                setFilingStatus(status);
                const url = new URL(window.location.href);
                url.searchParams.set("status", getSlugFromStatus(status));
                window.history.pushState({}, "", url.toString());
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {FilingStatuses.map((status) => (
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
