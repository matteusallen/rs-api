// @flow
import type { DocumentType } from 'Models/document/types';

type FileUploadType = {|
  bucket: string,
  encoding: string,
  key: string,
  location: string,
  originalname: string
|};

type DocumentUploadType = {|
  description: string,
  venueId: string | number,
  documentType: string | number
|};

async function createDocument(file: FileUploadType, body: DocumentUploadType): Promise<DocumentType | void> {
  try {
    const { venueId, description, documentType } = body;
    const documentParams = {
      venueId,
      name: file.originalname,
      description,
      key: `documents/venue/${documentType === '1' ? 'agreements' : 'maps'}/${file.key}${file.key.includes('.pdf') ? '' : '.pdf'}`,
      documentType,
      uniqueText: `${file.originalname.toLowerCase()}-${venueId}-${documentType}`
    };
    const document = await this.upsert(documentParams);
    return document;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw new Error(error.message || 'There was an error upserting document');
  }
}

export default createDocument;
