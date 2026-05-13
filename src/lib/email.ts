import sendgrid from "@sendgrid/mail";

if (process.env.SENDGRID_API_KEY) {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function sendOrderEmail(to: string, subject: string, html: string) {
  if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
    return { skipped: true };
  }
  return sendgrid.send({ to, from: process.env.EMAIL_FROM, subject, html });
}
