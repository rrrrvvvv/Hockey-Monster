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

    let stack = d3.stack()
        .keys(["goals", "assists"])
        (data)
        
    console.log(stack)


    x = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])

    y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.goals)]).nice()
        .range([height - margin.bottom, margin.top])

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("font-family", "sans-serif")
        .attr("font-size", "40")
        .attr("text-anchor", "middle")

    const bar = svg.selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", (d, i) => `translate(${x(i)},0)`)

    bar.append("rect")
        .attr("fill", "steelblue")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.goals))
        .attr("width", x.bandwidth())
        .attr("height", d => y(0) - y(d.goals))

    bar.append("text")
        .attr("fill", "black")
        .attr("y", d => y(d.goals) + 10)
        .attr("x", x.bandwidth() / 2)
        .attr("alignment-baseline", "hanging")

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))

    function update(stat) {
        switch (stat) {
            case "goals":
                bar.sort((a, b) => d3.descending(a.goals, b.goals))
                    .attr("transform", (d, i) => `translate(${x(i)},0)`)
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
    chartElement.update("goals")
}

getData(insert)