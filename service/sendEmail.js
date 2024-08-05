import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html, attachments = []) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.sendEmail,
      pass: process.env.sendEmailPassword,
    },
  });
  const info = await transporter.sendMail({
    from: `"bero👻" <${process.env.sendEmail}>`,
    to: to ? to : "",
    subject: subject ? subject : "hi",
    html: html ? html : "hello",
    attachments
  });
  if(info.accepted.length){
    return true
  }
  return false
};
