import { v2 as cloudinary } from 'cloudinary';
import { config } from '@config';

cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
});

export const uploadToCloudinary = (
    buffer: Buffer,
    folder: string = 'sydney-shopping',
): Promise<{ url: string; publicId: string }> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                {
                    folder,
                    resource_type: 'image',
                    transformation: [
                        { width: 800, height: 800, crop: 'limit' },
                        { quality: 'auto' },
                        { fetch_format: 'auto' },
                    ],
                },
                (error, result) => {
                    if (error || !result) {
                        reject(error || new Error('Upload failed'));
                        return;
                    }
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    });
                },
            )
            .end(buffer);
    });
};

export const deleteFromCloudinary = async (
    publicId: string,
): Promise<void> => {
    await cloudinary.uploader.destroy(publicId);
};
