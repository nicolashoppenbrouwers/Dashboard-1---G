function drawColouredRangeRects(grenzen, colors, x, y, widthSvg, heightSvg){
    // INIT: margins
    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        totalWidth = widthSvg - margin.right - margin.left,
        totalHeight = heightSvg - margin.top - margin.bottom;
    
    // INIT: formatting options
    var spacing = 0;

    // INIT: animation options
    var animationDuration = 800,
        animationDelayPerRect = 250;

    // Create svg
    var svgColoredRects = histogram
        .append("svg")
            .attr("width", widthSvg + x)
            .attr("height", heightSvg + y)
        .append("g")
            .attr("transform", "translate(" + (margin.left+x) + "," + (margin.top+y) + ")");

    // Creating & drawing graadmeter
    var nbRects = grenzen.length - 1,
        totalRange = grenzen[grenzen.length-1] - grenzen[0];
        
    // Draw rectangles
    var widthRectangles = calculateWidthRectangles(totalWidth, nbRects, grenzen);
    for (j = 0; j < nbRects; j++){
        var rect = svgColoredRects.append("rect")
            .attr('class', 'histogramranges-rect')
            .attr('x', sumTillIndex(widthRectangles, j) + j*spacing)
            .attr('y', margin.top)
            .attr('width', 0)
            .attr('height', heightSvg)
            // animation
            .attr('fill', 'ghostwhite')
            .transition()
                .duration(animationDuration)
                .delay(animationDelayPerRect*j)
                .attr('width', widthRectangles[i])
                .attr("fill", function(){
                    return colors[j];
                });
    }
    
    // Help method: calculate widths of the rectangles
    function calculateWidthRectangles(totWidth, nbRects, ranges){
        var widthRects = [],
            totalRange = ranges[ranges.length-1] - ranges[0];

        for (i = 0; i < nbRects; i++){
            var proportion = (grenzen[i+1] - grenzen[i]) / totalRange;
            widthRects.push(proportion * totWidth);
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
    
    return svgColoredRects;
}