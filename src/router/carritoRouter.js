const express = require('express')
const CartManager = require('../controllers/cartManager.js')
const router = express.Router()
let cartManager = new CartManager()

// MIDDLEWARES
const validarId = (req, res, next) => {
    let {id} = req.params
    if (isNaN(id)) return res.status(404).send({error: -2, descripcion: `ruta ${req.baseUrl}${req.url} metodo ${req.method}`}) //CORREGIR
    next()
}

const validarCarrito = (req, res, next) => {
    let carrito = req.body
    if (!carrito.productos) return res.status(400).send({err: 'Faltan datos'})
    carrito.productos.map (producto => {
        if (!producto.nombre || !producto.descripcion || !producto.codigo || !producto.foto || !producto.precio || !producto.stock || !producto.id || !producto.timestamp) return res.status(400).send({err: 'Faltan datos'})
    })
    next()
}

const validarProducto = (req, res, next) => {
    let producto = req.body
    if (!producto.nombre || !producto.descripcion || !producto.codigo || !producto.foto || !producto.precio || !producto.stock || !producto.id || !producto.timestamp) return res.status(400).send({err: 'Faltan datos'})
    next()
}


//ROUTER
 
router.get('/:id/productos', validarId, (req, res) => {
    let {id} = req.params
    cartManager.getById(id)
    .then(result => res.send(result))
    .catch(err => res.send({error: 0, descripcion: err}))
})
 
router.post('/', validarCarrito, (req, res) => {
    let carrito = req.body
    cartManager.createCart(carrito)
    .then(result => res.send(result))
    .catch(err => res.send({error: 0, descripcion: err})) 
})

router.post('/:id/productos', validarId, validarProducto, (req, res) => {
    let {id} = req.params
    let producto = req.body
    cartManager.update(id, producto)
    .then(result => res.send(result))
    .catch(err => res.send({error: 0, descripcion: err})) 
})
 
router.delete('/:id', validarId, (req, res) => {
    let {id} = req.params
    cartManager.deleteCart(id)
    .then(res.send({message: "Carrito eliminado con éxito"}))
    .catch(err => res.send({error: 0, descripcion: err}))    
})

router.delete('/:cartId/productos/:productId',(req, res) => {
    let {cartId} = req.params
    let {productId} = req.params
    cartManager.deleteProduct(cartId, productId)
    .then(res.send({message: "Producto eliminado con éxito"}))
    .catch(err => res.send({error: 0, descripcion: err}))  
} )

module.exports = router