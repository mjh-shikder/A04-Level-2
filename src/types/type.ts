export interface ICreateProperty {
  landlordId: string;
  categoryId: string;
  title: string;
  description: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  floor?: number;
  furnished?: boolean;
  rent: number;
  securityDeposit?: number;
  address: string;
  city: string;
  country: string;
  availableFrom?: string;
  images?: string[];
}


export interface IUpdateProperty {
  categoryId?: string;
  title?: string;
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  floor?: number;
  furnished?: boolean;
  rent?: number;
  securityDeposit?: number;
  address?: string;
  city?: string;
  country?: string;
  availableFrom?: string;
  images?: string[];
}