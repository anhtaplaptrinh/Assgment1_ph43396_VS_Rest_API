const express = require('express')
const router = express.Router();
const sanphamModel = require('./SanphamModel')
const mongoose = require('mongoose');
const upload = require('./config/common/upload')
const path = require('path');

module.exports = router;

router.get('/', (req, res) => {
    res.send('Vao api Moblie')
})

const uri = 'mongodb+srv://anhttph43396:EeQIOMkkPfdZRLRk@lab3-anhttph43396.9jz7xzv.mongodb.net/Assigment_REST_API';

router.get('/list', async (req, res) => {
    await mongoose.connect(uri)

    let sanpham = await sanphamModel.find();

    res.send(sanpham)
})

router.post('/add', async (req, res) => {
    try {
        const newSanpham = new sanphamModel(req.body);
        await newSanpham.save();
        res.status(201).send('Dữ liệu đã được thêm thành công');
    } catch (error) {
        console.error('Lỗi khi thêm dữ liệu:', error);
        res.status(500).send('Đã xảy ra lỗi khi thêm dữ liệu');
    }
});
 
router.get('/gallery/:imageName', async (req, res) => {
    await mongoose.connect(uri)
    try {
        const imageName = req.params.imageName;
 
        res.render('gallery', { images: [imageName] });
    } catch (error) {
        console.error('Lỗi khi tìm ảnh:', error);
        res.status(500).send('Đã xảy ra lỗi khi tìm ảnh');
    }
});


router.delete('/delete/:id', async (req, res) => {
    try {
        await mongoose.connect(uri);

        let id = req.params.id;
        let result = await sanphamModel.deleteOne({ _id: id });

        if (result) {
            res.json({
                "status": 200,
                "messenger": "Xóa thành công",
                "data": result
            });
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi, xóa không thành công",
                "data": []
            });
        }
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        res.status(500).send('Lỗi máy chủ nội bộ');
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        await mongoose.connect(uri);

        const id = req.params.id;
        const data = req.body;

        const updateFruit = await sanphamModel.findByIdAndUpdate(id, data, { new: true });

        res.json({
            "status": 200,
            "messenger": "Cập nhật thành công",
            "data": updateFruit
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật sản phẩm:', error);
        res.status(500).send('Lỗi máy chủ nội bộ');
    }
});