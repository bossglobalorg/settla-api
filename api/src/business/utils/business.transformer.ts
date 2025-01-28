// src/business/utils/business.transformer.ts
import { CreateBusinessDto } from '../dto/create-business.dto';

interface AddressData {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

interface BaseBusinessData {
  name: string;
  business_type: string;
  industry: string;
  id_type: string;
  id_number: string;
  id_country: string;
  id_level: string;
  dof: string | Date;  // Allow both string and Date
  contact_phone: string;
  contact_email: string;
}

interface NestedBusinessData extends BaseBusinessData {
  address: AddressData;
}

interface FlatBusinessData extends BaseBusinessData {
  'address.line1': string;
  'address.line2'?: string;
  'address.city': string;
  'address.state': string;
  'address.country': string;
  'address.postal_code': string;
}

export class BusinessDataTransformer {
  static transform(
    data: FlatBusinessData | NestedBusinessData,
    ownerId: string,
    idUploadUrl: string,
  ): CreateBusinessDto {
    // Check if the data is already in the correct format
    if (this.isNestedFormat(data)) {
      return {
        ...data,
        dof: this.parseDateField(data.dof),  // Convert dof to Date
        owner_id: ownerId,
        id_upload: idUploadUrl,
      };
    }

    // If it's flat data, transform it
    return this.transformFlatToNested(data as FlatBusinessData, ownerId, idUploadUrl);
  }

  private static isNestedFormat(data: any): data is NestedBusinessData {
    return (
      data.address &&
      typeof data.address === 'object' &&
      'line1' in data.address
    );
  }

  private static parseDateField(date: string | Date): Date {
    if (date instanceof Date) {
      return date;
    }
    return new Date(date);
  }

  private static transformFlatToNested(
    flatData: FlatBusinessData,
    ownerId: string,
    idUploadUrl: string,
  ): CreateBusinessDto {
    const { address, businessFields } = this.separateAddressFields(flatData);
    
    return {
      ...businessFields,
      dof: this.parseDateField(flatData.dof),  // Convert dof to Date
      address,
      owner_id: ownerId,
      id_upload: idUploadUrl,
    };
  }

  private static separateAddressFields(flatData: FlatBusinessData) {
    const address = {
      line1: flatData['address.line1'],
      line2: flatData['address.line2'],
      city: flatData['address.city'],
      state: flatData['address.state'],
      country: flatData['address.country'],
      postal_code: flatData['address.postal_code'],
    };

    const businessFields = {
      name: flatData.name,
      business_type: flatData.business_type,
      industry: flatData.industry,
      id_type: flatData.id_type,
      id_number: flatData.id_number,
      id_country: flatData.id_country,
      id_level: flatData.id_level,
      // dof is handled separately
      contact_phone: flatData.contact_phone,
      contact_email: flatData.contact_email,
    };

    return { address, businessFields };
  }
}