//TODO:
// - gem streepjes is nu op basis van gem score maar is het niet beter op percentage juist beantwoord?

// INIT: visualisation formatting
var roundednessCells = 5,
    magnificationCells = {width: 0.9, height: 0.9};

var questionResultOptions = ["juist", "fout", "blanco"];

var legendXOffSet = 0 //marginHeatmap.left;

// INIT: labels
var leftLabels = ["0x", "1x", "2x"],//"Vraag 1-10", "Vraag 11-20", "Vraag 21-30"],
    topLabels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

var xOffsetLeftLabels = 3,
    yOffsetLeftLabels = 9;

// INIT: animation formattion
var animationCellsDuration = 2000,
    delayPerCell = 50,
    textDuration = 1000;

// INIT: intialise heatMap (don't change unless you want to change legendwidth or gridsize)
var width = widthScorePerVraag - marginHeatmap.left - marginHeatmap.right,
    height = heightScorePerVraag - marginHeatmap.top - marginHeatmap.bottom,
    gridSize = Math.floor(width / 10),
    legendElementWidth = gridSize*2;

// SVG creation
var svgHeatmap = bodylayer
    .append("svg")
        .attr("width", width + marginHeatmap.left + marginHeatmap.right)
        .attr("height", height + marginHeatmap.top + marginHeatmap.bottom)
    .append("g")
        .attr("transform", "translate(" + marginHeatmap.left + "," + marginHeatmap.top + ")");

// graph title
svgHeatmap.append("text")
    .attr('class', 'graphtitle')
    .attr("x", - margin.left)             
    .attr("y", - verticalTitleSpace*2/3)
    .text("Score per vraag");

// help icon
var helpIcon = drawHelpIcon(widthScorePerVraag - 40, marginTs.top - 10);
helpIcon
    .on('mouseover', (d) => helpTooltip(
        d3.event.pageX - 30, d3.event.pageY - verticalMainTitleSpace - 20,
        630, 70,
        ['Score per vraag', 'Deze grafiek geeft per individuele vraag weer of je de vraag juist, fout of blanco hebt beantwoord.', 
         'Hoe hoger de horizontale streepjes in de cellen, hoe meer studenten die vraag juist hebben beantwoord.', 
         'Hover over een cel voor meer gedetailleerde informatie voor een specifieke vraag.'])
    )
    .on('mouseout', () => removeTooltip())


// LABELS ON LEFT OF GRID
if (showLeftLabels){
    svgHeatmap.selectAll(".label")
        .data(leftLabels).enter()
        .append("text")
            .attr('class', 'axisLabelsLeft')
            .attr('x', xOffsetLeftLabels)
            .attr('y', (d,i) => i * gridSize - yOffsetLeftLabels)
            .attr('transform', "translate(-15," + gridSize / 1.5 + ")")
            .style('opacity', 0)
            .text((d) => d)
            .transition().duration(textDuration)
                .style('opacity', 1.0);
}

// LABELS ON TOP OF GRID
if (showTopLabels){
    svgHeatmap.selectAll(".label")
        .data(topLabels)
        .enter().append("text")
            .attr('class', 'axisLabelsTop')
            .attr('x', (d, i) => i * gridSize)
            .attr('y', 0)
            .attr('transform', "translate(" + gridSize / 2 + ", -6)")
            .style('opacity', 0)
            .text((d) => d)
            .transition().duration(textDuration)
                .style('opacity', 1.0);
}

// HEATMAP
function drawHeatmap(dataFile) {
    
    d3.csv(dataFile, function(data) {
        data.forEach(function(d) {
            d.vraag = +d.vraag;
            d.score = +d.score;
            d.gem_score = +d.gem_score;
            d.moeilijkheidsgraad = +d.moeilijkheidsgraad
        });
               
        // DE CELLEN
        var cards = svgHeatmap.selectAll(".cells")
            .data(data);
        
        cards.enter().append("rect")
            .attr('class', 'cell')
            .attr('id', (d) => 'vraag' + d.vraag)
            .attr('x', (d) => ((d.vraag-1) % 10) * gridSize)
            .attr('y', (d) => Math.ceil(d.vraag/10 - 1) * gridSize)
            .attr('rx', roundednessCells)
            .attr('ry', roundednessCells)
            .attr('width', magnificationCells.width * gridSize)
            .attr('height', magnificationCells.height * gridSize)
            .style('fill', colourGrey)
            // tooltip
            .on('mouseover', function(d){
                d3.select(this).classed("cell-hover",true);
                drawTooltipScorePerVraag(d,
                    d3.event.pageX - 30, 
                    d3.event.pageY - verticalMainTitleSpace - 20,
                    350, 380);
            })
            .on('mouseout', function(){
                d3.select(this).classed("cell-hover",false);
                removeTooltip();
            })

        // ANIMATIE
        cards.transition().duration(animationCellsDuration)
            //.ease('elastic')
            .delay((d,i) => i*delayPerCell)
            .style('fill', (d) => determineJFBColor(d.score));
        
        // STREEPJES VOOR GEMIDDELDEN      
        if (showStreepjesGemiddeldes){        
            var lineXOffset = (1-magnificationCells.width)*gridSize,
                lineYOffset = (1-magnificationCells.height)*gridSize;

            cards.enter().append("line")
                .transition().duration(animationCellsDuration)
                .delay((d,i) => animationCellsDuration + i*delayPerCell)
                .attr('class', 'lines-cells-avg')
                .attr("x1", (d) => 2 + Math.round(gridSize * ((d.vraag-1) % 10)))
                .attr("x2", (d) => - 2 + Math.round(gridSize * ((d.vraag-1) % 10) + gridSize - lineXOffset))
                .attr("y1", function(d){
                    var y1 = Math.round(Math.ceil(d.vraag/10 - 1) * gridSize + 
                        gridSize * (1-d.gem_score));
                    if (d.vraag > 10)
                        y1 -= lineYOffset;
                    if (d.gem_score < 0.02)
                        y1 -= 2;
                    return y1;
                })
                .attr("y2", function(d){
                    var y2 = Math.ceil(d.vraag/10 - 1) * gridSize +
                        gridSize * (1-d.gem_score);
                    if (d.vraag > 10)
                        y2 -= lineYOffset;
                    if (d.gem_score < 0.02)
                        y2 -= 2;
                    return y2;
                })
        }
          
        // LEGENDE
        if (showLegend){
            var data = questionResultOptions;

            var legend = svgHeatmap.selectAll(".legend")
                .data(data)
                .enter().append("g");

            // legende rechthoekjes
            legend.append("rect")
                .attr('class', 'legend')
                .style('fill', (d, i) => coloursJFB[i])
                .style('opacity', 0)
                .transition().duration(500).delay((d,i) => animationCellsDuration*1.5 + 200*i)
                    .attr('x', (d, i) => legendXOffSet + legendElementWidth * i)
                    .attr('y', height)
                    .attr('width', legendElementWidth)
                    .attr('height', gridSize / 2)
                    .style('opacity', 0.9);

            // legende labels tekst
            legend.append("text")
                .attr('class', 'legendText')
                .style('opacity', 0)
                .transition().duration(500).delay((d,i) => animationCellsDuration*1.5 + 200*i)
                    .attr('x', (d,i) => legendXOffSet + legendElementWidth*i)
                    .attr('y', height + gridSize/1.2)
                    .text((d, i) => data[i])
                    .style('opacity', 0.9);
        }
    });  
}

// functions for other parts in the graph
function getNbJFB(lstVragen){
    var J = 0, F = 0, B = 0;
    for(i=0; i<lstVragen.length; i++){
        var score = d3.select('rect#vraag' + lstVragen[i]).datum().score;
        if (score < 0){
            F += 1;
        } else if (score == 0){
            B += 1;
        } else{
            J += 1;
        }
    }
    return [J, F, B];
}

function highlightVraag(vraagNb){
    d3.select('rect#vraag' + vraagNb).classed("cell-hover",true);
}

function dehighlightVraag(vraagNb){
    d3.select('rect#vraag' + vraagNb).classed("cell-hover",false);
}

function highlightVragen(lstVragen){
    for(i=0; i<lstVragen.length; i++){
        highlightVraag(lstVragen[i]);
    }
}

function dehighlightVragen(lstVragen){
    for(i=0; i<lstVragen.length; i++){
        dehighlightVraag(lstVragen[i]);
    }
}

// hulpfunctions
function determineJFBColor(score) {
    if (score > 0){
        return coloursJFB[0]; //green
    }
    else if (score < 0){
        return coloursJFB[1]; // red
    }
    else{
        return coloursJFB[2]; // white
    }
}

function determineJFBText(score){
    if (score > 0){
        return questionResultOptions[0]; // juist
    }
    else if (score < 0){
        return questionResultOptions[1]; // fout
    }
    else{
        return questionResultOptions[2]; // blanco
    }
}