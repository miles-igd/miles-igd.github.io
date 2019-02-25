var trie = new Trie();
for (var i=0; i<FULL.length; i++) {
    trie.insert(FULL[i])
}

var chartDiv = document.getElementById('chartview');
var infoBox = document.getElementById('infobox');

var listingTitle = document.getElementById('listingTitle');
var listingBox = document.getElementById('listingList');

var infoGame = document.getElementById('gametext');
var infoTag = document.getElementById('steamtext');
var hoverTag = document.getElementById('hovertext');
var posText = document.getElementById('postext');

//var d3 = Plotly.d3;
//var N = 16;
//var x = d3.range(N);
//var y = d3.range(N).map( d3.random.normal() );

trace = {
    type: "scattergl",
	x: X,
    y: Y,
    text: NAME,
    mode: "markers",
    marker: {
        size: 6,
        color: CLUSTER,
        colorscale: 'Jet'
    }
}

layout = {
            yaxis: {
                showticklabels:false, 
                scaleanchor:"x",
                showgrid:false, 
                showline:false,
                hoverformat:'.3r', 
                zeroline:false
            },
            xaxis: {
                showticklabels:false, 
                showgrid:false, 
                showline:false, 
                hoverformat:'.3r', 
                zeroline:false
            },
            dragmode: 'pan',
            hovermode: 'closest',
            margin: {
                l:0,
                r:0,
                b:0,
                t:0,
                pad:0
            }
}

chartDiv.removeChild(chartDiv.firstChild);
Plotly.plot(chartDiv, [trace], layout, {scrollZoom: true, displayModeBar: false});

var gameinput = document.getElementById("gameinput")
autocomplete(gameinput, trie);

function update_listing(arr) {
    listingTitle.innerHTML = "<strong>TOP 50 MOST SIMILAR</strong>"
    listingStr = "<ol>";
    for (var i=0; i<arr.length; i++) {
        if (typeof APPIDS[FULL[arr[i]]] !== 'undefined') {
        listingStr += "<li><a href='https://store.steampowered.com/app/"+APPIDS[FULL[arr[i]]]+"' target='_blank'>"+FULL[arr[i]]+"</a></li>"
        } else {
        listingStr += "<li>"+FULL[arr[i]]+"</li>"
        }
    }
    listingStr += "</ol>"
    listingBox.innerHTML = listingStr
}

function get_json(fp) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', fp, true);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            if(xmlhttp.status == 200) {
                let json = JSON.parse(xmlhttp.responseText);
                update_listing(json);
            } else {
                listingBox.innerHTML = 'Error: '+xmlhttp.status
            }
        }
    };
    xmlhttp.send(null);
}

function update_arrow(div, id, noclear=true) {
    if (noclear) {
        Plotly.relayout(div, {annotations: [{
            x: X[id],
            y: Y[id],
            text: NAME[id],
            ax: 0,
            ay: -30,
            showarrow: true,
            arrowhead: 2,
            arrowsize: 2,
            arrowwidth: 2,
            arrowcolor: 'black',
            font: {
                family: 'Consolas, monospace',
                size: 16,
                color: 'white'
            },
            bgcolor: 'black',
            opacity: 0.9
        }]})
    } else {
        Plotly.relayout(div, {annotations: []})
    }
}

function update_list(input) {
    if (typeof APPIDS[input.value] !== 'undefined') {
        infoGame.innerHTML = "<a href='https://store.steampowered.com/app/"+APPIDS[input.value]+"' target='_blank'><strong>"+input.value+"</strong></a>";
    } else {
        infoGame.innerHTML = "<strong>"+input.value+"</strong>";
    }

    if (NAME.includes(input.value)) {
        let indexThis = NAME.indexOf(input.value)
        infoTag.innerHTML = "<strong>"+STEAMTAG[indexThis]+" - "+CLUSTERTAG[indexThis]+"</strong>";

        let x = X[indexThis].toPrecision(3);
        let y = Y[indexThis].toPrecision(3);
        posText.innerHTML = "<strong>X: "+x+" Y: "+y+"</strong>";
        update_arrow(chartDiv, indexThis);
    } else {
        infoTag.innerHTML = "<strong>Unknown - Unknown</strong>";
        posText.innerHTML = "<strong>Not on graph</strong>";
        update_arrow(chartDiv, 0, noclear=false);
    }

    fp = "./js/top/"+sha1(input.value)+".json"
    get_json(fp);
}

gameinput.addEventListener("keyup", function(e) {
    if (e.keyCode == 13 && FULL.includes(this.value)) {
        update_list(this)
    }
});

document.addEventListener("autocomplete-click", function() {
    update_list(gameinput)
})

chartDiv.on('plotly_click', function(data){
    id = data.points[0].pointIndex;
    text = data.points[0].text;

    if (typeof APPIDS[text] !== 'undefined') {
        infoGame.innerHTML = "<a href='https://store.steampowered.com/app/"+APPIDS[text]+"' target='_blank'><strong>"+NAME[id]+"</strong></a>";
    } else {
        infoGame.innerHTML = "<strong>"+NAME[id]+"</strong>";
    }

    infoTag.innerHTML = "<strong>"+STEAMTAG[id]+" - "+CLUSTERTAG[id]+"</strong>";

    let x = X[id].toPrecision(5);
    let y = Y[id].toPrecision(5);
    posText.innerHTML = "<strong>X: "+x+" Y: "+y+"</strong>";
    update_arrow(chartDiv, id);

    fp = "./js/top/"+sha1(text)+".json"
    get_json(fp);
    
    gameinput.value = '';
});

chartDiv.on('plotly_hover', function(data){
    id = data.points[0].pointIndex;
    hoverTag.innerHTML = "<strong>"+CLUSTERTAG[id]+"</strong>";
});



window.addEventListener("resize", function(){Plotly.Plots.resize(document.getElementById("chartview"));});