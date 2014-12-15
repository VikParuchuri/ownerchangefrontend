angular.module('ownerchangefrontendApp').

   directive('bars', function ($parse) {
      return {
          restrict: 'E',
          replace: true,
          template: '<div id="chart"></div>',
          link: function (scope, element, attrs) {
              var data = attrs.data;
              data = JSON.parse(data);
              var w = 100,
                  h = 75;


              var chart = d3.select("#chart")
                  .append("svg")
                  .attr("width", w * data.length)
                  .attr("height", h)
                  .attr("class", "chart");


              var x = d3.scale.linear()
                  .domain([0, 1])
                  .range([0, w]);

              var y = d3.scale.linear()
                  .domain([0, 16])
                  .rangeRound([0, h]);

              chart.selectAll("rect")
                  .data(data)
                  .enter().append("rect")
                  .attr("x", function (d, i) {
                      return x(i) - .5;
                  })
                  .attr("width", w)
                  .style("fill", function(d) { return d.color; })
                  .attr("y", function (d) {
                      return h;
                  })
                  .attr("height", function (d) {
                      return 0;
                  })
                  .transition().delay(function (d, i) { return i*100; })
                  .attr("height", function (d) {
                      return d.wins * h/16;
                  })
                  .attr("y", function (d) {
                      return h - (d.wins * h/16) - .5;
                  })

          }
      }
   });