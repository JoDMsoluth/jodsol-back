import nodemailer, { SentMessageInfo } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

// Replace with your preferable SMTP server, port, account, and password
// You can also use OAuth2 token for better security
// See https://nodemailer.com/smtp/ for details of how to configure
const SMTP_SERVER: string = "smtp.gmail.com";
const SMTP_PORT: number = 587;
const SMTP_AUTH_ACCOUNT = process.env.SMTP_AUTH_ACCOUNT;
const SMTP_AUTH_PASSWORD = process.env.SMTP_AUTH_PASSWORD;

const mailer: Mail = nodemailer.createTransport({
  host: SMTP_SERVER,
  secure: false,
  port: SMTP_PORT,
  tls: {
    ciphers: "SSLv3"
  },
  auth: {
    user: SMTP_AUTH_ACCOUNT,
    pass: SMTP_AUTH_PASSWORD
  }
});

export const sendEmail = (
  name: string,
  from: string,
  subject: string,
  content: string
): Promise<SentMessageInfo> => {
  console.log(SMTP_AUTH_ACCOUNT, SMTP_AUTH_PASSWORD);
  const mailOptions: Mail.Options = {
    to: SMTP_AUTH_ACCOUNT,
    from: from,
    subject: subject, // 메일 제목
    text: `Hi, I'm ${name}(${from}). ${content}` // 메일 내용
  };
  return mailer.sendMail(mailOptions);
};
