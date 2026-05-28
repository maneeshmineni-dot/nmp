export interface Project {
  id: string;
  title: string;
  duration: string;
  client: string;
  location: string;
  projectType: string;
  totalUnits?: string;
  builtUpArea?: string;
  builtUpSqFt?: number; // numeric sqft for calculations/analytics
  projectValue: string; // text representation
  projectValueCr: number; // numeric value in Crores for sorting and calculators
  url?: string;
  additionalScope?: string[];
  category: "Consultancy / Engineering" | "Contracting";
  serviceProvided?: string;
  isLargest?: boolean;
  isCurrent?: boolean;
  details?: string;
}

export type ProjectSortKey = "value" | "area" | "date" | "name";

export interface CostEstRequest {
  projectType: string;
  builtUpArea: number; // in sqft
  location: string;
  floors: number;
  quality: "standard" | "premium" | "luxury";
  additionalFeatures: string[];
}

export interface CostEstResponse {
  baseCostCrores: number;
  perSqFtRate: number;
  durationMonths: number;
  breakdown: {
    civil: number; // in Crores
    finishing: number;
    mep: number; // mechanical, electrical, plumbing
    consultancyAndDesign: number;
    permitsAndGovt: number;
  };
  recommendations: string[];
}

export interface ChatMessage {
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}
