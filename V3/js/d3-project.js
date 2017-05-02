var engineering_call_data;
var resolvedData = [];
var openData = [];
var verificationData = [];

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    radius = Math.min(width, height) / 2,
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var color = d3.scaleOrdinal(["red", "green", "yellow"]);
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([5, 180])
    .html(function(d) {
        return "<span style='color:black'>" + d.data.Status + "</span></br> <span style='color:black'>" + d.data.percentage + "%" + "</span>";
    });
svg.call(tip);
var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d.count; });

var path = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var label = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

d3.csv("data/engineering_call.csv", function(data) {
    engineering_call_data = data;
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

    var arc = g.selectAll(".arc")
        .data(pie(finalData))
        .enter().append("g")
        .attr("class", "arc");

    arc.append("path")
        .attr("d", path)
        .attr("fill", function(d) { return color(d.data.count); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
});