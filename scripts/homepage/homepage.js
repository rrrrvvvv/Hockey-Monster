const getResultsButton = document.getElementById('get-results-page')

getResultsButton.addEventListener('click', (click) => {
    if (click) {
        console.log('clicked')
        getPlayerRankings()
    } else {
        console.log('other')
    }
})

let getPlayerRankings = function () {
    const rankingsArray = []
    //call to server
    let apiRequest = new XMLHttpRequest()
    apiRequest.onreadystatechange = () => {
        if(apiRequest.readyState === 4) {
            // if (apiRequest.status === 404) {
            //     console.log("error")
            // } else {
            //     const response = JSON.parse(apiRequest.response)
            //     console.log("hello")
            // }
           console.log("hello")
        }
    }
    apiRequest.open('GET', '../getranks/weighted')
    apiRequest.send()
    // console.log("hello")

    return rankingsArray
}