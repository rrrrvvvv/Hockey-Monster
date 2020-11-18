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
        // .attr("transform", `translate(${margin.left},0)`)

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
    }

    // function getBars() {
    //     bar = cat.selectAll("rect")
    //     return bar
    // }

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
                // d3.select("#bar-chart-wrapper").selectAll("rect").attr("transform", `translate(${margin.left},0)`)
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
    // console.log(players)
    // console.log(playerData)
    let highlightData = playerData.filter((current, i, array) => {
        // console.log(current.name)
        return players.includes(current.name)
    })
    // console.log(highlightData)

    // let svg = d3.create("svg")
    //     .attr("width", width)
    //     .attr("height", height)

    // console.log(svg.node())

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
        // .style("height", height + 'px')
        .style("flex", "1")
        .style("flex-grow", "0")
        .style("display", "inline-block")
        .attr("class", "player-card")

    playerCard.append("p")
    playerCard.append("ul")

    function seriesCreator(data, i, name) {

        let names = data.map((d, i, arr) => {
            return d.name
        })

        let array = []

        // console.log(name)
        // console.log(names)

        for (cat in data[i]) {
            // console.log(cat)
            switch (cat) {
                case "name":
                case "_id":
                    break
                default:
                    let stat = new Object()
                    stat[cat] = data[i][cat]
                    array.push(stat)
                    break
            }
            // array.push(data[i][cat])
        }
        console.log(array)
        // let newArray = array.map((cur,i,arr) => {
        //     return Math.round(cur.value * 1000) / 1000
        // })

        // console.log(array)

        // let series = d3.stack().keys(categories)(data)

        // console.log(i)
        // console.log(series)
        // console.log(data)


        // let result = data.map((cur,i,arr) => {
        //     return cur[categories[i]]
        // })

        // let groups = Array.from(d3.group(data, d=>d.name))
        // 
        // console.log(groups)

        // console.log(result)

        // let mapped = series.map()

        // console.log(mapped)

        return array
    }

    function textCreator(data, index) {
        // console.log(data.key)
        // console.log(index)
        // data[index].data

        // let key = data.key
        // let value = data[index].data[data.key]
        // value = Math.round(value * 1000) / 1000
        // console.log(data[index].data[data.key])
        // console.log(data)
        // console.log(index)
        // return key + ": " + value
        return Object.keys(data) + ": " + Math.round(Object.values(data) * 1000) / 1000
    }

    div.selectAll("p")
        .text(d => d.name)
        .style("height", "2rem")
        .style("text-align", "center")
    div.selectAll("ul")
        .selectAll("li")
        .data((d, i) => seriesCreator(highlightData, i, d.name))
        .join("li")
        .text((d, i) => textCreator(d, i))
        .style("display", "block")
        .style("width", "100%")
        .style("white-space", "nowrap")
        .style("text-align", "left")

}

getData(insert)