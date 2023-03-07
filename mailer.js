const nodemailer = require("nodemailer");
//! not working
let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "chandrasekharsai.p20@iiits.in",
    pass: "Raja7093@iiits",
  },
});

let mailDetails = {
  from: "xyz@gmail.com",
  to: "pcssai7093@gmail.com",
  subject: "Test mail",
  text: "nodemailer testing mail",
};

mailTransporter.sendMail(mailDetails, function (err, data) {
  if (err) {
    console.log(err);
    console.log("Error Occurs");
  } else {
    console.log("Email sent successfully");
  }
});
