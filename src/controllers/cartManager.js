const fs = require('fs')
const pathToFile = './src/data/carritos.json'
class CartManager {
    async getById(id) {
        id = parseInt(id)
        if (!fs.existsSync(pathToFile)) return {error: 0, descripcion: "No existe la BD"}
        let data = await fs.promises.readFile(pathToFile, 'utf-8')
        let carts = JSON.parse(data)
        if (carts.length === 0) return {descripcion: "No hay carritos"}
        let cartSearched = carts.find (item => item.id === id)
        if (!cartSearched) return {error: 0, descripcion: "Carrito no encontrado"}
        return cartSearched.productos
    }
    async createCart(cart) {
        try { 
            let id = 1;
            let timestamp = new Date().toLocaleString()
            let newCart
            if (fs.existsSync(pathToFile)) {
                let data = await fs.promises.readFile(pathToFile, 'utf-8')
                let carts = JSON.parse(data)
                if (carts.length >0) id = carts[carts.length-1].id + 1
                newCart = { ...cart, id, timestamp}
                carts.push(newCart)
                await fs.promises.writeFile(pathToFile, JSON.stringify(carts, null, 2))   
            } else {
                newCart = {...cart, id, timestamp }
                await fs.promises.writeFile(pathToFile, JSON.stringify([newCart], null, 2))
            }
            return newCart
        } catch(err) {
            return {error: 0, descripcion: err}
        } 
    }
    async update(id, product) {
        id = parseInt(id)
        if (fs.existsSync(pathToFile)) {
            let data = await fs.promises.readFile(pathToFile, 'utf-8')
            let carts = JSON.parse(data)
            let cartSearched = carts.find(item => item.id === id)
            if (!cartSearched) return {error: 0, descripcion: 'Carrito no encontrado'}
            let isInCart = cartSearched.productos.find(item => item.id === product.id)
            if (isInCart) return {error: 0, descripcion: 'Ya se encuentra el producto en el carrito'}
            cartSearched.productos.push(product)
            let cartsFiltered = carts.filter(item => item.id !== id)
            let newCarts = [{...cartsFiltered, ...cartSearched}]
            await fs.promises.writeFile(pathToFile, JSON.stringify(newCarts, null, 2))
            return cartSearched
        } else {
            return {error: 0, descripcion: "No existe la BD"}
        }

    }
    async deleteCart(id) {
        id = parseInt(id)
        if (fs.existsSync(pathToFile)) {
            let data = await fs.promises.readFile(pathToFile, 'utf-8')
            let carts = JSON.parse(data)
            let newCarts = carts.filter(item => item.id !== id)
            let cartSearched = carts.find(item => item.id === id)
            if (!cartSearched) return {error: 0, descripcion: 'Carrito no encontrado'}
            await fs.promises.writeFile(pathToFile, JSON.stringify(newCarts, null, 2))
        } else {
            return {error: 0, descripcion: 'No existe la BD'}
        }
    }
    async deleteProduct(cartId, productId) {
        cartId = parseInt(cartId)
        productId = parseInt(productId)
        if (fs.existsSync(pathToFile)) {
            let data = await fs.promises.readFile(pathToFile, 'utf-8')
            let carts = JSON.parse(data)
            let cartSearched = carts.find(item => item.id === cartId)
            if (!cartSearched) return {error: 0, descripcion: 'Carrito no encontrado'}
            let productSearched = cartSearched.productos.find(item => item.id === productId)
            if (!productSearched) return {error: 0, descripcion: 'El producto no se encuentra en el carrito'}
            let productsFiltered = cartSearched.productos.filter(item => item.id !==productId)
            let cartFiltered = { id: cartSearched.id, timestamp: cartSearched.timestamp, productos: productsFiltered}
            let cartsFiltered = carts.filter(item => item.id !==cartId)
            let newCarts = [{...cartFiltered, ...cartsFiltered}]
            await fs.promises.writeFile(pathToFile, JSON.stringify(newCarts, null, 2))
        } else {
            return {error: 0, descripcion: 'No existe la BD'}
        }
    }
}
module.exports = CartManager