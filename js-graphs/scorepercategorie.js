//TODO:
// - assen lichtgrijs maken
// - positie van sorteer button relatief positioneren en niet absoluut, same for tekst erbij
// - bij sorteren: enkel de labels van de laatste twee worden veranderd, waarom??

// INIT: init variabelen
var scoreInFocus = 0.0,
    categorieInFocus = "totaal",
    currentlyClicked = false,
    previouslyClickedBar = null;

// **************************
// *        BAR CHART       *
// **************************
function barChartScorePerCategorie(datafile){
    // INIT: visualisation formatting
    var verticalOffSetLabels = 25,
        paddingBars = 0.35;
    
    // INIT: animation formatting    
    var durationAnimationBars = 1500,
        durationDelayPerBar = 250;
    
    var durationAnimationSorting = 750,
        durationDelayPerBarSorting = 200;
    
    // INIT: standard code
    var width  = bcSpcWidth  - bcSpcMargin.left - bcSpcMargin.right,
        height = bcSpcHeight - bcSpcMargin.top  - bcSpcMargin.bottom;
    
    // scales creation
    var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], paddingBars),
        y = d3.scale.linear()
            .range([height, 0]);

    // x-axis creation
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    // add svg to body layer
    var svgBc = bodylayer
        .append("svg")
            .attr("width", bcSpcWidth)
            .attr("height", bcSpcHeight)
        .append("g")
            .attr("transform", "translate(" + bcSpcMargin.left + "," + bcSpcMargin.top + ")");
    
    // graph title
    svgBc.append("text")
        .attr('class', 'graphtitle')
        .attr("x", bcSpcMargin.left)             
        .attr("y", 0 - verticalOffsetGraphTitle)
        .text("Sterktes en werkpunten");

    svgBc.append("text")
        .attr('class', 'graphexplanation')
        .attr("x", bcSpcMargin.left)             
        .attr("y", 0 - verticalTitleSpace)
        .text(function(){
            if (showScorePerCategorie)
                return "Score per categorie vragen. Klik en hover over de staven voor meer gedetailleerde informatie.";
            else
                return "Score per moeilijkheidsgraad. Klik en hover over de staven voor meer gedetailleerde informatie.";
        });
    
    // help icon
    var helpIcon = drawHelpIcon(bcSpcMargin.left + bcSpcWidth - 40, bcSpcMargin.top - 99);
    helpIcon
        .on('mouseover', function(d){
            helpTooltip(
                d3.event.pageX - 30, d3.event.pageY - 200,
                440, 620,
                ['Sterktes en werkpunten', 
                 'Deze grafiek geeft per categorie of per moeilijkheidsgraad vragen',
                 'je score weer. Klik op het pijltje om te kiezen welke de grafiek weergeeft.',
                 '',
                 'De vragen van de ijkingstoets zijn onderverdeeld in vijf categorieën:',
                 '',
                 '',
                 '',
                 '',
                 '',
                 '',
                 '',
                 '',
                 '',
                 '',
                 'Voor de moeilijkheidsgraad zijn er vier mogelijkheden:',
                 '',
                 '',
                 '',
                 '',
                 '',
                 '',
                 'Hover met je muis over de staven voor meer gedetailleerde informatie.']);
            createBulletList(d3.event.pageX - 30, d3.event.pageY - 110,[
                ['redeneren'],
                ['begrippenkennis'],
                ['wiskundige vaardigheden: berekenen van een afgeleide, oplossen', 
                  'van (stelsels) vergelijkingen, meetkunde, combinatoriek, ...'],
                ['ruimtelijk inzicht'],
                ['modelleren & combineren: combinatievragen of wiskundige',
                    'vraagstukken die geformuleerd zijn in een fysica-context',
                    'en die gemodelleerd moeten worden']
                 ]);
            createBulletList(d3.event.pageX - 30, d3.event.pageY + 35,[
                ['1 ster: de gemakkelijkste vragen'],
                ['2 sterren'],
                ['3 sterren'],
                ['4 sterren: de moeilijkste vragen']
                 ]);
            addGroupDefinitionsToHelpTooltip(d3.event.pageX - 30, d3.event.pageY + 125);
        })
        .on('mouseout', () => removeTooltip())
    
    // read data
    d3.csv(datafile, function(data) {
        data.forEach(function(d) {
            d.score = calculateScores(d);
            d.vragen = stringToList(d.vragen);
        });
        
        function calculateScores(d){
            var score = calculateScorePercentBasedOnList(getNbJFB(stringToList(d.vragen)));
            // totaalscore cannot be negative
            if ((score < 0) && (d.categorie == 'totaal'))
                return 0;
            return score;
        }
        
        function filterdata(dataSet){
            var filteredData = [];
            for (var i=0; i<dataSet.length; i++){
                if (showScorePerCategorie){
                    if (dataSet[i].type == 'categorie' || dataSet[i].type == 'allebei')
                        filteredData.push(dataSet[i]);
                }
                else{
                    if (dataSet[i].type == 'moeilijkheidsgraad' || dataSet[i].type == 'allebei')
                        filteredData.push(dataSet[i]);
                }
            }
            return filteredData;
        }
        var filteredData = filterdata(data);
        
        // domains for x and y-axis
        x.domain(filteredData.map((d) => d.categorie));
        y.domain([0, d3.max(filteredData, (d) => d.score)]);
        
        // initialise score in focus naar de score van categorie "totaal" (dus totaalscore)
        var totaalscore = filteredData[0].score*100;
        scoreInFocus = totaalscore;
        
        // x-axis
        svgBc.append("g")
            .attr('class', 'x axis-bc')
            .attr('transform', "translate(0," + height + ")")
            .call(xAxis)
            .selectAll('text')
                // modelleren en combineren is too big dus bij de x-as zetten we gewoon modelleren
                .text(function(d){
                    if (d == 'modelleren en combineren')
                        return 'modelleren';
                    else
                        return d;
                })
                .attr('y', function(d, j){
                    if (getScoreForCategorie(d, j) >= 0)
                        return 10;
                    else 
                        return -20;
                })
                .style('opacity', 0.0)
                .transition()
                    .duration(durationAnimationBars)
                    .delay((d,i) => i * durationDelayPerBar)
                    .style('opacity', 1.0);
        
        function getScoreForCategorie(requestedCategorie, j){
            // de j moet erbij, anders krijg je het fenomeen dat de eerste bar op de laatste bar wordt geplot 
            // voor een of andere onverklaarbare reden
            var copy = filteredData.slice();
            for (i=j; i<copy.length; i++){
                if (copy[i].categorie = requestedCategorie)
                    return copy[i].score;
            }
        }
        
        // bars
        var bars = svgBc.selectAll(".bar-bc")
            .data(filteredData)
            .enter().append("g");
        
        bars.append("rect")  
                .attr('class', 'bar-bc')
                .attr('x', (d) => x(d.categorie))
                .attr('width', x.rangeBand())
            //tooltip
                .on('mouseover', function(d){
                    highlightVragen(d.vragen);
                    drawTooltipBC(d,
                    d3.event.pageX - 30, 
                    d3.event.pageY - 400,
                    350, 445);
                })
                .on('mouseout', function(d){
                    dehighlightVragen(d.vragen);
                    removeTooltip();
                })
            //interaction with histogram
                .on('click', click)
            // different colour of bar depending on score
                .style('fill', (d, i) => colourBar(d,i))   
            // animation of bars
                .attr('height', 0)
                .attr('y', height)
                .transition()
                    .duration(durationAnimationBars)
                    .delay((d,i) => i * durationDelayPerBar)
                    .attr('y', function(d){
                        if (d.score >= 0)
                            return y(d.score);
                        else 
                            return height - y(1);
                    })
                    .attr('height', function(d){
                        if (d.score == 0)
                            return height - y(d.score) + 3;
                        else if (d.score < 0)
                            return y(d.score) - height;
                        else
                            return height - y(d.score);
                    });
        
        // scores on bars
        bars.append("text")
            .attr('class', 'barLabels-bc')
            .attr('x', (d) => x(d.categorie) +x.rangeBand()/2)
            .attr('y', function(d){
                if (d.score >= 0 && d.score < 0.12)
                    return y(d.score) - verticalOffSetLabels*0.4;
                else if (d.score < 0 && d.score >= -0.12)
                    return y(d.score) + verticalOffSetLabels*0.7;
                else if (d.score < -0.12)
                    return y(d.score) - verticalOffSetLabels/2;
                else
                    return y(d.score) + verticalOffSetLabels;
            })
            .style('fill', function(d){
                if (d.score < 0.12 && d.score >= -0.12)
                    return 'grey';
                else
                    return 'white';
            })
            .text((d) => Math.round(d.score * 100) + "%")
            .style('opacity', 0.0)
                .transition()
                    .duration(durationAnimationBars)
                    .delay((d,i) => i * durationDelayPerBar)
                    .style('opacity', 1.0);
        
        // dashed vertical line between totaal en categories scores
        var xValueVerticalLine = bcSpcWidth/(filteredData.length) + 4;
        var line = svgBc.selectAll(".line").
            data(filteredData).enter();

        line.append("line")
            .attr('id', 'vertical-line-bc')
            .attr("x1", xValueVerticalLine)
            .attr("x2", xValueVerticalLine)
            .attr("y1", 0 - 10)
            .attr("y2", height + 25);
        
        function click(d){
            if (previouslyClickedBar == null){
                previouslyClickedBar = this;
            }
            // CASE 1: geen enkele bar momenteeel geselecteerd en je klikt op een bar => zet deze bar in focus
            if (! currentlyClicked){
                // highlight the clicked bar
                d3.select(this).style("stroke", "grey")
                               .style("stroke-width", "3px")
                               .style("fill-opacity", 1.0);
                // update histogram
                categorieInFocus = d.categorie;
                scoreInFocus = d.score*100;
                histogram.update(categorieInFocus);
                previouslyClickedBar = this;
                currentlyClicked = true;
            }
            else{
                // CASE 2.1: er is een bar geselecteerd en je klikt op deze bar => de huidige bar terug deselecteren
                if (previouslyClickedBar == this){
                    // dehighlight the currently clicked bar
                    d3.select(this).style("stroke-width", "0px")
                                   .style("fill-opacity", 0.8);
                    // put totalscore back in focus & update histogram
                    categorieInFocus = "totaal";
                    scoreInFocus = totaalscore;
                    histogram.update(categorieInFocus);
                    currentlyClicked = false;
                }
                // CASE 2.2: er is reeds een bar geselecteerd maar er wordt geklikt op een andere bar => defocus de huidig geselecteerde bar & zet de focus op de geklikte bar
                if (previouslyClickedBar != this){
                    // dehighlight the previously clicked bar
                    d3.select(previouslyClickedBar).style("stroke-width", "0px")
                                                   .style("fill-opacity", 0.8);
                    // focus on the new clicked bar
                    d3.select(this).style("stroke", "grey")
                                   .style("stroke-width", "3px")
                                   .style("fill-opacity", 1.0);
                    categorieInFocus = d.categorie;
                    scoreInFocus = d.score*100;
                    histogram.update(categorieInFocus);
                    previouslyClickedBar = this;
                }
            }
        }
        
        //TODO: zie vanboven
        // sorteer button
        var sorteerButton = d3.select("input");
        svgBc.append("text")
            .attr('class', 'textonoffswitch')
            .text("Sorteer op sterktes")
                .attr("x", 550)
                .attr("y", -20);
        sorteerButton.on("change", change);

        
        // sorteren
        function change() {
            var x0 = x.domain(filteredData.sort(this.checked
                // CASE 1: if box is ticked
                ? function(a, b) {
                        if ((a.categorie === 'totaal') || (b.categorie === 'totaal'))
                            return -1000; //totaalcategorie blijft altijd eerst staan
                        else
                            return b.score - a.score; 
                }
                // CASE 2: if box is not ticked
                : (a, b) => (d3.ascending(a.index, b.index)))
                .map(d => d.categorie))
                .copy();

            svgBc.selectAll(".bar-bc")
                .sort((a,b) => x0(a.categorie) - x0(b.categorie));
            

            var transition = svgBc.transition().duration(durationAnimationSorting),
                delay = (d,i) => i * durationDelayPerBarSorting;

            transition.selectAll(".bar-bc")
                .delay(delay)
                .attr("x", (d) => x0(d.categorie));

            transition.selectAll(".barLabels-bc")
                .attr("x", (d) => x0(d.categorie) +x0.rangeBand()/2);
            
            transition.select(".x.axis-bc")
                .call(xAxis)
              .selectAll("g")
                .delay(delay);
        }
    });
    
    return svgBc;
}


// **************************
// *        HISTOGRAM       *
// **************************
function histogramRelatievePerformantie(datafile, categorie){
    // INIT: visualisation formatting
    var paddingBars = 0.1,
        verticalOffSetLabels = 15;
    
    var fillOpacityNormal = 0.15,
        fillOpacityFocus = 0.45;
    
    // INIT: animation formatting
    var durationAnimationBars = 500,
        durationDelayPerBar = 100;
    
    var durationUpdateTitle = 500;
    
    var delayLabelsAppearance = 300;

    // INIT: standard code
    var width = histWidth - histMargin.left - histMargin.right,
        height = histHeight - histMargin.top - histMargin.bottom;
    
    // add svg to body layer
    var svgHist = bodylayer
        .append("svg")
            .attr("width", width + histMargin.left + histMargin.right)
            .attr("height", height + histMargin.top + histMargin.bottom)
        .append("g")
            .attr("transform", "translate(" + histMargin.left + "," + histMargin.top + ")");

    // scales creation
    var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], paddingBars),
        y = d3.scale.linear()
            .range([height, 0]);

    // axis creation
    var formatPercent = d3.format(".0%");
    var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom"),
        yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(formatPercent);
    
    // graph title
    var graphTitleHistMain = svgHist.append("text")
        .attr('class', 'graphtitle')
        .attr("x", -30)             
        .attr("y", 0 - verticalOffsetGraphTitle)
        .text("Situering t.o.v. andere studenten");
    
    var graphTitleHistCategory = svgHist.append("text")
        .attr('class', 'graphtitle')
        .attr("x", -30)             
        .attr("y", 0 - verticalOffsetGraphTitle + 20)
        .text(categorie)
        .style('fill', 'steelblue');
    
    // help icon
    var helpIcon = drawHelpIcon(histMargin.left + width + 55, bcSpcMargin.top - 97);
    helpIcon
        .on('mouseover', (d) => helpTooltip(
            d3.event.pageX - 30, d3.event.pageY - verticalMainTitleSpace - 20,
            620, 100,
            ['Situering t.o.v. andere studenten', 
             'Deze grafiek toont de verdeling van de scores voor de geselecteerde categorie of moeilijkheidsgraad.',
             'De grafiek geeft aan hoe jij je relatief positioneert ten opzichte van andere studenten.',
             '',
             'Klik op een staaf in de grafiek hiernaast om de verdeling van een andere categorie weer te geven.',
             'Je kan ook hoveren over elke staaf in het histogram voor meer gedetailleerde informatie.'])
        )
        .on('mouseout', () => removeTooltip())
    
    // read data
    d3.csv(datafile, function(data) {
        data.forEach(function(d) {
            d.lowbound = +d.lowbound;
            d.highbound = +d.highbound;
            if (categorie === "totaal"){
                d.aantal = +d.totaal_aantal;
                d.percent = +d.totaal_percent;
            } else if (categorie === "redeneren"){
                d.aantal = +d.redeneren_aantal;
                d.percent = +d.redeneren_percent;
            } else if (categorie === "begrippenkennis"){
                d.aantal = +d.begrippenkennis_aantal;
                d.percent = +d.begrippenkennis_percent;
            } else if (categorie === "vaardigheden"){
                d.aantal = +d.vaardigheden_aantal;
                d.percent = +d.vaardigheden_percent;
            } else if (categorie === "ruimtelijk inzicht"){
                d.aantal = +d.ruimtelijkinzicht_aantal;
                d.percent = +d.ruimtelijkinzicht_percent;
            } else if (categorie === "modelleren en combineren"){
                d.aantal = +d.modellerenencombineren_aantal;
                d.percent = +d.modellerenencombineren_percent;
            }
        });
        // [min, Q1, med, Q3, max] voor deze categorie
        var grenzen = determineCorrectRanges(categorie);
        
        // domains for x and y-axis
        x.domain(data.map((d) => d.bin));
        y.domain([0, d3.max(data, (d) => d.percent)]);

        // x-axis
        svgHist.append("g")
            .attr('class', 'x axis-hist')
            .attr('transform', "translate(0," + height + ")")
            .transition()
                .duration(1000)
                .delay(durationAnimationBars)
                .call(xAxis);
        
        // y-axis
        svgHist.append("g")
            .attr('class', 'y axis-hist')
            .transition()
                .duration(1000)
                .delay(durationAnimationBars)
                .call(yAxis);
        
        // bars
        var bars = svgHist.selectAll(".bar")
            .data(data)
            .enter().append("g");
        bars.append("rect")   
            .attr('class', 'bar-hist')
            .attr('x', (d) => x(d.bin))
            .attr('width', x.rangeBand())
            .style('fill', colourBlue)
            //opacity of own score should be focused
            .style('opacity', function(d){
                if (d.lowbound < scoreInFocus && scoreInFocus <= d.highbound)
                    return fillOpacityFocus;
                else
                    return fillOpacityNormal;
            })   
          //tooltip
            .on('mouseover', function(d){;
                var thisBar = d3.select(this);
                thisBar
                    .style('fill', (d) => hoverColourBar(d))
                    .style('opacity', fillOpacityFocus+0.3);
                drawTooltipHist(d,
                    d3.event.pageX - 30, 
                    d3.event.pageY - 200,
                    320, 105, categorieInFocus, grenzen)
            })
            .on('mouseout', function(d){
                var thisBar = d3.select(this);
                thisBar 
                    .style('fill', colourBlue)
                    .style('opacity', function(d){
                        if (d.lowbound < scoreInFocus && scoreInFocus <= d.highbound)
                            return fillOpacityFocus;
                        else
                            return fillOpacityNormal;
                    })
                removeTooltip();
            
            })     
          // animation of bars
            .attr('height', 0)
            .attr('y', height)
            .transition()
                .duration(durationAnimationBars)
                .delay((d,i) => i * durationDelayPerBar)
                .attr('y', (d) => y(d.percent))
                .attr('height', (d) => height - y(d.percent));
                
        // function to determine the colour when you hover over a bar
        function hoverColourBar(d){
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
        
        // score labels on bars
        if (showHistBarLabels){
            bars.append("text")
                .attr('class', 'barLabels-hist')
                .attr('x', (d) => x(d.bin) +x.rangeBand()/2)
                .attr('y', (d) => calculateYPositionHistLabels(d))
                .style('fill', (d) => calculateColourHistLabels(d))
                .text((d) => Math.round(d.percent * 100) + "%")
                .style('opacity', 0)
                .transition()
                    .duration(durationAnimationBars)
                    .delay(delayLabelsAppearance)
                    .style('opacity', 1.0);
        }
        
        // axis titles
        svgHist.append("text")
            .attr('class', 'axis-title-hist')
            .attr('x', width + 10)
            .attr('y', height + 5)
            .text('score (%)')
            .style('opacity', 0)
            .transition()
                .duration(durationAnimationBars)
                .delay(durationAnimationBars)
                .style('opacity', 1.0);
        
        svgHist.append("text")
            .attr('class', 'axis-title-hist')
            .attr('x', -30)
            .attr('y', 0 - 15)
            .text('frequentie (%)')
            .style('opacity', 0)
            .transition()
                .duration(durationAnimationBars)
                .delay(durationAnimationBars)
                .style('opacity', 1.0);
        
        // vertical line to denote 'jouw score'
        var xPositionLine = calculateXPositionHistLine();
        svgHist.append("line")
            .attr('id', 'vertical-line-hist')
            .attr("x1", xPositionLine)
            .attr("x2", xPositionLine)
            .attr("y1", 0 - 30)
            .attr("y2", height)
            .style('opacity', 0)
            .transition()
                .duration(durationAnimationBars)
                .delay(durationAnimationBars*4)
                .style('opacity', 1.0);
        
            // 'jouw score' tekst
        svgHist.append("text")
            .attr('id', 'text-vertical-line-hist')
            .attr('x', xPositionLine + 10)
            .attr('y', 0 - 25)
            .text('Jouw score')
            .style('opacity', 0)
            .transition()
                .duration(durationAnimationBars)
                .delay(durationAnimationBars*4)
                .style('opacity', 1.0);
        
            // het eigenlijke percentage
        var lineTextScore = svgHist.append("text")
            .attr('id', 'score-vertical-line-hist')
            .attr('x', xPositionLine + 30)
            .attr('y', -5)
            .text(Math.round(scoreInFocus) + "%")
            .style('fill', colourScorePercentage(scoreInFocus, grenzen))
            .style('opacity', 0)
            .transition()
                .duration(durationAnimationBars)
                .delay(durationAnimationBars*4)
                .style('opacity', 1.0);
        
        function calculateXPositionHistLine(){
            for (d in data){
                if (data[d].lowbound < scoreInFocus && scoreInFocus <= data[d].highbound)
                    return x(data[d].bin) + ((scoreInFocus%10)/10)*x.rangeBand();
            }
        }
        
        // Teken de ranges van de verschillende groepen met gekleurde rechthoekjes vanonder.
        function determineCorrectRanges(categorie){
            var grenzen = [];
            if (categorie === "totaal"){
                grenzen = grenzenTotaal;
            } else if (categorie === "redeneren"){
                grenzen = grenzenRedeneren;
            } else if (categorie === "begrippenkennis"){
                grenzen = grenzenBegrippenkennis;
            } else if (categorie === "vaardigheden"){
                grenzen = grenzenBegrippenkennis;
            } else if (categorie === "ruimtelijk inzicht"){
                grenzen = grenzenRuimtelijk;
            } else if (categorie === "modelleren en combineren"){
                grenzen = grenzenModelleren;
            } else if (categorie === "1 ster"){
                grenzen = grenzen1ster;
            } else if (categorie === "2 sterren"){
                grenzen = grenzen2sterren;
            } else if (categorie === "3 sterren"){
                grenzen = grenzen3sterren;
            } else if (categorie === "4 sterren"){
                grenzen = grenzen4sterren;
            }
            return grenzen;
        }
        
        function paintColouredRangeRects(categorie){
            var grenzenToDraw = grenzen;
            grenzenToDraw[0] = -0.3;
            grenzenToDraw[grenzen.length - 1] = 1.0;
            return drawColouredRangeRects(grenzenToDraw, colourScale, 5, height, width*0.97, 6);
        }
        var svgColoredRects = paintColouredRangeRects(categorie);        
        
        // update histogram when another cathegory is clicked on in the bar chart
        svgHist.update = function(categorie){
            console.log("updating histogram!");
            grenzen = determineCorrectRanges(categorie);
            
            // update data
            data.forEach(function(d) {
                if (categorie === "totaal"){
                    d.aantal = +d.totaal_aantal;
                    d.percent = +d.totaal_percent;
                } else if (categorie === "redeneren"){
                    d.aantal = +d.redeneren_aantal;
                    d.percent = +d.redeneren_percent;
                } else if (categorie === "begrippenkennis"){
                    d.aantal = +d.begrippenkennis_aantal;
                    d.percent = +d.begrippenkennis_percent;
                } else if (categorie === "vaardigheden"){
                    d.aantal = +d.vaardigheden_aantal;
                    d.percent = +d.vaardigheden_percent;
                } else if (categorie === "ruimtelijk inzicht"){
                    d.aantal = +d.ruimtelijkinzicht_aantal;
                    d.percent = +d.ruimtelijkinzicht_percent;
                } else if (categorie === "modelleren en combineren"){
                    d.aantal = +d.modellerenencombineren_aantal;
                    d.percent = +d.modellerenencombineren_percent;
                } else if (categorie === "1 ster"){
                    d.aantal = +d.eenster_aantal;
                    d.percent = +d.eenster_percent;
                } else if (categorie === "2 sterren"){
                    d.aantal = +d.tweesterren_aantal;
                    d.percent = +d.tweesterren_percent;
                } else if (categorie === "3 sterren"){
                    d.aantal = +d.driesterren_aantal;
                    d.percent = +d.driesterren_percent;
                } else if (categorie === "4 sterren"){
                    d.aantal = +d.viersterren_aantal;
                    d.percent = +d.viersterren_percent;
                }
            })
            
            // update the domain of the y-axis map to reflect change.
            y.domain([0, d3.max(data, (d) => d.percent)]);
            
            // change y axis
            svgHist.select(".y.axis-hist")
                .transition().duration(durationUpdateTitle)
                .call(yAxis);
            
            // update graph title
            graphTitleHistCategory
                .transition().duration(durationUpdateTitle)
                    .style('opacity', 0)
                .transition().duration(durationUpdateTitle)
                    .style('opacity', 0.5)
                    .text(categorie);
                        
            // update bars
            bars.selectAll("rect")   
                .transition()
                    .duration(durationAnimationBars)
                    .attr('y', (d) => y(d.percent))
                    .attr('height', (d) => height - y(d.percent))
                .style('opacity', function(d){
                        if (d.lowbound < scoreInFocus && scoreInFocus <= d.highbound)
                            return fillOpacityFocus;
                        else
                            return fillOpacityNormal;
                    });
            
            // update text labels
            if (showHistBarLabels){
                bars.selectAll("text")
                    .text((d) => Math.round(d.percent * 100) + "%")
                    .attr('y', (d) => calculateYPositionHistLabels(d))
                    .style('fill', (d) => calculateColourHistLabels(d))
                    .style('opacity', 0)
                    .transition().duration(durationAnimationBars)
                        .delay(delayLabelsAppearance)
                        .style('opacity', 1.0);
            }
            
            // update vertical line
            svgHist.select('#vertical-line-hist')
                .transition().duration(durationUpdateTitle)
                    .attr("x1", calculateXPositionHistLine())
                    .attr("x2", calculateXPositionHistLine());
            
            svgHist.select("#text-vertical-line-hist")
                .transition().duration(durationUpdateTitle)
                    .attr('x', calculateXPositionHistLine() + 10);
            
            svgHist.select("#score-vertical-line-hist")
                .transition().duration(durationUpdateTitle)
                    .attr('x', calculateXPositionHistLine() + 30)
                    .style('fill', colourScorePercentage(scoreInFocus, grenzen))
                    .text(Math.round(scoreInFocus) + "%");
            
            // update coloured rects at bottom
            //svgColoredRects.selectAll("*").remove();
            paintColouredRangeRects(categorie);
            
        }        
    });
    
    // help functions histograms
    function calculateYPositionHistLabels(d){
        if (d.percent > 0.02){
            return y(d.percent) + verticalOffSetLabels;
        } 
        else if (d.percent > 0){
            return y(d.percent) - verticalOffSetLabels + 10;
        } 
        else{ // if score is too small, just plot above the x-axis
            return height - 5;
        }
    }
    
    function calculateColourHistLabels(d){
        if (d.percent * 100 > 2){
            return "white" //"black";
        }
        else{ // if score is too small, just plot above the x-axis
            return "black"; //"grey";
        }
    }
    return svgHist;
}

// help functions general
function colourBar(d, i){
    if (i == 0){
        return colourBlue;
    }
    else if (d.score < d.Q1) {
        return colourScale[0];
    }
    else if (d.score < d.med){
        return colourScale[1];
    }
    else if (d.score < d.Q3){
        return colourScale[2];
    } 
    else {
        return colourScale[3];
    }
}

function colourScorePercentage(score, grenzen){
    var score = score/100;
    if (score < grenzen[1]) {
        return colourScale[0];
    }
    else if (score < grenzen[2]){
        return colourScale[1];
    }
    else if (score < grenzen[3]){
        return colourScale[2];
    } 
    else {
        return colourScale[3];
    }
}

function group(d){
    if (d.score < d.Q1) {
        return 'D';
    }
    else if (d.score < d.med){
        return 'C';
    }
    else if (d.score < d.Q3){
        return 'B';
    } 
    else {
        return 'A';
    }
}
// OLD groups
//function colourBar(d, i){
//    if (i == 0){
//        return colourBlue;
//    }
//    else if (d.score < d.Q1) {
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

function stringToList(str){
    var strSplit = str.split(","),
        result = []
    for (i=0; i<strSplit.length; i++){
        result.push(+strSplit[i]);
    }
    return result;
}

function idxOfMinimum(lst){
    var idx = 0,
        min = Number.MIN_VALUE;
    for (i=0; i < lst.length; i++){
        if (lst[i] < min){
            idx = i;
        }
    }
    return idx;
}