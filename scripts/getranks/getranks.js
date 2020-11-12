console.log('hello')

window.onload = function () {
    const sortButton = document.getElementById('sort')
    sortButton.addEventListener("change", sort)
}
let chartElement
let categories = ['goals', 'assists', 'points', 'pims', 'ppp', 'sog', 'hits', 'blks']

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
        switch (stat) {
            case "score":
                sortedBar = bars.sort((a, b) => d3.descending(a.data[stat], b.data[stat]))
                // let scoreKey = categories[categories.length - 1]
                // categories = buildCategories(scoreKey)
                // buildSeries(data,categories)
                // console.log(scoreKey)
                // // console.log(bars.data())
                // // sortedBar = bars.sort((a, b) => d3.descending(a.data[scoreKey], b.data[scoreKey]))
                // // sortedBar = bars.sort((a, b) => d3.descending(a[1], b[1]))
                console.log(sortedBar.data())
                // // x.domain(sortedBar.data().map(d => d.data.name))
                // // sortedBar.order()
                break
            default:
                sortedBar = bars.sort((a, b) => d3.descending(a.data[stat], b.data[stat]))
                break
        }
        return sortedBar
    }

    function positionElements(bars) {
        x.domain(bars.data().map(d => d.data.name))

        bars.attr("x", (d, i) => x(d.data.name))
            .attr("y", (d, i) => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth())
            .attr("fill", d => colour(d.key))

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
                // categories = buildCategories(stat)
                // series = buildSeries(data, categories)
                // let scoreKey = categories[categories.length - 1]
                // categories = buildCategories(scoreKey)
                // series = buildSeries(data, categories)
                // console.log(series)
                // bars = buildElements(series)
                // sortedBar = sortBars(bars, stat)
                // positionElements(sortedBar)
                // categories = buildCategories(stat)
                // series = buildSeries(data, categories)
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
        }
    }
    dataCall.open('GET', '../getranks/data')
    dataCall.send()
}

function insert(data) {
    chartElement = chart(data)
    const chartWrapper = document.getElementById('D3-wrapper')
    chartWrapper.appendChild(chartElement.node())
}

function sort(event) {
    chartElement.update(event.target.value)
}

getData(insert)