import { EventEmitter } from "node:events";
import sendNotificationClient from "./init.js";

interface ISendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmailEvent = new EventEmitter();

sendEmailEvent.on("send-email", async ({ to, subject, html }: ISendEmailOptions) => {
    await sendNotificationClient.send(to, subject, html);
});
