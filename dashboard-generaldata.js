// Naam & details
var naam = "Nicolas",
    achternaam = "Hoppenbrouwers",
    datumIjk = "september 2017";

// Totaalscore details
// -- persoonlijk
// TODO: make it work that it only needs the data from the scores per vraag
//          ook ervoor zorgen dat je hier gewoon alle scores per vraag weergeeft en dat je die automatisch schrijft naar de csv files
//var allJFB = getNbJFB([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30])
//var totaalscore = calculateScore(allJFB[0],allJFB[1],allJFB[2]),         // in percent
//    totAantalJ = allJFB[0],            // totaal aantal juist  beantwoorde vragen
//    totAantalF = allJFB[1],            // totaal aantal fout   beantwoorde vragen
//    totAantalB = allJFB[2];             // totaal aantal blanco beantwoorde vragen

// ID van goede testpersoon: 2
var totaalscore = 0.758;
if (totaalscore < 0){
    totaalscore = 0;
}

// -- algemeen
var totaalscoreGem = 0.46,      // alles in percent
    totaalscoreSTD = 0.1679,    
    totaalscoreMin = 0, //totaalscores kunnen niet negatief zijn.
    totaalscoreQ1 = 0.3583,
    totaalscoreMed = 0.46,
    totaalscoreQ3 = 0.5667,
    totaalscoreMax = 0.92;

// TODO: eigenlijk zouden de CSV files hiermee dynamisch moeten worden aangepast: dat deze altijd consistent zijn
// want op deze manier moet je op 2 plaatsen tegelijk aanpassen en dit leidt snel tot fouten...
// -- grenzen [min, Q1, med, Q3, max]
var grenzenTotaal = [-0.11,	0.36, 0.46, 0.57, 0.92],
    grenzenRedeneren = [-0.25, 0.166666667, 0.583333333, 0.666666667, 1],
    grenzenBegrippenkennis = [-0.25, 0.25, 0.4, 0.6, 1],
    grenzenVaardigheden = [-0.11, 0.5, 0.68, 0.82, 1],
    grenzenRuimtelijk = [-0.25, 0.58, 0.58, 1, 1],
    grenzenModelleren = [-0.21,	0.19, 0.33,	0.48, 0.92],
    grenzen1ster = [-0.06, 0.69, 0.84, 1, 1],
    grenzen2sterren = [-0.13, 0.41, 0.59, 0.84, 1],
    grenzen3sterren = [-0.25, 0.083, 0.29, 0.5, 1],
    grenzen4sterren = [-0.25, -0.063, 0.06, 0.19, 0.84];

// Data voor stroomdiagramma
var totaalAantalDeelnemers = 1705,
    totaalAantalDeelnemersIjk = 348;
var level0 = totaalAantalDeelnemers,
    level1 = [457, 838, 411],
    level21 = [297, 122, 36, 2],
    level22 = [319, 346, 158, 15],
    level23= [56, 144, 193, 18];
var studieTrajectEndCategories = [">70% CSE", "30%-70% CSE", "<30% CSE", "drop-out"],
        //[">80% CSE", "30%-80% CSE", "<30% CSE", "drop-out", "niet ingeschreven"];
    studieTrajectStromen = ['alle deelnemers', 'totaalscore ≥ 14/20', '10 ≤ totaalscore ≤ 13', 'totaalscore < 10'];
var treeData = [
    {
        "name": studieTrajectStromen[0],
        "parent": "null",
        "level": 0,
        "aantal": level0,
        "percentage": level0/totaalAantalDeelnemers,
        "children": 
            [
                {
                    "name": studieTrajectStromen[1],
                    "parent": studieTrajectStromen[0],
                    "level": 1,
                    "aantal": level1[0],
                    "percentage": level1[0]/level0,
                    "children": [
                        {
                            "name": studieTrajectEndCategories[0],
                            "parent": studieTrajectStromen[1],
                            "level": 2,
                            "aantal": level21[0],
                            "percentage": level21[0]/level1[0],
                        },
                        {
                            "name": studieTrajectEndCategories[1],
                            "parent": studieTrajectStromen[1],
                            "level": 2,
                            "aantal": level21[1],
                            "percentage": level21[1]/level1[0],
                        },
                        {
                            "name": studieTrajectEndCategories[2],
                            "parent": studieTrajectStromen[1],
                            "level": 2,
                            "aantal": level21[2],
                            "percentage": level21[2]/level1[0],
                        },
                        {
                            "name": studieTrajectEndCategories[3],
                            "parent": studieTrajectStromen[1],
                            "level": 2,
                            "aantal": level21[3],
                            "percentage": level21[3]/level1[0],
                        }
                    ]
                },
                {
                    "name": studieTrajectStromen[2],
                    "parent": studieTrajectStromen[0],
                    "level": 1,
                    "aantal": level1[1],
                    "percentage": level1[1]/level0,
                    "children": [
                        {
                            "name": studieTrajectEndCategories[0],
                            "parent": studieTrajectStromen[2],
                            "level": 2,
                            "aantal": level22[0],
                            "percentage": level22[0]/level1[1],
                        },
                        {
                            "name": studieTrajectEndCategories[1],
                            "parent": studieTrajectStromen[2],
                            "level": 2,
                            "aantal": level22[1],
                            "percentage": level22[1]/level1[1],
                        },
                        {
                            "name": studieTrajectEndCategories[2],
                            "parent": studieTrajectStromen[2],
                            "level": 2,
                            "aantal": level22[2],
                            "percentage": level22[2]/level1[1],
                        },
                        {
                            "name": studieTrajectEndCategories[3],
                            "parent": studieTrajectStromen[2],
                            "level": 2,
                            "aantal": level22[3],
                            "percentage": level22[3]/level1[1],
                        }
                    ]
                },
                {
                    "name": studieTrajectStromen[3],
                    "parent": studieTrajectStromen[0],
                    "level": 1,
                    "aantal": level1[2],
                    "percentage": level1[2]/level0,
                    "children": [
                        {
                            "name": studieTrajectEndCategories[0],
                            "parent": studieTrajectStromen[3],
                            "level": 2,
                            "aantal": level23[0],
                            "percentage": level23[0]/level1[2],
                        },
                        {
                            "name": studieTrajectEndCategories[1],
                            "parent": studieTrajectStromen[3],
                            "level": 2,
                            "aantal": level23[1],
                            "percentage": level23[1]/level1[2],
                        },
                        {
                            "name": studieTrajectEndCategories[2],
                            "parent": studieTrajectStromen[3],
                            "level": 2,
                            "aantal": level23[2],
                            "percentage": level23[2]/level1[2],
                        },
                        {
                            "name": studieTrajectEndCategories[3],
                            "parent": studieTrajectStromen[3],
                            "level": 2,
                            "aantal": level23[3],
                            "percentage": level23[3]/level1[2],
                        }
                    ]
                }
            ]
    }
];



// Calculate a score based on the given number of juist, fout en blanco answered questions
function calculateScore(J,F,B){
    return J*1 - F*0.25;
}

function calculateScorePercent(J,F,B){
    return calculateScore(J,F,B) / (J+F+B);
}

function calculateScoreBasedOnList(lst){
    return calculateScore(lst[0], lst[1], lst[2]);
}

function calculateScorePercentBasedOnList(lst){
    return calculateScorePercent(lst[0], lst[1], lst[2]);
}

