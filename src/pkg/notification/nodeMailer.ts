import { createTransport, type Transporter } from "nodemailer";
import type { INotificationProvider } from "../../lib/types/interfaces/notification.interface.js";

interface INodeMailerConfig {
  user: string;
  pass: string;
  fromName: string;
  fromEmail: string;
  service: string;
}

export class NodeMailerProvider implements INotificationProvider {
  private client: Transporter;
  private fromEmail: string;
  private fromName: string;
  constructor(config: INodeMailerConfig) {
    this.client = createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
    this.fromName = config.fromName;
    this.fromEmail = config.fromEmail;
  }
  async send(email: string, subject: string, htmlContent: string) {
    await this.client.sendMail({
      from: `"${this.fromName}" <${this.fromEmail}>`,
      to: email,
      subject,
      html: htmlContent,
    });
  }
}
