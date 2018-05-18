function drawTooltipTotaalScore(x, y, w, h){            
    var background = tooltipLayer.append("rect")
        .attr('class', 'tooltip-background')
        .attr('x', x)
        .attr('y', y)
        .attr('rx', 3)
        .attr('ry', 3)
        .attr('width', w)
        .attr('height', h);

    // Text: "totaalscore"
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text-h1')
        .attr('x', x + 10)
        .attr('y', y + 20)
        .text('TOTAALSCORE ');

    // Text: cijfer totaalscore
    tooltipLayer.append("text")
        .attr('x', x + 10)
        .attr('y', y + 50)
        .attr('font-size' , '30px')
        .attr('fill', determineColour())
        .text(Math.round(totaalscore*20) + '/20');
    
    // Text: "Met deze score behoor je tot groep"
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + 15)
        .attr('y', y + 80)
        .text('> Met deze score behoor je tot groep');
    // Text: groep    
    tooltipLayer.append("text")
        .attr('x', x + 237)
        .attr('y', y + 82)
        .attr('font-size' , '18px')
        .attr('fill', determineColour())
        .text(determinTextGroup());
    
    // Graadmeter
    var grenzen = [Math.round(totaalscoreMin*20), Math.round(totaalscoreQ1*20), Math.round(totaalscoreMed*20), Math.round(totaalscoreQ3*20), 20];
    createGraadmeter(grenzen, totaalscore*20, totaalscoreGem*20, colourScale, x+20, y+60, 310, 120, graadmeterWidthsProportional, true);
    
    // Text: "Verhouding juist, fout, blanco"
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + 15)
        .attr('y', y + 220)
        .text('> Verhouding juist, fout en blanco ingevulde vragen:');
    
    // Donut JFB
    var JFB = getNbJFB([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]);
    drawDonutJuistFoutBlanco(x + 30, y + 190, 300, 150, JFB);
    tooltipLayer.append("text")
        .attr('class', 'tooltip-note')
        .attr('x', x + 120)
        .attr('y', y + 410)
        .text('totaal aantal vragen: 30');
}

// help methods
function determineColour(){
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

function determinTextGroup(){
    if (totaalscore < totaalscoreQ1){
        return 'D'; 
    }
    else if (totaalscore < totaalscoreMed){
        return 'C';
    }
    else if (totaalscore < totaalscoreQ3){
        return 'B'; 
    }
    else{
        return 'A';
    }
}
//OLD groups
//function determineColour(){
//    if (totaalscore < totaalscoreQ1){
//        return colourScale[0]; 
//    }
//    else if (totaalscore < totaalscoreMed){
//        return colourScale[1];
//    }              
//    else if (totaalscore < 0.5){
//        return colourScale[2];
//    }
//    else if (totaalscore < totaalscoreQ3){
//        return colourScale[3]; 
//    }
//    else{
//        return colourScale[4];
//    }
//}
//
//function determinTextGroup(){
//    if (totaalscore < totaalscoreQ1){
//        return 'E'; 
//    }
//    else if (totaalscore < totaalscoreMed){
//        return 'D';
//    }              
//    else if (totaalscore < 0.5){
//        return 'C';
//    }
//    else if (totaalscore < totaalscoreQ3){
//        return 'B'; 
//    }
//    else{
//        return 'A';
//    }
//}

