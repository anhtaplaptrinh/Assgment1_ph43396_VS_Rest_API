const express = require('express')
const app = express();
const port = 3000
const mongoose = require('mongoose');

const sanphamModel = require('./model/SanphamModel')

const path = require('path');


app.listen(port, () => {
    console.log(`Server đang chạy ở cổng ${port}`)
})

const uri = 'mongodb+srv://anhttph43396:anh@lab3-anhttph43396.9jz7xzv.mongodb.net/Assigment_REST_API';


app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

const api = require('./api');
app.use('/api', api)

try {
    mongoose.connect(uri)
    console.log('Ket noi thanh cong');
} catch (error) {
    console.log('Loi: ', error);
}

app.get('/', async (req, res) => {
    let sanpham = await sanphamModel.find();

    res.send(sanpham)
})