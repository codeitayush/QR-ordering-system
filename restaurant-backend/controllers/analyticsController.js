const Order = require('../models/Order');

// GET ADVANCED ANALYTICS (ADMIN)
const getAdvancedAnalytics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    const thisMonth = new Date();
    thisMonth.setDate(1); // Start of this month
    
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    lastMonth.setDate(1); // Start of last month
    
    const lastMonthEnd = new Date();
    lastMonthEnd.setMonth(lastMonthEnd.getMonth() - 1);
    lastMonthEnd.setDate(lastMonthEnd.getDate()); // End of last month

    // Today's orders
    const todayOrders = await Order.find({
      createdAt: { $gte: today }
    });

    // This month orders
    const thisMonthOrders = await Order.find({
      createdAt: { $gte: thisMonth }
    });

    // Last month orders
    const lastMonthOrders = await Order.find({
      createdAt: { $gte: lastMonth, $lt: thisMonth }
    });

    // Calculate basic metrics
    const totalOrdersToday = todayOrders.length;
    const totalRevenueToday = todayOrders.reduce(
      (total, order) => total + (order.totalAmount || 0),
      0
    );
    const averageOrderValue = totalOrdersToday > 0 ? totalRevenueToday / totalOrdersToday : 0;

    // Hourly distribution (24 hours)
    const hourlyOrderDistribution = new Array(24).fill(0);
    todayOrders.forEach(order => {
      const hour = new Date(order.createdAt).getHours();
      hourlyOrderDistribution[hour]++;
    });

    // Top 5 items
    const itemCounts = {};
    todayOrders.forEach(order => {
      order.items.forEach(item => {
        const itemName = item.name || 'Unknown';
        itemCounts[itemName] = (itemCounts[itemName] || 0) + (item.quantity || 1);
      });
    });

    const top5Items = Object.entries(itemCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Orders by status
    const ordersByStatus = {
      Preparing: todayOrders.filter(o => o.status === 'Preparing').length,
      Ready: todayOrders.filter(o => o.status === 'Ready').length,
      Served: todayOrders.filter(o => o.status === 'Served').length
    };

    // Monthly comparison
    const thisMonthRevenue = thisMonthOrders.reduce(
      (total, order) => total + (order.totalAmount || 0),
      0
    );
    const lastMonthRevenue = lastMonthOrders.reduce(
      (total, order) => total + (order.totalAmount || 0),
      0
    );

    const monthlyComparison = {
      thisMonth: {
        orders: thisMonthOrders.length,
        revenue: thisMonthRevenue
      },
      lastMonth: {
        orders: lastMonthOrders.length,
        revenue: lastMonthRevenue
      }
    };

    res.status(200).json({
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
      message: 'Error fetching advanced analytics'
    });
  }
};

module.exports = {
  getAdvancedAnalytics
};
