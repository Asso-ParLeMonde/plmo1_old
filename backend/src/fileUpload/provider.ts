export abstract class Provider {
  public abstract async uploadImage(filename: string, filePath: string, hasMultipleSizes?: boolean): Promise<string>;
  public abstract async deleteImage(filename: string, filePath: string): Promise<void>;
  public abstract async getFile(filename: string): Promise<Buffer | null>;
  public abstract async uploadFile(filename: string, filedata: Buffer): Promise<void>;
}
