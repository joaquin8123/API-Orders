const mongoose = require('mongoose')
const schema = mongoose.Schema

const ProductSchema = schema(
    {
        id: { type: String, required: 'id required.', trim: true, unique: true, lowercase: true },
        description: {type: String},
        unit_price: {type: Number},
        isActive: {
            type: Boolean,
            default: false
        },
        image: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Product', ProductSchema)