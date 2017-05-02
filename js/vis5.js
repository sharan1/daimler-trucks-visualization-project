var causes = ["REPAINT_REQ_INDC"];
var plots = ["yes", "no"];
var parseDate = d3.time.format("%d-%b-%y").parse;

var margin = {
        top: 10,
        right: 20,
        bottom: 15,
        left: 10
    },
    width = 570 - margin.left - margin.right,
    height = 275 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width]);

var y = d3.scale.linear()
    .rangeRound([height, 0]);
var z = d3.scale.category10().range(["#00ff00", "#ff0000"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(function(d) {
        var d1 = new Date(d);
        return d3.time.format("%d-%m-%Y")(d1)
    });

var yAxis = d3.svg.axis()
    .scale(y)
    .innerTickSize([-5])
    .orient("left");

var section = document.getElementById("visualization-5");
var svg = d3.select(section).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


function getCount(data, str) {
    var count = 0;
    data.forEach(function(element) {
        if (element.REPAINT_REQ_INDC == str)
            count += 1;
    });
    return count;
}

d3.csv("data/paint.csv", type, function(error, data) {
    //console.log(data);
    if (error) throw error;
    var dataGroup = d3.nest()
        .key(function(d) {
            return d.TS_LOAD;
        })
        .rollup(function(v) {
            return {
                no: getCount(v, 'N'),
                yes: getCount(v, 'Y')
            }
        })
        .entries(data);

    var layers = d3.layout.stack()(plots.map(function(c) {
        return dataGroup.map(function(d) {
            if (c == "no") {
                return {
                    x: d.key,
                    y: d.values.no,
                };
            } else {
                return {
                    x: d.key,
                    y: d.values.yes,
                };
            }
        });
    }));
    //console.log(layers);
    x.domain(layers[0].map(function(d) {
        return d.x;
    }));
    y.domain([0, d3.max(layers[layers.length - 1], function(d) {
        return d.y0 + d.y;
    })]).nice();
    var layer = svg.selectAll(".layer")
        .data(layers)
        .enter().append("g")
        .attr("class", "layer")
        .style("fill", function(d, i) {
            return z(i);
        });

    layer.selectAll("rect")
        .data(function(d) {
            return d;
        })
        .enter().append("rect")
        .attr("x", function(d) {
            return x(d.x) + 55;
        })
        .attr("y", function(d) {
            return y(d.y + d.y0);
        })
        .attr("height", function(d) {
            return y(d.y0) - y(d.y + d.y0);
        })
        .attr("width", 20);

    svg.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", "translate(" + margin.left + ", 0)")
        .call(yAxis);

    svg.append("text")
        .attr("transform", "translate(" + 3 * margin.left + "," + (height / 4) + ") rotate(-90)") // text is drawn off the screen top left, move down and out and rotate
        .attr("font-weight", "bold")
        .attr("font-size", 12)
        .text("Paint Issues");

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(" + margin.left + "," + (height - 1) + ")")
        .call(xAxis);

    svg.append("text")
        .attr("transform", "translate(" + (width - margin.top) + "," + (height - margin.bottom) + ")")
        .attr("font-weight", "bold")
        .attr("font-size", 12)
        .text("Date");
});

function type(d) {
    d.TS_LOAD = parseDate(d.TS_LOAD.substring(0, 10));
    return d;
}