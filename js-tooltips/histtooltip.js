//TODO: make the tooltip appear just above the bar like with the d3 tooltip
//TODO: ipv score tussen werken met 'low < score <= high' (gelijkheidstekens)
function drawTooltipHist(d, x, y, w, h, categorieInFocus, grenzen){       
    var background = tooltipLayer.append("rect")
        .attr('class', 'tooltip-background')
        .attr('x', x)
        .attr('y', y)
        .attr('rx', 3)
        .attr('ry', 3)
        .attr('width', w)
        .attr('height', h);

    // Text: categorie
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text-h1')
        .attr('x', x + 10)
        .attr('y', y + 20)
        .text(categorieInFocus.toUpperCase());

    // Text: 'Score tussen ... en ... %'
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + 10)
        .attr('y', y + 37)
        .text('> Score tussen ');  
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + 95)
        .attr('y', y + 37)
        .style('fill', colourBlueHighlight)
        .text(d.lowbound + '%'); 
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + 123)
        .attr('y', y + 37)
        .text(' en '); 
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + 140)
        .attr('y', y + 37)
        .style('fill', colourBlueHighlight)
        .text(d.highbound + '%'); 

    // Text: "Deze scores horen (voornamelijk) tot groep"
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + 10)
        .attr('y', y + 52)
        .text('> Deze scores behoren (voornamelijk) tot ');
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + 250)
        .attr('y', y + 52)
        .style('fill', getGroupColour(d, grenzen))
        .text('groep ' + getGroupText(d, grenzen)); 
    
    // Text: "Aantal studenten: ..."
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + 15)
        .attr('y', y + 77)
        .text('Aantal studenten: '); 
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + 125)
        .attr('y', y + 77)
        .style('fill', colourBlueHighlight)
        .text(d.aantal + "/" + totaalAantalDeelnemersIjk); 
    
    // Text: "Percentage van totaalaantal: ..."
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + 15)
        .attr('y', y + 90)
        .text('Percentage van totaalaantal:'); 
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + 195)
        .attr('y', y + 90)
        .style('fill', colourBlueHighlight)
        .text(Math.round(d.percent*100) + '%'); 
}


// help methods
function getGroupColour(d, grenzen){
    var Q1 = grenzen[1]*100, med = grenzen[2]*100, Q3 = grenzen[3]*100;
    if ((d.lowbound+5 < Q1)){
        return colourScale[0];
    }
    else if (d.lowbound+5 < med){
        return colourScale[1];
    }
    else if (d.lowbound < Q3){
        return colourScale[2];
    }
    else {
        return colourScale[3];
    }
}

function getGroupText(d, grenzen){
    var Q1 = grenzen[1]*100, med = grenzen[2]*100, Q3 = grenzen[3]*100;
    if ((d.lowbound+5 < Q1)){
        return 'D';
    }
    else if (d.lowbound+5 < med){
        return 'C';
    }
    else if (d.lowbound < Q3){
        return 'B';
    }
    else {
        return 'A';
    }
}
