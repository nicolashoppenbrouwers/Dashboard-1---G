// Code to change the bar chart:
//      show scores per category or per difficulty level
// TODO: misschien wat refactoren, iets efficienter maken
function createMenuToChangeBarchart(){
    // INIT: formatting options
    var durationAnimationArrow = 200,
        durationAnimationOpenMenu = 300;

    var backgroundColourHeaderMenu = colourGrey,
        backgroundColourMenu = 'ghostwhite';
    
    // INIT: create svg
    var svgOptionMenu = bodylayer
        .append("svg")
            .attr("width", bcSpcWidth)
            .attr("height", bcSpcHeight)
        .append("g")
            .attr("transform", "translate(" + bcSpcMargin.left + "," + (bcSpcMargin.top-verticalOffsetGraphTitle - 25) + ")");
    
    var svgMenu = svgOptionMenu
        .append("svg")
            .attr('width', bcSpcWidth)
            .attr('height', bcSpcHeight)
        .append("g")
            .attr('transform', "translate(" + 10 + "," + 0 + ")"); 
    
    var vButtonClicked = false;
    drawMenu(290,23,8,12);
    
    function drawMenu(x, y, widthTriangle, heightTriangle){
        
        // Draw V-button
        var trianglePoints = [ 
            {"x": x-widthTriangle, "y": y-heightTriangle}, 
            {"x": x, "y": y},  
            {"x": x+widthTriangle, "y": y-heightTriangle},
        ];
        var lineFunction = d3.svg.line()
            .x((d) => d.x)
            .y((d) => d.y)
            .interpolate("linear"); 
        
        var vButton = svgOptionMenu.append("path")
            .attr('class', 'Vbutton')
            .attr('d', lineFunction(trianglePoints))
            .style('fill', 'white')
            .on('click', function(){
                if (!vButtonClicked)
                    openMenu();
                else
                    closeMenu();
            });

        // Open the menu
        function openMenu(){
            vButtonClicked = true;
            // Reverse triangle
            var reversedTrianglePoints = [ 
                {"x": x-widthTriangle, "y": y}, 
                {"x": x, "y": y-heightTriangle},  
                {"x": x+widthTriangle, "y": y},
            ];
            vButton.transition()
                .duration(durationAnimationArrow)
                .attr('d', lineFunction(reversedTrianglePoints))
                .style('fill', backgroundColourHeaderMenu)
                .style('fill-opacity', 0.1);

            // Open the menu options
            var offset = {x: 2, y: 3},
                widthRects = [300, 485, 485],
                heightRects = [30, 26, 26],
                fillColours = [backgroundColourHeaderMenu, backgroundColourMenu, backgroundColourMenu],
                opacity = [0.1, 0.95, 0.95]

            // First rectangle: header rectangles around "Sterktes & werkpunten"
            svgMenu.append("rect")
                .attr('class', 'optionMenu-rect')
                .attr('x', offset.x)
                .attr('y', offset.y)
                .attr('rx', 0)
                .attr('width', widthRects[0])
                .attr('height', 0)
                // animation
                .attr('fill', fillColours[0])
                .style('opacity', 0)
                .transition()
                    .duration(durationAnimationOpenMenu)
                    .delay(0)
                    .attr('height', heightRects[0])
                    .style('opacity', opacity[0]);

            // The 2 option rectangles below
            var optionsText = ['', '> Op basis van de score per categorie vragen', '> Op basis van de score per moeilijkheidsgraad'];
            var i = 1;
                svgMenu.append("rect")
                    .attr('class', 'optionMenu-rect')
                    .attr('x', offset.x)
                    .attr('y', offset.y + heightRects[0] + (i-1)*heightRects[i-1])
                    .attr('width', widthRects[i])
                    .attr('height', 0)
                    .on('mouseover', function(){
                        d3.select(this).style('opacity', 1);
                        d3.select(this).style('fill', colourGrey);
//                            d3.select(this).style('stroke', colourBlue);
//                            d3.select(this).style('stroke-width', "1px");
                    })
                    .on('mouseout', function(){
                        d3.select(this).style('fill', backgroundColourMenu);
                        d3.select(this).style('opacity', opacity[i]);
//                            d3.select(this).style('stroke', 'none');
                    })
                    .on('click', changeBarChartToShowCategories)
                    // animation
                    .style('fill', fillColours[i])
                    .style('opacity', 0)
                    .transition()
                        .duration(durationAnimationOpenMenu)
                        .delay(durationAnimationOpenMenu*i*0.3)
                        .attr('height', heightRects[1])
                        .style('opacity', opacity[i]);

            var i = 2;
                svgMenu.append("rect")
                    .attr('class', 'optionMenu-rect')
                    .attr('x', offset.x)
                    .attr('y', offset.y + heightRects[0] + (i-1)*heightRects[i-1])
                    .attr('width', widthRects[i])
                    .attr('height', 0)
                    .on('mouseover', function(){
                        d3.select(this).style('opacity', 1);
                        d3.select(this).style('fill', colourGrey);
//                            d3.select(this).style('stroke', colourBlue);
//                            d3.select(this).style('stroke-width', "1px");
                    })
                    .on('mouseout', function(){
                        d3.select(this).style('fill', backgroundColourMenu);
                        d3.select(this).style('opacity', opacity[i]);
//                            d3.select(this).style('stroke', 'none');
                    })
                    .on('click', changeBarChartToShowMoeilijkheidsgraad)
                    // animation
                    .style('fill', fillColours[i])
                    .style('opacity', 0)
                    .transition()
                        .duration(durationAnimationOpenMenu)
                        .delay(durationAnimationOpenMenu*i*0.3)
                        .attr('height', heightRects[1])
                        .style('opacity', opacity[i]);

            // The lines between the rects and the text on the rects
            for (var i=1; i<3; i++){                                 
                svgMenu.append("line")
                    .attr('class', 'optionMenu-vertline')
                    .attr('x1', offset.x)
                    .attr('x2', offset.x + widthRects[i])
                    .attr('y1', offset.y + heightRects[0] + (i-1)*heightRects[i-1])
                    .attr('y2', offset.y + heightRects[0] + (i-1)*heightRects[i-1])
                    // animation
                    .style('opacity', 0)
                    .transition()
                        .duration(durationAnimationOpenMenu)
                        .delay(durationAnimationOpenMenu*i*0.3)
                        .attr('height', heightRects)
                        .style('opacity', opacity[i]);

                svgMenu.append("text")
                    .attr('class', 'optionMenu-text')
                    .attr('x', offset.x + 15)
                    .attr('y', offset.y + heightRects[0] + (i-1)*heightRects[i-1] + 18)
//                        .style('font-weight', function(){
//                            if (showScorePerCategorie && i == 1)
//                                return 'bold';
//                            if (!showScorePerCategorie && i == 2)
//                                return 'bold';
//                            else 
//                                return 'normal';
//                        })
//                        .text(optionsText[i])
                    .text(function(){
                        if (showScorePerCategorie && i == 1)
                            return optionsText[i].toUpperCase() + ' (momenteel)' ;
                        if (!showScorePerCategorie && i == 2)
                            return optionsText[i].toUpperCase() + ' (momenteel)' ;
                        else 
                            return optionsText[i].toUpperCase() ;
                    })
                    // animation
                    .style('opacity',0)
                    .transition()
                        .duration(durationAnimationOpenMenu*2)
                        .delay(durationAnimationOpenMenu*i*0.5)
                        .style('opacity', 0.5);
            }

            return svgMenu;
        }

        
        // Close the menu
        function closeMenu(){
            vButtonClicked = false;
            // Put triangle back
            vButton.transition()
                .duration(durationAnimationArrow)
                .attr("d", lineFunction(trianglePoints))
                .style('fill', 'white');
            // Close the menu options
            svgMenu.selectAll("*").remove();
        }

        // Change the bar chart to plot categories.
        function changeBarChartToShowCategories(){
            // CASE 1: the bar chart already shows the categories
            if (showScorePerCategorie)
                closeMenu();
            // CASE 2: the bar chart does not yet show the categoreies
            else {
                // update bar chart
                showScorePerCategorie = true;
                svgBc.selectAll("*").remove();
                svgBc = barChartScorePerCategorie(dataBarChart);
                // recreate menu, else it's no longer on top
                closeMenu();
                svgOptionMenu.selectAll('*').remove();
                createMenuToChangeBarchart();
                // recreate tooltip layer, else it's no longer on top
                bodylayer.select('#tooltipLayer').remove();
                tooltipLayer = bodylayer
                    .append("svg");
            }
        }

        // Change the bar chart to plot the moeilijkheidsgraad.
        function changeBarChartToShowMoeilijkheidsgraad(){
            // CASE 1: the bar chart already shows the moeilijkheidsgraad
            if (! showScorePerCategorie)
                closeMenu();
            // CASE 2: the bar chart does not yet show the moeilijkheidsgraad
            else {
                // update bar chart
                showScorePerCategorie = false;
                svgBc.selectAll("*").remove();
                svgBc = barChartScorePerCategorie(dataBarChart);
                // recreate menu, else it's no longer on top
                closeMenu();
                svgOptionMenu.selectAll('*').remove();
                createMenuToChangeBarchart();
                // recreate tooltip layer, else it's no longer on top
                bodylayer.select('#tooltipLayer').remove();
                tooltipLayer = bodylayer
                    .append("svg");
            }
        }
    }
}