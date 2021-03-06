console.log('hello')

window.onload = function () {
    const sortButton = document.getElementById('sort')
    sortButton.addEventListener("change", sort)
    const playersButton = document.getElementById('highlight-team')
    playersButton.addEventListener('click', highlight)
    const webTeamForm = document.getElementById('web-team')
    webTeamForm.addEventListener('click', importTeam)
    // checkCode()
    // const webTeamForm = document.getElementById('web-team-form')
    // webTeamForm
}
let chartElement
let categories = ['goals', 'assists', 'points', 'pims', 'ppp', 'sog', 'hits', 'blks']
let highlightedPlayers = ['Ryan Strome', 'Blake Wheeler', 'Anders Lee', 'Kevin Fiala', 'Kyle Palmieri', 'Ryan Reaves', 'Brayden Point', 'Filip Forsberg',
    'Jordan Eberle', "Ryan Ellis", 'Kris Letang', 'Neal Pionk', 'Matt Niskanen', 'Taylor Hall', 'David Perron', 'David Pastrnak',
    'Torey Krug', 'Brock Boeser', 'Steven Stamkos', 'Kailer Yamamoto'
]

let playerData
checkCode()

//check if authorized login
async function checkCode() {

    try{
    console.log(window.location.search)
    let url = window.location.search
    let urlParams = new URLSearchParams(url)
    if (urlParams.get("code")) {
        let code = {
            code: urlParams.get("code")
        }
        let tokenPromise = await getAccessToken(code)
        let token = tokenPromise
        console.log(token)
        console.log(code)
    } else {

    }
} catch (error) {
    console.log(error)
}
}
// checkCode()
// let code = urlParams.get("code")

function getAccessToken(code) {
    console.log(code)
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest()
        request.open('POST', "../getteam/getaccesstoken")
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status === 201) {
                    resolve(JSON.parse(request.response))
                } else {
                    reject(JSON.parse(request.response))
                }
            }
            // request.send(JSON.stringify(code))
            // request.setRequestHeader('Content-Type', 'application/json')
            // request.send()
        }
        request.setRequestHeader('Content-Type', 'application/json')
        request.send(JSON.stringify(code))
    })
}

async function importTeam(event) {
    event.preventDefault()
    let url = document.getElementById('url').value
    console.log(url)
    let data = {
        url: url
    }
    // console.log(data)
    let destinationPromise = await submitWebTeam(data)
    let destination = destinationPromise
    //    console.log(destination.url)
    window.location.replace(destination.url)
    return false
}

function getTeamRequest(data) {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest()
        request.open('POST', '../getteam')
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status === 201) {
                    resolve(JSON.parse(request.response))
                } else {
                    reject(JSON.parse(request.response))
                }
            }
        }
        request.setRequestHeader('Content-Type', 'application/json')
        console.log(JSON.stringify(data))
        // console.log(request.body)
        request.send()
        console.log(request.body)
    })
}

async function submitWebTeam(url) {
    try {
        const requestPromise = getTeamRequest(url)
        const response = await requestPromise
        console.log(response)
        return response

        // console.log(JSON.parse(response.body))

    } catch (errorResponse) {
        console.log(errorResponse.error)
    }

}

//Oauth stuff
// let OAuth ={
//     client_id: 'dj0yJmk9U1dBdmZHT3JzN3hCJmQ9WVdrOU1VSm1XbEZIVWpFbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWYx',
//     redirect_uri: "https://0113086a6e33.ngrok.io/getranks/rankings",
//     response_type: "code"
// }
// function getAuthURL() {
//     // let url = 'https://api.login.yahoo.com/oauth2/request_auth?client_id=' + client_id + '--&redirect_uri=oob&response_type=code&language=en-us'
//     let url = 'https://api.login.yahoo.com/oauth2/request_auth'
//     return new Promise((resolve,reject) => {
//         let request = new XMLHttpRequest()
//         request.open('')
//     })


// }






// console.log(event)
// let formData = new FormData()
// let formElements = {"url": document.forms["web-team-form"].elements["url"].value}
// formData.append("url", document.forms["web-team-form"].elements["url"].value)
// // formData.append("test", "test")
// console.log(JSON.stringify(formElements))
// console.log(formData)
// // console.log(form)
// const teamCall = new XMLHttpRequest()
// teamCall.onreadystatechange = () => {
//     if (teamCall.readyState === 4) {
//         // insert(JSON.parse(dataCall.response))
//         webTeam = JSON.parse(teamCall.response)
//     }
// }
// teamCall.open('POST', '../getteam')
// teamCall.send(JSON.stringify(formElements))
// teamCall.send(formElements)
// const webTeamForm = document.getElementById('web-team-form')
// console.log(webTeamForm)
// event.preventDefault()
// const webTeamForm = document.getElementById('web-team-form')
// // webTeamForm.preventDefault()
// webTeamForm.submit()
// console.log(event)
// return false
// event.preventDefault()
// }

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
        // sortedBar = bars.sort((a, b) => d3.descending(a.data[stat], b.data[stat]))
        sortedBar = bars.sort((a, b) => {
            if (a.data[stat] === b.data[stat]) {
                return a.data.name.localeCompare(b.data.name)
            } else {
                return b.data[stat] - a.data[stat]
            }
        })
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

    function buildKey() {

        let categoriesCaps = ['Goals', 'Assists', 'Points', 'Pims', 'Ppp', 'Sog', 'Hits', 'Blks']

        let key = d3.select("#key")
            .style("display", "flex")
            .style("justify-content", "center")
            .style("align-items", "center")
            .text("Color Code:")
            // .style("")
            // .style("border", "1px solid black")
            // .style("width", "50%")
            .style("margin", "auto")
            .style("margin-top", "1rem")
            .style("margin-bottom", "1rem")
            .style("font-weight", "600")
        // .style("display", "flex")

        key.selectAll("div")
            .data(categoriesCaps)
            .join("div")
            .text(d => d)
            .style("width", "10%")
            // .style("margin", "auto")
            .style("padding", "0.2rem 0.2rem")
            .style("text-align", "center")
            .style("background-color", d => colour(d))
        // console.log(key.nodes())
    }

    buildKey()

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
                playerData.sort((a, b) => {
                    if (b.score === a.score) {
                        return a.name.localeCompare(b.name)
                    } else {
                        return b.score - a.score
                    }
                    // return b.score - a.score
                })
                // console.log(playerData)
                console.log("player data after sort")
                console.log(playerData)
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
                playerData.sort((a, b) => {
                    if (b[stat] === a[stat]) {
                        // let nameA = a.name
                        // let nameB = b.name
                        // console.log(b.name)
                        // console.log(a.name)
                        // console.log(a.name.localeCompare(b.name))
                        return a.name.localeCompare(b.name)
                    } else {
                        return b[stat] - a[stat]
                    }
                    // return b[stat] - a[stat]
                })
                console.log("player data after sort")
                console.log(playerData)
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
            console.log(index)
            let toMove = playerData.slice(index + 1)
            console.log("player data after to move")
            console.log(playerData)
            console.log("player data to move")
            console.log(toMove)
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
                d3.selectAll(".stat-bar").filter(moveFilter).attr("x", (d, i, n) =>
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
                d3.selectAll(".stat-bar").filter(moveFilter).attr("x", (d, i, n) =>
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

            function moveFilter(d, i) {
                // console.log(d)
                if (namesToMove.includes(d.data.name)) {
                    // console.log(d.data.name)
                }
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
    // console.log(playerData)
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