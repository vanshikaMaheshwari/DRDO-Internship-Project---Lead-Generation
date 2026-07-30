/**
 * Scrape targets: public procurement & MSME registry pages.
 *
 * IMPORTANT: government portals restructure their HTML periodically. The
 * generic table scraper (htmlTableScraper.js) auto-detects columns by
 * header keywords, so it survives minor markup changes, but you should
 * still open each `url` in a browser and confirm the page still renders a
 * plain HTML <table> before relying on it for a demo — some portals now
 * load results via client-side JS, which a plain HTTP fetch cannot see
 * (see README "Known limitations" for the Playwright upgrade path).
 */
export const SOURCES = [
  {
    sourceName: 'CPPP eProcurement - Latest Active Tenders',
    sourceType: 'Government Procurement Portal',
    url: 'https://eprocure.gov.in/eprocure/app?page=FrontEndLatestActiveTenders&service=page',
    description:
      'Central Public Procurement Portal (Government of India) public tender listings. Used as a proxy for organisations currently active in procurement, which is useful signal for vendor/partner discovery.',
    isActive: true,
  },
  {
    sourceName: 'data.gov.in - MSME Sector Catalog',
    sourceType: 'Open Government Data Portal',
    url: 'https://www.data.gov.in/search?title=msme',
    description:
      'Open Government Data (OGD) platform of India — catalog search results for MSME-related public datasets and the ministries/departments that publish them.',
    isActive: true,
  },
  // Add more registries here, e.g. a state industries department's
  // "List of Registered MSME Units" page, once you've confirmed it renders
  // a plain HTML table (no login, no JS-only rendering).
];
