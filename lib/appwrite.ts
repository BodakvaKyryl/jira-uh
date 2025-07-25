import { IMAGES_BUCKET_ID } from "@/config";
import { Account, Storage as AppwriteStorage, Client, ID } from "node-appwrite";

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function uploadImageAndGetBase64(
  storage: AppwriteStorage,
  image: File | undefined | null
): Promise<string | undefined> {
  if (!image) {
    return undefined;
  }

  if (image.size > 1024 * 1024) {
    throw new Error("Image file size must be less than 1MB");
  }

  const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), image);

  const arrayBuffer = await storage.getFilePreview(IMAGES_BUCKET_ID, file.$id);

  return `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
}
