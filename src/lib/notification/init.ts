import { NodeMailerProvider } from "../../pkg/notification/nodeMailer.js";
import config from "../config/config.js";

const sendMailClient = new NodeMailerProvider({
    user: config.nodeMailer.email,
    pass:config.nodeMailer.password,
    fromName:"Social Media App",
    fromEmail:config.nodeMailer.email,
    service:"gmail"
})

export default sendMailClient;