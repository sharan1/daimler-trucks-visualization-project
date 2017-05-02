function dashboard(id, fData) {
    var barColor = 'steelblue';

    function segColor(c) {
        return {
            cries_on_line: "#807dba",
            paint: "#e08214",
            item_short: "#41ab5d",
            engineering_call: ""
        }[c];
    }

    // compute total for each state.
    fData.forEach(function(d) {
        d.total = d.freq;
    });



    // function to handle pieChart.
    function pieChart(pD) {
        var pC = {},
            pieDim = {
                w: 250,
                h: 250
            };
        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;

        // create svg for pie chart.
        var piesvg = d3.select(id).append("svg")
            .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
            .attr("transform", "translate(" + pieDim.w / 2 + "," + pieDim.h / 2 + ")");

        // create function to draw the arcs of the pie slices.
        var arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(30);

        // create a function to compute the pie slice angles.
        var pie = d3.layout.pie().sort(null).value(function(d) {
            return d.freq;
        });

        // Draw the pie slices.
        piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
            .each(function(d) {
                this._current = d;
            })
            .style("fill", function(d) {
                return segColor(d.data.type);
            });

        // create function to update pie-chart. This will be used by histogram.
        pC.update = function(nD) {
                piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                    .attrTween("d", arcTween);
            }
            // Animating the pie-slice requiring a custom function which specifies
            // how the intermediate paths should be drawn.
        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) {
                return arc(i(t));
            };
        }
        return pC;
    }

    // function to handle legend.
    function legend(lD) {
        var leg = {};

        // create table for legend.
        var legend = d3.select(id).append("table").attr('class', 'legend');

        // create one row per segment.
        var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");

        // create the first column for each segment.
        tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
            .attr("width", '16').attr("height", '16')
            .attr("fill", function(d) {
                return segColor(d.type);
            });

        // create the second column for each segment.
        tr.append("td").text(function(d) {
            return d.type;
        });

        // create the third column for each segment.
        tr.append("td").attr("class", 'legendFreq')
            .text(function(d) {
                return d.freq;
            });

        //create the fourth column for each segment.
        tr.append("td").attr("class", 'legendPerc')
            .text(function(d) {
                return getLegend(d, lD);
            });

        // Utility function to be used to update the legend.
        leg.update = function(nD) {
            // update the data attached to the row elements.
            var l = legend.select("tbody").selectAll("tr").data(nD);

            // update the frequencies.
            l.select(".legendFreq").text(function(d) {
                return d3.format(",")(d.freq);
            });

            // update the percentage column.
            l.select(".legendPerc").text(function(d) {
                return getLegend(d, nD);
            });
        }

        function getLegend(d, aD) { // Utility function to compute percentage.
            return d3.format("%")(d.freq / d3.sum(aD.map(function(v) {
                return v.freq;
            })));
        }

        return leg;
    }

    // calculate total frequency by segment for all state.
    //  var tF = ['low','mid','high'].map(function(d){ 
    //     return {type:d, freq: d3.sum(fData.map(function(t){ return t.freq[d];}))}; 
    // });    
    var tF1 = fData.map(function(d) {
        return {
            type: d.name,
            freq: d.freq
        };




    });

    // calculate total frequency by state for all segment.
    var sF = fData.map(function(d) {
        return [d.State, d.total];
    });

    //  var hG = histoGram(sF), // create the histogram.
    var pC = pieChart(tF1), // create the pie-chart.
        leg = legend(tF1); // create the legend.
}

var cries_var = 0;
var paint_var = 0;
var item_short_var = 0;
var engi_call = 0;

d3.csv("data/cries_on_line.csv", function(error1, data1) {
    d3.csv("data/paint.csv", function(error2, data2) {
        d3.csv("data/item_short.csv", function(error3, data3) {
            d3.csv("data/engineering_call.csv", function(error4, data4) {

                data1.forEach(function(d1) {
                    cries_var++;
                });
                data2.forEach(function(d2) {
                    if (d2.REPAINT_REQ_INDC == "Y")
                        paint_var++;
                });
                data3.forEach(function(d3) {
                    item_short_var++;
                });
                data4.forEach(function(d3) {
                    if (!d3.SC_STATUS_CD.localeCompare("Resolved"))
                        engi_call++;
                });


                //engi_call++;
                //console.log(cries_var);
                var issuesInfo = [{
                    name: "cries_on_line",
                    freq: cries_var
                }, {
                    name: "paint",
                    freq: paint_var
                }, {
                    name: "item_short",
                    freq: item_short_var
                }, {
                    name: "engineering_call",
                    freq: engi_call
                }];

                dashboard('#visualization-3', issuesInfo);

            });

        });




    });
});