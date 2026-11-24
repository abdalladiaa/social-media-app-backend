import Mailjet from "node-mailjet";
import type { INotificationProvider } from "../../lib/types/interfaces/notification.interface.js";

interface IMailjetConfig {
  apiKey: string;
  apiSecret: string;
  fromName: string;
  fromEmail: string;
}

export class MailjetProvider implements INotificationProvider {
  private client: Mailjet.Client;
  private fromEmail: string;
  private fromName: string;
  constructor(config: IMailjetConfig) {
    this.client = new Mailjet.Client({
      apiKey: config.apiKey,
      apiSecret: config.apiSecret,
    });
    this.fromName = config.fromName;
    this.fromEmail = config.fromEmail;
  }
  async send(email: string, subject: string, htmlContent: string) {
    await this.client.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: this.fromEmail,
            Name: this.fromName,
          },
          To: [
            {
              Email: email,
            },
          ],
          Subject: subject,
          HTMLPart: htmlContent,
        },
      ],
    });
  }
}
