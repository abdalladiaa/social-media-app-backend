import multer, { memoryStorage } from "multer";
import AppError from "../../pkg/error/error.js";

export function uploadFile(allowedTypes: string | string[]) {
  allowedTypes = Array.isArray(allowedTypes) ? allowedTypes : [allowedTypes];

  return multer({
    storage: memoryStorage(),
    fileFilter: (req, file, cb) => {
      if (!allowedTypes.includes(file.mimetype)) {
        return cb(
          new AppError(
            `Only ${allowedTypes.join(", ")} files are allowed`,
            400,
          ) as unknown as null,
          false,
        );
      }
      cb(null, true);
    },
  });
}

export function UploadSingle(
  fieldName: string,
  allowedFiles: string | string[],
) {
  return uploadFile(allowedFiles).single(fieldName);
}

export function multerUploadArray(
  fieldName: string,
  allowedFiles: string | string[],
  maxCount?: number | undefined,
) {
  return uploadFile(allowedFiles).array(fieldName, maxCount);
}
