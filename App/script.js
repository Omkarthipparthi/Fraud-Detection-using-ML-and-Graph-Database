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
}


