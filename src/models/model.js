const {Schema, model} = require('mongoose')
const schema = new Schema({
    nombre: {
        type: String,
        required: true,
        max: 100
    },
    precio: {
        type: Number,
        required: true,
    },
    foto: {
        type: String,
        required: true,
        max: 200
    },
    codigo: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
})
module.exports = model('productos', schema)
