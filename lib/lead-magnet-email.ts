// The lead-magnet email lives in lib/emails/ with the welcome series (one copy dictionary per
// language). This module keeps the old import path and the Bokmål constants.

import { nb } from "./emails/copy/nb";
import { emailLinks } from "./emails/links";
import { leadMagnetHeaders } from "./emails/lead-magnet";

export {
  LEAD_MAGNET_IMAGE_URL,
  buildLeadMagnetEmail,
  buildLeadMagnetHtml,
  buildLeadMagnetText,
  type LeadMagnetOptions,
} from "./emails/lead-magnet";

export const LEAD_MAGNET_SUBJECT = nb.leadMagnet.subject;
export const LEAD_MAGNET_PREHEADER = nb.leadMagnet.preheader;
export const LEAD_MAGNET_LINKS = emailLinks("nb");
export const LEAD_MAGNET_HEADERS = leadMagnetHeaders("nb");
