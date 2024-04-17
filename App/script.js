var fileName = "sample.csv";
var categoryFields = ["Transportation", "Food", "Fashion", "Leisure", "Health", "Home"];
var piechartFields = ["legitimate_count", "fraudulent_count"];

d3.csv("sample.csv", function (error, data) {
    if (error) throw error;

    let barGraph = {};
    let piechartMap = {};
    data.forEach(d => {
        const customerId = d.customer_id;
        barGraph[customerId] = categoryFields.map(field => +d[field]);
        piechartMap[customerId] = piechartFields.map(field => +d[field]);
    });
    makeVis(barGraph, piechartMap);
});

function makeVis(barGraph, piechartMap) {
    // Define dimensions and scales
    const margin = { top: 30, right: 50, bottom: 30, left: 50 }; // Increased top margin
    const width = 550 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;
    const xScale = d3.scale.ordinal().domain(categoryFields).rangeRoundBands([0, width], 0.1);
    const yScale = d3.scale.linear().range([height, 0]);

    // SVG Canvas
    const canvas = d3.select("#vis-container").append("svg")
        .attr("width", 600)
        .attr("height", 450) // Increased height to accommodate titles
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Bar Graph Title
    canvas.append("text")
        .attr("x", width / 2)
        .attr("y", -10) // Adjust y position to be within the new margin
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Distribution of Transactions by Category");

    // Axes
    const xAxis = d3.svg.axis().scale(xScale).orient("bottom");
    const yAxis = d3.svg.axis().scale(yScale).orient("left");
    canvas.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
    const yAxisHandleForUpdate = canvas.append("g").attr("class", "y axis").call(yAxis);

    // Initial bar and pie chart
    updateBars(barGraph[Object.keys(barGraph)[0]]);
    let piechart = new PieChart(d3.select('.center'), piechartMap[Object.keys(piechartMap)[0]]);

    // Dropdown interaction
    const dropdown = d3.select("#vis-dropdown").append("select").on("change", function () {
        const customerId = d3.select(this).property('value');
        updateBars(barGraph[customerId]);
        piechart.draw(piechartMap[customerId]);
    });
    dropdown.selectAll("option")
        .data(Object.keys(barGraph))
        .enter().append("option")
        .attr("value", d => d)
        .text(d => d);

    function updateBars(data) {
        yScale.domain([0, d3.max(data)]);
        yAxisHandleForUpdate.call(yAxis);
        const bars = canvas.selectAll(".bar").data(data);
        bars.enter().append("rect").attr("class", "bar")
            .attr("x", (d, i) => xScale(categoryFields[i]))
            .attr("width", xScale.rangeBand())
            .attr("y", yScale)
            .attr("height", d => height - yScale(d));
        bars.transition().duration(250).attr("y", yScale).attr("height", d => height - yScale(d));
        bars.exit().remove();
    }

    class PieChart {
    constructor(svg, data) {
        this.svg = svg;
        this.draw(data);
    }

    draw(data) {
        const margin = 40, width = 450, height = 450, radius = (Math.min(width, height) / 2) - margin;
        const color = d3.scale.ordinal().domain(["Legitimate", "Fraudulent"]).range(["#008000", "#FF0000"]);
        const pie = d3.layout.pie();
        const arc = d3.svg.arc().outerRadius(radius).innerRadius(0);
        const labelArc = d3.svg.arc().outerRadius(radius - 40).innerRadius(radius - 40);

        this.svg.selectAll("*").remove();
        const svg = this.svg.append("svg")
            .attr("width", width)
            .attr("height", height + margin) // Ensure height accounts for the margin
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + (height / 2 + margin / 2) + ")"); // Center the pie chart properly

        svg.append("text")
            .attr("x", 0)
            .attr("y", -height / 2) // Position the title above the pie chart
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Transaction Type Distribution");

        const arcs = svg.selectAll(".arc").data(pie(Object.values(data))).enter().append("g").attr("class", "arc");
        arcs.append("path").attr("d", arc).style("fill", (d, i) => color(i));
        arcs.append("text")
            .attr("transform", d => "translate(" + labelArc.centroid(d) + ")")
            .attr("text-anchor", "middle")
            .text(d => ${Math.round((d.data / d3.sum(Object.values(data))) * 100)}%);

        // Legend setup
        const legend = svg.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => "translate(0," + (i * 20 - 180) + ")");

        legend.append("rect")
            .attr("x", width / 2 - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", width / 2 - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(d => d);
    }
}
}


