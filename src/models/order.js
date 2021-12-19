const mongoose = require('mongoose')
const schema = mongoose.Schema

const OrderSchema = schema(
    {
        description: {type: String},
        total: {type: Number},
        // productos: [{ type: schema.Types.ObjectId, ref: 'product' }],
        // user: [{ type: schema.Types.ObjectId, ref: 'user' }]
        productoId: {type: Number},
        userId: {type: Number},
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Order', OrderSchema)