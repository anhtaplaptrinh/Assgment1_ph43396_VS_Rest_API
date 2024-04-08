const express = require('express')
const router = express.Router();
const sanphamModel = require('./model/SanphamModel')
const upload = require('./config/common/upload')
const users = require('./model/userModel');
const unidecode = require('unidecode');

module.exports = router;

router.get('/', (req, res) => {
    res.send('Vao api Moblie')
})
router.get('/list', async (req, res) => {
    let sanpham = await sanphamModel.find();

    res.send(sanpham)
})

router.post('/add', upload.single('anh'), async (req, res) => {
    try {
        const data = req.body;
        const { file } = req
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`

        const newSanpham = new sanphamModel({
            ten: data.ten,
            anh: imageUrl,
            gia: data.gia,
            soluong: data.soluong,
        });

        const result = await newSanpham.save();

        if (result) {
            res.json({
                "status": 200,
                "message": "Thêm thành công",
                "data": result
            });
        } else {
            res.json({
                "status": 400,
                "message": "Thêm không thành công",
                "data": []
            });
        }
    } catch (error) {
        console.error('Lỗi khi thêm dữ liệu:', error);
        res.status(500).send('Đã xảy ra lỗi khi thêm dữ liệu');
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
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

router.put('/update/:id', upload.single('anh'), async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const { file } = req
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`

        const result = await sanphamModel.findByIdAndUpdate(id, {
            ten: data.ten,
            anh: imageUrl,
            gia: data.gia,
            soluong: data.soluong,
        })  

        if (result) {
            res.json({
                "status": 200,
                "message": "Cập nhật thành công",
                "data": result
            });
        } else {
            res.json({
                "status": 400,
                "message": "Không tìm thấy trái cây",
                "data": []
            });
        }
    } catch (error) {
        console.error('Lỗi khi thêm dữ liệu:', error);
        res.status(500).send('Đã xảy ra lỗi khi thêm dữ liệu');
    }
});

router.put('/update-no-image/:id', upload.single('anh'), async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        const result = await sanphamModel.findByIdAndUpdate(id, {
            ten: data.ten,
            gia: data.gia,
            soluong: data.soluong,
        })  

        if (result) {
            res.json({
                "status": 200,
                "message": "Cập nhật thành công",
                "data": result
            });
        } else {
            res.json({
                "status": 400,
                "message": "Cap nhat that bai",
                "data": []
            });
        }
    } catch (error) {
        console.error('Lỗi khi thêm dữ liệu:', error);
        res.status(500).send('Đã xảy ra lỗi khi thêm dữ liệu');
    }
});

router.post('/register', upload.single('avatar'), async (req, res) => {
    try {
        const data = req.body;
        const { file } = req
        const avatar = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
        const newUser = users({
            username: data.username,
            password: data.password,
            email: data.email,
            name: data.name,
            avatar: avatar,
        })

        const result = await newUser.save()

        if (result) { 
            res.json({
                "status": 200,
                "messenger": "Thêm thành công",
                "data": result
            })
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi, thêm không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await users.findOne({ username, password })
        if (user) {
            res.json({
                "status": 200,
                "messenger": "Đăng nhâp thành công",
                "data": user
            })
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi, đăng nhập không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
})

router.get('/search', async (req, res) => {
    try {
        const tuKhoa = req.query.key; 
       
        const ketQuaTimKiem = await sanphamModel.find({ ten: { $regex: new RegExp(tuKhoa, "i") } });

        if (ketQuaTimKiem.length > 0) {
            res.json(ketQuaTimKiem);
        } else {
            res.json([]);
        }
    } catch (error) {
        res.status(500).send('Lỗi máy chủ nội bộ');
    }
});

const sapxepgiamdan = (products) => {
    return products.sort((a, b) => b.gia - a.gia);
}

router.get('/giam-dan', async (req, res) => {
    try {
        let sanpham = await sanphamModel.find();
        let sortedProducts = sapxepgiamdan(sanpham);
        res.json(sortedProducts);
    } catch (error) {
        console.error('Lỗi khi sắp xếp danh sách sản phẩm theo giá tăng dần:', error);
        res.status(500).send('Đã xảy ra lỗi khi sắp xếp danh sách sản phẩm');
    }
});

const sapxeptangdan = (products) => {
    return products.sort((a, b) => a.gia - b.gia);
}

router.get('/tang-dan', async (req, res) => {
    try {
        let sanpham = await sanphamModel.find();
        let sortedProducts = sapxeptangdan(sanpham);
        res.json(sortedProducts);
    } catch (error) {
        console.error('Lỗi khi sắp xếp danh sách sản phẩm theo giá giảm dần:', error);
        res.status(500).send('Đã xảy ra lỗi khi sắp xếp danh sách sản phẩm');
    }
});