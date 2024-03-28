const express = require('express')
const app = express();
const port = 3000

const sanhphamModel = require('./SanphamModel')
const mongoose = require('mongoose');

const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(port, () => {
    console.log(`Server đang chạy ở cổng ${port}`)
})

const uri = 'mongodb+srv://anhttph43396:EeQIOMkkPfdZRLRk@lab3-anhttph43396.9jz7xzv.mongodb.net/Assigment_REST_API';

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

const api = require('./api')
app.use('/api', api)

app.get('/', async (req, res) => {
    await mongoose.connect(uri)

    let sanpham = await sanhphamModel.find();

    res.send(sanpham)
})