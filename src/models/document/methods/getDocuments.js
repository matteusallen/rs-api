// @flow
import type { DocumentTypeType as DocumentType } from 'Models/documentType/types';
import { Document } from 'Models';
import { getAWSPreSignedUrl } from 'Helpers';
import { ACTIONS, MENU } from 'Constants';
import { validateAction } from 'Utils';

type DocumentInputType = {|
  id?: string | number,
  typeId?: string | number,
  venueId?: string | number
|};

async function getDocuments(input: DocumentInputType, roleId: number): Promise<[?[DocumentType], ?string]> {
  const { id, typeId, venueId } = input;
  const where = {};
  try {
    validateAction(MENU.DOCUMENTS, ACTIONS[MENU.DOCUMENTS].GET_DOCUMENTS, roleId);

    if (id) where.id = id;
    if (venueId) where.venueId = venueId;
    if (typeId) where.documentType = typeId;

    const documents = await Document.findAll({ where });
    const documentsWithUrl = documents.map(document => {
      const url = getAWSPreSignedUrl(document.key);
      return {
        ...document.dataValues,
        url
      };
    });

    return [documentsWithUrl, undefined];
  } catch (error) {
    return [undefined, error.message];
  }
}

export default getDocuments;
