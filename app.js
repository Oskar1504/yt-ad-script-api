require("dotenv").config()
const express = require('express')
const HTMLParser = require('node-html-parser');
const fs = require("fs");

const selectors = JSON.parse(fs.readFileSync("./selectors.json"))

const app = express()

let lastFetch = new Date("2023-10-19:00:00").getTime()
let lastResponse = {}

app.use(express.json())

app.use(function (req, res, next) {
    console.log(`${req.method} | ${req.path} | ${req.ip} | ${new Date().toJSON()}`)
    next()
})

app.get('/getScriptId', async function (req, res) {

    let hostUrl = "https://www.youtube.com"

    let now = new Date().getTime()

    if (diff_seconds(lastFetch, now) <= process.env.CACHE_DURATION){
        console.log("Using cache. time since last fetch: " + diff_seconds(lastFetch, now));
        res.json(lastResponse)
    }else {
        fetch(hostUrl)
        .then(r => r.text())
        .then(async function (response) {
            console.log(hostUrl, " | Success:");
            let root = HTMLParser.parse(response);

            let foundElements = selectors.map((selector, i) => {
                let elm = root.querySelector(selector)
                return {
                    id: i,
                    selector: selector,
                    scriptSrc: elm.getAttribute("src"),
                    scriptId: elm.getAttribute("src").split("/")[5],
                    timestamp: new Date().getTime()
                }
            })

            addToTrackedIds(foundElements)

            lastFetch = new Date().getTime()

            lastResponse = {
                status: 200,
                foundElements: foundElements,
                scriptIds: foundElements.map(e => e.scriptId),
                fetchTimestamp: lastFetch
            }

            res.json(lastResponse)
        })
        .catch(function (error) {
            // handle error
            console.log(error.toString());
            res.json({
                status: 500,
                error: error.toString()
            })
        })
    }

    

})

app.get('/getTrackedIds', async function (req, res) {
    try {
        res.json({
            status: 200,
            trackedIds: JSON.parse(fs.readFileSync("./trackedIds.json")) 
        })
    } catch (error) {
        res.json({
            status: 500,
            err: error.toString()
        })
    }
})
app.get('/', async function (req, res) {
    res.json({
        status: 200,
        msg: "hey i am alive"
    })
})

app.listen(process.env.PORT, function () {
    console.log(`${process.env.PROJECT_NAME} is running at http://localhost:${process.env.PORT}`)
})


// src https://stackoverflow.com/a/59887628
// small patch by me to make the function work with timestamps rather tahn date object
function diff_seconds(dt2, dt1) {
    var diff = (dt2 - dt1) / 1000;
    return Math.abs(Math.round(diff));
}


function addToTrackedIds(foundElements){
    let trackedIds = JSON.parse(fs.readFileSync("./trackedIds.json"))
    foundElements.forEach(e => {
        if(trackedIds.find(te => te.scriptSrc == e.scriptSrc) == undefined){
            trackedIds.push(e)
        }
    });

    fs.writeFileSync("./trackedIds.json", JSON.stringify(trackedIds, null, 2))
}