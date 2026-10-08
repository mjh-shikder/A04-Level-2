import { PropertyStatus } from "../../generated/prisma/client";

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


export interface IGetAllPropertiesQuery {
  search?: string;
  city?: string;
  country?: string;
  categoryId?: string;
  minRent?: string;
  maxRent?: string;
  bedrooms?: string;
  bathrooms?: string;
  furnished?: string;
  status?: PropertyStatus;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}