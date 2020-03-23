import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { logger } from "../utils/logger";
import { getNodeMailer } from "./nodemailer";

// init mailer
let transporter: Mail | null = null;
getNodeMailer()
  .then(t => {
    transporter = t;
  })
  .catch();

export enum MailType {
  RESET_PASSWORD = "reset-password",
}

export async function sendMail(mailType: MailType, args?: { [key: string]: string }): Promise<void> {
  if (transporter === null) {
    logger.error("Could not send mail, transporter is null!");
    return;
  }

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  logger.info(`Message sent: ${info.messageId}`);

  // Preview only available when sending through an Ethereal account
  logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
}
