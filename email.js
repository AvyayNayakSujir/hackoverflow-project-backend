const nodemailer = require("nodemailer");
require("dotenv").config();

async function email(rmail, sub, body) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: rmail,
    subject: sub,
    text: body,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    console.log("Message sent: " + info.messageId);
  } catch (error) {
    console.log(error);
  }
}

module.exports = email;