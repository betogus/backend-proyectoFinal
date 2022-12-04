const fs = require('fs')
const pathToFile = './src/data/productos.json'
class ProductManager {
    getAll = async () => {
        if (!fs.existsSync(pathToFile)) return {error: 0, descripcion: "No existe la BD"}
        let data = await fs.promises.readFile(pathToFile, 'utf-8')
        let products = JSON.parse(data)
        if (products.length === 0) return {descripcion: "No hay productos"}
        return products
    }

    getById = async (id) => {
        id = parseInt(id)
        if (!fs.existsSync(pathToFile)) return {error: 0, descripcion: "No existe la BD"}
        let data = await fs.promises.readFile(pathToFile, 'utf-8')
        let products = JSON.parse(data)  
        console.log(products)
        let product = products.find(item => item.id === id)
        console.log(product)
        if (!product) return {error: 0, descripcion: "Producto no encontrado"}
        return product  
    }
    createProduct = async (product) => {
        try { 
            let id = 1;
            let timestamp = new Date().toLocaleString()
            let newProduct
            if (fs.existsSync(pathToFile)) {
                let data = await fs.promises.readFile(pathToFile, 'utf-8')
                let products = JSON.parse(data)
                if (products.length >0) id = products[products.length-1].id + 1
                newProduct = { ...product, id, timestamp}
                products.push(newProduct)
                await fs.promises.writeFile(pathToFile, JSON.stringify(products, null, 2))   
            } else {
                newProduct = {...product, id, timestamp }
                await fs.promises.writeFile(pathToFile, JSON.stringify([newProduct], null, 2))
            }
            return newProduct
        } catch(err) {
            return {error: 0, descripcion: err}
        } 
    }
    update = async (id, product) => {
        let timestamp = new Date().toLocaleString()
        id = parseInt(id)
        if (fs.existsSync(pathToFile)) {
            let data = await fs.promises.readFile(pathToFile, 'utf-8')
            let products = JSON.parse(data)
            let productsFiltered = products.filter(item => item.id !== id)
            let productUpdated = {...product, id, timestamp }
            let newProducts = [{...productsFiltered, ...productUpdated}]
            let productSearched = products.find(item => item.id === id)
            if (!productSearched) return {error: 0, descripcion: 'Producto no encontrado'}
            await fs.promises.writeFile(pathToFile, JSON.stringify(newProducts, null, 2))
            return productUpdated
        } else {
            return {error: 0, descripcion: "No existe la BD"}
        }

    }
    delete = async (id) => {
        id = parseInt(id)
        if (fs.existsSync(pathToFile)) {
            let data = await fs.promises.readFile(pathToFile, 'utf-8')
            let products = JSON.parse(data)
            let newProducts = products.filter(item => item.id !== id)
            let productDeleted = products.find(item => item.id === id)
            if (!productDeleted) return {error: 0, descripcion: 'Producto no encontrado'}
            await fs.promises.writeFile(pathToFile, JSON.stringify(newProducts, null, 2))
        } else {
            return {error: 0, descripcion: 'No existe la BD'}
        }
    }
}
module.exports = ProductManager