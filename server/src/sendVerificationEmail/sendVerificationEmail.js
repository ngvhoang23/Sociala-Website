const transporter = require("../config/nodemailer/nodemailer");

const sendVerificationEmail = (user) => {
  const mailOptions = {
    from: "phuoclongahi@gmail.com",
    to: user.email,
    subject: "Email Verification",
    html: `<p>Click <a href="http://localhost:3000/verification/${user.verification_token}">here</a> to verify your email.</p>`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });
};

module.exports = sendVerificationEmail;
