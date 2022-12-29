require('../../config/mongodb')
class MongoProductManager {
    constructor(model) {
        this.model = model
    }

    async getAll() {
        const products = this.model.find({})
        console.log(products)
        if (products.length === 0) return {
            descripcion: "No hay productos"
        } 
        return products
    }

    async getById(id) {
        if (!this.model.find()) return {
            error: 0,
            descripcion: "No existe la BD"
        }
        const product = await this.model.findOne({_id: id})
        if (!product) return {
            error: 0,
            descripcion: "Producto no encontrado"
        }
        return product
    }

    async createProduct(item) {
        try {
            let timestamp = new Date().toLocaleString()
            const product = JSON.parse(JSON.stringify(item))
            await this.model.create({
                ...product,
                timestamp
            })
            return {
                ...product,
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
        await this.model.findByIdAndUpdate(id, {...item, timestamp}, { new: true })
        return {decripcion: "producto actualizado"}
    }



    async delete(id) {
        const response = await this.getById(id)
        if (!!response) {
            await this.model.deleteOne({ _id: id })
            return {
                descripcion: "producto eliminado"
            }
        } else return {
            error: 0,
            descripcion: 'Producto no encontrado'
        }
    }
}

module.exports = MongoProductManager