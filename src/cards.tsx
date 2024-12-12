import React from "react";
import { usePoints } from "./points";
import Card from "./card";

const Cards: React.FC = () => {
    const { points, removePoint } = usePoints();

    return (
        <div>
            {points.map((point, index) => (
                <Card
                    key={index}
                    color={point.color}
                    taxYear={point.taxYear}
                    filingStatus={point.filingStatus}
                    taxableIncome={point.taxableIncome}
                    taxesOwed={point.taxesOwed}
                    marginalTaxRate={point.marginalTaxRate}
                    onRemove={() => removePoint(index)}
                />
            ))}
        </div>
    );
};

export default Cards;
