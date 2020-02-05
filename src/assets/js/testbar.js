var margin = {top: 20, right: 30, bottom: 40, left: 260};
var width = 650 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;
const percentFormat = d3.format('.0%');
var leftPadding = 5;
var colorScale = d3.scaleOrdinal(d3["schemeCategory20"]);


const delay = function(d, i) {
    return i * 40;
};

function sortData(data) {
    return data.sort((a, b) => b.value - a.value);
}

function removeGeoAreasWithNoData(data) {
    return data.filter(d => d.value);
}

function prepareData(data) {
    return data.reduce((accumulator, d) => {
        Object.keys(d).forEach((k) => {
        if (!Number.isInteger(+k)) { return; }
        let value;
        if (d[+k] === '..') {
            value = 0;
        } else {
            value = +d[+k] / 100;
        }
        const newEntry = {
            value,
            geoCode: d.CountryCode,
            geoName: d.Country,
        };
        if (accumulator[+k]) {
            accumulator[+k].push(newEntry);
        } else {
            accumulator[+k] = [newEntry];
        }
        });
        return accumulator;
    }, {});
}

function xAccessor(d) {
    return d.value;
}

function yAccessor(d) {
    return d.geoName;
}

var xScale = d3.scaleLinear()
    .range([0, width])
    .domain([0, 1]);

var yScale = d3.scaleBand()
    .rangeRound([0, height], 0.1)
    .padding(0.1);

function drawXAxis(el) {
    el.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', `translate(${leftPadding},${height})`)
        .call(d3.axisBottom(xScale).tickFormat(percentFormat));
}

function drawYAxis(el, data, t) {
    let axis = el.select('.axis--y');
    if (axis.empty()) {
        axis = el.append('g')
        .attr('class', 'axis axis--y');
}

axis.transition(t)
    .call(d3.axisLeft(yScale))
    .selectAll('g')
    .delay(delay);
}

function drawBars(el, data, t) {
let barsG = el.select('.bars-g');
if (barsG.empty()) {
    barsG = el.append('g')
    .attr('class', 'bars-g');
}

var bars = barsG
    .selectAll('.bar')
    .data(data, yAccessor)

bars.exit()
    .remove();
bars.enter()
    .append('rect')
    .attr('class', d => d.geoCode === 'WLD' ? 'bar wld' : 'bar')
    .attr('x', leftPadding)
    .merge(bars).transition(t)
    .attr('y', d => yScale(yAccessor(d)))
    .attr('width', d => xScale(xAccessor(d)))
    .attr('height', yScale.bandwidth())
    .style('fill', function(d, i) {
        return colorScale(d.geoCode); })
    .delay(delay);
}

var svg = d3.select('.chart').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

fetch('https://gist.githubusercontent.com/deciob/ffd5c65629e43449246cb80a0af280c7/raw/cddc89a14d414f617e0703bbc1b768ec4b7bc2d4/data.csv')
.then((res) => res.text())
.then((res) => {
    const data = prepareData(d3.csvParse(res));
    const years = Object.keys(data).map(d => +d);
    const lastYear = years[years.length - 1];
    let startYear = years[0];
    let selectedData = removeGeoAreasWithNoData(sortData(data[startYear]));
    let geoAreas = selectedData.map(yAccessor);

    yScale.domain(geoAreas);
    drawXAxis(svg, selectedData);
    drawYAxis(svg, selectedData);
    drawBars(svg, selectedData);

    d3.select("#year").selectAll("option")
		.data(years)
	    .enter().append("option")
        .attr("value", function(d){
            return d;
        })
        .text(function(d){
            return d;
        });
    
    d3.select("#year").on("change", function(){
        const t = d3.transition().duration(400);

        var year = $(this).val();

        selectedData = removeGeoAreasWithNoData(sortData(data[year]));

        d3.select('.year').text(year);

        yScale.domain(selectedData.map(yAccessor));
        drawYAxis(svg, selectedData, t);
        drawBars(svg, selectedData, t);
    });
});