// VISUALISATION FORMATTING
var xOffset = 10;
var yTitle = 20,
    yFirstLine = 35,
    ySecondLine = 48;
var yOffset = [20, 35, 48, 61, 74, 87, 100, 113, 126, 139, 152, 165, 178, 191, 204, 217, 230, 243, 256, 269,
              282,295,308,323,346]; // per line
var roundnessCorners = 3;

// ?-BUTTON
function drawHelpIcon(x, y){
    var svgContainer = bodylayer.append("svg")
        .attr("width", screen.width)
        .attr("height", screen.height);
    
    var circle = svgContainer.append("circle")
        .attr('id', 'helpIcon')
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 8);

    // TEXT for the legend
    var text = svgContainer.append("text")
        .attr('id', 'helpIcon-text')
        .attr("x", x)
        .attr("y", y+4)
        .attr("text-anchor", "middle")
        .text("?");
    
    return svgContainer;
}

// TOOLTIPS on ?-BUTTON
function helpTooltip(x, y, w, h, text){
    var background = tooltipLayer.append("rect")
        .attr('class', 'tooltip-background')
        .attr('x', x)
        .attr('y', y)
        .attr('rx', 3)
        .attr('ry', 3)
        .attr('width', w)
        .attr('height', h);
    
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text-h1')
        .attr('x', x + xOffset)
        .attr('y', y + yOffset[0])
        .text(text[0].toUpperCase());
    
    for (i=1; i< text.length; i++){
        tooltipLayer.append("text")
            .attr('class', 'tooltip-text')
            .attr('x', x + xOffset)
            .attr('y', y + yOffset[i])
            .text(text[i]);
    }
}

function createBulletList(x, y, text){
    var xOffsetBullets = xOffset + 5,
        xOffsetTextAfterBullets = [xOffset + 20, xOffset + 25, xOffset + 25, xOffset + 25], //1st line, 2nd line, 3rd line, 4th line
        yOffset = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165];
    
    var totalIndex = 0;
    for (i=0; i< text.length; i++){
        tooltipLayer.append("text")
                .attr('class', 'tooltip-text')
                .attr('x', x + xOffsetBullets)
                .attr('y', y + yOffset[totalIndex])
                .text('•');
        for (var j=0; j<text[i].length; j++){
            tooltipLayer.append("text")
                .attr('class', 'tooltip-text')
                .attr('x', x + xOffsetTextAfterBullets[j])
                .attr('y', y + yOffset[totalIndex])
                .text(text[i][j]);
            totalIndex ++;
        }
    }
    
}


function addGroupDefinitionsToHelpTooltip(x, y){
    // Inleidende tekst
    var text = ['De kleur van de figuur',
        'Op basis van jouw score wordt je in een bepaalde groep ingedeeld.',
        'Er zijn vier groepen: A, B, C en D. De groep tot waar jij toebehoort kan je',
        'zien a.d.h.v. de kleur van de grafiek of door over de grafiek te hoveren.'
    ]    
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text-h1')
        .attr('x', x + xOffset)
        .attr('y', y + yOffset[0])
        .text(text[0].toUpperCase());
    
    for (i=1; i< text.length; i++){
        tooltipLayer.append("text")
            .attr('class', 'tooltip-text')
            .attr('x', x + xOffset)
            .attr('y', y + yOffset[i])
            .text(text[i]);
    }
    
    // De gekleurde rechthoekjes
    var groups = ['D', 'C', 'B', 'A'];
    var wRects = 60,
        wSpacingRects = 1,
        hRects = 20,
        xPos = x + 80,
        yPos = y + 100;
    for (i=0; i< 4; i++){
        // rechthoekjes zelf
        var rects = tooltipLayer.append("rect")
            .attr('class', 'graadmeter-rect')
            .attr('x', xPos + i*(wRects+wSpacingRects))
                .attr('y', yPos)
                .attr('width', wRects)
                .attr('height', hRects)
                .style('fill', colourScale[i])
        
        // tekst boven rechthoekjes
        tooltipLayer.append("text")
            .attr('class', 'graadmeter-rect-big-text')
            .attr('x', xPos + (i+0.5)*(wRects+wSpacingRects))
            .attr('y', yPos - 5)
            .style('text-anchor', 'middle')
            .style('fill', colourScale[i])
            .text(groups[i]);
    }
    
    // tekst onder rechthoekjes
    var groupDefs = ['minimumscore', 'Q1', 'mediaan', 'Q3', 'maximumscore']
    for (i=0; i< 5; i++){
        tooltipLayer.append("text")
            .attr('class', 'graadmeter-rect-text')
            .attr('x', xPos + i*(wRects+wSpacingRects))
            .attr('y', yPos + hRects + 10)
            .style('text-anchor', 'middle')
            .text(groupDefs[i]);
    }
    
    // Inleidende tekst
    var text = ['',
        'De definities voor de verschillende groepen zijn gebaseerd op',
        'de statistische verdeling van de scores. Indien je tot groep A behoort,',
        'behoor je tot de 25% hoogst scorende studenten. Indien je tot groep B',
        'behoort, heb je een score boven de mediaan en behoor je tot de 50%',
        'hoogst scorende studenten. Bij groep C, zit je onder de mediaan en',
        'behoor je tot de 75% hoogst scorende studenten. Bij groep D behoor je',
        'tot de 25% laagst scorende studenten. ', '',
        'De preciese grenswaarden tussen de verschillende groepen kan je',
        'raadplegen als je over de grafiek hovert.'
    ];
    
    for (i=0; i< text.length; i++){
        tooltipLayer.append("text")
            .attr('class', 'tooltip-text')
            .attr('x', x + xOffset)
            .attr('y', y + 130 + yOffset[i])
            .text(text[i]);
    }
}


function helpTooltipLegendStudieTracject(x, y, w, h){
    yOffset = [20, 35, 48, 61, 85, 98, 111];
    
    // TODO: actually this is a bad solution: it should be based on the id of the svg element 
    // (in the code of typischstudietraject.js) but didn't find solution directly 
    // so this is a bad but easier hard-coded way
    // determine the circle that is hovered based on position
    function determineHoveredCircleIdx(x){
        if (x < 950){
            return 0;
        } else if ((x > 950) && (x < 1020)){
            w = w + 15
            x = x - 15
            return 1;
        } else if ((x > 1020) && (x < 1080)){
            return 2;
        } else if ((x > 1080) && (x < 1150)){
            w = w - 20;
            x = x + 20;
            return 3;
        } else if (x > 1150){
            return 4;
        }
    }
    var i = determineHoveredCircleIdx(x);
    
    var background = tooltipLayer.append("rect")
        .attr('class', 'tooltip-background')
        .attr('x', x)
        .attr('y', y)
        .attr('rx', 3)
        .attr('ry', 3)
        .attr('width', w)
        .attr('height', function(){
            if (i==4){
                return h*0.55;
            } else if (i == 3){
                return h*0.4;
            } else{
                return h;
            }
        });
    
    var alleUitlegText = [];
    var cseText = ["Wat betekent CSE?", "CSE staat voor cumulatieve studie-efficiëntie. Het geeft de verhouding weer tussen", "het aantal studiepunten van de vakken waarvoor je geslaagd bent tot het aantal", "studiepunten dat je hebt opgenomen."];
    
    var text1 = cseText.slice();
    text1.push("Een studie-efficiëntie van >70% betekent dat in termen van het aantal studiepunten")
    text1.push("je voor minstens 70% van de vakken die je hebt opgenomen geslaagd bent.");
    alleUitlegText.push(text1);
    
    var text2 = cseText.slice();
    text2.push("Een studie-efficiëntie tussen 30-70% betekent dat in termen van het aantal studiepunten")
    text2.push("je voor 30 tot 70% van de vakken die je hebt opgenomen geslaagd bent.");
    alleUitlegText.push(text2);
    
    var text3 = cseText.slice();
    text3.push("Een studie-efficiëntie van <30 betekent dat in termen van het aantal studiepunten")
    text3.push("je voor minder dan 30% van de vakken die je hebt opgenomen geslaagd bent.");
    alleUitlegText.push(text3);
    
    var text4 = ["Drop-out"];
    text4.push("Deze studenten zijn de opleiding begonnen maar zijn deze voor januari gestopt.")
    alleUitlegText.push(text4);
    
//    var text5 = ["Niet ingeschreven"];
//    text5.push("Deze studenten hebben deelgenomen aan de ijkingstoets maar zijn niet")
//    text5.push("aan de richting burgerlijk ingenieur gestart.")
//    alleUitlegText.push(text5);
    
    console.log(alleUitlegText[0]);
    var text = alleUitlegText[i];
    
    tooltipLayer.append("text")
        .attr('class', 'tooltip-text-h1')
        .attr('x', x + xOffset)
        .attr('y', y + yOffset[0])
        .text(text[0].toUpperCase());
    
    for (i=1; i< text.length; i++){
        tooltipLayer.append("text")
            .attr('class', 'tooltip-text')
            .attr('x', x + xOffset)
            .attr('y', y + yOffset[i])
            .text(text[i]);
    }
}
