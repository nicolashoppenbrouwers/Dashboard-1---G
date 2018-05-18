function drawTooltipBC(d, x, y, w, h){            
    var background = tooltipLayer.append("rect")
        .attr('class', 'tooltip-background')
        .attr('x', x)
        .attr('y', y)
        .attr('rx', 3)
        .attr('ry', 3)
        .attr('width', w)
        .attr('height', h);

    // Text: "Categorie"
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text-h1')
        .attr('x', x + 10)
        .attr('y', y + 20)
        .text('CATEGORIE ');
    
    // Text: de eigenlijke categorie
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text-h1')
        .attr('x', x + 90)
        .attr('y', y + 20)
        //.style('fill', colourBlue)
        .text(d.categorie.toUpperCase());

    // Text: score voor deze categorie
    tooltipLayer.append("text")
        .attr('x', x + 10)
        .attr('y', y + 50)
        .attr('font-size' , '30px')
        .attr('fill', determineGroupColour(d))
        .text(Math.round(d.score * 100) + '%');
    
    // Text: "Vragen"
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + 15)
        .attr('y', y + 80)
        .text('> Vragen ');
    // de eigenlijke vragen
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + 75)
        .attr('y', y + 80)
        .style('fill', colourBlueHighlight)
        .text(function(){
            if (d.categorie === 'totaal'){
                return "alle vragen"
            }
            else {
                var str = "";
                for (i=0; i<d.vragen.length; i++){
                    if (i == d.vragen.length - 1){
                        str += "en " + d.vragen[i];
                    } else if (i == d.vragen.length - 2){
                        str += d.vragen[i] + " ";
                    } else {
                        str += d.vragen[i] + ", ";
                    }
                }
                return str;
            }
        });
    
    // Text: "Met deze score behoor je tot groep"
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + 15)
        .attr('y', y + 105)
        .text('> Met deze score behoor je tot groep');
    // Text: groep    
    tooltipLayer.append("text")
        .attr('x', x + 237)
        .attr('y', y + 107)
        .attr('font-size' , '18px')
        .attr('fill', determineGroupColour(d))
        .text(determineGroup(d));
    
    // Graadmeter
    var grenzen = [Math.round(d.min*100), Math.round(d.Q1*100), Math.round(d.med*100), Math.round(d.Q3*100), 100];
    createGraadmeter(grenzen, d.score*100, d.gem*100, colourScale, x+20, y+85, 310, 120, graadmeterWidthsProportional, false);
    
    // Text: "Verhouding juist, fout, blanco"
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + 15)
        .attr('y', y + 240)
        .text('> Verhouding juist, fout en blanco ingevulde vragen:');
    
    // Donut JFB
    var JFB = getNbJFB(d.vragen);
    drawDonutJuistFoutBlanco(x + 30, y + 215, 300, 150, JFB);
    tooltipLayer.append("text")
        .attr('class', 'tooltip-note')
        .attr('x', x + 120)
        .attr('y', y +  435)
        .text('totaal aantal vragen: '+d.vragen.length);
}

// help methods
function determineGroup(d){
    if (d.score < d.Q1) {
        return 'D';
    }
    else if (d.score < d.med){
        return "C";
    }
    else if (d.score < d.Q3){
        return 'B'; 
    }
    else{
        return 'A';
    }
}

function determineGroupColour(d){
    if (d.score < d.Q1) {
        return colourScale[0];
    }
    else if (d.score < d.med){
        return colourScale[1];
    }
    else if (d.score < d.Q3){
        return colourScale[2];
    }
    else{
        return colourScale[3];
    }
}
// OLD groups
//function determineGroup(d){
//    if (d.score < d.Q1) {
//        return 'E';
//    }
//    if (d.med >= 0.5){
//        if (d.score < 0.50){
//            return "D";
//        }
//        else if (d.score < d.med){
//            return 'C';
//        }
//    }
//    if (d.med < 0.5){
//        if (d.score < d.med){
//            return "D";
//        }
//        else if (d.score < 0.50){
//            return 'C'; 
//        }
//    }
//    if (d.score < d.Q3){
//        return 'B';
//    }
//    else{
//        return 'A';
//    }
//}
//
//function determineGroupColour(d){
//    if (d.score < d.Q1) {
//        return colourScale[0];
//    }
//    if (d.med >= 0.5){
//        if (d.score < 0.50){
//            return colourScale[1];
//        }
//        else if (d.score < d.med){
//            return colourScale[2];
//        }
//    }
//    if (d.med < 0.5){
//        if (d.score < d.med){
//            return colourScale[1];
//        }
//        else if (d.score < 0.50){
//            return colourScale[2];
//        }
//    }
//    if (d.score < d.Q3){
//        return colourScale[3];
//    }
//    else{
//        return colourScale[4];
//    }
//}
