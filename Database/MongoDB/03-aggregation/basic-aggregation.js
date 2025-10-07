/**
 * MongoDB Aggregation Framework - Basic Examples
 * Demonstrates common aggregation pipeline stages
 */

const mongoose = require("mongoose");

// ============================================
// Sample Data Setup
// ============================================

const orderSchema = new mongoose.Schema({
  orderNumber: String,
  customer: String,
  status: String,
  amount: Number,
  items: [
    {
      product: String,
      quantity: Number,
      price: Number,
    },
  ],
  date: Date,
});

const Order = mongoose.model("Order", orderSchema);

// ============================================
// $match - Filter Documents
// ============================================

async function matchExample() {
  // Find completed orders
  const result = await Order.aggregate([
    {
      $match: {
        status: "completed",
        amount: { $gte: 100 },
      },
    },
  ]);

  console.log("Completed orders >= $100:", result.length);
  return result;
}

// ============================================
// $group - Group and Calculate
// ============================================

async function groupExample() {
  // Group orders by status and calculate totals
  const result = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        totalOrders: { $sum: 1 },
        totalAmount: { $sum: "$amount" },
        averageAmount: { $avg: "$amount" },
        maxAmount: { $max: "$amount" },
        minAmount: { $min: "$amount" },
      },
    },
  ]);

  console.log("Orders grouped by status:", result);
  return result;
}

// ============================================
// $sort - Sort Results
// ============================================

async function sortExample() {
  const result = await Order.aggregate([
    {
      $match: { status: "completed" },
    },
    {
      $sort: { amount: -1 }, // -1 for descending, 1 for ascending
    },
    {
      $limit: 10,
    },
  ]);

  console.log("Top 10 orders by amount:", result);
  return result;
}

// ============================================
// $project - Select and Transform Fields
// ============================================

async function projectExample() {
  const result = await Order.aggregate([
    {
      $project: {
        orderNumber: 1,
        customer: 1,
        amount: 1,
        // Add computed fields
        amountWithTax: { $multiply: ["$amount", 1.1] },
        orderYear: { $year: "$date" },
        _id: 0,
      },
    },
  ]);

  console.log("Projected orders:", result);
  return result;
}

// ============================================
// $limit and $skip - Pagination
// ============================================

async function paginationExample(page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;

  const result = await Order.aggregate([
    { $match: { status: "completed" } },
    { $sort: { date: -1 } },
    { $skip: skip },
    { $limit: pageSize },
  ]);

  const total = await Order.countDocuments({ status: "completed" });

  return {
    data: result,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

// ============================================
// $count - Count Documents
// ============================================

async function countExample() {
  const result = await Order.aggregate([
    { $match: { status: "completed" } },
    { $count: "completedOrders" },
  ]);

  console.log("Count result:", result[0]);
  return result[0];
}

// ============================================
// Combined Pipeline Example
// ============================================

async function salesReportExample() {
  const result = await Order.aggregate([
    // Stage 1: Filter by date range and status
    {
      $match: {
        status: "completed",
        date: {
          $gte: new Date("2024-01-01"),
          $lte: new Date("2024-12-31"),
        },
      },
    },

    // Stage 2: Group by month
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
        },
        totalSales: { $sum: "$amount" },
        orderCount: { $sum: 1 },
        averageOrderValue: { $avg: "$amount" },
        customers: { $addToSet: "$customer" },
      },
    },

    // Stage 3: Add computed fields
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        totalSales: { $round: ["$totalSales", 2] },
        orderCount: 1,
        averageOrderValue: { $round: ["$averageOrderValue", 2] },
        uniqueCustomers: { $size: "$customers" },
      },
    },

    // Stage 4: Sort by year and month
    {
      $sort: { year: 1, month: 1 },
    },
  ]);

  console.log("Monthly sales report:", result);
  return result;
}

// ============================================
// $unwind - Deconstruct Arrays
// ============================================

async function unwindExample() {
  const result = await Order.aggregate([
    // Deconstruct items array
    { $unwind: "$items" },

    // Group by product
    {
      $group: {
        _id: "$items.product",
        totalQuantity: { $sum: "$items.quantity" },
        totalRevenue: {
          $sum: { $multiply: ["$items.quantity", "$items.price"] },
        },
        orderCount: { $sum: 1 },
      },
    },

    // Sort by revenue
    { $sort: { totalRevenue: -1 } },

    // Limit to top 10
    { $limit: 10 },
  ]);

  console.log("Top 10 products by revenue:", result);
  return result;
}

// ============================================
// $addFields - Add New Fields
// ============================================

async function addFieldsExample() {
  const result = await Order.aggregate([
    {
      $addFields: {
        totalItems: { $size: "$items" },
        isPremium: { $gte: ["$amount", 500] },
        orderYear: { $year: "$date" },
      },
    },
    {
      $match: { isPremium: true },
    },
  ]);

  console.log("Premium orders:", result);
  return result;
}

// ============================================
// Date Aggregation Example
// ============================================

async function dateAggregationExample() {
  const result = await Order.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          day: { $dayOfMonth: "$date" },
        },
        dailySales: { $sum: "$amount" },
        orders: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": -1, "_id.month": -1, "_id.day": -1 },
    },
    {
      $limit: 30, // Last 30 days
    },
  ]);

  console.log("Daily sales:", result);
  return result;
}

// ============================================
// Customer Insights Example
// ============================================

async function customerInsightsExample() {
  const result = await Order.aggregate([
    {
      $match: { status: "completed" },
    },
    {
      $group: {
        _id: "$customer",
        totalSpent: { $sum: "$amount" },
        orderCount: { $sum: 1 },
        averageOrderValue: { $avg: "$amount" },
        firstOrder: { $min: "$date" },
        lastOrder: { $max: "$date" },
      },
    },
    {
      $addFields: {
        customerSince: {
          $dateDiff: {
            startDate: "$firstOrder",
            endDate: new Date(),
            unit: "day",
          },
        },
      },
    },
    {
      $sort: { totalSpent: -1 },
    },
    {
      $limit: 100,
    },
  ]);

  console.log("Top customers:", result);
  return result;
}

// ============================================
// Export Functions
// ============================================

module.exports = {
  matchExample,
  groupExample,
  sortExample,
  projectExample,
  paginationExample,
  countExample,
  salesReportExample,
  unwindExample,
  addFieldsExample,
  dateAggregationExample,
  customerInsightsExample,
};

// ============================================
// Usage Example
// ============================================

if (require.main === module) {
  (async () => {
    try {
      await mongoose.connect("mongodb://localhost:27017/testdb");

      console.log("=== Aggregation Examples ===\n");

      await matchExample();
      await groupExample();
      await salesReportExample();

      await mongoose.connection.close();
    } catch (error) {
      console.error("Error:", error);
      process.exit(1);
    }
  })();
}
