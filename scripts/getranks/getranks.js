console.log('hello')

window.onload = function () {
    const sortButton = document.getElementById('sort')
    sortButton.addEventListener("change", sort)
    const playersButton = document.getElementById('highlight-team')
    playersButton.addEventListener('click', highlight)
    // return sortButton
}
let chartElement
let categories = ['goals', 'assists', 'points', 'pims', 'ppp', 'sog', 'hits', 'blks']
let highlightedPlayers = ['Ryan Strome', 'Blake Wheeler', 'Anders Lee', 'Kevin Fiala', 'Kyle Palmieri', 'Ryan Reaves', 'Brayden Point', 'Filip Forsberg',
    'Jordan Eberle', "Ryan Ellis", 'Kris Letang', 'Neal Pionk', 'Matt Niskanen', 'Taylor Hall', 'David Perron', 'David Pastrnak',
    'Torey Krug', 'Brock Boeser', 'Steven Stamkos', 'Kailer Yamamoto']

let playerData

const chart = function (data) {

    //set private functions

    function buildSeries(data, categories) {
        let series = d3.stack()
            .keys(categories)
            (data)
            .map(d => (d.forEach(v => v.key = d.key), d))
        return series
    }

    function buildCategories(stat) {
        let d = categories.sort((a, b) => {
            return (a === stat) ? -1 : 0
        })
        return d
    }

    function buildElements(series) {
        cat = svg
            .selectAll("g")
            .data(series)
            .join("g")
        // console.log(cat)

        bar = cat.selectAll("rect")
            .data(d => d)
            .join("rect")

        // console.log(bar)

        return bar
    }

    function sortBars(bars, stat) {
        sortedBar = bars.sort((a, b) => d3.descending(a.data[stat], b.data[stat]))
        return sortedBar
    }

    function positionElements(bars) {
        x.domain(bars.data().map(d => d.data.name))
            .range([margin.left, width - margin.right])

        bars.attr("x", (d, i) => x(d.data.name))
            .attr("y", (d, i) => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth())
            .attr("fill", d => colour(d.key))
            .classed("stat-bar", true)

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
    }

    // set chart size

    const width = 1100,
        height = 400

    const margin = ({
        top: 20,
        right: 0,
        bottom: 30,
        left: 40
    })

    //organize data

    let series = buildSeries(data, categories)

    //find max of each category

    // series is an array of 8 arrays or arrays, the value that we want to find the max of is at position [1] of inner array
    const max = d3.max(series, d => d3.max(d, d => d[1]))

    x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([margin.left, width - margin.right])

    y = d3.scaleLinear()
        .domain([0, max]).nice()
        .range([height - margin.bottom, margin.top])

    colour = d3.scaleOrdinal()
        .domain(series.map(d => d.key))
        .range(d3.schemeSpectral[series.length])

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("font-family", "sans-serif")
        .attr("font-size", "40")
        .attr("text-anchor", "middle")

    let elements = buildElements(series)
    // sortBars(elements,'score')

    positionElements(elements)

    function update(stat) {
        // removePlayers()
        // loadPlayers()
        let resetSelected = d3.selectAll('.selected')
        resetSelected.style("border", "none").classed('selected', false)

        // this.removePlayers()
        // this.loadPLayers()
        switch (stat) {
            case "score":
                updatedBars = buildElements(series)
                
                sortedBar = sortBars(updatedBars, stat)
                // console.log(playerData)
                // let sortedPlayerScore = playerData.map((x) => {
                //     return x
                // })
                playerData.sort((a,b) => {
                    return b.score - a.score
                })
                // console.log(playerData)
                
                // console.log(playerData)
                // let updatedPlayerData
                positionElements(sortedBar)
                break
            default:
                updatedCategories = buildCategories(stat)
                updatedSeries = buildSeries(data, updatedCategories)
                updatedBars = buildElements(updatedSeries)
                sortedBar = sortBars(updatedBars, stat)
                // console.log(playerData)
                // let sortedPlayerStat = playerData.map((x) => {
                //     return x
                // })
                playerData.sort((a,b) => {
                    return b[stat] - a[stat]
                })
                // console.log(playerData)
                positionElements(sortedBar)
                break
        }
        return svg
    }

    // update('score')

    function loadPlayers() {
        console.log("hello from loadPlayers")
        let players = highlightedPlayers
        let highlightData = data.filter((current, i, array) => {
            return players.includes(current.name)
        })

        let div = d3.selectAll("#player-card-wrapper")
            .append("div")
            .attr("id", "content-container")
            .style("display", "flex")
            .style("flex-flow", "row wrap")

        let playerCard = div.selectAll("div")
            .data(highlightData)
            .join("div")
            .on("click", cardClick)
            .classed("player-card", true)
            .style("flex", "1")
            .style("flex-grow", "0")
            .style("display", "inline-block")
            .attr("class", "player-card")

        playerCard.append("p")
        playerCard.append("ul")

        let barIndex = []
        let notMoved = []
        let svgWidth

        function cardClick(event, data) {
            //data is passed from div card which contains the player data, name, stats etc. Data is drawn from called data that is passed in to make the chart
            // console.log(d3.select(this).classed("selected"))
            let sortButton = document.getElementById('sort')
            // console.log(data.name)
            // console.log(sortButton.value)
            // console.log(playerData)
            let index = playerData.findIndex((elem) => {
                // console.log(elem.name)
                return elem.name === data.name
            })
            let toMove = playerData.slice(index+1)
            let namesToMove = toMove.map((e) => {
                return e.name
            })
            // console.log(toMove)
            // console.log(namesToMove)
            // console.log(index)
            if (d3.select(this).classed("selected")) {
                // console.log(sortButton.value)
                
                d3.select(this).classed("selected", false)
                d3.select(this).style("border", "none")
                // d3.selectAll(".highlighted").attr("width", x.bandwidth()).classed("highlighted", false)
                d3.selectAll(".stat-bar").filter(playerFilter).attr("width", x.bandwidth()).classed("highlighted", false)
                // d3.selectAll(".stat-bar").filter(moveFilter).attr("transform", `translate(0,0)`)
                d3.selectAll(".stat-bar").filter(moveFilter).attr("x", (d,i,n) => 
                n[i].x.baseVal.value - 19
            )
                // console.log(d3.selectAll(".stat-bar").filter(moveFilter))
                svgWidth = parseInt(d3.select("svg").attr("width"))
                svgWidth -= 20
                d3.select("svg").attr("width", svgWidth)
                barIndex = []

            } else {
                d3.select(this).classed("selected", true)
                // console.log(this)
                // console.log(sortButton.value)
                d3.select(this).style("border", "3px solid black")
                d3.selectAll(".stat-bar").filter(playerFilter).attr("width", "20px").classed("highlighted", true)
                svgWidth = parseInt(d3.select("svg").attr("width"))
                svgWidth += 20
                d3.select("svg").attr("width", svgWidth)
                let numberSelected = d3.selectAll(".selected").size()
                // console.log(numberSelected)
                // console.log(toMove)
                d3.selectAll(".stat-bar").filter(moveFilter).attr("x", (d,i,n) => 
                    n[i].x.baseVal.value + 19
                )

                // d3.selectAll(".stat-bar").filter(moveFilter).attr("transform", `translate(${numberSelected*19},0)`)
                // d3.selectAll(".stat-bar").filter(moveFilter).each((d,i,nodes) => {
                //     let newX = nodes[i].x.baseVal.value +19
                //     nodes[i].attr("x", newX)
                //     console.log(nodes[i].x.baseVal.value)
                // })

                barIndex = []
            }

            function playerFilter(d, i) {
                if (d.data.name === data.name) {
                    barIndex.push(i)
                }
                return d.data.name === data.name
            }

            function moveFilter(d,i) {
                // console.log(d)
               return namesToMove.includes(d.data.name)
                
                // let playersToMove = playerData
                // console.log(sortButton)
            }
        }

        function seriesCreator(data, i, name) {
            let array = []
            for (cat in data) {
                switch (cat) {
                    case "name":
                    case "_id":
                        break
                    default:
                        let stat = new Object()
                        stat[cat] = data[cat]
                        array.push(stat)
                        break
                }
            }
            return array
        }

        function textCreator(data, index) {
            return Object.keys(data) + ": " + Math.round(Object.values(data) * 1000) / 1000
        }

        div.selectAll("p")
            .text(d => d.name)
            .style("height", "2rem")
            .style("text-align", "center")
        div.selectAll("ul")
            .selectAll("li")
            .data((d, i) => seriesCreator(d, i, d.name))
            .join("li")
            .text((d, i) => textCreator(d, i))
            .style("display", "block")
            .style("width", "100%")
            .style("white-space", "nowrap")
            .style("text-align", "left")
    }

    function removePlayers() {
        console.log("hello from remove players")
        let container = document.getElementById('content-container')
        container.remove()

    }

    function selectPlayers() {
        console.log("hello from selectPlayers")
    }

    return Object.assign(svg, {
        update,
        loadPlayers,
        selectPlayers,
        removePlayers
    })
}

function getData(insert) {
    const dataCall = new XMLHttpRequest()
    dataCall.onreadystatechange = () => {
        if (dataCall.readyState === 4) {
            insert(JSON.parse(dataCall.response))
            playerData = JSON.parse(dataCall.response)
        }
    }
    dataCall.open('GET', '../getranks/data')
    dataCall.send()
}

async function insert(data) {
    chartElement = await chart(data)
    const chartWrapper = document.getElementById('bar-chart-wrapper')
    chartWrapper.appendChild(chartElement.node())
    chartElement.update('score')

}

function sort(event) {
    chartElement.update(event.target.value)
    // console.log("hello from sort")
    console.log(playerData)
    // let sortedPlayerData = []
    // populate a list of players in order of sorted value
    console.log(event.target.value)
}

function highlight(event) {
    if (this.classList.contains('clicked')) {
        chartElement.removePlayers()
        document.getElementById('highlight-team').innerHTML = 'Import Team'

    } else {
        chartElement.loadPlayers()
        document.getElementById('highlight-team').innerHTML = 'Remove Team'
    }
    this.classList.toggle('clicked')
    
    console.log("hello from highlight")
    console.log(this.classList)
    // chartElement.loadPlayers()
}

function initialize() {
console.log("hello from initialize")
// chartElement.update('score')
}

getData(insert)
initialize()