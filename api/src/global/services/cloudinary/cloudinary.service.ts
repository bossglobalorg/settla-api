import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { CloudinaryConfig } from 'src/services/app-config/configuration';

interface CloudinaryResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  type: string;
  url: string;
  secure_url: string;
}

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    const { cloudName, apiKey, apiSecret } =
      configService.get<CloudinaryConfig>('cloudinary') as CloudinaryConfig;

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  async uploadDocument(
    file: Express.Multer.File,
    folder: string = 'business_documents',
  ): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          allowed_formats: ['pdf', 'png', 'jpg', 'jpeg'],
          max_file_size: 10000000, // 10MB
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error || !result)
            return reject(error || new Error('Upload failed'));

          const response: CloudinaryResponse = {
            public_id: result.public_id,
            version: result.version,
            signature: result.signature,
            width: result.width,
            height: result.height,
            format: result.format,
            resource_type: result.resource_type,
            created_at: result.created_at,
            bytes: result.bytes,
            type: result.type,
            url: result.url,
            secure_url: result.secure_url,
          };

          resolve(response);
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async deleteFile(public_id: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(public_id);
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
}
