const express = require('express')
const ProductManager = require('../controllers/productManager.js')
const router = express.Router()
let productManager = new ProductManager()

let isAdmin = true 

// MIDDLEWARES
const validarId = (req, res, next) => {
    let {id} = req.params
    if (isNaN(id)) return res.status(404).send({error: -2, descripcion: `ruta ${req.baseUrl}${req.url} metodo ${req.method}`}) //CORREGIR
    next()
}

const validarProducto = (req, res, next) => {
    let producto = req.body
    if (!producto.nombre || !producto.descripcion || !producto.codigo || !producto.foto || !producto.precio || !producto.stock) return res.status(400).send({err: 'Faltan datos'})
    next()
}

const validarAdmin = (req, res, next) => {
    if (!isAdmin) return res.status(401).send({error: -1, descripcion: `ruta: ${req.baseUrl}${req.url} metodo: ${req.method} no autorizado`})
    next()
}


//ROUTER
router.get('/', (req, res) => {
    productManager.getAll()
    .then(result => res.send(result))
    .catch(err => res.send({error: 0, descripcion: err}))
})
 
router.get('/:id', validarId, (req, res) => {
    let {id} = req.params
    productManager.getById(id)
    .then(result => res.send(result))
    .catch(err => res.send({error: 0, descripcion: err}))
})
 
router.post('/', validarAdmin, validarProducto, (req, res) => {
    let producto = req.body
    productManager.createProduct(producto)
    .then(result => res.send(result))
    .catch(err => res.send({error: 0, descripcion: err})) 
})
 
router.put('/:id', validarId, validarProducto, (req, res) => {
    let producto = req.body
    let {id} = req.params
    productManager.update(id, producto)
    .then(result => res.send(result))
    .catch(err => res.send({error: 0, descripcion: err}))    
})
 
router.delete('/:id', validarAdmin, validarId, (req, res) => {
    let {id} = req.params
    productManager.delete(id)
    .then(res.send({message: "Producto eliminado con éxito"}))
    .catch(err => res.send({error: 0, descripcion: err}))    
})

module.exports = router