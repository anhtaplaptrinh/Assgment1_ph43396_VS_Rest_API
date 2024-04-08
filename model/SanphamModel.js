const mongoose = require('mongoose');
const sanphamSchema = mongoose.Schema({
    ten: {
        type: String,
        require: true
    },
    anh: {
        type: String
    },
    gia: {
        type: Number,
        require: true
    },
    soluong: {
        type: String,
        require: true
    }
})

const sanphamModel = mongoose.model('sanphams', sanphamSchema)

module.exports = sanphamModel;