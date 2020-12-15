const sg = require("@sendgrid/mail");
const fs = require("fs");

console.log("Please set your own sendgrid api key");
sg.setApiKey("your api key");

const sendEmail = async (mailOptions) => {
  try {
    const pathToAttachment = `${__dirname}/report.csv`;
    const attachment = fs.readFileSync(pathToAttachment).toString("base64");

    const message = {
      to: "hemanthgreen22@gmail.com",
      from: "hemanthkovuruk3@gmail.com",
      subject: "orders report",
      text: "Hello from mathongo",
      html: `
        <h1>Today sales:</h1>
        <div>totalTransactions: ${mailOptions.totalTransactions}</div>
        <div>successfulTransactions: ${mailOptions.successfulTransactions}</div>
        <div>totalAmount: ${mailOptions.totalAmount}</div>
        <div>date: ${mailOptions.date}</div>
        `,
      attachments: [
        {
          content: attachment,
          filename: "report.csv",
          type: "application/csv",
          disposition: "attachment",
        },
      ],
    };

    await sg.send(message);
    console.log("Email sent..!");
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = sendEmail;
