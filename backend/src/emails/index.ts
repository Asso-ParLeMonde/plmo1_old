import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import pug from "pug";
import path from "path";
import { logger } from "../utils/logger";
import { getNodeMailer } from "./nodemailer";

const frontUrl = process.env.FRONT_URL || "http://localhost:3000";
let transporter: Mail | null = null;
getNodeMailer()
  .then(t => {
    transporter = t;
  })
  .catch();

export enum Email {
  RESET_PASSWORD,
  VERIFY_EMAIL,
  INVITATION_EMAIL,
}
interface EmailMapping {
  [Email.RESET_PASSWORD]: { resetCode: string };
  [Email.VERIFY_EMAIL]: { verifyCode: string; firstname: string; lastname: string };
  [Email.INVITATION_EMAIL]: { verifyCode: string; firstname: string; lastname: string };
}
type EmailOptions<E extends Email> = EmailMapping[E];

type emailData = {
  filename: string;
  filenameText: string;
  subject: string;
  args: { [key: string]: string };
};

function getTemplateData<E extends Email>(email: E, receiverEmail: string, options: EmailOptions<E>): emailData | undefined {
  if (email === Email.RESET_PASSWORD) {
    return {
      filename: "reset-password.pug",
      filenameText: "reset-password_text.pug",
      subject: "Réinitialisez votre mot de passe",
      args: {
        resetUrl: `${frontUrl}/update-password?email=${encodeURI(receiverEmail)}&verify-token=${encodeURI((options as EmailOptions<Email.RESET_PASSWORD>).resetCode)}`,
      },
    };
  }
  if (email === Email.VERIFY_EMAIL) {
    return {
      filename: "verify-email.pug",
      filenameText: "verify-email_text.pug",
      subject: "Bienvenue! - Vérifiez votre adresse email",
      args: {
        verifyUrl: `${frontUrl}/verify?email=${encodeURI(receiverEmail)}&verify-token=${encodeURI((options as EmailOptions<Email.VERIFY_EMAIL>).verifyCode)}`,
        firstname: (options as EmailOptions<Email.VERIFY_EMAIL>).firstname,
        lastname: (options as EmailOptions<Email.VERIFY_EMAIL>).lastname,
      },
    };
  }
  if (email === Email.VERIFY_EMAIL) {
    return {
      filename: "invite-email.pug",
      filenameText: "invite-email_text.pug",
      subject: "Bienvenue! - Initialiser votre adresse email",
      args: {
        initUrl: `${frontUrl}/verify?email=${encodeURI(receiverEmail)}&verify-token=${encodeURI((options as EmailOptions<Email.INVITATION_EMAIL>).verifyCode)}`,
        firstname: (options as EmailOptions<Email.INVITATION_EMAIL>).firstname,
        lastname: (options as EmailOptions<Email.INVITATION_EMAIL>).lastname,
      },
    };
  }
  return undefined;
}

export async function sendMail<E extends Email>(email: E, receiverEmail: string, options: EmailOptions<E>): Promise<void> {
  if (transporter === null) {
    logger.error("Could not send mail, transporter is null!");
    return;
  }
  if (!receiverEmail) {
    logger.error("Could not send mail, receiver is null or undefined!");
    return;
  }

  // Get email template data
  const templateData = getTemplateData<E>(email, receiverEmail, options);
  if (templateData === undefined) {
    logger.info(`Template ${email} not found!`);
    return undefined;
  }

  // Compile text and html
  const pugOptions = {
    ...templateData.args,
    cache: true,
    frontUrl,
    receiverEmail,
    plmoEmail: "contact@parlemonde.fr",
  };
  const html = pug.renderFile(path.join(__dirname, "templates", templateData.filename), pugOptions);
  const text = pug.renderFile(path.join(__dirname, "templates", templateData.filenameText), pugOptions);

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Par Le Monde" <no-reply@parlemonde.fr>', // sender address
    to: receiverEmail, // receiver address
    subject: templateData.subject, // Subject line
    text, // plain text body
    html, // html body
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "templates", "logo.png"),
        cid: "logo.png", //same cid value as in the html img src
      },
    ],
  });

  logger.info(`Message sent: ${info.messageId}`);
  logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`); // Preview only available when sending through an Ethereal account
}
