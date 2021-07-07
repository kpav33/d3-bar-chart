let url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let req = new XMLHttpRequest();

let data;
let values;

let heightScale;
let xScale;
let xAxisScale;
let yAxisScale;

let width = 800;
let height = 600;
let padding = 40;

let svg = d3.select("svg");

function drawCanvas() {
  svg.attr("width", width).attr("height", height);
}

function generateScales() {
  // Set scales
  heightScale = d3
    .scaleLinear()
    .domain([0, d3.max(values, (d) => d[1])])
    .range([0, height - 2 * padding]);

  xScale = d3
    .scaleLinear()
    .domain([0, values.length - 1])
    .range([padding, width - padding]);

  let datesArray = values.map((d) => {
    return new Date(d[0]);
  });

  // console.log(datesArray);

  // Test if you could just use [0, datesArray.length - 1] with the domain, since the datesArray is already sorted from oldest to newest
  xAxisScale = d3
    .scaleTime()
    .domain([d3.min(datesArray), d3.max(datesArray)])
    .range([padding, width - padding]);

  yAxisScale = d3
    .scaleLinear()
    .domain([0, d3.max(values, (d) => d[1])])
    .range([height - padding, padding]);
}

function drawBars() {
  let tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("visibility", "hidden")
    .style("width", "auto")
    .style("height", "auto");

  // Draw bars
  svg
    .selectAll("rect")
    .data(values)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .attr("width", (width - 2 * padding) / values.length)
    .attr("height", (d) => heightScale(d[1]))
    .attr("x", (d, i) => xScale(i))
    .attr("y", (d) => height - padding - heightScale(d[1]))
    .on("mouseover", (d) => {
      tooltip.transition().style("visibility", "visible");
      tooltip.text(d[0]).attr("data-date", d[0]);
    })
    .on("mouseout", (d) => tooltip.transition().style("visibility", "hidden"));
}

function generateAxes() {
  // Generate x and y axes
  let xAxis = d3.axisBottom(xAxisScale);

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`);

  let yAxis = d3.axisLeft(yAxisScale);

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`);
}

req.open("GET", url, true);
req.onload = () => {
  data = JSON.parse(req.responseText);
  values = data.data;
  console.log(values);
  drawCanvas();
  generateScales();
  drawBars();
  generateAxes();
};
req.send();
