const mongoose = require('mongoose')
const schema = mongoose.Schema

const OrderSchema = schema(
    {
        id: { type: String, required: 'id required.', trim: true, unique: true, lowercase: true },
        description: {type: String},
        amount: {type: Number},
        total: {type: Number},
        productos: [{ type: Schema.Types.ObjectId, ref: 'product' }],
        user: [{ type: Schema.Types.ObjectId, ref: 'user' }]
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Order', OrderSchema)