import type { ICloudProvider } from "../../lib/types/interfaces/cloud.interface.js";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  type GetObjectCommandOutput,
} from "@aws-sdk/client-s3";

interface S3Configs {
  region: string;
  accessKey: string;
  secretKey: string;
  bucketName: string;
}

export class S3CloudProvider implements ICloudProvider {
  private readonly client: S3Client;
  private readonly bucketName: string;

  constructor(config: S3Configs) {
    this.client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKey,
        secretAccessKey: config.secretKey,
      },
    });
    this.bucketName = config.bucketName;
  }

  async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Body: file.buffer,
      ContentType: file.mimetype,
      Key: `${path}/${file.originalname}`,
    });
    await this.client.send(command);
    return command.input.Key as string;
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    await this.client.send(command);
  }

  async getFile(key: string): Promise<GetObjectCommandOutput> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    return await this.client.send(command);
  }
}
