function drawTitle(){
     //Tekst: titel
    titlelayer.append("text")
        .attr('id', 'titlelayer-h1')
        .attr('x', 70)
        .attr('y', 40)
        .text('Dashboard ijkingstoets ');
    
    // Tekst: verwelkoming
    titlelayer.append("text")
        .attr('id', 'titlelayer-p')
        .attr('x', 70)
        .text('Dag ' + naam + ", dit zijn jouw resultaten van de ijkingstoets:")
//        .attr('opacity', 0)
//        .attr('y', 54)
//        .transition()
//            .duration(1000)
            .attr('y', 59)
            .style('opacity', 1.0);
    
    // Logo ijkingstoets
    titlelayer.append("svg:image")
        .attr("xlink:href", "https://www.ijkingstoets.be/img/logo-ijkingstoets-small.png")
        .attr("width", 100)
        .attr("height", 80)
        .attr("x", screen.width * 7/8)
        .attr("y", 0);
    
    // make the logo clickable so it goes to the site
    titlelayer.append("a")
            .attr("xlink:href", "https://www.ijkingstoets.be/")
        .append("rect")  
            .attr("width", 100)
            .attr("height", 80)
            .attr("x", screen.width * 7/8)
            .attr("y", 0)
            .style("opacity", 0);

    // Logo KU Leuven
//    titlelayer.append("svg:image")
//        .attr("xlink:href", "https://feb.kuleuven.be/antwerpen/Regelgeving/documenten/kuleuven-logo.jpg")
//        .attr("width", 100)
//        .attr("height", 80)
//        .attr("x", screen.width - 400)
//        .attr("y", 0);
    
    // Personal details
    titlelayer.append("text")
        .attr('id', 'titlelayer-p')
        .attr('x', screen.width * 3/4)
        .attr('y', 33)
        .text(naam + " " + achternaam);
    
    titlelayer.append("text")
        .attr('id', 'titlelayer-p')
        .attr('x', screen.width * 3/4)
        .attr('y', 53)
        .text('Ijkingstoets ' + datumIjk);
    
//    titlelayer.append("line")
//        .attr('id', 'titlelayer-line')
//        .attr("x1", 0)
//        .attr("x2", screen.width)
//        .attr("y1", 73)
//        .attr("y2", 73);
}

function drawGlobalVerticalLine(x, y){
    bodylayer.append("line")
        .attr('id', 'global-vertical-line')
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", 0)
        .attr("y2", y);
}


