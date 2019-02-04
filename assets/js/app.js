// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom:60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//SVG wrapper
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
// Import Data
d3.csv("assets/data/data.csv")
    .then(function(sdata) {
        //parse data/cast as numbers
        sdata.forEach(function(data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
        });

        //create scale functions
        var xLinearScale = d3.scaleLinear()
            .domain([5, d3.max(sdata, d => d.poverty)])
            .range([0, width]);
        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(sdata, d => d.healthcare)])
            .range([height, 0]);
        
        //create axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        //append axes to chart
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);
        chartGroup.append("g")
            .call(leftAxis);
        
        //create circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(sdata)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", "10")
            .attr("fill", "blue")
            .attr("opacity", ".5");

            chartGroup.append("text")
            .style("text-anchor", "middle")
            .style("font-size", "7px")
            .selectAll("tspan")
            .data(sdata)
            .enter()
            .append("tspan")
            .attr("x", function(data) {
                return xLinearScale(data.poverty);
            })
            .attr("y", function(data) {
                return yLinearScale(data.healthcare -.02);
            })
            .text(function(data) {
                return data.abbr
            });
    
        //initialize tool tip
        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function(d) {
                return ('${d.state<br>Poverty (%): ${d.poverty}<br>Healthcare (%): ${d.healthcare}')
            });

        //tooltip
        chartGroup.call(toolTip);

        //event listeners
        circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
        })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
        
        // Create axes labels
        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 1.3))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("In Poverty (%)");

        chartGroup.append("text")
        .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");
    });