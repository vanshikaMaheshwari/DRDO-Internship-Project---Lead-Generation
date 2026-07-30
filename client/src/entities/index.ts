/**
 * Entity types for the local (non-Wix) API.
 * `leadScore` and `reasonCodes` were removed: trustScore is now the single
 * quality metric, derived from source reliability + data completeness +
 * freshness (see server/src/scraper/trustScore.js).
 */

export interface LeadFeedback {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  leadId?: string;
  salesOfficerAction?: string;
  officerNotes?: string;
  rootCauseAnalysis?: string;
  revisedReasonCode?: string;
  feedbackTimestamp?: Date | string;
}

export interface CustomerLeads {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  companyName?: string;
  industryType?: string;
  plantLocations?: string;
  contactInformation?: string;
  /** Single quality metric (0-100). See server trustScore engine. */
  trustScore?: number;
  status?: string;
  productRecommendations?: string;
  /** Which live source this lead was scraped from. */
  sourceId?: string;
  sourceName?: string;
  lastUpdated?: Date | string;
}

export interface RegionalOffices {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  officeName?: string;
  regionIdentifier?: string;
  address?: string;
  city?: string;
  stateProvince?: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  latitude?: number;
  longitude?: number;
}

export interface Sources {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  sourceName?: string;
  sourceType?: string;
  url?: string;
  /** Source reliability score (0-100), feeds into each lead's trustScore. */
  trustScore?: number;
  description?: string;
  lastCrawled?: Date | string;
  isActive?: boolean;
}

export interface ScrapeRun {
  _id: string;
  sourceId?: string;
  sourceName?: string;
  startedAt?: string;
  finishedAt?: string;
  status?: 'success' | 'success_no_table' | 'failed';
  itemsFound?: number;
  itemsNew?: number;
  error?: string | null;
}
