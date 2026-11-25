import dotenv from "dotenv";

dotenv.config({ path: [`.${process.env.NODE_ENV}.env`] });

const config = {
  port: process.env.PORT,
  mongoose: {
    uri: process.env.MONGO_URI as string,
  },
  encryption: {
    key: process.env.ENCRYPTION_KEY || ("" as string),
    saltRound: Number(process.env.SALT_ROUND) || (10 as number),
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "",
    accessExpiresIn: Number(process.env.JWT_ACCESS_EXPIRES_IN),
    refreshSecret: process.env.JWT_REFRESH_SECRET || "",
    refreshExpiresIn: Number(process.env.JWT_REFRESH_EXPIRES_IN),
  },
  redis: {
    url: process.env.REDIS_URL || "",
  },
  nodeMailer: {
    email: process.env.EMAIL || "",
    password: process.env.EMAIL_PASS || "",
  },
  aws: {
    s3Region:process.env.S3_REGION as string,
    s3BucketName: process.env.S3_BUCKET_NAME as string,
    s3AccessKey: process.env.S3_ACCESS_KEY as string,
    s3SecretKey: process.env.S3_SECRET_KEY as string,
  },
  google:{
    clientId:process.env.GOOGLE_CLIENT_ID as string
  }
};

export default config;
