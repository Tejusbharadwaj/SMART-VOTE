d3.csv("Data/population.csv", function(err, data) {
  var config = {"color1":"#e5e500","color2":"#58ce12","stateDataColumn":"state_or_territory","valueDataColumn":"population_estimate_for_july_1_2013_number","second":"census_population_april_1_2010_number", "third":"census_population_april_1_2000_number"}
  
  var margin = {top: 0, right: 20, bottom: 5, left: 50};
var width = document.body.clientWidth - margin.left - margin.right;
var height = 450 - margin.top - margin.bottom;
  
  var COLOR_COUNTS = 9;
  var update;
  // function NewValue();
  
  var SCALE = 0.7;

  var centered;
  var firstGuage, secondGuage, democratGauge, repubGauge;
  
  function Interpolate(start, end, steps, count) {
      var s = start,
          e = end,
          final = s + (((e - s) / steps) * count);
      return Math.floor(final);
  }
  
  function Color(_r, _g, _b) {
      var r, g, b;
      var setColors = function(_r, _g, _b) {
          r = _r;
          g = _g;
          b = _b;
      };
  
      setColors(_r, _g, _b);
      this.getColors = function() {
          var colors = {
              r: r,
              g: g,
              b: b
          };
          return colors;
      };
  }
  
  function hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
      } : null;
  }
  
  function valueFormat(d) {
    // debugger
    if (d > 1000000000) {
      return Math.round(d / 1000000000 * 10) / 10 + "B";
    } else if (d > 1000000) {
      return Math.round(d / 1000000 * 10) / 10 + "M";
    } else if (d > 1000) {
      return Math.round(d / 1000 * 10) / 10 + "K";
    } else {
      // debugger;
      return d;
    }
  }
  
  var COLOR_FIRST = config.color1, COLOR_LAST = config.color2;
  
  var rgb = hexToRgb(COLOR_FIRST);
  
  var COLOR_START = new Color(rgb.r, rgb.g, rgb.b);
  
  rgb = hexToRgb(COLOR_LAST);
  var COLOR_END = new Color(rgb.r, rgb.g, rgb.b);
  
  var MAP_STATE = config.stateDataColumn;
  var MAP_VALUE = config.valueDataColumn;
  var MAP_SECOND = config.second;
  var MAP_THIRD = config.third;
  

  var valueById = d3.map();
  
  var startColors = COLOR_START.getColors(),
      endColors = COLOR_END.getColors();
  
  var colors = [];
  
  for (var i = 0; i < COLOR_COUNTS; i++) {
    var r = Interpolate(startColors.r, endColors.r, COLOR_COUNTS, i);
    var g = Interpolate(startColors.g, endColors.g, COLOR_COUNTS, i);
    var b = Interpolate(startColors.b, endColors.b, COLOR_COUNTS, i);
    colors.push(new Color(r, g, b));
  }
  
  var quantize = d3.scale.quantize()
      .domain([0, 1.0])
      .range(d3.range(COLOR_COUNTS).map(function(i) { return i }));

    var projection = d3.geo.albersUsa()
    .scale(1070)
    .translate([width / 2, height / 2]);
  
  var path = d3.geo.path()
  .projection(projection);

  var svgTitle = d3.select("#text-svg").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", 25 + margin.top + margin.bottom)
      .attr("align","center")
  
  var svg = d3.select("#canvas-svg").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("align","center")
      
      svgTitle.append("text")
      .attr("font-family","sans-serif")
      .attr("font-size","35px")
      .attr("fill","red")
      .attr("text-anchor","middle")
      .attr("x", width/2)
      .attr("y", 24)
.text("SMART VOTE");


  d3.tsv("https://s3-us-west-2.amazonaws.com/vida-public/geo/us-state-names.tsv", function(error, names) {
  
  name_id_map = {};
  id_name_map = {};
  second_id ={};
  var nextData=[];
  
  for (var i = 0; i < names.length; i++) {
    name_id_map[names[i].name] = names[i].id;
    id_name_map[names[i].id] = names[i].name;
    second_id[names[i].id] = names[i].names;
    
  }

  
  data.forEach(function(d) {
   
    var id = name_id_map[d[MAP_STATE]];
    
    valueById.set(id, +d[MAP_VALUE]); 
    nextData.push({id: name_id_map[d[MAP_STATE]],State:d.state_or_territory, freq:{low:d.census_population_april_1_2010_number, mid:d.census_population_april_1_2000_number, high:d.population_estimate_for_july_1_2013_number}});
  });

  
  quantize.domain([d3.min(data, function(d){ return +d[MAP_VALUE] }),
    d3.max(data, function(d){ return +d[MAP_VALUE] })]);
  
  d3.json("https://s3-us-west-2.amazonaws.com/vida-public/geo/us.json", function(error, us) {
   
    data;
    
    var firstGuage;
   var g= svg.append("g")
        .attr("class", "states-choropleth")
      .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
      .enter().append("path")
        .attr("transform", "scale(" + SCALE + ")")
        .style("fill", function(d) {
          if (valueById.get(d.id)) {
            var i = quantize(valueById.get(d.id));
            var color = colors[i].getColors();
            return "rgb(" + color.r + "," + color.g +
                "," + color.b + ")";
          } else {
            return "";
          }
        })
        .attr("d", path)
        .on("click",clicked)
        .on("mousemove", function(d) {
            var html = "";
            data;
            
            data.forEach(function (n){
              d;
              if(n.state_or_territory===id_name_map[d.id]){


             firstGuage =n.census_population_april_1_2010_number;
             secondGuage=n.population_estimate_for_july_1_2013_number;
             democratGauge=n.democrat;
             repubGauge=n.repulic;
             
           }
           
              


            })

            
  
            html += "<div class=\"tooltip_kv\">";
            html += "<span class=\"tooltip_key\">";
            html += id_name_map[d.id];
            html += "</span>";
            html += "<span class=\"tooltip_value\">";
            html += (valueById.get(d.id) ? valueFormat(valueById.get(d.id)) : "");
            html += "";
            html += "</span>";
            html += "</div>";

            
            $("#tooltip-container").html(html);
            $(this).attr("fill-opacity", "0.8");
            $("#tooltip-container").show();
            
            var coordinates = d3.mouse(this);
            
            var map_width = $('.states-choropleth')[0].getBoundingClientRect().width;
            
            if (d3.event.layerX < map_width / 2) {
              d3.select("#tooltip-container")
                .style("top", (d3.event.layerY + 15) + "px")
                .style("left", (d3.event.layerX + 15) + "px");
            } else {
              var tooltip_width = $("#tooltip-container").width();
              d3.select("#tooltip-container")
                .style("top", (d3.event.layerY + 15) + "px")
                .style("left", (d3.event.layerX - tooltip_width - 30) + "px");
            }
        })
        .on("mouseout", function() {
                $(this).attr("fill-opacity", "1.0");
                $("#tooltip-container").hide();
            });
  
    

      var p=  g.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("class", "states")
      .attr("id", "state-borders")
      .attr("transform", "scale(" + SCALE + ")")
      .attr("d", path);

      var gauge1 = loadLiquidFillGauge("fillgauge1", 0, config1,"utils/cap.jpg");
  var gauge2 = loadLiquidFillGauge("fillgauge2", 0, config1, "utils/democratic.png");
  var gauge3 = loadLiquidFillGauge("fillgauge3", 0, config1,"utils/republic.jpg");
  var gauge4 = loadLiquidFillGauge("fillgauge4", 0, config1,"utils/voter.jpg");


        function clicked(d) {
  var x, y, k;
  
  gauge1.update(secondGuage);
  gauge2.update(democratGauge);
  gauge3.update(repubGauge);
  gauge4.update(firstGuage);



 
  var nextData 

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  p.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}

var hyper = d3.select("#hyper").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", 25 + margin.top + margin.bottom)
      .attr("align","center")

      hyper.append("text")
      .attr("font-family","sans-serif")
      .attr("font-size","12px")
      .attr("text-anchor","middle")
      .attr("x", width/2)
      .attr("y", 24)
      .attr("href","Tejus")
.text("http://collegecompletion.chronicle.com || http://www.electproject.org/2014g  ||   http://www.usatoday.com/pages/interactives/elections-results-2014/#governor")
 
   
  });
  
  });
});