function drawTooltipStudieTrajectNodes(d, x, y, w, h){       
//    var background = tooltipLayer.append("rect")
//        .attr('class', 'tooltip-background')
//        .attr('x', x)
//        .attr('y', y)
//        .attr('rx', 3)
//        .attr('ry', 3)
//        .attr('width', w)
//        .attr('height', h);
//
//    // Text: categorie
//    tooltipLayer.append("text")
//        .attr('class', 'tooltip-text-h1')
//        .attr('x', x + 10)
//        .attr('y', y + 20)
//        .text("blabla");
}

function drawTooltipStudieTrajectEdges(d, x, y, w, h){
    var yOffset = [20,35,52,69]
    
    if (d.source.level == 0){
        h = h - 14;
        yOffset = [20,38,38,55]
    }
    
    var background = tooltipLayer.append("rect")
        .attr('class', 'tooltip-background')
        .attr('x', x)
        .attr('y', y)
        .attr('rx', 3)
        .attr('ry', 3)
        .attr('width', w)
        .attr('height', h);

    // Text: 'Stroom' + naam stroom
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text-h1')
        .attr('x', x + 10)
        .attr('y', y + yOffset[0])
        .text('STROOM: ');
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text-h1')
        .attr('x', x + 80)
        .attr('y', y + yOffset[0])
        .style('font-weight', 'normal')
        .style('fill', determineEdgeColour(d))
        .text(function(){
            if (d.source.level == 0)
                return 'deelnemers met een ' + d.target.name;
            else 
                return 'studenten met ' + d.target.name;
        });

    // Text: 'Aantal studenten in deze stroom' + aantal
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + 80)
        .attr('y', y + yOffset[1])
        .text(function(){
            if (d.source.level == '0')
                return '';
            else
                return 'van de deelnemers met een ' + d.source.name;
        });  
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + 218)
        .attr('y', y + yOffset[2])
        .style('fill', colourBlueHighlight)
        .text(d.target.aantal); 
    
    // Text: 'Aantal studenten in deze stroom' + aantal
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + 10)
        .attr('y', y + yOffset[2])
        .text('> Aantal studenten in deze stroom: ');  
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + 218)
        .attr('y', y + yOffset[2])
        .style('fill', colourBlueHighlight)
        .text(d.target.aantal); 
    
    // Text: 'Percentage van totaal/vorige stroom' + percentage
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + 10)
        .attr('y', y + yOffset[3])
        .text(function(){
            if (d.source.level == 0)
                return '> Percentage van totaal: ';
            else
                return '> Percentage van vorige stroom: ';
        });  
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', function(){
            if (d.source.level == 0)
                return x+162;
            else
                return x+205;
        })  
        .attr('y', y + yOffset[3])
        .style('fill', colourBlueHighlight)
        .text(Math.round(d.target.percentage*1000)/10 + '%'); 
}