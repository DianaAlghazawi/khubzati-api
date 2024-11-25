import { config } from '../config';

export const requestErrorMessages = {
  requiredField: (fieldName: string) => `The ${fieldName} field is required.`,
  requiredObject: (objectName: string, fieldsName: string) =>
    `The ${objectName} object is required and should contain these fields ${fieldsName}.`,
  maxSize: (fieldName: string) => `The max file size is ${config.maxFileSize} for ${fieldName}.`,
  acceptedTypes: (fieldName: string) =>
    `Only ${config.acceptedFileTypes} files are accepted for ${fieldName}.`,
};
