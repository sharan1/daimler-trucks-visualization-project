var causes2 = ["SYS_DESC"];
var plots2 = ["paint_inspection", "stvms_tracking_top_station", "assembly_line_tracker", "cab_call_scan", "cab_conveyer", "omt_offline_tracking", "u_bolt", "hood_conveyor", "stvms_tracking_chassis_start", "cab_conveyor_monorail", "cab_white_conveyer"];
var parseDate2 = d3.time.format("%d-%b-%y").parse;

var margin = {
        top: 10,
        right: 20,
        bottom: 15,
        left: 10
    },
    width = 570 - margin.left - margin.right,
    height = 275 - margin.top - margin.bottom;

var x2 = d3.scale.ordinal()
    .rangeRoundBands([0, width]);

var y2 = d3.scale.linear()
    .rangeRound([height, 0]);
var z2 = d3.scale.category10().range(["#ADD8E6", "#800080", "#A52A2A", "#FFA500", "#C0C0C0", "#808080", "#808000", "#FFFF00", "#FF00FF", "#00FF00", "#FF0000"]);

var xAxis2 = d3.svg.axis()
    .scale(x2)
    .orient("bottom")
    .tickFormat(function(d) {
        var d1 = new Date(d);
        return d3.time.format("%d-%m-%Y")(d1)
    });

var yAxis2 = d3.svg.axis()
    .scale(y2)
    .innerTickSize([-5])
    .orient("left");

var section2 = document.getElementById("visualization-4");
var svg2 = d3.select(section2).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


function getCount2(data2, str2) {
    var count2 = 0;
    data2.forEach(function(element) {
        if (element.SYS_DESC == str2)
            count2 += 1;
    });
    return count2;
}

d3.csv("data/location.csv", type2, function(error2, data2) {
    //console.log(data);
    if (error2) throw error2;
    var dataGroup2 = d3.nest()
        .key(function(d) {
            return d.TS_LOAD;
        })
        .rollup(function(v) {
            return {
                paint_inspection: getCount2(v, "Paint Inspection"),
                stvms_tracking_top_station: getCount2(v, "STVMS Tracking Top Station"),
                assembly_line_tracker: getCount2(v, "Assembly Line Tracker"),
                cab_call_scan: getCount2(v, "Cab call scan"),
                cab_conveyer: getCount2(v, "Cab Conveyer"),
                omt_offline_tracking: getCount2(v, "OMT Offline Tracking"),
                u_bolt: getCount2(v, "U-BOLT"),
                hood_conveyor: getCount2(v, "Hood Conveyor"),
                stvms_tracking_chassis_start: getCount2(v, "STVMS Tracking Chassis Start"),
                cab_conveyor_monorail: getCount2(v, "Cab Conveyor / Monorail"),
                cab_white_conveyer: getCount2(v, "Cab in white conveyer"),

            }
        })
        .entries(data2);

    //            console.log(JSON.stringify(dataGroup));
    var layers2 = d3.layout.stack()(plots2.map(function(c) {
        return dataGroup2.map(function(d) {
            switch (c) {
                case "paint_inspection":
                    return {
                        x: d.key,
                        y: d.values.paint_inspection,
                    };
                    break;
                case "stvms_tracking_top_station":
                    return {
                        x: d.key,
                        y: d.values.stvms_tracking_top_station,
                    };
                    break;
                case "assembly_line_tracker":
                    return {
                        x: d.key,
                        y: d.values.assembly_line_tracker,
                    };
                    break;
                case "cab_call_scan":
                    return {
                        x: d.key,
                        y: d.values.cab_call_scan,
                    };
                    break;
                case "cab_conveyer":
                    return {
                        x: d.key,
                        y: d.values.cab_conveyer,
                    };
                    break;
                case "omt_offline_tracking":
                    return {
                        x: d.key,
                        y: d.values.omt_offline_tracking,
                    };
                    break;
                case "u_bolt":
                    return {
                        x: d.key,
                        y: d.values.u_bolt,
                    };
                    break;
                case "hood_conveyor":
                    return {
                        x: d.key,
                        y: d.values.hood_conveyor,
                    };
                    break;
                case "stvms_tracking_chassis_start":
                    return {
                        x: d.key,
                        y: d.values.stvms_tracking_chassis_start,
                    };
                    break;
                case "cab_conveyor_monorail":
                    return {
                        x: d.key,
                        y: d.values.cab_conveyor_monorail,
                    };
                    break;
                case "cab_white_conveyer":
                    return {
                        x: d.key,
                        y: d.values.cab_white_conveyer,
                    };
                    break;

            }
        });
    }));
    //console.log(layers);
    x2.domain(layers2[0].map(function(d) {
        return d.x;
    }));
    y2.domain([0, d3.max(layers2[layers2.length - 1], function(d) {
        return d.y0 + d.y;
    })]).nice();
    var layer2 = svg2.selectAll(".layer")
        .data(layers2)
        .enter().append("g")
        .attr("class", "layer")
        .style("fill", function(d, i) {
            return z2(i);
        });

    layer2.selectAll("rect")
        .data(function(d) {
            return d;
        })
        .enter().append("rect")
        .attr("x", function(d) {
            return x2(d.x) + 55;
        })
        .attr("y", function(d) {
            return y2(d.y + d.y0);
        })
        .attr("height", function(d) {
            return y2(d.y0) - y2(d.y + d.y0);
        })
        .attr("width", 20);

    svg2.append("g")
        .attr("class", "axis axis--y")
        .attr("max-width", "100%")
        .attr("transform", "translate(" + margin.left + ", 0)")
        .call(yAxis2);

    svg2.append("text")
        .attr("transform", "translate(" + 3 * margin.left + "," + (height / 4) + ") rotate(-90)") // text is drawn off the screen top left, move down and out and rotate
        .attr("font-weight", "bold")
        .attr("font-size", 12)
        .text("No. of Issues");

    svg2.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(" + margin.left + "," + (height - 1) + ")")
        .call(xAxis2);

    svg2.append("text")
        .attr("transform", "translate(" + (width - 3 * margin.top) + "," + (height - margin.bottom / 2) + ")")
        .attr("font-weight", "bold")
        .attr("font-size", 8)
        .text("Timestamp");
});

function type2(d) {
    d.TS_LOAD = parseDate2(d.TS_LOAD.substring(0, 10));
    return d;
}