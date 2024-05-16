// Define the dimensions for the SVG
var margin = {top: 30, right: 100, bottom: 70, left: 100},
    w = 1300- margin.left - margin.right,
    h = 600 - margin.top - margin.bottom;
var barPadding = 1;

// Load the CSV data
d3.csv("https://gist.githubusercontent.com/AllenHo2/bc5f32e18e66cac9041831a3ae10703d/raw/1bd86f73817d49e0de73519930f768d5c350b3db/Gas_vs_AQI.csv")
  .then(function(data) {

    data.sort((a, b) => +b["AQI"] - +a["AQI"]);
    // Create the SVG element
    var svg = d3.select("#scatterPlot")
      .append("svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    var aqiValues = Array.from(new Set(data.map(function(d) { return Math.floor(+d["AQI"]); })));

    // Include 46 in the AQI values and sort them
    aqiValues.push(46);
    aqiValues.sort((a, b) => a - b);

    // Define scales for x and y axes
    var x = d3.scaleBand()
      .domain(aqiValues) 
      .range([0, w])
      .padding(0.2); 

    var y = d3.scaleLinear()
      .domain([d3.min(data, function(d) { return d["Gas"] }), d3.max(data, function(d) { return d["Gas"] })])
      .nice()
      .range([h, 0]);

    //Drawing data points
svg.selectAll('.dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', (d) => x(Math.floor(+d["AQI"])) + Math.random() * 25 - 20 + 50) 
    .attr('cy', (d) => y(+d['Gas']))
    .attr('r', 8)
    .attr('fill',(d) => 'red')
    .style("stroke", "black")
    .append('title')
    .text((d) => 'GreenHouse Gas Emission: ' + d['Gas'] + ', AQI: ' + d['AQI'] + ', Year: ' + d['Years']);

    //X Axis and ticks
    svg.append("g")
      .attr("class", "axis")
      .style("stroke", "black")
      .attr("transform", "translate( 0 , " + h + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-size", 20)
      .style("fill", "0");

    //Y Axis and ticks
    var yAxis = d3.axisLeft()
                  .scale(y)
                  .tickFormat(function(d){return d/1000000000 + " Billion"});
    svg.append("g")
    .attr("class", "axis")
    .style("stroke", "black")
    .style("font-size", 15)
    .call(yAxis);

    svg.append("text")
      .attr("x", w / 2)
      .attr("y", h + margin.bottom / 2)
      .attr("text-anchor", "middle")
      .text("")
      .style("font-size", "14px");

    //X Axis Label
    svg.append("text")
      .attr("transform", "translate(" + (w/2) + " ," + (h + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .style('stroke', "black")
      .text("Average Air Quality Index experienced by Humans");
    //Y Axis Label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (h / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style('stroke', "black")
      .text("GreenHouse Gas Emissions in tons");

  
    // Calculate regression line
    var xValues = data.map(d => Math.floor(+d["AQI"]));
    var yValues = data.map(d => +d['Gas']);
    var regression = d3.regressionLinear()(xValues.map((d, i) => [d, yValues[i]]));
  
      // Draw regression line
    svg.append("line")
      .attr("class", "regression-line")
      .attr("x1", x(regression[0][0]))
      .attr("y1", y(regression[0][1]))
      .attr("x2", x(regression[1][0]))
      .attr("y2", y(regression[1][1]))
      .style("stroke", "blue")
      .style("stroke-width", 2);
      //debugging
      console.log("xValues:", xValues);
      console.log("yValues:", yValues);
      console.log("Regression:", regression);
        
  })