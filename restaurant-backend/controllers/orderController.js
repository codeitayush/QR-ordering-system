const Order = require('../models/Order');

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
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

// GET ALL ORDERS
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

// UPDATE STATUS
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

// BASIC ANALYTICS
const getAnalytics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await Order.find({
      createdAt: { $gte: today }
    });

    const totalOrders = todayOrders.length;
    const totalRevenue = todayOrders.reduce(
      (total, order) => total + (order.totalAmount || 0),
      0
    );

    const itemCounts = {};
    todayOrders.forEach(order => {
      order.items.forEach(item => {
        const name = item.name || 'Unknown';
        itemCounts[name] = (itemCounts[name] || 0) + item.quantity;
      });
    });

    let mostOrderedItem = 'None';
    let max = 0;

    for (const [name, count] of Object.entries(itemCounts)) {
      if (count > max) {
        max = count;
        mostOrderedItem = name;
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

// 🔥 ADVANCED ANALYTICS
const getAdvancedAnalytics = async (req, res) => {
  console.log("🔥 ADVANCED ANALYTICS HIT");
  try {
    const orders = await Order.find();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = orders.filter(o => new Date(o.createdAt) >= today);

    const totalOrdersToday = todayOrders.length;
    const totalRevenueToday = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const averageOrderValue = totalOrdersToday
      ? totalRevenueToday / totalOrdersToday
      : 0;

    // Hourly distribution
    const hourlyOrderDistribution = Array(24).fill(0);
    todayOrders.forEach(order => {
      const hour = new Date(order.createdAt).getHours();
      hourlyOrderDistribution[hour]++;
    });

    // Top items
    const itemCounts = {};
    todayOrders.forEach(order => {
      order.items.forEach(item => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
      });
    });

    const top5Items = Object.entries(itemCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Status count
    const ordersByStatus = {
      Preparing: 0,
      Ready: 0,
      Served: 0
    };

    todayOrders.forEach(order => {
      if (ordersByStatus[order.status] !== undefined) {
        ordersByStatus[order.status]++;
      }
    });

    // Monthly comparison
    const now = new Date();
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthOrders = orders.filter(o => new Date(o.createdAt) >= firstDayThisMonth);

    const lastMonthOrders = orders.filter(o => {
      const d = new Date(o.createdAt);
      return d >= firstDayLastMonth && d <= lastDayLastMonth;
    });

    const monthlyComparison = {
      thisMonth: {
        orders: thisMonthOrders.length,
        revenue: thisMonthOrders.reduce((sum, o) => sum + o.totalAmount, 0)
      },
      lastMonth: {
        orders: lastMonthOrders.length,
        revenue: lastMonthOrders.reduce((sum, o) => sum + o.totalAmount, 0)
      }
    };

    res.json({
      success: true,
      data: {
        totalOrdersToday,
        totalRevenueToday,
        averageOrderValue,
        hourlyOrderDistribution,
        top5Items,
        ordersByStatus,
        monthlyComparison
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Advanced analytics error'
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getAnalytics,
  getAdvancedAnalytics
};