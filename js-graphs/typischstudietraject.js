// INITIALIZATION: formatting
var widthBetweenLevels = 220,
    maxWidthEdges = 140,
    circle_radius = 10;

// INIT: visualisation
var opacityEdgeInFocus = 0.80,
    opacityEdgeNotInFocus = 0.125;

// INIT: svg
var svgStrDiagram = bodylayer
    .append("svg")
        .attr("width", widthStrD + marginStrD.right + marginStrD.left)
        .attr("height", heightStrD + marginStrD.top + marginStrD.bottom)
    .append("g")
        .attr("transform", "translate(" + marginStrD.left + "," + marginStrD.top + ")");

// INIT: D3 standard code to make tree structure
var i = 0,
    duration = 1500,
    root,
    stroomInFocus = determineStroom();

var tree = d3.layout.tree()
    .size([heightStrD, widthStrD]);

var diagonal = d3.svg.diagonal()
    .projection((d) => [d.y, d.x]);

root = treeData[0];
root.x0 = heightStrD / 2;
root.y0 = 0;

// graph title
svgStrDiagram.append("text")
    .attr('class', 'graphtitle')
    .attr('x', -4*margin.left)             
    .attr('y', 0 - verticalParagraphSpace)
    .text("Typisch studietraject");

svgStrDiagram.append("text")
    .attr('class', 'graphexplanation')
    .attr('x', -4*margin.left)             
    .attr('y', 0 - verticalTitleSpace / 2)
    .text("Het typische stroomverloop van studenten tot na de januari-examens op basis");
svgStrDiagram.append("text")
    .attr('class', 'graphexplanation')
    .attr('x', -4*margin.left)             
    .attr('y', 0 - verticalTitleSpace / 2 + 20)
    .text("van de totaalscore. De stroom waartoe jij behoort is gehighlight.");

// help icon
var helpIcon = drawHelpIcon(marginStrD.left + widthStrD + 100, marginStrD.top - 66);
helpIcon
    .on('mouseover', (d) => helpTooltip(
        d3.event.pageX - 590, d3.event.pageY - verticalMainTitleSpace - 50,
        520, 265,
        ['Typisch studietraject', 
         'De grafiek toont het stroomverloop tot na de januari examens. De grafiek is gebaseerd', 
         'op de resultaten van deelnemers van voorgaande edities. De stroom waartoe jij zou',
         'behoren in deze data is gehighlight.',
         '',
         'Deze figuur toont dat de wiskundige voorkennis, gemeten tijdens de ijkingstoets,',
         'een belangrijke factor is voor je toekomstige studiesucces. Bij de groep die slaagde',
         'op de ijkingstoets heeft een aanzienlijk deel na de januari-zittijd een hoge studie-',
         'efficiëntie (groene stroom). Van studenten uit de groene stroom weten we dat ze bijna',
         'allemaal hun bachelor in drie jaar zullen behalen. Een goede ijkingstoetsscore is echter',
         'geen garantie op succes in de opleiding. Hard werken, een goede studieaanpak en',
         'motivatie blijven heel belangrijk!',
         '',
         'Voor studenten die niet slaagden op de ijkingstoets blijkt het heel moeilijk te zijn om het',
         'bijspijkeren van de voorkennis te combineren met hun studie. Meer dan de helft van',
         'de vroegere deelnemers is ofwel al gestopt met de opleiding in de loop van het eerste',
         'semester (zwarte stroom) of heeft een zeer lage studie-efficiëntie in januari (rode ',
         'stroom). Van studenten uit de rode stroom weten we dat het heel moeilijk zal zijn om',
         'het bachelordiploma ingenieurswetenschappen te behalen.'])
    )
    .on('mouseout', () => removeTooltip())

update(root);
d3.select(self.frameElement).style("height", "1500px"); // geen idee waarvoor dit dient



function update(source) {
    
    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

    /////////////////////////////////////////////
    /*******************************************/
    /*****              NODES              *****/
    /*******************************************/
    /////////////////////////////////////////////
    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * widthBetweenLevels; });

    // Update the nodes...
    var node = svgStrDiagram.selectAll("g.node")
        .data(nodes, (d) => d.id || (d.id = ++i));

    /////////////////////////
    ///     NODE ENTER    ///
    /////////////////////////
    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
        .attr('class', 'node')
        .attr('transform', (d) => "translate(" + source.y0 + "," + source.x0 + ")")
        .on('click', click)
        .on('mouseover', (d) =>
            drawTooltipStudieTrajectNodes(d,
                d3.event.pageX - 300, 
                d3.event.pageY - 180,
                245, 105)
        )
        .on('mouseout', () => removeTooltip());

    nodeEnter.append("circle")
        .attr('r', 1e-6)
        .style('stroke', determineNodeStrokeColour)
        .style('fill', function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    // Text above nodes: tekst boven de takken (level 0 en level 1) + percentages helemaal rechts (level 2).
    nodeEnter.append("text")
        .attr('class', 'nodeText')
        .attr('x', function(d){
            if (d.level == 0)
                return 0;
            else if (d.level == 1)
                return 0;
            else   
                return 22;
        })
        .attr('y', function(d){
            if (d.level == 0)
                return -20;
            else if (d.level == 1)
                return -40;
            else
                return 0;
        })
        .style('dy', '.35em')
        .style('text-anchor', function(d){
            if (d.level == 2)
                return 'start';
            else
                return 'middle';
        })
        .text(function(d){
            if (d.level === 0 || d.level == 1)
                return d.name;
            if (d.level === 2)
                return Math.round(d.percentage*1000)/10 + '%';
        })
        .style("fill-opacity", 1e-6);
    
    // Text inside the nodes: het aantal deelnemers
    nodeEnter.append('text')
        .attr('class', function (d){
            if (d.level === 0)
                return 'nodeTextNumberBig';
            else if (d.level == 1)
                return 'nodeTextNumberSmall';
        })
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', ".45em")
        .attr('text-anchor', 'middle')
        .text(function(d){
            if (d.level === 0 || d.level == 1)
                return d.aantal;
        })
        .style('fill', determineNodeStrokeColour)
        .style('opacity', 0)
        .transition()
            .duration(duration/2)
            .delay(duration*0.33)
            .style('opacity', 0.9);

    //////////////////////////
    ///     NODE UPDATE    ///
    //////////////////////////
    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(duration)
        .attr('transform', (d) => "translate(" + d.y + "," + d.x + ")");

    nodeUpdate.select("circle")
        .attr('r', (d) => d.aantal.toString() / totaalAantalDeelnemers * maxWidthEdges / 2)
        .style('fill', function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeUpdate.select("text")
        .style('fill-opacity', 1);

    ////////////////////////
    ///     NODE EXIT    ///
    ////////////////////////
    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr('transform', (d) => "translate(" + source.y + "," + source.x + ")")
        .remove();

    nodeExit.select("circle")
        .attr('r', 1e-6);

    nodeExit.select("text")
        .style('fill-opacity', 1e-6);

    /////////////////////////////////////////////
    /*******************************************/
    /*****              LINKS              *****/
    /*******************************************/
    /////////////////////////////////////////////
    // Update the links…
    var link = svgStrDiagram.selectAll("path.link")
        .data(links, function(d) { return d.target.id; });
    
    /////////////////////////
    ///     LINK ENTER    ///
    /////////////////////////
    // Enter any new links at the parent's previous position.
    var links = link.enter().insert("path", "g")
        .attr('class', "link")
        .attr('d', function(d) {
            var o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
        })
        .attr('stroke-width', function(d){
            var thickness = d.target.aantal/totaalAantalDeelnemers * maxWidthEdges;
            return thickness.toString() + "px";
        })
        .attr('stroke', determineEdgeColour)
        .attr('opacity', determineEdgeOpacity)
        .on('mouseover', function(d){;
            var thisLink = d3.select(this);
            thisLink
                .style('opacity', 1.0);
            drawTooltipStudieTrajectEdges(d,
                d3.event.pageX - 420, 
                d3.event.pageY - 150,
                370, 80)
        })
        .on('mouseout', function(d){
            var thisLink = d3.select(this);
            thisLink 
                .style('opacity', determineEdgeOpacity)
            removeTooltip();
        });

    //////////////////////////
    ///     LINK UPDATE    ///
    //////////////////////////
    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr('d', diagonal);

    ////////////////////////
    ///     LINK EXIT    ///
    ////////////////////////
    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr('d', function(d) {
            var o = {x: source.x, y: source.y};
            return diagonal({source: o, target: o});
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

// Toggle children on click.
function click(d) {
    if (d.children && d.level != 0) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    update(d);
}

// Legend
createLegend(4);
function createLegend(nb){
    for (i = 0; i < nb; i++){
        // CIRCLES for the legend
        var xPos = 120 + 70*i;
        var yPos = heightStrD + 20
        var circle = svgStrDiagram.append("circle")
            .attr('cx', xPos)
            .attr('cy', yPos)
            .attr('r', 10)
            .attr('fill', coloursStrD[i])
            .attr('opacity', opacityEdgeInFocus)
            .on('mouseover', (d) => helpTooltipLegendStudieTracject(
                d3.event.pageX - 575, d3.event.pageY - verticalMainTitleSpace - 50,
                510, 110)
            )
            .on('mouseout', () => removeTooltip());
        
        // TEXT for the legend
        var text = svgStrDiagram.append("text")
            .attr('class', 'txtLegend-StroomDiagramma')
            .attr("x", xPos)
            .attr("y", yPos + 25)
            .text( function() { return studieTrajectEndCategories[i]; })
            .attr("text-anchor", "middle")
            .on('mouseover', (d) => helpTooltipLegendStudieTracject(
                d3.event.pageX - 575, d3.event.pageY - verticalMainTitleSpace - 50,
                510, 110)
            )
            .on('mouseout', () => removeTooltip());
    }       
}


// Help functions
function determineEdgeColour(d){
    if (d.source.level == 0){
        switch(stroomInFocus) {
            case 1:
                if (d.target.name == studieTrajectStromen[1])
                    return colourBlue;
                else
                    return colourGrey;
            case 2:
                if (d.target.name == studieTrajectStromen[2])
                    return colourBlue;
                else
                    return colourGrey;
            case 3:
                if (d.target.name == studieTrajectStromen[3])
                    return colourBlue;
                else
                    return colourGrey;
        }
    }
    else {
        if (d.target.name == studieTrajectEndCategories[0]) //goed
            return coloursStrD[0];
        else if (d.target.name == studieTrajectEndCategories[1]) //middel
            return coloursStrD[1];
        else if (d.target.name == studieTrajectEndCategories[2]) //slecht
            return coloursStrD[2];
        else if (d.target.name == studieTrajectEndCategories[3]) //drop-out
            return coloursStrD[3];
    }
}

function determineNodeStrokeColour(d){
    if (d.level == 0)
        return colourBlue;
    else if (d.level == 1){
        switch(stroomInFocus) {
            case 1:
                if (d.name == studieTrajectStromen[1])
                    return colourBlue;
                else
                    return colourGrey;
            case 2:
                if (d.name == studieTrajectStromen[2])
                    return colourBlue;
                else
                    return colourGrey;
            case 3:
                if (d.name == studieTrajectStromen[3])
                    return colourBlue;
                else
                    return colourGrey;
        }
    }
    else {
        switch(stroomInFocus) {
            case 1:
                if (d.parent.name == studieTrajectStromen[1])
                    return colourBlue;
                else
                    return colourGrey;
            case 2:
                if (d.parent.name == studieTrajectStromen[2])
                    return colourBlue;
                else
                    return colourGrey;
            case 3:
                if (d.parent.name == studieTrajectStromen[3])
                    return colourBlue;
                else
                    return colourGrey;
        }
    }
}

function determineEdgeOpacity(d){
    switch(stroomInFocus) {
        case 1:
            if (d.target.name == studieTrajectStromen[1] || d.source.name == studieTrajectStromen[1])
                return opacityEdgeInFocus;
            else
                return opacityEdgeNotInFocus;
        case 2:
            if (d.target.name == studieTrajectStromen[2] || d.source.name == studieTrajectStromen[2])
                return opacityEdgeInFocus;
            else
                return opacityEdgeNotInFocus;
        case 3:
            if (d.target.name == studieTrajectStromen[3] || d.source.name == studieTrajectStromen[3])
                return opacityEdgeInFocus;
            else
                return opacityEdgeNotInFocus;
    }
}

function determineStroom(){
    if (totaalscore >= 14/20)       // bovenste stroom
        return 1;
    else if (totaalscore < 8/20)    // onderste stroom
        return 3;
    else                            // middelste stroom
        return 2;
}