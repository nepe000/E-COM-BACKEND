import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.smtp_server,
  port: Number(process.env.smtp_port),
  secure: process.env.smtp_port === "465",
  auth: {
    user: process.env.smtp_email,
    pass: process.env.smtp_password,
  },
});
interface IMailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (mailOption: IMailOptions) => {
  const mailOptions = {
    from: `"$(process.env.smtp_mail_from)" <$(process.env.smtp_email)`, //?send address
    to: mailOption.to,
    subject: mailOption.subject,
    html: mailOption.html,
  };
  await transporter.sendMail(mailOptions);
};
