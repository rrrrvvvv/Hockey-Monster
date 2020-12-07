console.log('hello')

window.onload = function () {
    const sortButton = document.getElementById('sort')
    sortButton.addEventListener("change", sort)
    const playersButton = document.getElementById('highlight-team')
    playersButton.addEventListener('click', highlight)
}
let chartElement
let categories = ['goals', 'assists', 'points', 'pims', 'ppp', 'sog', 'hits', 'blks']
let highlightedPlayers = ['Ryan Strome', 'Blake Wheeler', 'Anders Lee', 'Kevin Fiala', 'Kyle Palmieri', 'Ryan Reaves', 'Brayden Point', 'Filip Forsberg',
    'Jordan Eberle', "Ryan Ellis", 'Kris Letang', 'Neal Pionk', 'Matt Niskanen', 'Taylor Hall', 'David Perron', 'David Pastrnak',
    'Torey Krug', 'Brock Boeser', 'Steven Stamkos', 'Kailer Yamamoto'
]

let playerData

const chart = function (data) {

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

        bar = cat.selectAll("rect")
            .data(d => d)
            .join("rect")

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

    const width = 1100,
        height = 400

    const margin = ({
        top: 20,
        right: 0,
        bottom: 30,
        left: 40
    })

    let series = buildSeries(data, categories)

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

    positionElements(elements)

    function update(stat) {
        switch (stat) {
            case "score":
                bars = buildElements(series)
                sortedBar = sortBars(bars, stat)
                positionElements(sortedBar)

                break
            default:
                categories = buildCategories(stat)
                series = buildSeries(data, categories)
                bars = buildElements(series)
                sortedBar = sortBars(bars, stat)
                positionElements(sortedBar)
                break
        }
        return svg
    }

    return Object.assign(svg, {
        update
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

function insert(data) {
    chartElement = chart(data)
    const chartWrapper = document.getElementById('bar-chart-wrapper')
    chartWrapper.appendChild(chartElement.node())
}

function sort(event) {
    chartElement.update(event.target.value)
}

function highlight(event) {
    const width = '1100',
        height = '400'
    let players = highlightedPlayers

    let highlightData = playerData.filter((current, i, array) => {
        return players.includes(current.name)
    })

    x = d3.scaleBand()
        .domain(highlightData.map(d => d.name))
        .range([0, width])

    let div = d3.selectAll("#player-card-wrapper")
        .append("div")
        .attr("id", "content-container")
        .style("display", "flex")
        .style("flex-flow", "row wrap")

    let playerCard = div.selectAll("div")
        .data(highlightData)
        .join("div")
        // .on("mouseenter", cardHover)
        // .on("mouseleave", cardReset)
        // .on("click", [cardHover, cardReset])
        .on("click", cardClick)
        // .on("click.cardReset", cardReset)
        // .on("click", cardReset)
        // .on("click")
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

    function moveFilter(d, i) {
        // console.log(barIndex)

        if (i < 659) {
            if (i > barIndex[0]) {
                return true
            } else {
                notMoved.push(i)
                return false
            }
        } else if (i < 1318) {
            if (i > barIndex[1]) {
                return true
            } else {
                notMoved.push(i)
                return false
            }
        } else if (i < 1977) {
            if (i > barIndex[2]) {
                return true
            } else {
                notMoved.push(i)
                return false
            }
        } else if (i < 2636) {
            if (i > barIndex[3]) {
                return true
            } else {
                notMoved.push(i)
                return false
            }
        } else if (i < 3295) {
            if (i > barIndex[4]) {
                return true
            } else {
                notMoved.push(i)
                return false
            }
        } else if (i < 3954) {
            if (i > barIndex[5]) {
                return true
            } else {
                notMoved.push(i)
                return false
            }
        } else if (i < 4613) {
            if (i > barIndex[6]) {
                return true
            } else {
                notMoved.push(i)
                return false
            }
        } else if (i < 5272) {
            if (i > barIndex[7]) {
                return true
            } else {
                notMoved.push(i)
                return false
            }
        } else {
            notMoved.push(i)
            return false
        }

    }

    function cardClick(event, data) {
        console.log(d3.select(this).classed("selected"))
        // console.log("card hover")
        // barIndex = []
        // let svgWidth


        if (d3.select(this).classed("selected")) {
            // cardReset(event,data)
            d3.select(this).classed("selected", false)
            d3.select(this).style("border", "none")

            d3.selectAll(".highlighted").attr("width", x.bandwidth()).classed("highlighted", false)
            console.log(barIndex)
            d3.selectAll(".stat-bar").filter(moveFilter).attr("transform", `translate(0,0)`)
            svgWidth = parseInt(d3.select("svg").attr("width"))
            console.log(svgWidth)
            svgWidth -= 20
            d3.select("svg").attr("width", svgWidth)
            barIndex = []
            
        } else {
            d3.select(this).classed("selected", true)
            d3.select(this).style("border", "3px solid black")
            d3.selectAll(".stat-bar").filter(playerFilter).attr("width", "20px").classed("highlighted", true)
            svgWidth = parseInt(d3.select("svg").attr("width"))
            console.log(svgWidth)
            svgWidth += 20
            d3.select("svg").attr("width", svgWidth)
            console.log(d3.select("svg").attr("width"))
            console.log(barIndex)
            let numberSelected = d3.selectAll(".selected").size()
            console.log(numberSelected)
            d3.selectAll(".stat-bar").filter(moveFilter).attr("transform", `translate(${numberSelected*19},0)`)
            
            barIndex = []
        }

        // function cardReset(event, data) {
        //     console.log(d3.select(this).classed("selected"))

        //     console.log("card Reset")

        //     // if(d3.select(this).classed("selected")) {
        //     //     // cardReset(event,data)
        //     //     d3.select(this).classed("selected", false)
        //     //     // return
        //     // } else {
        //     //     return
        //     //     d3.select(this).classed("selected", true)
        //     // }

        //     d3.select(this).style("border", "none")

        //     d3.selectAll(".highlighted").attr("width", x.bandwidth()).classed("highlighted", false)
        //     d3.selectAll(".stat-bar").filter(moveFilter).attr("transform", `translate(0,0)`)
        //     let svgWidth = d3.select("svg").attr("width")
        //     console.log(svgWidth)
        //     svgWidth -= 20
        //     d3.select("svg").attr("width", svgWidth)
        //     barIndex = []
        // }

        // barIndex = []

        function playerFilter(d, i) {

            if (d.data.name === data.name) {
                barIndex.push(i)
                // console.log(barIndex)
            }

            return d.data.name === data.name
        }

        // function cardReset(event, data) {

        //     console.log(event)

        //     d3.select(".selected").style("border", "none")

        //     d3.selectAll(".highlighted").attr("width", x.bandwidth()).classed("highlighted", false)
        //     d3.selectAll(".stat-bar").filter(moveFilter).attr("transform", `translate(0,0)`)
        //     let svgWidth = d3.select("svg").attr("width")
        //     console.log(svgWidth)
        //     svgWidth -= 20
        //     d3.select("svg").attr("width", svgWidth)
        //     barIndex = []    
        // }


        // d3.select(this).style("border", "3px solid black")
        // d3.selectAll(".stat-bar").filter(playerFilter).attr("width", "20px").classed("highlighted", true)
        // let svgWidth = d3.select("svg").attr("width")
        // svgWidth += 20
        // d3.select("svg").attr("width", svgWidth)
        // d3.selectAll(".stat-bar").filter(moveFilter).attr("transform", `translate(19,0)`)
    }

    // function cardReset(event, data) {
    //     console.log(d3.select(this).classed("selected"))

    //     console.log("card Reset")

    //     if (d3.select(this).classed("selected")) {
    //         // cardReset(event,data)
    //         d3.select(this).classed("selected", false)
    //         // return
    //     } else {
    //         return
    //         d3.select(this).classed("selected", true)
    //     }

    //     d3.select(this).style("border", "none")

    //     d3.selectAll(".highlighted").attr("width", x.bandwidth()).classed("highlighted", false)
    //     d3.selectAll(".stat-bar").filter(moveFilter).attr("transform", `translate(0,0)`)
    //     let svgWidth = d3.select("svg").attr("width")
    //     console.log(svgWidth)
    //     svgWidth -= 20
    //     d3.select("svg").attr("width", svgWidth)
    //     barIndex = []
    // }

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

    // Should make this a chart method, call it on button press. No need to have a global variable. Work from the same processed data

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

getData(insert)