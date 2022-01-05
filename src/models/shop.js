const mongoose = require('mongoose')
const schema = mongoose.Schema

const ShopSchema = schema(
    {
        name: {type: String},
        category: {type: String},
        isActive: {type: Boolean},
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Shop', ShopSchema)