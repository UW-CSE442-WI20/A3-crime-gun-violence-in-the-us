'use strict';

var rec = d3.select(".myRec")
  .append('rect')
  .attr('width', 20)
  .attr('height', 20)
  .attr('fill', 'blue')

const margin = {top: 20, right: 30, bottom: 40, left: 260};
const width = 960 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;
const percentFormat = d3.format('.0%');
const leftPadding = 5;

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

const xScale = d3.scaleLinear()
    .range([0, width])
    .domain([0, 1]);

const yScale = d3.scaleBand()
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

const bars = barsG
    .selectAll('.bar')
    .data(data, yAccessor);
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
    .delay(delay);
}

const svg = d3.select('.chart').append('svg')
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

    d3.select('.year').text(startYear);

    yScale.domain(geoAreas);
    drawXAxis(svg, selectedData);
    drawYAxis(svg, selectedData);
    drawBars(svg, selectedData);

    const interval = d3.interval(() => {
    const t = d3.transition().duration(400);

    startYear += 1;
    selectedData = removeGeoAreasWithNoData(sortData(data[startYear]));

    d3.select('.year').text(startYear);

    yScale.domain(selectedData.map(yAccessor));
    drawYAxis(svg, selectedData, t);
    drawBars(svg, selectedData, t);

    if (startYear === lastYear) {
        interval.stop();
    }
    }, 1000);
});