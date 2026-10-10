export type UploadRequest = {
  fileName: string;
  contentType: string;
  contentLength: number;
  folder: "gallery" | "site-content";
};

export type UploadTarget = {
  uploadUrl: string;
  objectKey: string;
};

export interface StorageProvider {
  createUploadTarget(request: UploadRequest): Promise<UploadTarget>;
  deleteObject(objectKey: string): Promise<void>;
}