// Define the dimensions for the SVG
var margin = { top: 30, right: 30, bottom: 70, left: 100 },
  w = 1300 - margin.left - margin.right,
  h = 600 - margin.top - margin.bottom;
var barPadding = 1;

// Load the CSV data
d3.csv('https://gist.githubusercontent.com/AllenHo2/60e931802e00bba842a25c07181fa11e/raw/40d021a33a040eee1d9c64732675fd0b864a74eb/BTU.csv').then(function (data) {
  // var sequentialScale = d3.scaleSequential(d3.interpolateRainbow)
  // .domain([0,100]);

  // Create the SVG element
  var svg = d3
    .select('#barChart')
    .append('svg')
    .attr('width', w + margin.left + margin.right)
    .attr('height', h + margin.top + margin.bottom)
    .append('g')
    .attr('transform',`translate(${margin.left},${margin.top})`,);

    //sequential color scale
  var myColor = d3
    .scaleLinear()
    .domain([5000000000000000000, 8150000000000000000])
    .range(['white', 'blue']);

  // Define scales for x and y axes
  var x = d3
    .scaleBand()
    .domain(
      data.map(function (d) { return d['Years']; }))
    .range([0, w])
    .padding(0.2); 

  var y = d3
    .scaleLinear()
    .domain([0, d3.max(data, function (d) { return d['Fuel'] * 1.25; })])
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
    .attr('y', function (d) {return y(d['Fuel']);})
    .attr('width', x.bandwidth())
    .attr('height',(d) => h - y(d['Fuel']))
    .attr('fill', function (d) {return myColor(d['Fuel']);})
    .append('title')
    .text((d) => d['Fuel'] + ' Fuel');
  //X axis
  svg
    .append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate( 0 , ' + h + ')')
    .call(d3.axisBottom(x).tickValues(x.domain().filter(function(d, i) { return i % 2 === 0; }))) // Display every other tick label
    .selectAll('text')
    .style('font-size', 20)
    .style('stroke', "black")
    .style('fill', '0');
  //Y Axis
  var yAxis = d3.axisLeft().scale(y).tickFormat(function(d){return d/1000000000000000000 + " Quintillion"}); //Shorten tick label
  svg.append('g')
  .attr('class', 'axis')
  .call(yAxis)
  .style('font-size', 12)
  .style('stroke', "black");
  //Legend
  svg
    .append('g')
    .attr('class', 'legendSequential')
    .style('stroke', "black")
    .attr('transform', 'translate(960,14)');
  //Legend Label
  svg
    .append('text')
    .attr('transform', 'translate(960,2)')
    .style('font-size', '12px')
    .style('stroke', "black")
    .text("Fossil Fuel in BTU");
 
  var legendSequential = d3
    .legendColor()
    .shapeWidth(30)
    .cells(5)
    .orient('vertical')
    .scale(myColor)
    .labelFormat(d3.format(".1"));


  //call legend
  svg.select('.legendSequential')
    .call(legendSequential)
    .selectAll("text")
    .style("font-size", 15) 
    .style("stroke", "black"); 

  //Y Axis Label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (h / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", 20)
    .style("stroke", "black")
    .text("Fossil Fuels in BTU");
  //X Axis Label
  svg.append("text")
    .attr("transform", "translate(" + (w/2) + " ," + (h + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .style("font-size", 20)
    .style("stroke", "black")
    .text("Year");
});
