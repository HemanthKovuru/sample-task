const mongoose = require("mongoose");
const dotenv = require("dotenv");
const sendEmail = require("./utils/email");
const schedule = require("node-schedule");
const Order = require("./models/Order");
const ObjectsToCsv = require("objects-to-csv");
const Item = require("./models/Item");

// dotenv configuration
dotenv.config({ path: "./config.env" });

const db = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

// report function
const getReport = async () => {
  // get order details
  let items = await Item.find();
  let res = Order.find();
  try {
    res = await res;
  } catch (err) {
    console.log(err);
  }

  // 1]. make report
  const totalTransactions = res.length;
  let successfulTransactions = 0;
  let totalAmount = 0;
  let data = [];

  res.map((order, index) => {
    if (order.paid) {
      successfulTransactions++;
      totalAmount += order.amount;
    }

    data.push({
      sl_no: index + 1,
      order_id: order.order_id,
      payment_id: order.payment_id,
      title: order.item.title,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      item_id: order.item._id,
      coupon: order.coupon,
      amount: order.amount,
      paid_status: order.paid,
      phone: order.phone,
      email: order.email,
      utm_params_source: order.utm_params[0].source,
      utm_params_medium: order.utm_params[0].medium,
      utm_params_campaign: order.utm_params[0].campaign,
      utm_params_term: order.utm_params[0].term,
    });
  });

  // 2]. generate a csv file
  const csv = new ObjectsToCsv(data);
  csv.toDisk("./utils/report.csv");

  // 3]. send email with reports and csv
  const mailOptions = {
    totalTransactions,
    successfulTransactions,
    totalAmount,
    date: new Date(Date.now()),
  };

  sendEmail(mailOptions);
  console.log(mailOptions);

  // 4]. disconnect from database
  setTimeout(() => {
    mongoose.disconnect().then(() => {
      console.log("Database disconnected successfully..!");
    });
  }, 10000);
};

// schedule task and databse connection
schedule.scheduleJob("*/20 * * * * *", () => {
  // 1]. connect to database
  mongoose
    .connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log("Database connected successfully..!");
    })
    .catch((err) => {
      console.log(err);
    });

  // 2]. call report function
  getReport();
});
