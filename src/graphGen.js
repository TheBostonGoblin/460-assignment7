const rowConverter = (row) => {
    row = {
        rainfall: parseFloat(row.Rainfall),
        date: `${row.Month}-${row.Year}`,
    }
    return { ...row };
};

const dataset = await d3.csv("./data/pakistanRainfall.csv", rowConverter);
// console.log(dataset);
const filterData = dataset.filter(data => data.date.includes('1901'));
console.log(filterData);

// const parseTest = d3.timeParse("%M-%Y");
// const formatTest = d3.timeFormat("%M-%Y");

// console.log(parseTest);
// console.log(formatTest);

const margin = {
    left: 30,
    right: 80,
    top: 40,
    bottom: 40
};

const w = 800;
const h = 800;

const svg = d3.select(".graph1")
    .append('svg')
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom);

const yLabel = svg.append("text")
    .text("Rainfall")
    .attr("font-size", "19px")
    .attr("transform", `translate(20,${h / 2}) rotate(-90)`);

const xLabel = svg.append("text")
    .text("Date")
    .attr("font-size", "19px")
    .attr("transform", `translate(${w / 2},${h + margin.bottom})`);

const title = svg.append("text")
    .text("Rainfall in Pakastain in the year 1901")
    .attr("font-size", "19px")
    .attr("transform", `translate(${w / 2 - 50},${20})`);




const yScale = d3.scaleLinear()
    .domain([0, d3.max(filterData, d => d.rainfall)])
    .range([h - margin.bottom, margin.top]);

// create a scale for x-axis: use time for the date data variable
// set the end to be the day after the last date, which is hard
// coded here, so that the far right end of the scale is going to
// allow the last day within the data set to show within the range
const xScale = d3.scaleBand()
    .domain(filterData.map((d) => d.date))
    .rangeRound([margin.left + margin.right, w]);

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

let xAxisGroup = svg.append('g')
    .attr('class', 'axisX')
    .attr('transform', `translate(${-margin.left}, ${h - margin.bottom})`)
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-1em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

let yAxisGroup = svg.append('g')
    .attr('class', 'axisY')
    .attr('transform', `translate(${margin.right},${0})`)
    .call(yAxis)
    .selectAll("text")
    .text(function (d) { return d + " mm" });

const dangerArea = d3.area()
    .defined(function (d) { return d.rainfall <= 35 })
    .x(function (d) { return xScale(d.date); })
    .y0(function () { return yScale.range()[0]; })
    .y1(function (d) { return yScale(d.rainfall) });


const goodArea = d3.area()
    .defined(function (d) { return d.rainfall >= 0; })
    .x(function (d) { return xScale(d.date); })
    .y0(function () { return yScale.range()[0]; })
    .y1(function (d) { return yScale(d.rainfall) });


svg.append("path")
    .datum(filterData)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
        .x(function (d) { return xScale(d.date) })
        .y(function (d) { return yScale(d.rainfall) })
    )

svg.append("path")
    .datum(filterData)
    .attr("class", "area")
    .attr("fill", "steelblue")
    .attr("d", goodArea)

svg.append("path")
    .datum(filterData)
    .attr("class", "area")
    .attr("fill", "red")
    .attr("d", dangerArea)




svg.append("line")
    .attr('x1', margin.right)
    .attr('y1', function () { return yScale(35) })
    .attr('x2', w)
    .attr('y2', function () { return yScale(35) })
    .style('stroke', 'red')
    .style('stroke-width', '2px')
    .style('stroke-dasharray', '5,3');

svg.append("text")
    .attr('x', margin.right + 55)
    .attr('y', function () { return yScale(35) - 5 })
    .text("Rainfall Below 35mm")


//"id","date_collected","retailer_type","retailer_detail","food_type","food_detail","label_type","label_language","label_date","approximate_dollar_value","image_id","collection_lat","collection_long","label_explanation"


const rowConverter2 = (row) => {
    row = {
        id: row.id,
        date: row.date_collected,
        retailType: row.retailer_type,
        foodType: row.food_type,
        foodDetail: row.food_detail,
        labelType: row.label_type,
        labelLang: row.label_language,
        labelDate: row.label_date,
        value: row.approximate_dollar_value,
        imgID: row.image_id,
        latitudeCollected: row.collection_lat,
        longitudeCollected: row.collection_long,
        labelExplained: row.label_explanation
    }
    return { ...row };
};

const dataset2 = await d3.csv("./data/brooklyn.csv", rowConverter2);

const margin2 = {
    left: 30,
    right: 80,
    top: 40,
    bottom: 40
};

const w2 = 800;
const h2 = 800;

let counter = dataset2.filter(data => data.retailType.includes("counter service"));
let healthFoodGrocer = dataset2.filter(data => data.retailType.includes("health food grocer"));
let drugstore = dataset2.filter(data => data.retailType.includes("drugstore"));
let coffeeshop = dataset2.filter(data => data.retailType.includes("coffeeshop"));
let bakeryDeli = dataset2.filter(data => data.retailType.includes("bakery/deli"));
let chainGrocer = dataset2.filter(data => data.retailType.includes("chain grocer"));

const total = dataset2.length;
const counterNum = counter.length;
const healthNum = healthFoodGrocer.length;
const drugNum = drugstore.length;
const coffeeNum = coffeeshop.length;
const bakeryNum = bakeryDeli.length;
const chainNum = chainGrocer.length;

console.log(total);
console.log(counterNum);

const pieData = [
    { name: "counterService", value: counterNum },
    { name: "healthFoodGroc", value: healthNum },
    { name: "drugStore", value: drugNum },
    { name: "coffeeShop", value: coffeeNum },
    { name: "BakeryDeli", value: bakeryNum },
    { name: "chainGroc", value: chainNum },
]

const pieColors = d3.scaleOrdinal()
    .domain(dataset2)
    .range([
        "#da908b",
        "#87a9cc",
        "#d3dc39",
        "#9f93d9",
        "#16cd0c",
        "#eb77c5"
    ]);

const svg2 = d3.select(".graph2")
    .append("svg")
    .attr("width", w2)
    .attr("height", h2)


const pie = d3.pie().value(function(d){
    return d.value;
});

const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(350);

    console.log(pieData);

const arcs = svg2
    .selectAll('arc')
    .data(pie(pieData))
    .enter()
    .append('g')
    .attr('class', "arc")
    .attr("transform",`translate(${w2/2},${h2/2})`);


    arcs.append("path")
    .attr("fill",function(_,i){
        return pieColors(i);
    })
    .attr("d",arc);

    svg2
    .append("text")
    .text("hello")
    d3.selectAll("arcs").attr("transform","translate(140,140)");


    arcs.append("text")
           .attr("transform", function(d) { 
                    return "translate(" + arc.centroid(d) +") rotate("+((d.startAngle/2 + d.endAngle/2) * 180/Math.PI -90) +")"; 
            })
           .text(function(d) { return d.data.name+ ` ${Math.round(d.data.value/total*100)}%`; })
           .style("font-family", "arial")
           .style("font-size", 20)
           .raise();
           //.attr("transform","rotate(90)")
    //.attr('fill', function (d) { return (pieColors(d.data.key)) });

    //d3.selectAll(".arc text").attr("transform","rotate()");

    const title2 = svg2.append("text").text("What Instatutions Produces The Most Food Waste In Brookyln").attr("x",w2/4).attr("y",20)

