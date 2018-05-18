//TODO gem en jouw score overlappen vaak; bv Jouw score vervangen door "Jij"
//TODO: de vakjes kloppen niet helemaal omdat je met de grens van 0.5 werkt, dat is nogal moeilijk soms precies...
//TODO: choose the animation for the graadmeter if also width should be animated
function createGraadmeter(grenzen, jouwScore, gem, colors, x, y, widthSvg, heightSvg, proportionalWidths, grenzenOp20){
    // INIT: margins
    var margin = {top: 30, right: 40, bottom: 10, left: 30},
        totalWidth = widthSvg - margin.right - margin.left,
        totalHeight = heightSvg - margin.top - margin.bottom;
    
    // INIT: formatting options
    var heightPerRect = totalHeight/4,
        verticalOffsetText = [13,22],
        spacing = 1.5;

    // INIT: animation options
    var animationDuration = 800,
        animationDelayPerRect = 300;

    // Create svg
    var svgGraadmeter = tooltipLayer
        .append("svg")
            .attr("width", widthSvg + x)
            .attr("height", heightSvg + y)
        .append("g")
            .attr("transform", "translate(" + (margin.left+x) + "," + (margin.top+y) + ")");

    // Creating & drawing graadmeter
    var nbRects = grenzen.length - 1,
        totalRange = grenzen[grenzen.length-1] - grenzen[0];
    paintGraadmeter(nbRects);
    
    // Method to draw graadmeter
    function paintGraadmeter(nbRects){
        
        // Draw rectangles
        var widthRectangles = calculateWidthRectangles(totalWidth, nbRects, grenzen, proportionalWidths);
        for (j = 0; j < nbRects; j++){
            var rect = svgGraadmeter.append("rect")
                .attr('class', 'graadmeter-rect')
                .attr('x', sumTillIndex(widthRectangles, j) + j*spacing)
                .attr('y', margin.top)
                //.attr('width', 0)
                .attr('width', widthRectangles[i])
                .attr('height', heightPerRect)
                // animation
                .attr('fill', 'ghostwhite')
                .transition()
                    //.ease('elastic')
                    .duration(animationDuration)
                    .delay(animationDelayPerRect*j)
                    //.attr('width', widthRectangles[i])
                    .attr("fill", function(){
                        return colors[j];
                    });
        }

        // Draw text under rects
        for (j = 0; j < nbRects+1; j++){
            svgGraadmeter.append("text")
                .attr('class', 'graadmeter-rect-text')
                .attr('x', sumTillIndex(widthRectangles, j) + j*spacing)
                .attr('y', margin.top + heightPerRect + verticalOffsetText[0])
                .style('text-anchor', 'middle')
                .text(function(){
                    if (grenzenOp20)
                        return grenzen[i].toString()+"/20"
                    else
                        return grenzen[i].toString()+"%";
                })
                // animation
                .style('opacity', 0)
                .transition()
                    .duration(animationDuration)
                    .delay(animationDelayPerRect*j)
                    .style('opacity', 1.0)
        }
        
        drawVerticalLine(jouwScore, 700);
        drawText(jouwScore, 'Jouw score', verticalOffsetText, 700);
        drawTriangle(jouwScore, 5, 8, 700);
        drawVerticalLine(gem, 0);
        drawText(gem, 'Gem.', verticalOffsetText, 0);
        drawTriangle(gem, 5, 8, 0);
    }

    // Help method: calculate widths of the rectangles
    function calculateWidthRectangles(totWidth, nbRects, ranges, propotionalWidths){
        var widthRects = [],
            totalRange = ranges[ranges.length-1] - ranges[0];

        // OPTION 1: The width of each rectangle is proportional to its range.
        if (proportionalWidths){
            for (i = 0; i < nbRects; i++){
                var proportion = (grenzen[i+1] - grenzen[i]) / totalRange;
                widthRects.push(proportion * totWidth);
            }
        }
        // OPTION 2: Each rectangle has same length (length = widthAllRects / nbRects)
        else{
            for (i = 0; i < nbRects; i++){
                widthRects.push(totWidth/nbRects)
            }
        }
        return widthRects;
    }

    // Help method: calculate sum of elements in list till certain index
    function sumTillIndex(lst, idx){
        var sum = 0;
        for (i=0; i < idx; i++){
            sum += lst[i];
        }
        return sum;
    }
    
    function drawVerticalLine(score, extraDelay){
        // Draw vertical line
        var xPositionLine = (score-grenzen[0]) / totalRange * totalWidth;
        svgGraadmeter.append("line")
            .attr('class', 'graadmeter-vertline')
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', margin.top)
            .attr('y2', margin.top+heightPerRect)
            // animation
            .transition()
                .duration(animationDuration*2)
                .delay(animationDelayPerRect*4 + extraDelay)
                .attr('x1', xPositionLine)
                .attr('x2', xPositionLine);

    }
    
    function drawText(score, text, textOffset, extraDelay){
        var xPositionLine = (score-grenzen[0]) / totalRange * totalWidth;
        var textSplit = text.split(" ");
        // Text
        for (i = 0; i<textSplit.length; i++){
            svgGraadmeter.append("text")
                .attr('class', 'graadmeter-text')
                .attr('x', 0)
                .attr('y', margin.top - textOffset[textSplit.length-1 - i])
                .style('text-anchor', 'middle')
                .text(textSplit[i])
                // animation
                .style('opacity',0)
                .transition()
                    .duration(animationDuration*2)
                    .delay(animationDelayPerRect*4 + extraDelay)
                    .attr('x', xPositionLine)
                    .style('opacity', 1);
        }
    }
    
    function drawTriangle(score, widthTriangle, heightTriangle, extraDelay){
        var xPosMiddle = (score-grenzen[0]) / totalRange * totalWidth;
        
        var initPoints = [ 
            {"x": 0, "y": margin.top},  
            {"x": 0-widthTriangle, "y": margin.top-heightTriangle},
            {"x": 0+widthTriangle, "y": margin.top-heightTriangle}, 
            {"x": 0, "y": margin.top}]

        var trianglePoints = [ 
            {"x": xPosMiddle, "y": margin.top},  
            {"x": xPosMiddle-widthTriangle, "y": margin.top-heightTriangle},
            {"x": xPosMiddle+widthTriangle, "y": margin.top-heightTriangle}, 
            {"x": xPosMiddle, "y": margin.top}];
    
        var lineFunction = d3.svg.line()
            .x((d) => d.x)
            .y((d) => d.y)
            .interpolate("linear");
        
        svgGraadmeter.append("path")
            .attr('class', 'graadmeter-triangle')
            .attr("d", lineFunction(initPoints))
            // animation
            .transition()
                .duration(animationDuration*2)
                .delay(animationDelayPerRect*4 + extraDelay)
                .attr("d", lineFunction(trianglePoints));
    }
}