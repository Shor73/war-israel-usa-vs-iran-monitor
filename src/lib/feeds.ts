export interface FeedConfig {
  url: string
  name: string
  category: 'WIRE' | 'WESTERN' | 'ISRAELI' | 'IRANIAN' | 'ARAB' | 'DEFENSE' | 'FINANCIAL' | 'OSINT'
  isStateMedia?: boolean
  priority: number // 1=highest
}

export const RSS_FEEDS: FeedConfig[] = [
  // Wire Services (verificati 200)
  { url: 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml', name: 'BBC Middle East', category: 'WIRE', priority: 1 },
  { url: 'https://rss.nytimes.com/services/xml/rss/nyt/MiddleEast.xml', name: 'NYT Middle East', category: 'WIRE', priority: 1 },
  { url: 'https://www.theguardian.com/world/middleeast/rss', name: 'The Guardian', category: 'WIRE', priority: 1 },
  { url: 'https://feeds.skynews.com/feeds/rss/world.xml', name: 'Sky News World', category: 'WIRE', priority: 2 },
  { url: 'https://www.independent.co.uk/topic/middle-east/rss', name: 'The Independent', category: 'WIRE', priority: 2 },
  { url: 'https://rss.dw.com/rdf/rss-en-world', name: 'DW News', category: 'WIRE', priority: 2 },
  { url: 'https://www.france24.com/en/rss', name: 'France 24', category: 'WIRE', priority: 2 },

  // Israeli Media (verificati 200)
  { url: 'https://www.jpost.com/rss/rssfeedsfrontpage.aspx', name: 'Jerusalem Post', category: 'ISRAELI', priority: 1 },
  { url: 'https://www.i24news.tv/en/rss', name: 'i24 News', category: 'ISRAELI', priority: 1 },
  { url: 'https://www.ynetnews.com/Integration/StoryRss2.xml', name: 'Ynet News', category: 'ISRAELI', priority: 2 },

  // Arab/Regional Media (verificati 200)
  { url: 'https://www.aljazeera.com/xml/rss/all.xml', name: 'Al Jazeera', category: 'ARAB', priority: 1 },
  { url: 'https://www.middleeasteye.net/rss', name: 'Middle East Eye', category: 'ARAB', priority: 1 },

  // Defense & Military (verificati 200)
  { url: 'https://www.thedrive.com/feed', name: 'The War Zone', category: 'DEFENSE', priority: 1 },
  { url: 'https://breakingdefense.com/feed/', name: 'Breaking Defense', category: 'DEFENSE', priority: 1 },
  { url: 'https://warontherocks.com/feed/', name: 'War on the Rocks', category: 'DEFENSE', priority: 1 },
  { url: 'https://www.defensenews.com/arc/outboundfeeds/rss/', name: 'Defense News', category: 'DEFENSE', priority: 2 },
  { url: 'https://www.navalnews.com/feed/', name: 'Naval News', category: 'DEFENSE', priority: 2 },
  { url: 'https://www.airandspaceforces.com/feed/', name: 'Air & Space Forces', category: 'DEFENSE', priority: 2 },
  { url: 'https://www.militarytimes.com/arc/outboundfeeds/rss/', name: 'Military Times', category: 'DEFENSE', priority: 3 },

  // OSINT & Think Tanks (verificati 200)
  { url: 'https://www.bellingcat.com/feed/', name: 'Bellingcat', category: 'OSINT', priority: 1 },
  { url: 'https://foreignpolicy.com/feed/', name: 'Foreign Policy', category: 'OSINT', priority: 1 },
  { url: 'https://www.foreignaffairs.com/rss.xml', name: 'Foreign Affairs', category: 'OSINT', priority: 2 },
  { url: 'https://www.armscontrol.org/rss.xml', name: 'Arms Control Assoc.', category: 'OSINT', priority: 2 },
  { url: 'https://iranprimer.usip.org/rss.xml', name: 'Iran Primer (USIP)', category: 'OSINT', priority: 2 },

  // Financial / Energy (verificati 200)
  { url: 'https://oilprice.com/rss/main', name: 'OilPrice.com', category: 'FINANCIAL', priority: 1 },
  { url: 'https://feeds.bloomberg.com/markets/news.rss', name: 'Bloomberg Markets', category: 'FINANCIAL', priority: 1 },
]

export const TICKER_FEEDS = RSS_FEEDS.filter(f => f.priority <= 2 && ['WIRE','ISRAELI','DEFENSE'].includes(f.category))

export const CATEGORY_LABELS: Record<string, string> = {
  WIRE: 'Wire',
  WESTERN: 'Western',
  ISRAELI: 'Israeli',
  IRANIAN: 'Iranian',
  ARAB: 'Arab',
  DEFENSE: 'Defense',
  FINANCIAL: 'Financial',
  OSINT: 'OSINT',
}
