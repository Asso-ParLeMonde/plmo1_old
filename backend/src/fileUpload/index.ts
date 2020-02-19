import { FirebaseUtils } from "./firebase";
import { LocalUtils } from "./local";
import { Provider } from "./provider";

const providers: { [p: string]: Provider } = {
  firebase: new FirebaseUtils(),
  local: new LocalUtils(),
};

export async function uploadImage(filename: string, filePath: string): Promise<string | null> {
  const provider: string = process.env.STOCKAGE_PROVIDER_NAME || "local";
  if (providers[provider] === undefined) {
    return null;
  } else {
    return await providers[provider].uploadImage(filename, filePath);
  }
}

export async function deleteImage(filename: string, filePath: string): Promise<void> {
  const provider: string = process.env.STOCKAGE_PROVIDER_NAME || "local";
  if (providers[provider] !== undefined) {
    return await providers[provider].deleteImage(filename, filePath);
  }
}
