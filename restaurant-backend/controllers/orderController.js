const Order = require('../models/Order');

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    console.log("CREATE ORDER HIT", req.body);

    const { tableNumber, items } = req.body;

    if (!tableNumber || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Table number and items are required'
      });
    }

    const totalAmount = items.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );

    const order = await Order.create({
      tableNumber,
      items,
      totalAmount
    });

    const io = req.app.get("io");
    if (io) {
      io.emit("new-order", order);
    }

    res.status(201).json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: 'Error creating order'
    });
  }
};


// GET ORDERS (ADMIN)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
};


// UPDATE STATUS (ADMIN)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Preparing', 'Ready', 'Served'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: 'Error updating order'
    });
  }
};

// GET ANALYTICS (ADMIN)
const getAnalytics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const todayOrders = await Order.find({
      createdAt: { $gte: today }
    });

    const totalOrders = todayOrders.length;
    const totalRevenue = todayOrders.reduce(
      (total, order) => total + (order.totalAmount || 0),
      0
    );

    // Calculate most ordered item
    const itemCounts = {};
    todayOrders.forEach(order => {
      order.items.forEach(item => {
        const itemName = item.name || 'Unknown';
        itemCounts[itemName] = (itemCounts[itemName] || 0) + (item.quantity || 1);
      });
    });

    let mostOrderedItem = 'None';
    let maxCount = 0;
    for (const [itemName, count] of Object.entries(itemCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostOrderedItem = itemName;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        mostOrderedItem
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Error fetching analytics'
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getAnalytics
};