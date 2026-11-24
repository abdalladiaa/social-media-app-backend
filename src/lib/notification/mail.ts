import { EventEmitter } from "node:events";
import sendMailClient from "./init.js";

interface ISendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmailEvent = new EventEmitter();

sendEmailEvent.on("send-email", async ({ to, subject, html }: ISendEmailOptions) => {
    await sendMailClient.send(to, subject, html);
});
