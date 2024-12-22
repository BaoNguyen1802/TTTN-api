const mongoose = require("mongoose");
const Order = require("../models/Orders");

const router = require("express").Router();

//CREATE

router.post("/", async (req, res) => {
  const { userId, products, amount, address, paymentMethod } = req.body;

  // Kiểm tra phương thức thanh toán hợp lệ
  const validPaymentMethods = ["cash", "creditCard", "paypal"];
  if (!validPaymentMethods.includes(paymentMethod)) {
    return res.status(400).json({ message: "Invalid payment method" });
  }

  // Kiểm tra xem có sản phẩm nào không
  if (!products || products.length === 0) {
    return res.status(400).json({ message: "No products in the order" });
  }

  // Chuyển đổi productId thành ObjectId nếu chưa là ObjectId
  const formattedProducts = products.map((product) => {
    return {
      productId: product.productId, // Chuyển productId thành ObjectId
      quantity: product.quantity,
    };
  });

  const newOrder = new Order({
    userId,
    products: formattedProducts,
    amount,
    address,
    paymentMethod,
  });

  try {
    // Lưu đơn hàng vào cơ sở dữ liệu
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: "Error saving order", error: err.message });
  }
});

//UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER ORDERS
router.get("/find/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL orders and populate the products
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId")
      .populate("products.productId") // Thay "productId" bằng tên trường bạn đang sử dụng trong schema
      .exec();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET order by ID and populate the products
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId")
      .populate("products.productId") // Populate cho productId
      .exec();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});



// GET MONTHLY INCOME

router.get("/income", async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;