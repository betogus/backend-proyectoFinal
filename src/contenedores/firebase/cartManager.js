class FirebaseCartManager {
     constructor(collection) {
         this.collection = collection
         this.db = require('../../config/firestore').firestore()
     }


    async getById(id) {
        if (!this.collection) return {
            error: 0,
            descripcion: "No existe la BD"
        }
        const cart = await this.db.collection(this.collection).doc(id).get()
        if (!cart) return {
            error: 0,
            descripcion: "carrito no encontrado"
        }
        return {...cart.data(), id: cart.id}
    }

    async createCart(item) {
        try {
            let timestamp = new Date().toLocaleString()
            const cart = JSON.parse(JSON.stringify(item))
            const carts = this.db.collection(this.collection)
            await carts.add({...cart, timestamp})
            return {...cart, timestamp}
        } catch (err) {
            return {
                error: 0,
                descripcion: err
            }
        }
    }

    async update(id, item) {
        if (!this.collection) return {
            error: 0,
            descripcion: "No existe la BD"
        }
        let timestamp = new Date().toLocaleString()
        const cart = this.db.collection(this.collection).doc(id)
        const getCart = await cart.get()
        const products = await getCart.data().productos
        const productsUpdated = [...products, item]
         if (!cart) return {
                error: 0,
                descripcion: 'Producto no encontrado'
            }; else {
                await cart.update(JSON.parse(JSON.stringify({productos: productsUpdated,timestamp})))
                return {descripcion: 'Producto actualizado'}
            }
    }

    async deleteProduct(cartId, productId) {
        if (!this.collection) return {
            error: 0,
            descripcion: "No existe la BD"
        }
        let timestamp = new Date().toLocaleString()
        const cart = this.db.collection(this.collection).doc(cartId)
        const getCart = await cart.get()
        const products = await getCart.data().productos
        let productsFiltered = [...products.filter(product => product.id !== parseInt(productId))]
        if (!!productsFiltered) {
            await cart.update(JSON.parse(JSON.stringify({productos: productsFiltered,timestamp})))
            return {
                decripcion: "carrito actualizado"
            }
        } else {
            return {
                error: 0,
                descripcion: 'Producto no encontrado'
            }
        }
        
        
        
    }

    async deleteCart(id) {
        const doc = this.db.collection(this.collection).doc(id)
        const result = await doc.get()
        if (result.exists) {
           await doc.delete()
           return {descripcion: "carrito eliminado"}
        } else return {error: 0, descripcion: 'carrito no encontrado'}
    }
}

module.exports = FirebaseCartManager