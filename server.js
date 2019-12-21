require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIES = require('./movies-data-small.json')

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(helmet())

//validate the API token
function validateToken(req, res, next){
    const reqToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN

    if (!reqToken || apiToken !== reqToken.split(' ')[1]){
        res.status(401).json({error: 'Unauthorized request'})
    }

    next()
}

app.use(validateToken)

app.get('/movie', (req, res) => {
    const {genre, country, avg_vote} = req.query
    let results = MOVIES
    if(genre){
        results = results.filter(movie => 
            movie["genre"].toLowerCase().includes(genre.toLowerCase()))
    }
    if (country) {
        results = results.filter(movie => 
            movie['country'].toLowerCase().includes(country.toLowerCase()))
    }
    if (avg_vote){
        if (avg_vote >10 || avg_vote < 0){
            return res.status(400).json({error: "please put in a number between 0 to 10"})
        }else {
            results = results.filter(movie => 
                movie['avg_vote'] >= Number(avg_vote)
            )
        }
    }
    res.json(results)
})

const PORT = 8000
app.listen(PORT, () => {
    console.log(`Server listening a http://localhost:${PORT}`)
})