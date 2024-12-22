const express = require('express');
const router = express.Router();
const { User } = require('../models')

const { verifyToken, verifyTokenWithAdmin } = require('../middleware/authMiddleware');

// Get User
router.get('/', verifyToken, async (req, res) => {
    try {
        // Lấy thông tin người dùng từ cơ sở dữ liệu dựa trên ID
        const user = await User.findById(req.userId);

        // Kiểm tra xem người dùng có tồn tại không
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { password, ...others } = user._doc
        res.status(200).json(
            others
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get User Info by Token
router.get('/me', verifyToken, async (req, res) => {
    try {
        // Lấy thông tin người dùng từ cơ sở dữ liệu dựa trên ID từ token
        const user = await User.findById(req.userId);

        // Kiểm tra xem người dùng có tồn tại không
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Loại bỏ trường password trước khi trả về
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/all', async (req, res) => {
    try {
        // Lấy tất cả người dùng từ cơ sở dữ liệu
        const users = await User.find();

        // Kiểm tra xem người dùng có tồn tại không
        if (!users) {
            return res.status(404).json({ error: 'No users found' });
        }

        // Lọc bỏ trường password từ mỗi người dùng
        const filteredUsers = users.map(user => {
            const { password, ...others } = user._doc;
            return others;
        });

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update User
router.put('/', verifyToken, async (req, res) => {
    try {
        // Lấy thông tin người dùng từ cơ sở dữ liệu dựa trên ID từ token
        const user = await User.findById(req.userId);

        // Kiểm tra xem người dùng có tồn tại không
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Lấy các trường thông tin muốn cập nhật từ body của request
        const { username, phone, address, email } = req.body;

        // Cập nhật các thông tin người dùng
        if (username) user.username = username;
        if (phone) user.phone = phone;
        if (address) user.address = address;
        if (email) user.email = email;

        // Lưu lại thông tin đã cập nhật
        await user.save();

        // Trả về thông tin người dùng sau khi cập nhật
        const { password, ...updatedUser } = user._doc;
        res.status(200).json(updatedUser);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});



module.exports = router;
