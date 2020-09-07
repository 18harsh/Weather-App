const express = require('express')
const path = require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for Express config
const publicDirectionPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialsPath)


// Setup static directory to serve
app.use(express.static(publicDirectionPath))

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Harsh'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {

        title: 'Help',
        name: 'Harsh'
    })
})

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Harsh'
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query) 
    res.send({
        products: []
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({error})
        }
            forecast(latitude,longitude, (error, forecasteData) => {
                if (error) {
                    return res.send({error})
                }
                res.send({
                    forecast: forecasteData,
                    location: location,
                    address: req.query.address
                })
            })
    })
    
})

app.get('/help/*', (req,res) => {
    res.render('404', {
        errorMessage: 'help page not found',
        title: 'Weather',
        name: 'Harsh'
    })
})

app.get('*', (req,res) => {
    res.render('404', {
        errorMessage: 'Page not found',
        title: 'Weather app',
        name: 'Harsh'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})