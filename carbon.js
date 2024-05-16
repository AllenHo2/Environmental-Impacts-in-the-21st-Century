// Define the dimensions for the SVG
var margin = { top: 30, right: 30, bottom: 70, left: 100 },
  w = 1300 - margin.left - margin.right,
  h = 600 - margin.top - margin.bottom;
var barPadding = 1;

// Load the CSV data
d3.csv('https://gist.githubusercontent.com/AllenHo2/1c1f1f40b26de1b56c657c472a809318/raw/fe06a7c6b95aad72c39dc3b6aba2cbcb103841a6/Carbon%2520-%2520atmospheric_carbon_dioxide_concentration_in_parts_per_million_usafacts%2520(1).csv').then(function (data) {
  // var sequentialScale = d3.scaleSequential(d3.interpolateRainbow)
  // .domain([0,100]);

  // Create the SVG element
  var svg = d3
    .select('#carbonChart')
    .append('svg')
    .attr('width', w + margin.left + margin.right)
    .attr('height', h + margin.top + margin.bottom)
    .append('g')
    .attr('transform',`translate(${margin.left},${margin.top})`,);

  var myColor = d3
    .scaleLinear()
    .domain([300, 450])
    .range(['white', 'blue']);

  // Define scales for x and y axes
  var x = d3
    .scaleBand()
    .domain(
      data.map(function (d) { return d['Years']; }))
    .range([0, w])
    .padding(0.2); // Adjust padding as needed

  var y = d3
    .scaleLinear()
    .domain([0, d3.max(data, function (d) { return d['Carbon'] * 1.5; })])
    .nice()
    .range([h, 0]);

  //   console.log(x(d["Years"]));
  // Create bars
  svg
    .selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', function (d) {return x(d['Years']);})
    .attr('y', function (d) {return y(d['Carbon']);})
    .attr('width', x.bandwidth())
    .attr('height',(d) => h - y(d['Carbon']))
    .attr('fill', function (d) {return myColor(d['Carbon']);})
    .append('title')
    .text((d) => d['Carbon'] + ' Tons');
  //X Axis
  svg
    .append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate( 0 , ' + h + ')')
    .call(d3.axisBottom(x).tickValues(x.domain().filter(function(d, i) { return i % 2 === 0; }))) // Display every other tick label
    .selectAll('text')
    .style('font-size', 20)
    .style('stroke', "black")
    .style('fill', '0');

    var yAxis = d3.axisLeft().scale(y);
  //Y axis
  svg.append('g')
    .attr('class', 'axis')
    .call(yAxis)
    .style('stroke', "black")
    .style("font-size", 20);

  //Sequential Legend
  svg
    .append('g')
    .attr('class', 'legendSequential')
    .style('stroke', "black")
    .attr('transform', 'translate(1000,15)');

  //Legend Label
  svg
    .append('text')
    .attr('transform', 'translate(940,5)')
    .style("font-size", 20)
    .style("stroke", "black")
    .text("Atmospheric Carbon Levels in Tons");

  var legendSequential = d3
    .legendColor()
    .shapeWidth(30)
    .cells(5)
    .orient('vertical')
    .scale(myColor);

  //Call Legend
  svg.select('.legendSequential').call(legendSequential);

  //Y Axis Label
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (h / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style('stroke', "black")
    .text("Atmospheric Carbon Levels (Tons)");
    
  //X Axis Label
  svg.append("text")
    .attr("transform", "translate(" + (w/2) + " ," + (h + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .style("font-size", 20)
    .style("stroke", "black")
    .text("Year");
});
