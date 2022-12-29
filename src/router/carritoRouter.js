const express = require('express')
const router = express.Router()

//CONFIGURACION PARA FIREBASE
const CartManager = require('../contenedores/firebase/cartManager')
let cartManager = new CartManager('carritos')

//CONFIGURACION PARA MONGODB
//const CartManager = require('../contenedores/mongodb/cartManager')
//const cartModel = require('../models/cartModel')
//let cartManager = new CartManager(cartModel)

// MIDDLEWARES
const validarId = (req, res, next) => {
    //let {id} = req.params
    //if (isNaN(id)) return res.status(404).send({error: -2, descripcion: `ruta ${req.baseUrl}${req.url} metodo ${req.method}`}) //CORREGIR
    next()
}

const validarCarrito = (req, res, next) => {
    //let carrito = req.body
    //if (!carrito.productos) return res.status(400).send({err: 'Faltan datos'})
    //carrito.productos.map (producto => {
    //    if (!producto.nombre || !producto.descripcion || !producto.codigo || !producto.foto || !producto.precio || !producto.stock || !producto.id || !producto.timestamp) return res.status(400).send({err: 'Faltan datos'})
    //})
    next()
}

const validarProducto = (req, res, next) => {
    //let producto = req.body
    //if (!producto.nombre || !producto.descripcion || !producto.codigo || !producto.foto || !producto.precio || !producto.stock || !producto.id || !producto.timestamp) return res.status(400).send({err: 'Faltan datos'})
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
    .then(result => res.status(201).send(result))
    .catch(err => res.send({error: 0, descripcion: err})) 
})

router.put('/:id/productos', validarId, validarProducto, (req, res) => {
    let {id} = req.params
    let producto = req.body
    cartManager.update(id, producto)
    .then(result => res.send(result))
    .catch(err => res.send({error: 0, descripcion: err})) 
})
 
router.delete('/:id', validarId, (req, res) => {
    let {id} = req.params
    cartManager.deleteCart(id)
    .then(res.status(204).send({message: "Carrito eliminado con éxito"}))
    .catch(err => res.send({error: 0, descripcion: err}))    
})

router.delete('/:cartId/productos/:productId',(req, res) => {
    let {cartId} = req.params
    let {productId} = req.params
    cartManager.deleteProduct(cartId, productId)
    .then(res.status(204).send({message: "Producto eliminado con éxito"}))
    .catch(err => res.send({error: 0, descripcion: err}))  
} )

module.exports = router