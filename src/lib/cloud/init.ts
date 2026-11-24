import { S3CloudProvider } from "../../pkg/cloud/s3.cloud.js";
import config from "../config/config.js";

export const s3CloudProvider = new S3CloudProvider({
    accessKey:config.aws.s3AccessKey,
    secretKey:config.aws.s3SecretKey,
    region:config.aws.s3Region,
    bucketName:config.aws.s3BucketName
})