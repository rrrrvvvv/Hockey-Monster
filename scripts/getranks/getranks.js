console.log('hello')

window.onload = function () {
    const sortButton = document.getElementById('sort')
    sortButton.addEventListener("change", sort)
}
let chartElement
// let data

const chart = function (data1) {
    const width = 1100,
        height = 400

    const margin = ({
        top: 20,
        right: 0,
        bottom: 30,
        left: 40
    })

    const data = data1.slice(0, 11)

    let series = d3.stack()
        .keys(["goals", "assists"])
        (data)
        .map(d => (d.forEach(v => v.key = d.key), d))

    const max = d3.max(series, d => d3.max(d, d => d[1]))

    console.log(max)


    x = d3.scaleBand()
        .domain(data.map(d => d.name))
        // .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])

    y = d3.scaleLinear()
        .domain([0, max]).nice()
        .range([height - margin.bottom, margin.top])

    colour = d3.scaleOrdinal()
        // .domain(series.map(d => d.key))
        .domain(series.map(d => d.key))
        .range(["#deebf7", "#9ecae1"])
    // .unknown("#ccc")
    // console.log(d3.schemeBlues[series.length])

    // ["#deebf7","#9ecae1","#3182bd"]
    console.log(d3.schemeBlues)


    console.log(d3.max(series, f => d3.max(f, f => f[1])))

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("font-family", "sans-serif")
        .attr("font-size", "40")
        .attr("text-anchor", "middle")

    let cat = svg
        .selectAll("g")
        .data(series)
        .join("g")

    let bar = cat.selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("fill", d => colour(d.key))
        .attr("x", (d, i) => x(d.data.name))
        .attr("y", d => y(d[1]))
        .attr("width", x.bandwidth())
        .attr("height", d => y(d[0]) - y(d[1]))

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))

    function update(stat) {
        let newBar
        switch (stat) {
            case "goals":
                console.log(bar)
                //   bar.sort((a, b) => d3.descending(a.goals, b.goals))
                newBar = bar.sort((a, b) => d3.descending(a.data.goals, b.data.goals))
                x.domain(newBar.data().map(d => d.data.name))
                bar.attr("x", (d, i) => x(d.data.name))
                // console.log(newBar.data()[1].data.name)
                break
            case "assists":
                series = d3.stack()
                    .keys(["assists", "goals"])
                    (data)
                    .map(d => (d.forEach(v => v.key = d.key), d))

                console.log(series)

                cat = svg
                    .selectAll("g")
                    .data(series)
                    .join("g")

                bar = cat.selectAll("rect")
                    .data(d => d)
                    .join("rect")

                console.log(bar.data())

                newBar = bar.sort((a, b) => d3.descending(a.data.assists, b.data.assists))

                console.log(newBar)
                x.domain(newBar.data().map(d => d.data.name))
                bar.attr("x", (d, i) => x(d.data.name))
                    .attr("y", (d, i) => y(d[1]))
                    .attr("height", d => y(d[0]) - y(d[1]))
                    .attr("fill", d => colour(d.key))

                svg.append("g")
                    .attr("transform", `translate(${margin.left},0)`)
                    .call(d3.axisLeft(y))

                // series = d3.stack()
                //     .keys(["assists", "goals"])
                //     (data)
                //     .map(d => (d.forEach(v => v.key = d.key), d))
                // .attr("y", d => y(d[1])-y(max))

                break
            default:
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

function sort() {
    chartElement.update("assists")
}

getData(insert)