function drawDonutJuistFoutBlanco(x, y, w, h, JFB){
    var juistfoutblanco = JFB,
        juistfoutblancoStrings = ["Juist", "Fout", "Blanco"],
        juistfoutColours = coloursJFB;
    removeNullValues();

    // INITIALIZATION: formatting
    var width = w,
        height = h,
        radius = Math.min(width, height) / 2;

    var durationAnimation = 800,
        offsetTimeTextAppearance = -100; // of 400 wanneer 1 voor 1 apart 

    // STANDARD D3 CODE
    var svg = tooltipLayer
        .append("svg")
        .append("g")

    svg.append("g")
        .attr("class", "slices");
    svg.append("g")
        .attr("class", "labels");
    svg.append("g")
        .attr("class", "lines");

    // DONUT CHART initialized
    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d, i) {
            return juistfoutblanco[i];
        });

    var arc = d3.svg.arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.4);

    var outerArc = d3.svg.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

    svg.attr("transform", "translate(" + (x + width / 2) + "," + (y + height / 2 + 50) + ")");

    // DONUT slices
    var slice = svg.select(".slices").selectAll("path.slice")
        .data(pie(juistfoutblanco));

        // formatting
    slice.enter()
        .insert("path")
        .attr("class", "slice")
        .attr("fill", function(d, i) { 
            return juistfoutColours[i];
        })
        // transparency
        .attr("opacity", 0.80)
        // eerste animatie
        .transition()
//            .ease("bounce")
//            .ease("elastic")
//            .delay(function(d,i){
//                if (i == 0) 
//                    return 500; 
//                else if (i==1) 
//                    return 300; 
//                else 
//                    return 0;
//            })
            .duration(durationAnimation)
            .attrTween("d", tweenPie)

    // animation methods
    function tweenPie(b) {
          b.innerRadius = 0;
          var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
          return (t) => arc(i(t));
    }


    // TEXT LABELS
    var text = svg.select(".labels").selectAll("text")
        .data(pie(juistfoutblanco));

        // formatting
    text.enter().append("text")
        .attr('class', 'tooltip-donut-text')
        .attr("dy", "0.3em")
        .transition()
            .attrTween("transform", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                    return "translate("+ pos +")";
                };
            })
            .styleTween("text-anchor", function(d){
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    return midAngle(d2) < Math.PI ? "start":"end";
                };
            })
        .transition()
            .delay(durationAnimation+offsetTimeTextAppearance)
            .text((d, i) => juistfoutblancoStrings [i] + " " + juistfoutblanco[i]);

        // positions
        function midAngle(d){
            return d.startAngle + (d.endAngle - d.startAngle)/2;
        }



    // LINES between TEXT LABELS and DONUT CHART
    var polyline = svg.select(".lines").selectAll("polyline")
        .data(pie(juistfoutblanco));


        // formatting
    polyline.enter()
        .append("polyline")
        .attr("opacity", ".35")
        .attr("stroke", "black")
        .attr("stroke-width", "1.5px")
        .attr("fill", "none");

        // functions to visualise them
    polyline.transition().duration(1000)
        .delay(durationAnimation+offsetTimeTextAppearance)
        .attrTween("points", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };			
        });
    
    // TODO: bad code: really case per case... can be better
    // Removes the values that are equal to zero. Only use non-zero values for the donut chart.
    function removeNullValues(){
        var J = juistfoutblanco[0],
            F = juistfoutblanco[1],
            B = juistfoutblanco[2];
        if ((J == 0) && (F != 0) && (B != 0)){
            juistfoutblanco = [F,B];
            juistfoutblancoStrings = ["Fout", "Blanco"];
            juistfoutColours = [coloursJFB[1], coloursJFB[2]];
        } else if ((J != 0) && (F == 0) && (B != 0)){
            juistfoutblanco = [J,B];
            juistfoutblancoStrings = ["Juist", "Blanco"];
            juistfoutColours = [coloursJFB[0], coloursJFB[2]];
        } else if ((J != 0) && (F != 0) && (B == 0)){
            juistfoutblanco = [J,F];
            juistfoutblancoStrings = ["Juist", "Fout"];
            juistfoutColours = [coloursJFB[0], coloursJFB[1]];
        } else if ((J != 0) && (F == 0) && (B == 0)){
            juistfoutblanco = [J];
            juistfoutblancoStrings = ["Juist"];
            juistfoutColours = [coloursJFB[0]];
        } else if ((J == 0) && (F == 0) && (B != 0)){
            juistfoutblanco = [B];
            juistfoutblancoStrings = ["Blanco"];
            juistfoutColours = [coloursJFB[2]];
        } else if ((J == 0) && (F != 0) && (B == 0)){
            juistfoutblanco = [F];
            juistfoutblancoStrings = ["Fout"];
            juistfoutColours = [coloursJFB[1]];
        } 
    }
}
