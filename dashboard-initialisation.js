/* DATA INITIALIZATION */
var ijkVersion = 'ijk5';
var dataBarChart = "data/" + ijkVersion + "/categoriestats.csv";
var dataHistogram = "data/" + ijkVersion + "/histogramstats.csv";
var dataHeatmap = "data/" + ijkVersion + "/scorepervraag.csv";


/* LAYERS INITIALIZATION */
// -- Main title on top of the dashboard
var verticalMainTitleSpace = 75;
var titlelayer = d3.select("body")
    .append("svg")
        .attr('id', 'titlelayer')
        .attr('width', screen.width)
        .attr('height', verticalMainTitleSpace)
    .append("g")
        .attr("transform", "translate(" + 0 + "," + 0 + ")");

// -- Body layer
var maxHeight = 5/6*screen.height - 20;
var bodylayer = d3.select('body')
    .append('svg')
        .attr('id', 'bodylayer')
        .attr('width', screen.width)
        .attr('height', maxHeight)
    .append("g")
        .attr("transform", "translate(" + 50 + "," + 0 + ")");

// -- Tooltip layer
// see dashboard-main.js


/* FORMATTING */
// -- TEXT SPACE for graph titles & explanation --
var verticalTitleSpace = 60;
var verticalParagraphSpace = 60;
var verticalOffsetGraphTitle = verticalTitleSpace*1.5;
var verticalOffsetGraphParagraph = 20;


// -- COLOURS --
//OLD
//// groep E (rood), D (oranje), C(geel), B(groen) en A(donkergroen)
//var colourScale = ['#e74c3c', "#fdae61", '#FFF176', '#a6d96a', '#1a9641'];
//                //["#e74c3c", "orange", "yellow", "#2ecc71", "darkgreen"],
// groep D (rood), C (oranje), B(groen) en A(donkergroen)
var colourScale = ['#e74c3c', "#fdae61", '#a6d96a', '#1a9641'],
    coloursStrD = ["#2ecc71", "orange", "#e74c3c", "black", "#ccc"]; //green, yellow, red, black, grey

// neutrale kleur (grijs)
var colourGrey = "lightgrey", //"#ecf0f1",
    colourBlue = 'steelblue',
    colourBlueHighlight = 'CornflowerBlue';

// kleur juist (groen), fout (rood, blanco (grijs)
var coloursJFB = ["#a6d96a", "#e74c3c", "#ecf0f1"]; // ["#2ecc71", "#e74c3c", "#ecf0f1"];


/* PLACEMENT OF DIFFERENT GRAPHS */
// -- global margins
var margin = {top: 10, right: 20, bottom: 30, left: 20},
    width  = screen.width - margin.left - margin.right,
    height = screen.height - margin.top - margin.bottom;

// -- totaalscore
var marginTs = {top: margin.top + verticalTitleSpace, right: margin.right, bottom: 30, left: margin.left}
var tsWidth = 250,
    tsHeight = 400,
    tsRadius = 90;

// -- heatmap - score per vraag
var marginHeatmap = { top: margin.top + verticalTitleSpace*2/3 + verticalParagraphSpace, right: margin.right, bottom: 100 , left: margin.left + tsWidth + 130};
var widthScorePerVraag = 735 + tsWidth,
    heightScorePerVraag = 475;

// -- bar chart - score per categorie (sterktes en zwaktes)
var bcSpcMargin = {top: margin.top + heightScorePerVraag - 20, 
                   right: margin.right, bottom: margin.bottom + 65, left: margin.left},
    bcSpcWidth = 710,
    bcSpcHeight = 410 + heightScorePerVraag;

// -- histogram - relatieve performantie per categorie
var histMargin = {top: margin.top + heightScorePerVraag - 20,
                  right: margin.right + 300, bottom: margin.bottom + 5, left: 5*margin.left + bcSpcWidth + 20},
    histWidth = screen.width*3/4,
    histHeight = 350 + heightScorePerVraag;

// -- globaalstroomdiagramma
var marginStrD = {top: margin.top + verticalTitleSpace + verticalParagraphSpace, 
                  right: margin.right + 120, bottom: margin.bottom + 170, 
                  left: margin.left + tsWidth + widthScorePerVraag + 50},
    widthStrD = screen.width - marginStrD.right - marginStrD.left - 100,
    heightStrD = 450 + marginStrD.top - marginStrD.bottom;



/* OPTIONS GRAPHS */ 
// barchart
var showScorePerCategorie = true; // start with the score per categorie

// histogram
var showHistBarLabels = true;
var onlyShowUnevenXLabels = true;

// heatmap
var showLeftLabels = true,
    showTopLabels = true;

var showLegend = false;

var showStreepjesGemiddeldes = true;

//graadmeter
var graadmeterWidthsProportional = true;