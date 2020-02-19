export abstract class Provider {
  public abstract async uploadImage(filename: string, filePath: string): Promise<string>;
  public abstract async deleteImage(filename: string, filePath: string): Promise<void>;
}
