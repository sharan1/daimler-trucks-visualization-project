var engineering_call_data;
var resolvedData = [];
var openData = [];
var verificationData = [];

var svg0 = d3.select("#visualization-2");
var width0 = 300,
    height0 = 250;

var radius0 = Math.min(width0, height0) / 2,
    g0 = svg0.append("g").attr("transform", "translate(" + width0 / 2 + "," + height0 / 2 + ")");

var color0 = d3.scaleOrdinal(["red", "green", "yellow"]);
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([5, 140])
    .html(function(d) {
        return "<span style='color:black'>" + d.data.Status + "</span></br> <span style='color:black'>" + d.data.percentage + "%" + "</span>";
    });


svg0.call(tip);

var pie0 = d3.pie()
    .sort(null)
    .value(function(d) { return d.count; });

var path0 = d3.arc()
    .outerRadius(radius0 - 5)
    .innerRadius(0);

var label0 = d3.arc()
    .outerRadius(radius0 - 20)
    .innerRadius(radius0 - 20);

d3.csv("data/engineering_call.csv", function(data0) {
    engineering_call_data = data0;
    resolvedData = engineering_call_data.filter(function(o) { return o.SC_STATUS_CD === 'Resolved' });
    openData = engineering_call_data.filter(function(o) { return o.SC_STATUS_CD === 'Open' });
    verificationData = engineering_call_data.filter(function(o) { return o.SC_STATUS_CD === 'Verification' });

    var finalData = [{
            "Status": "Open",
            "count": openData.length,
            "percentage": ((openData.length / engineering_call_data.length) * 100).toFixed(2)
        },
        {
            "Status": "Resolved",
            "count": resolvedData.length,
            "percentage": ((resolvedData.length / engineering_call_data.length) * 100).toFixed(2)
        },
        {
            "Status": "Verification",
            "count": verificationData.length,
            "percentage": ((verificationData.length / engineering_call_data.length) * 100).toFixed(2)
        }
    ];

    console.log(finalData);

    var arc0 = g0.selectAll(".arc")
        .data(pie0(finalData))
        .enter().append("g")
        .attr("class", "arc");

    arc0.append("path")
        .attr("d", path0)
        .attr("fill", function(d) { return color0(d.data.count); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

});