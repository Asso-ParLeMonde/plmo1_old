export abstract class Provider {
  public abstract async uploadImage(filename: string, filePath: string, hasMultipleSizes?: boolean): Promise<string>;
  public abstract async deleteImage(filename: string, filePath: string): Promise<void>;
}
