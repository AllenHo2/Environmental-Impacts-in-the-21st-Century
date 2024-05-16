// Define the dimensions for the SVG
var margin = {top: 30, right: 30, bottom: 70, left: 100},
    w = 1300- margin.left - margin.right,
    h = 600 - margin.top - margin.bottom;
var barPadding = 1;

// Load the CSV data
d3.csv("https://gist.githubusercontent.com/AllenHo2/d049ea2fcf61c90a9b220f6693881e40/raw/643ed2db8210a15fbba086084d72da989bea23e2/AQI.csv")
  .then(function(data) {
      
    //Dots Visible when first ran
    var dotsVisible = true;
    // Create the SVG element
    var svg = d3.select("#lineChart")
      .append("svg")
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define scales for x and y axes
    const x = d3.scaleBand()
      .domain( data.map(function (d) { return d['Years']; }))
      .range([0, w])
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

    const y = d3.scaleLinear()
      .domain([d3.min(data, d => (+d["AQI"])), d3.max(data, d => (+d["AQI"]))])
      .nice()
      .range([h, 0]);

    //Y Axis
    svg.append("g")
      .attr("class", "axis")
      .style('stroke', "black")
      .style('font-size', 20)
      .call(d3.axisLeft(y))
      
    //Line/path connecting
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("class", "line")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(d => (x(+d["Years"]) + 10))
        .y(d => (y(+d["AQI"])))
        )

    //Data Points plotting
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("fill", "red")
        .attr("cx", d => (x(+d["Years"]) + 10))
        .attr("cy", d => (y(+d["AQI"])))
        .attr("r", 6)
        .style("stroke", "black")
        .append("title")
        .text(d => ("AQI: " + (+d["AQI"]) + " Year: " + (d["Years"])));

    //X Axis Label
    svg.append("text")
      .attr("transform", "translate(" + (w/2) + " ," + (h + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .style('stroke', "black")
      .text("Year");

    //Y Axis Label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (h / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style('stroke', "black")
        .text("Average Air Quality Index experienced by Humans");

  // Function to toggle visibility of dots
        function toggleDotsVisibility() {
          if (dotsVisible) {
              svg.selectAll(".dot").style("display", "none");
          } else {
              svg.selectAll(".dot").style("display", "block");
          }
          dotsVisible = !dotsVisible; // Toggle visibility state
      }

      //Event Listener for button click
      var button = document.createElement("button");
      button.textContent = "Dots Visibility";
      button.addEventListener("click", toggleDotsVisibility);
      document.getElementById("lineChart").appendChild(button);
  })