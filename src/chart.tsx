import React from "react";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { usePoints, getNextColor } from "./points";
import { brackets, TaxYear, FilingStatus, interpolate } from "./brackets";

type ChartProps = {
    taxYear: TaxYear;
    filingStatus: FilingStatus;
};

const Chart: React.FC<ChartProps> = ({ taxYear, filingStatus }) => {
    const { addPoint, points } = usePoints();
    const divRef = useRef<HTMLDivElement | null>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [maxTaxableIncome, setMaxTaxableIncome] = useState(750_000);
    const data = brackets[taxYear]?.[filingStatus] ?? [];
    let maxTaxesOwed = interpolate(data, maxTaxableIncome).taxesOwed;
    let curTaxableIncome: number | null;
    let curTaxesOwed: number | null;
    let curMarginalTaxRate: number | null;

    const handleClick = () => {
        if (curTaxableIncome && curTaxesOwed && curMarginalTaxRate) {
            addPoint({
                color: getNextColor(),
                taxYear: taxYear,
                filingStatus: filingStatus,
                taxableIncome: curTaxableIncome,
                taxesOwed: curTaxesOwed,
                marginalTaxRate: curMarginalTaxRate,
            });
        }
    };

    // Mobile zoom.  We need to keep track of the distance state and since
    // the svg is recreated, do this at the div level.
    const [initialDistance, setInitialDistance] = useState<number | null>(null);
    function eucledianDistanceBetweenTouches(touch1: Touch, touch2: Touch) {
        const dx = touch2.pageX - touch1.pageX;
        const dy = touch2.pageY - touch1.pageY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    divRef.current?.addEventListener("touchstart", (event) => {
        if (!event.touches || event.touches.length != 2) {
            return;
        }
        // event.preventDefault();
        setInitialDistance(eucledianDistanceBetweenTouches(event.touches[0], event.touches[1]));
    })
    divRef.current?.addEventListener("touchmove", (event) => {
        if (!event.touches || event.touches.length != 2 || initialDistance === null) {
            return;
        }
        //event.preventDefault();
        const currentDistance = eucledianDistanceBetweenTouches(event.touches[0], event.touches[1]);
        const delta = initialDistance - currentDistance;
        setMaxTaxableIncome(maxTaxableIncome * (1 + delta / 200));
        maxTaxesOwed = interpolate(data, maxTaxableIncome).taxesOwed;
        setInitialDistance(currentDistance);
    })

    // Update chart dimensions dynamically based on container size.
    useEffect(() => {
        const handleResize = () => {
            if (divRef.current) {
                const containerWidth = divRef.current.offsetWidth;
                const containerHeight = divRef.current.offsetHeight;
                setDimensions({ width: containerWidth * 0.8, height: containerHeight * 0.8 });
            }
        };

        // Set dimensions on mount and on resize.
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (!divRef.current) {
            return
        }
        const { width, height } = dimensions;
        if (width === 0) return; // Skip rendering if dimensions are not set yet.
        const margin = { top: 20, right: 30, bottom: 30, left: 80 };

        const xScale = d3
            .scaleLinear()
            .domain([0, maxTaxableIncome])
            .range([margin.left, width - margin.right]);

        const yScale = d3
            .scaleLinear()
            .domain([0, maxTaxesOwed])
            .range([height - margin.bottom, margin.top]);

        const svg = d3
            .select(divRef.current?.children[0])
            .attr("viewBox", `0 0 ${width} ${height}`)
            .style("overflow", "visible")
            .style("touch-action", "none");

        svg
            .append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(
                d3.axisBottom(xScale)
                    .ticks(3)
                    .tickFormat((d) => `$${d.toLocaleString()}`)
            )
            .attr("font-size", "12px");
        svg
            .append("text")
            .attr("transform", `translate(${width / 2}, ${height - margin.bottom + 40})`)
            .style("text-anchor", "middle")
            .attr("font-size", "14px")
            .text("Taxable Income");
        svg
            .append("g")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(
                d3.axisLeft(yScale)
                    .ticks(6)
                    .tickFormat((d) => `$${d.toLocaleString()}`)
            )
            .attr("font-size", "12px");
        svg
            .append("text")
            .attr("transform", `translate(${margin.left - 70}, ${height / 2}) rotate(-90)`)
            .style("text-anchor", "middle")
            .attr("font-size", "14px")
            .text("Taxes Owed");

        const cutoffs = data
            .filter(d => d.taxableIncome < maxTaxableIncome)
            .map(d => ({ taxableIncome: d.taxableIncome, taxesOwed: interpolate(data, d.taxableIncome).taxesOwed }));
        const lineData = [
            ...cutoffs,
            { taxableIncome: maxTaxableIncome, taxesOwed: maxTaxesOwed }
        ];
        const line = d3
            .line<{ taxableIncome: number; taxesOwed: number }>()
            .x((d) => xScale(d.taxableIncome))
            .y((d) => yScale(d.taxesOwed));
        svg
            .append("path")
            .datum(lineData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", line);

        svg
            .selectAll("circle")
            .data(cutoffs)
            .enter()
            .append("circle")
            .attr("cx", (d) => xScale(d.taxableIncome))
            .attr("cy", (d) => yScale(d.taxesOwed))
            .attr("r", 3)
            .attr("fill", "steelblue");


        const verticalCrosshairLine = svg
            .append("line")
            .attr("stroke", "green")
            .attr("stroke-dasharray", "5,5")
            .attr("stroke-width", 1)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", height - margin.bottom)
            .style("visibility", "hidden");
        const verticalCrosshairLabel = svg
            .append("text")
            .attr("font-size", "12px")
            .attr("fill", "green")
            .attr("text-anchor", "start")
            .style("visibility", "hidden");

        const horizontalCrosshairLine = svg
            .append("line")
            .attr("stroke", "green")
            .attr("stroke-dasharray", "5,5")
            .attr("stroke-width", 1)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", margin.left)
            .style("visibility", "hidden");
        const horizontalCrosshairLabel = svg
            .append("text")
            .attr("font-size", "12px")
            .attr("fill", "green")
            .attr("text-anchor", "middle")
            .style("visibility", "hidden");

        // Desktop zoom.
        svg.on("wheel", (event) => {
            if (event.deltaY != 0) { // Ensure an actual scroll event.
                event.preventDefault();
                setMaxTaxableIncome(maxTaxableIncome * (1 + event.deltaY / 200));
                maxTaxesOwed = interpolate(data, maxTaxableIncome).taxesOwed;
            }
        }, { passive: false });

        // Desktop (mouse) and mobile (touch, 1-finger) crosshair.
        svg.on("pointermove", function(event) {
            if (event.touches && event.touches.length != 1) {
                return;
            }
            const mouseX = d3.pointer(event)[0];
            const taxableIncome = xScale.invert(mouseX);

            const labelScale = (n: number) => 10 ** (Math.floor(Math.log10(n)) - 2);
            const round = (n: number) => Math.round(n / labelScale(n)) * labelScale(n);

            if (taxableIncome >= data[0].taxableIncome && taxableIncome <= maxTaxableIncome) {
                const interpolation = interpolate(data, taxableIncome);
                const taxesOwed = interpolation.taxesOwed;
                const marginalTaxRate = interpolation.marginalTaxRate;

                verticalCrosshairLine
                    .attr("x1", mouseX)
                    .attr("y1", yScale(taxesOwed))
                    .attr("x2", mouseX)
                    .attr("y2", height - margin.bottom);
                verticalCrosshairLabel
                    .attr("x", mouseX + 5)
                    .attr("y", ((height - margin.bottom) + yScale(taxesOwed)) / 2)
                    .text(`$${round(taxableIncome).toLocaleString()}`);
                horizontalCrosshairLine
                    .attr("x1", mouseX)
                    .attr("y1", yScale(taxesOwed))
                    .attr("x2", margin.left)
                    .attr("y2", yScale(taxesOwed));
                const effectiveTaxRate = taxesOwed / taxableIncome;
                horizontalCrosshairLabel
                    .attr("x", (mouseX + margin.left) / 2)
                    .attr("y", yScale(taxesOwed) - 10)
                    .attr("xml:space", "preserve")
                    .text(`$${round(taxesOwed).toLocaleString()} ` +
                        `(${Math.round(effectiveTaxRate * 10000) / 100}% / ${Math.round(marginalTaxRate * 100)}%)`);

                verticalCrosshairLine.style("visibility", "visible");
                verticalCrosshairLabel.style("visibility", "visible");
                horizontalCrosshairLine.style("visibility", "visible");
                horizontalCrosshairLabel.style("visibility", "visible");
                curTaxableIncome = taxableIncome;
                curTaxesOwed = taxesOwed;
                curMarginalTaxRate = marginalTaxRate;
            } else {
                verticalCrosshairLine.style("visibility", "hidden");
                verticalCrosshairLabel.style("visibility", "hidden");
                horizontalCrosshairLine.style("visibility", "hidden");
                horizontalCrosshairLabel.style("visibility", "hidden");
                curTaxableIncome = null;
                curTaxesOwed = null;
                curMarginalTaxRate = null;
            }
        }); // Mouseover

        points.forEach((point) => {
            if (point.taxYear == taxYear && point.filingStatus == filingStatus && point.taxableIncome < maxTaxableIncome) {
                const x = xScale(point.taxableIncome);
                const y = yScale(point.taxesOwed);
                svg
                    .append("circle")
                    .attr("cx", x)
                    .attr("cy", y)
                    .attr("r", 4)
                    .attr("fill", point.color.hex)
                    .attr("stroke", "steelblue");
            }
        });

        // Clean up on unmount
        return () => {
            svg.selectAll("*").remove();
        };
    }, [dimensions, taxYear, filingStatus, points, maxTaxableIncome]);

    return (
        <div onClick={handleClick} ref={divRef} style={{ width: "100%", height: "100%", margin: "0 auto" }}>
            <svg />
        </div>
    );
};

export default Chart;
