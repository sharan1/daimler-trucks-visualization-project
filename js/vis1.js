chart("data/cries_on_line.csv", "orange");

var issuesInfo = [{
    name: "cries_on_line",
    freq: 25
}, {
    name: "paint",
    freq: 30
}, {
    name: "item_short",
    freq: 65
}];


var datearray = [];
var colorrange = [];


function chart(csvpath, color) {

    if (color == "blue") {
        colorrange = ["#045A8D", "#2B8CBE", "#74A9CF", "#A6BDDB", "#D0D1E6", "#F1EEF6"];
    } else if (color == "pink") {
        colorrange = ["#980043", "#DD1C77", "#DF65B0", "#C994C7", "#D4B9DA", "#F1EEF6"];
    } else if (color == "orange") {
        colorrange = ["#B30000", "#E34A33", "#FC8D59", "#FDBB84", "#FDD49E", "#FEF0D9"];
    }
    strokecolor = colorrange[0];

    var format1 = d3.time.format("%d-%b-%y");

    var margin = {
            top: 10,
            right: 20,
            bottom: 15,
            left: 10
        },
        width = 550 - margin.left - margin.right,
        height = 255 - margin.top - margin.bottom;

    var tooltip = d3.select("visualization-1")
        .append("div")
        .attr("class", "remove")
        .style("position", "absolute")
        .style("z-index", "20")
        .style("visibility", "hidden")
        .style("top", "30px")
        .style("left", "55px");

    var x1 = d3.time.scale()
        .range([0, width]);

    var y1 = d3.scale.linear()
        .range([height - 10, 0]);

    var z1 = d3.scale.ordinal()
        .range(colorrange);

    var xAxis1 = d3.svg.axis()
        .scale(x1)
        .orient("bottom");

    var yAxis1 = d3.svg.axis()
        .scale(y1);

    var yAxisr = d3.svg.axis()
        .scale(y1);

    var stack1 = d3.layout.stack()
        .offset("silhouette")
        .values(function(d) {
            return d.values;
        })
        .x(function(d) {
            return d.TS_LOAD;
        })
        .y(function(d) {
            return d.value;
        });

    var nest1 = d3.nest()
        .key(function(d) {

            if (d.FOUND_INSP_TEAM == 1)

                return "CIW";
            if (d.FOUND_INSP_TEAM == 2)

                return "FCB";
            if (d.FOUND_INSP_TEAM == 3)

                return "PNT";
            if (d.FOUND_INSP_TEAM == 4)

                return "PCH";
            if (d.FOUND_INSP_TEAM == 5)

                return "FCH";
            if (d.FOUND_INSP_TEAM == 6)

                return "OFF";


            //return d.FOUND_INSP_TEAM;




            ;
        });


    //return d.FOUND_INSP_TEAM; });

    var area1 = d3.svg.area()
        .interpolate("cardinal")
        .x(function(d) {
            return x1(d.TS_LOAD) + 20;
        })
        .y0(function(d) {
            return y1(d.y0);
        })
        .y1(function(d) {
            return y1(d.y0 + d.y);
        });

    var svg1 = d3.select("#visualization-1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var graph1 = d3.csv(csvpath, function(manual1) {
        //console.log("manual" + manual1[0].VEH_SER_NO);



        var dataGroup1 = d3.nest()
            .key(function(d) {
                return d.FOUND_INSP_TEAM[0];
            })
            .key(function(m) {
                return m.TS_LOAD.substring(0, 10);
            })
            .rollup(function(v) {
                return d3.sum(v, function(m) {
                    return 1;
                });
            })
            .entries(manual1);

        //console.log("temp_y" + JSON.stringify(dataGroup1) + "try_temp");


        var data1 = []
        dataGroup1.forEach(function(car) {
            //console.log("car key" + car.key);
            car.values.forEach(function(carYear) {
                // console.log("hii");
                // console.log("car key" + car.key);
                // console.log("car year value" + carYear.values);
                // console.log("car yearkey" + carYear.key);
                data1.push({
                    //console.log("hii");
                    //console.log("car yearkey"+carYear.key);
                    FOUND_INSP_TEAM: car.key,
                    value: carYear.values,
                    TS_LOAD: carYear.key,
                });
            });
        });


        //console.log("flatCars" + data);




        data1.forEach(function(d) {
            // console.log("data fields" + d.value);
            // console.log("data fields" + d.TS_LOAD);


            d.TS_LOAD = format1.parse(d.TS_LOAD);

            //console.log("format" + d.TS_LOAD);

            d.value = +d.value;
        });




        var layers1 = stack1(nest1.entries(data1));

        x1.domain(d3.extent(data1, function(d) {
            //console.log(d.TS_LOAD);
            return d.TS_LOAD;
        }));
        y1.domain([0, d3.max(data1, function(d) {
            return d.y0 + d.y;
        })]);

        svg1.selectAll(".layer")
            .data(layers1)
            .enter().append("path")
            .attr("class", "layer")
            .attr("d", function(d) {
                //console.log("area" + area(d.values));
                return area1(d.values);
            })
            .style("fill", function(d, i) {
                return z1(i);
            });


        svg1.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + 2.5 * margin.left + "," + (height - margin.bottom / 2) + ")")
            .call(xAxis1);

        svg1.append("text")
            .attr("transform", "translate(" + (width - 4 * margin.left) + "," + (height - margin.bottom) + ")") // text is drawn off the screen top left, move down and out and rotate
            .attr("font-weight", "bold")
            .attr("font-size", 10)
            .text("Date/Time");

        svg1.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (width + margin.right / 1.5) + ", 0)")
            .call(yAxisr.orient("right"));

        svg1.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + 2.25 * margin.left + ", 0)")
            .call(yAxis1.orient("left"));

        svg1.append("text")
            .attr("transform", "translate(" + 3.2 * margin.left + "," + (height / 4 + 18) + ") rotate(-90)") // text is drawn off the screen top left, move down and out and rotate
            .attr("font-weight", "bold")
            .attr("font-size", 10)
            .text("No. of Vehicles");

        svg1.selectAll(".layer")
            .attr("opacity", 1);

        // .on("mousemove", function(d, i) {
        //         mousex = d3.mouse(this);
        //         mousex = mousex[0];
        //         var invertedx = x1.invert(mousex);
        //         invertedx = invertedx.getMonth() + invertedx.getDate();
        //         var selected = (d.values);
        //         for (var k = 0; k < selected.length; k++) {
        //             datearray[k] = selected[k].TS_LOAD;
        //             datearray[k] = datearray[k].getMonth() + datearray[k].getDate();
        //         }

        //         mousedate = datearray.indexOf(invertedx);
        //         pro = d.values[mousedate].value;

        //         d3.select(this)
        //             .classed("hover", true)
        //             .attr("stroke", strokecolor)
        //             .attr("stroke-width", "0.5px"),
        //             tooltip.html("<p>" + d.key + "<br>" + pro + "</p>").style("visibility", "visible");

        //     })
        //     .on("mouseout", function(d, i) {
        //         svg1.selectAll(".layer")
        //             .transition()
        //             .duration(250)
        //             .attr("opacity", "1");
        //         d3.select(this)
        //             .classed("hover", false)
        //             .attr("stroke-width", "0px"), tooltip.html("<p>" + d.key + "<br>" + pro + "</p>").style("visibility", "hidden");
        //     });

        var vertical = d3.select("#visualization-1")
            .append("div")
            .attr("class", "remove")
            .style("position", "absolute")
            .style("z-index", "19")
            .style("width", "1px")
            .style("height", "380px")
            .style("top", "10px")
            .style("bottom", "30px")
            .style("left", "0px")
            .style("background", "#fff");

        d3.select("#visualization-1")
            .on("mousemove", function() {
                mousex = d3.mouse(this);
                mousex = mousex[0] + 5;
                vertical.style("left", mousex + "px")
            })
            .on("mouseover", function() {
                mousex = d3.mouse(this);
                mousex = mousex[0] + 5;
                vertical.style("left", mousex + "px")
            });
    });
}