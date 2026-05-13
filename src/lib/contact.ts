import { sendOrderEmail } from "@/lib/email";
import { nextId, updateAppData, readAppData } from "@/lib/persistence";
import { sanitizeHtmlInput, sanitizeText } from "@/lib/sanitize";

export async function createContactMessage(input: { name: string; email: string; phone?: string; message: string }) {
  const message = await updateAppData((data) => {
    const created = {
      id: nextId(data.contactMessages),
      name: sanitizeText(input.name, 80),
      email: sanitizeText(input.email, 120).toLowerCase(),
      phone: input.phone ? sanitizeText(input.phone, 40) : undefined,
      message: sanitizeHtmlInput(input.message, 2000),
      createdAt: new Date().toISOString()
    };
    data.contactMessages.push(created);
    return created;
  });

  await sendOrderEmail(
    process.env.EMAIL_FROM || "orders@aceturbo.co.uk",
    `New Ace Turbo contact message from ${message.name}`,
    `<p>${message.message}</p><p>Reply to ${message.email}</p>`
  );

  return message;
}

export async function listContactMessages() {
  return (await readAppData()).contactMessages;
}
