require('../../config/mongodb')
class MongoCartManager {
    constructor(model) {
        this.model = model
    }


    async getById(id) {
        if (!this.model.find()) return {
            error: 0,
            descripcion: "No existe la BD"
        }
        const cart = await this.model.findOne({
            _id: id
        })
        if (!cart) return {
            error: 0,
            descripcion: "carto no encontrado"
        }
        return cart
    }

    async createCart(item) {
        try {
            let timestamp = new Date().toLocaleString()
            const cart = JSON.parse(JSON.stringify(item))
            await this.model.create({
                ...cart,
                timestamp
            })
            return {
                ...cart,
                timestamp
            }
        } catch (err) {
            return {
                error: 0,
                descripcion: err
            }
        }
    }

    async update(id, item) {
        if (!this.model.find()) return {
            error: 0,
            descripcion: "No existe la BD"
        }
        let timestamp = new Date().toLocaleString()
        const cart = await this.model.findOne({_id: id})
        let products = [...cart.productos]
        products.push(item)
        await this.model.findByIdAndUpdate(id, {
            productos: products,
            timestamp
        }, {
            new: true
        })
        return {
            decripcion: "carrito actualizado"
        }
    }

    async deleteProduct(cartId, productId) {
        
        if (!this.model.find()) return {
            error: 0,
            descripcion: "No existe la BD"
        }
        let timestamp = new Date().toLocaleString()
        const cart = await this.model.findOne({_id: cartId})
        let productsFiltered = [...cart.productos.filter(product => product.id !== parseInt(productId))]

        await this.model.findByIdAndUpdate(cartId, {productos: productsFiltered, timestamp}, {new: true})
        return {
            decripcion: "carrito actualizado"
        }
    }

    async deleteCart(id) {
        const response = await this.getById(id)
        if (!!response) {
            await this.model.deleteOne({
                _id: id
            })
            return {
                descripcion: "carrito eliminado"
            }
        } else return {
            error: 0,
            descripcion: 'carrito no encontrado'
        }
    }
}

module.exports = MongoCartManager