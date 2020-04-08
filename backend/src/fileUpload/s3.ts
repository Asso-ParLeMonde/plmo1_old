import { Provider } from "./provider";
import AWS, { S3 } from "aws-sdk";
import path from "path";
import fs from "fs-extra";
import { logger } from "../utils/logger";

const publicPolicy = (bucketName: string): { Version: string; Statement: [{ [key: string]: string | string[] }] } => ({
  Version: "2012-10-17",
  Statement: [
    {
      Sid: "PublicRead",
      Effect: "Allow",
      Principal: "*",
      Action: ["s3:GetObject"],
      Resource: [`arn:aws:s3:::${bucketName}/*`],
    },
  ],
});

export class AwsS3 extends Provider {
  private s3: S3;

  private createBucket(bucketName: string, acl: string): void {
    this.s3.createBucket(
      {
        Bucket: bucketName,
        ACL: acl,
      },
      (err, data) => {
        if (err) console.log("Error", err);
        else {
          if (acl === "public-read") {
            this.s3.putBucketPolicy(
              {
                Bucket: bucketName,
                Policy: JSON.stringify(publicPolicy(bucketName)),
              },
              err2 => {
                if (err2) console.log(err2);
                else {
                  console.log("Success", data.Location);
                }
              },
            );
          } else {
            console.log("Success", data.Location);
          }
        }
      },
    );
  }

  private uploadS3File(bucketName: string, filepath: string, file: Buffer | fs.ReadStream): Promise<string> {
    return new Promise((resolve, reject) => {
      this.s3.upload(
        {
          Bucket: bucketName,
          Key: filepath,
          Body: file,
        },
        function(err, data) {
          if (err) {
            reject(err);
          }
          if (data) {
            resolve(data.Location);
          }
        },
      );
    });
  }

  private deleteS3File(bucketName: string, filepath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.s3.deleteObject(
        {
          Bucket: bucketName,
          Key: filepath,
        },
        function(err, data) {
          if (err) {
            reject(err);
          }
          if (data) {
            resolve();
          }
        },
      );
    });
  }

  private getS3File(bucketName: string, filepath: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      this.s3.getObject(
        {
          Bucket: bucketName,
          Key: filepath,
        },
        function(err, data) {
          if (err) {
            reject(err);
          }
          if (data) {
            if (data.Body instanceof Buffer) {
              resolve(data.Body);
            } else {
              reject("Response is not a buffer...");
            }
          }
        },
      );
    });
  }

  constructor() {
    super();
    if (process.env.STOCKAGE_PROVIDER_NAME !== "s3") {
      return;
    }

    this.s3 = new AWS.S3({
      sslEnabled: process.env.S3_USE_SSL === "true",
      endpoint: process.env.S3_ENDPOINT,
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
      s3ForcePathStyle: true,
    });

    this.s3.listBuckets((err, data) => {
      if (err) {
        console.log("Error", err);
      } else {
        const names = (data.Buckets || []).map(s => s.Name);
        if (!names.includes("images")) {
          this.createBucket("images", "public-read");
        }
        if (!names.includes("files")) {
          this.createBucket("files", "private");
        }
      }
    });
  }

  public async uploadImage(filename: string, filePath: string): Promise<string> {
    // local dir
    const dir: string = path.join(__dirname, "../..", "dist", filePath);
    const fileStream = fs.createReadStream(`${dir}/${filename}.jpeg`);
    let url = "";

    // upload image on stockage server
    try {
      url = await this.uploadS3File("images", `${filePath}/${filename}.jpeg`, fileStream);
    } catch (e) {
      logger.error(`File ${filename} could not be sent to aws !`);
      return "";
    }

    // delete local file
    try {
      await fs.remove(`${dir}/${filename}.jpeg`);
    } catch (e) {
      logger.error(`File ${filename} not found !`);
    }

    if (process.env.S3_ENDPOINT === "minio:9000") {
      return url.replace("minio", "localhost");
    }
    return url;
  }

  public async deleteImage(filename: string, filePath: string): Promise<void> {
    try {
      await this.deleteS3File("images", `${filePath}/${filename}.jpeg`);
    } catch (e) {
      logger.error(`File ${filename} not found !`);
    }
  }

  public async getFile(filename: string): Promise<Buffer | null> {
    try {
      return await this.getS3File("files", filename);
    } catch (e) {
      console.log(e);
      logger.error(`File ${filename} not found !`);
    }
    return null;
  }

  public async uploadFile(filename: string, filedata: Buffer): Promise<void> {
    try {
      await this.uploadS3File("files", filename, filedata);
    } catch (e) {
      logger.error(`Error while uploading ${filename}.`);
    }
  }
}
