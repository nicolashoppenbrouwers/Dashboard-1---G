//TODO:
// - gem score wordt nu weergegeven maar is het niet beter op percentage juist beantwoord?
//  (idem voor streepjes btw)
// - foto's te goei doen
function drawTooltipScorePerVraag(d, x, y, w, h){
    var durationAnimationMoeilijkh = 0;
    
    var background = tooltipLayer.append("rect")
        .attr('class', 'tooltip-background')
        .attr('x', x)
        .attr('y', y)
        .attr('rx', 3)
        .attr('ry', 3)
        .attr('width', w)
        .attr('height', h);

    // Tekst: Vraag + nummer
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text-h1')
        .attr('x', x + 10)
        .attr('y', y + 20)
        .text('VRAAG ' + d.vraag);
    
    // Tekst: juist, fout, blanco
//    tooltipLayer.append("text")
//        .attr('x', function(){
//            if (d.vraag < 10)
//                return x + 82;
//            else   
//                return x + 90;
//            })
//        .attr('y', y + 20)
//        .attr('font-size' , '14px')
//        .attr('fill', determineJFBColorTooltip(d.score))
//        .text(determineJFBText(d.score));
    tooltipLayer.append("text")
        .attr('x', x + 10)
        .attr('y', y + 50)
        .attr('font-size' , '30px')
        .style('fill', determineJFBColorTooltip(d.score))
        .text(determineJFBText(d.score).toUpperCase()); 
    
    drawAntwoorden(x+20, y+85, w*0.9, d.antw, d.juist_antw, d.gem_score)
    
    // Text: categorie
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + 30)
        .attr('y', y + 168)
        .text("> Categorie: "); 
    
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + 175)
        .attr('y', y + 168)
        .style('fill', colourBlue)
        .text(d.categorie);
    
    //Text: moeilijkheidsgraad
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + 30)
        .attr('y', y + 185)
        .text("> Moeilijkheidsgraad:");
    
    drawMoeilijkheidsgraad(x+175, y+185, d.moeilijkheidsgraad, durationAnimationMoeilijkh);
    
    // De vraag zelf
    tooltipLayer.append("svg:image")
        .attr("xlink:href", "data/" + ijkVersion + "/images-vragen/vraag1.JPG") // "/images-vragen/vraag" + d.vraag + ".JPG")
        .attr("width", w * 0.9)
        .attr("height", h * 0.6)
        .attr("x", x+15)
        .attr("y", y + 185);
}

function determineJFBColorTooltip(score) {
    if (score > 0){
        return coloursJFB[0]; //green
    }
    else if (score < 0){
        return coloursJFB[1]; // red
    }
    else{
        return "lightgrey"; // white
    }
}

function drawMoeilijkheidsgraad(x, y, moeilijkheidsgraad, durationAnimation){
    for (i = 0; i < 4; i++){
        var r = 5,
            xPos = x + 1.5*r + 20*i,
            yPos = y - r/2;
        
        var circle = tooltipLayer.append("circle")
            .attr('id', 'circles-moeilijkheidsgraad')
            .attr('cx', xPos)
            .attr('cy', yPos)
            .attr('r', r)
            .attr('fill', 'ghostwhite')
            .transition()
                .duration(durationAnimation)
                .delay(durationAnimation+durationAnimation*i)
                .attr('fill', function(){
                    if (i < moeilijkheidsgraad){
                        return colourBlue;
                    }
                    else{
                        return 'none';
                    }
                });
    }       
}

function drawAntwoorden(x, y, width, antwoord, juist_antwoord, gem_score){
    // text: Jouw antwoord
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + width/6)
        .attr('y', y)
        .style('text-anchor', 'middle')
        .text("JOUW");
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + width/6)
        .attr('y', y + 15)
        .style('text-anchor', 'middle')
        .text("ANTWOORD");
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + width/6)
        .attr('y', y + 40)
        .style('text-anchor', 'middle')
        .style('fill', colourBlue)
        .style('font-size', '20px')
        .text(antwoord.toUpperCase());
    
    // text: Juist antwoord
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + width*3/6)
        .attr('y', y)
        .style('text-anchor', 'middle')
        .text("JUIST");
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + width*3/6)
        .attr('y', y + 15)
        .style('text-anchor', 'middle')
        .text("ANTWOORD");
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + width*3/6)
        .attr('y', y + 40)
        .style('text-anchor', 'middle')
        .style('fill', colourBlue)
        .style('font-size', '20px')
        .text(juist_antwoord);
    
    // text: Gemiddelde score
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + width*5/6)
        .attr('y', y)
        .style('text-anchor', 'middle')
        .text("GEMIDDELDE");
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + width*5/6)
        .attr('y', y + 15)
        .style('text-anchor', 'middle')
        .text("SCORE");
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text')
        .attr('x', x + width*5/6)
        .attr('y', y + 40)
        .style('text-anchor', 'middle')
        .style('fill', colourBlue)
        .style('font-size', '20px')
        .text(Math.round(gem_score*100)+'%');
    
    for (i = 0; i < 2; i++){
        tooltipLayer.append("line")
            .attr('id', 'global-vertical-line')
            .attr("x1", x + width*(i+1)/3)
            .attr("x2", x + width*(i+1)/3)
            .attr("y1", y - 15)
            .attr("y2", y + 50);
    }
}