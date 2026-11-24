import { getMessaging, type Message } from "firebase-admin/messaging";
import type { INotificationProvider } from "../../lib/types/interfaces/notification.interface.js";
import admin, { type App } from "firebase-admin";
class FirebaseProvider implements INotificationProvider {
  private readonly client: App;

  constructor(config: any) {
    this.client = admin.initializeApp({
      credential: admin.cert(config),
    });
  }

  async send(to: string, title: string, body: string): Promise<void> {
    const message: Message = {
      token: to,
      notification: {
        title,
        body,
      },
    };
    await getMessaging(this.client).send(message);
  }
}
