console.log('hello')
const sortButton = document.getElementById('sort')
// const chartWrapper = document.getElementById('D3-wrapper')
// const d3 = require('d3')

const dataCall = new XMLHttpRequest()
dataCall.onreadystatechange = () => {
    if (dataCall.readyState === 4) {
        const dataPromise = JSON.parse(dataCall.response)
        const data = dataPromise


        const width = 1100,
            height = 400

        console.log(data)
        const margin = ({
            top: 20,
            right: 0,
            bottom: 30,
            left: 40
        })

        console.log(margin.top)

        async function buildChart(data) {

            x = d3.scaleBand()

                .domain(d3.range(data.length))
                .range([margin.left, width - margin.right])

            y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.goals)]).nice()
                .range([height - margin.bottom, margin.top])



            const svg = d3.select("#D3-wrapper").append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("font-family", "sans-serif")
                .attr("font-size", "40")
                .attr("text-anchor", "middle")

            const bar = svg.selectAll("g")
                .data(data)

                .join("g")
                .sort((a, b) => d3.descending(a.goals, b.goals))
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
                // .text(d => d.name)
                .attr("alignment-baseline", "hanging")



            svg.append("g")
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y))

        }
        buildChart(data)
    }
}
dataCall.open('GET', '../getranks/data')
dataCall.send()