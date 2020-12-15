const sg = require("@sendgrid/mail");
const fs = require("fs");

sg.setApiKey(
  "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"
);

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
