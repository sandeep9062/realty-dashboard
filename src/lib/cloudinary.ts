import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadFile(file: File): Promise<string> {
  // Convert File to Buffer
  const buffer = await file.arrayBuffer();
  const bytes = Buffer.from(buffer);

  // Determine resource type based on file type
  const isVideo = file.type.startsWith("video/");
  const resourceType = isVideo ? "video" : "image";

  // Upload to Cloudinary
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: isVideo ? "property-videos" : "property-images",
        resource_type: resourceType,
        format: isVideo ? "mp4" : "webp",
        quality: "auto",
        width: isVideo ? 1280 : 1200,
        height: isVideo ? 720 : 800,
        crop: "limit",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(new Error(`Failed to upload ${resourceType}`));
        } else if (result) {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(bytes);
  });
}

export async function uploadFiles(files: File[]): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadFile(file));
  return Promise.all(uploadPromises);
}

export default cloudinary;