const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/adios', (req, res) => {
    res.send('bye World!')
})

app.get('/variable/:nombre', (req, res) => {
    let x = req.params.nombre;
    let saludo = "hola ";
    x = saludo + x;
    res.send(x)
})

app.post('/suma', (req, res) => {
    let x = parseFloat(req.body.primero);
    let y = parseFloat(req.body.segundo);
    let resultado = x + y;
    res.send(resultado.toString())
})

app.get('/fotoGato', (req, res) => {
    res.sendFile(__dirname + '/tama.jpg')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

console.log("SI SE ESTA EJECUTANDO ESTE ARCHIVO");


// parse float -> convierte a flotante
