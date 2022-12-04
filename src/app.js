const express = require('express');
const app = express();
const productoRouter = require('./router/productoRouter')
const carritoRouter = require('./router/carritoRouter')
const PORT = process.env.PORT || 8080
const server = app.listen(PORT, () => console.log('Server Up'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/productos', productoRouter)
app.use('/api/carritos', carritoRouter)

app.use((req,res) => {
    res.status(404).send({error: -2, descripcion: `ruta ${req.baseUrl}${req.url} metodo ${req.method} no implementada`})
})