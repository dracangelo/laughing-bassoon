import sendgrid from "@sendgrid/mail";
import { appendFile, mkdir } from "fs/promises";
import path from "path";

if (process.env.SENDGRID_API_KEY) {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function sendOrderEmail(to: string, subject: string, html: string) {
  if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
    const mailbox = path.join(process.cwd(), ".data", "mailbox.log");
    await mkdir(path.dirname(mailbox), { recursive: true });
    await appendFile(mailbox, `[${new Date().toISOString()}] TO:${to} SUBJECT:${subject}\n${html}\n\n`, "utf8");
    return { skipped: true, mailbox };
  }
  return sendgrid.send({ to, from: process.env.EMAIL_FROM, subject, html });
}
