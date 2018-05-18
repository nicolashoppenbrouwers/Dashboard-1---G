//TODO:
//  - wanneer minder dan 50%, start de progress bij de foute kant

// INIT: visualisation formatting
var verticalAlignmentText = ".35em",
    verticalAlignmentBottomText = "2.65em";
        
// INIT: animation formatting
var durationAnimation1 = 1500,
    durationAnimation2 = 500,
    delayAnimation2 = 1000;

// create data & add svg to bodylayer
var data = [totaalscore, 1-totaalscore];
var svgTotScore = bodylayer.append("svg")
        .datum(data)
        .attr('width', tsWidth)
        .attr('height', tsHeight)
    .append("g")
        .attr('transform', "translate(" + (tsWidth / 2) + "," + (tsHeight / 2) + ")");

// create visualisation elements
var arc = d3.svg.arc()
        .startAngle(function(d) { 
            if (totaalscore >= 0.5)
                return d.startAngle;
            else
                return -d.startAngle;
        })
        .endAngle(function(d) { 
            if (totaalscore >= 0.5)
                return d.endAngle;
            else
                return -d.endAngle;
        })
    .outerRadius(tsRadius);
var pie = d3.layout.pie();
var arcs = svgTotScore.selectAll("g.arc")
    .data(pie)
        .enter().append("g");

// graph title
svgTotScore.append("text")
    .attr('class', 'graphtitle')
    .attr('x', -tsWidth / 2 + marginTs.left)             
    .attr('y', -tsHeight / 2 + marginTs.top)
    .text("Totaalscore");

// help icon
var helpIcon = drawHelpIcon(tsWidth - 50, marginTs.top - 8);

helpIcon
    .on('mouseover', function(d){
        helpTooltip(
            d3.event.pageX - 30, d3.event.pageY - verticalMainTitleSpace - 20,
            440, 352,
            ['Totaalscore', 'Deze grafiek geeft jouw totaalresultaat op de ijkingstest aan.', 'Hover met je muis over de grafiek voor meer gedetailleerde informatie.']); 
        addGroupDefinitionsToHelpTooltip(d3.event.pageX - 30, d3.event.pageY - verticalMainTitleSpace - 20 + 60);
    })
    .on('mouseout', () => removeTooltip())

// DONUT slices
arcs.append("path")
    .attr('class', 'arc-ts')
    .attr('fill', (d,i) => determineColour(d, i))
    .attr('opacity', function(d,i) {
        if (i == 0){ // gekleurde deel van de donut chart
            return 0.80;
        } else {  // grijze stuk vd donutchart
                return 0.30;
        }
    })
    // tooltip
    .on('mouseover', (d) => drawTooltipTotaalScore(
        d3.event.pageX - 30, 
        d3.event.pageY - verticalMainTitleSpace - 20,
        350, 430)
    )
    .on('mouseout', () => removeTooltip())
    // eerste animatie
    .transition()
        .ease("bounce")
        .duration(durationAnimation1)
        .attrTween("d", tweenPie)
    // tweede animatie
    .transition()
        .ease("elastic")
        .delay((d, i) => delayAnimation2 + i * 50)
        .duration(durationAnimation2)
        .attrTween("d", tweenDonut);

// TEKST in het midden
arcs.append("text")
    .attr('class', 'textinsidecircle-ts')
    .attr('dy', verticalAlignmentText)
    .attr('text-anchor', "middle")
    // kleur van de tekst
    .style('fill', (d) => determineColour(d, 0))
    // tijd van de tekst
    .transition()
        .delay(delayAnimation2)
        .text(Math.round(totaalscore*20));

arcs.append("text")
    .attr('class', 'textinsidecirclebottom-ts')
    .attr('dy', verticalAlignmentBottomText)
    .attr('text-anchor', "middle")
    // kleur van de tekst
    .style('fill', colourGrey)
    // tijd van de tekst
    .transition()
        .delay(delayAnimation2)
        .text('op 20');

// animation methods
function tweenPie(b) {
      b.innerRadius = 0;
      var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
      return function(t) { return arc(i(t)); };
}

function tweenDonut(b) {
      b.innerRadius = tsRadius * .6;
      var i = d3.interpolate({innerRadius: 0}, b);
      return function(t) { return arc(i(t)); };
}
    

// help methods
function determineColour(d, i){
    if (i == 0){  // gekleurde deel van de donut chart
        if (totaalscore < totaalscoreQ1){
            return colourScale[0]; 
        }
        else if (totaalscore < totaalscoreMed){
            return colourScale[1];
        }              
        else if (totaalscore < totaalscoreQ3){
            return colourScale[2]; 
        }
        else{
            return colourScale[3];
        }
    }
    else {  // grijze stuk vd donutchart
        return colourGrey;
    }
}
//OLD groups
//function determineColour(d, i){
//    if (i == 0){  // gekleurde deel van de donut chart
//        if (totaalscore < totaalscoreQ1){
//            return colourScale[0]; 
//        }
//        else if (totaalscore < totaalscoreMed){
//            return colourScale[1];
//        }              
//        else if (totaalscore < 0.5){
//            return colourScale[2];
//        }
//        else if (totaalscore < totaalscoreQ3){
//            return colourScale[3]; 
//        }
//        else{
//            return colourScale[4];
//        }
//    }
//    else {  // grijze stuk vd donutchart
//        return colourGrey;
//    }
//}