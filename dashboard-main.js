drawTitle();
drawGlobalVerticalLine(screen.width*3/5 + 50, 5/6*screen.height - 20);

drawHeatmap(dataHeatmap);
var svgBc = barChartScorePerCategorie(dataBarChart);
var histogram = histogramRelatievePerformantie(dataHistogram, "totaal");
createMenuToChangeBarchart();

// Create tooltip layer
// This code should be last, because it needs to be painted on top
var tooltipLayer = bodylayer
    .attr('id', 'tooltipLayer')
    .append("svg");

// Code to be able to make tooltiplayer unvisible
function removeTooltip(){
    tooltipLayer.selectAll("*").remove()
}
