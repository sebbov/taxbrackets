import React, { createContext, useState, useContext } from 'react';
import { TaxYear, FilingStatus } from './brackets';

export type Color = {
    tailwind: string;
    hex: string;
};

export const Colors = {
    red: {
        tailwind: "bg-red-100",
        hex: "#fee2e2",
    } as Color,
    blue: {
        tailwind: "bg-blue-100",
        hex: "#dbeafe",
    } as Color,
    green: {
        tailwind: "bg-green-100",
        hex: "#d1fae5",
    } as Color,
    yellow: {
        tailwind: "bg-yellow-100",
        hex: "#fef9c3",
    } as Color,
    purple: {
        tailwind: "bg-purple-100",
        hex: "#e9d5ff",
    } as Color,
    teal: {
        tailwind: "bg-teal-100",
        hex: "#ccfbf1",
    } as Color,
    orange: {
        tailwind: "bg-orange-100",
        hex: "#ffedd5",
    } as Color,
    pink: {
        tailwind: "bg-pink-100",
        hex: "#fce7f3",
    } as Color,
};

const createColorCycler = () => {
    const colorArray = Object.values(Colors) as Color[];
    let currentIndex = 0;

    return () => {
        const color = colorArray[currentIndex];
        currentIndex = (currentIndex + 1) % colorArray.length;
        return color;
    };
};
export const getNextColor = createColorCycler();


interface Point {
    color: Color;
    taxYear: TaxYear;
    filingStatus: FilingStatus,
    taxableIncome: number;
    taxesOwed: number;
    marginalTaxRate: number;
}

const PointsContext = createContext<{
    points: Point[];
    addPoint: (point: Point) => void;
    removePoint: (index: number) => void;
}>({
    points: [],
    addPoint: () => { },
    removePoint: () => { },
});

export const usePoints = () => useContext(PointsContext);

export const PointsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [points, setPoints] = useState<Point[]>([]);

    const addPoint = (point: Point) => {
        setPoints((prevPoints) => [...prevPoints, point]);
    };

    const removePoint = (index: number) => {
        setPoints((prevPoints) => prevPoints.filter((_, i) => i !== index));
    };

    return (
        <PointsContext.Provider value={{ points, addPoint, removePoint }}>
            {children}
        </PointsContext.Provider>
    );
};
