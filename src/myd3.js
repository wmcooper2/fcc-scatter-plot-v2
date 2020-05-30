import * as d3 from "d3";
const reqUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

//d3.json is easier than the XML way.
d3.json(reqUrl, (data) => {  
  
  //convenience
  const yearFromData = d => new Date(d.Year,0,0,0,0,0,0);
  const secondsFromData = d => new Date(0,0,0,0,0,d.Seconds,0);
  const chartW = 700;
  const chartH = 500;
  const chartPad = 30;
  
  //convert data to Date objects
  const years = data.map(d => yearFromData(d));
  const seconds = data.map(d => secondsFromData(d));
  
  //data examples
  // console.log(data[0]);

  //min max
  const xScaleMin = d3.min(years);
  const xScaleMax = d3.max(years);
  const yScaleMin = d3.min(seconds);
  const yScaleMax = d3.max(seconds);

  //scales
  const xScale = d3.scaleTime()
    .domain([xScaleMin, xScaleMax])
    .range([chartPad, chartW-2*chartPad]);
  const yScale = d3.scaleLinear()
    .domain([yScaleMax, yScaleMin])
    .range([chartPad, chartH-(2*chartPad)]);
  
  //axes
  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat("%Y"));
  const yAxis = d3.axisLeft(yScale)
    .tickFormat(d3.timeFormat("%M:%S"));
  
  //tooltip
  const toolH = 100;
  const toolW = 100;
  const tooltip = d3.select("#graph").append("div")
    .attr("width", "20px")
    .attr("height", "20px")
    .attr("fill", "green")
    .attr("opacity", 0);
  
  //chart area
  const chart = d3.select("#graph")
    .append("svg")
    .attr("width", chartW)
    .attr("height", chartH);
  
  //legend
  const legendX = chartW/2-80;
  const legendY = chartH-10;
  const legendW = 180;
  const legendH = 40;
  const legCircleX = 150;
  const legCircleY = 20;
  const legTextX = 20;
  const legTextY = 20;
  
  const legend = chart
    .append("svg")
    .attr("id", "legend")
    .attr("x", legendX + "px")
    .attr("y", legendY + "px")
    .attr("width", legendW + "px")
    .attr("height", legendH + "px");

  legend.append("circle")
    .attr("cx", legCircleX+"px")
    .attr("cy", legCircleY+"px")
    .attr("r", 6 + "px")
    .style("fill", "blue");
  
  legend.append("text")
    .text("Doping Occurrences")
    .attr("x", legTextX+"px")
    .attr("y", legTextY+"px")
    .attr("transform", "translate(-20,5)");
  
  //apply axes to chart
  chart.append("g")
    .attr("transform", "translate(0, "+(chartH-chartPad)+")")
    .attr("id", "x-axis")
    .call(xAxis);
  chart.append("g")
    .attr("id", "y-axis")
    .call(yAxis);
  
  //apply data to chart
  chart.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", d => yearFromData(d))
    .attr("data-yvalue", d => secondsFromData(d))
    .attr("cx", d => xScale(yearFromData(d)))
    .attr("cy", d => yScale(secondsFromData(d)))
    .attr("r", 6 + "px")
    .attr("fill", "blue")
    .on("mouseover", d => {
      tooltip.transition()
        .duration(0)
        .attr("data-year", yearFromData(d))
        .attr("id", "tooltip")
        .style("opacity", 1)
        .style("left", d3.event.pageX + 20 + "px")
        .style("top", d3.event.pageY - (toolH/2) + "px")
        .style("width", toolW+"px")
        .style("height", toolH+"px");
        tooltip.html(
          d.Name+"<br />"+
          "Place: "+d.Place+"<br />"+
          "Time: "+d.Time+"<br />"+
          "Year: "+d.Year+"<br />"); 
    })
    .on("mouseout", d => {
      tooltip.transition()
        .duration(0)
        .style("opacity", 0)
        .style("left", "10000px")
        .style("top", "0px")
        .style("width", "0px")
        .style("height", "0px")
  });
});

