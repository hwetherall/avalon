# Cellary Decision Dossier

**Venture:** CellarEye Wine Inventory & Virtual Sommelier Platform

CellarEye occupies a genuine whitespace at the intersection of automated cellar-level valuation, physical bottle tracking, and sommelier AI — no evidenced competitor combines all three, and the structural demand from insurers and club finance teams is directionally real. However, the most critical commercial inputs — enterprise API pricing from Liv-ex and Wine-Searcher, club CFO willingness-to-pay, and legal classification of 'market analytics' versus 'appraisal' — are all unvalidated, meaning the Year 1 revenue model of $345K rests on a stack of medium-to-low-confidence assumptions. The chosen path (Wine Valuation Bureau, P5) is correctly sequenced to minimize upfront capital risk, but three hard conditions must be resolved within 90 days before meaningful capital deployment is justified. Member-to-member wine consignment is legally foreclosed across all evidenced jurisdictions and should be permanently removed from the product roadmap. The competitive moat deepens only as the product climbs the ladder from valuation report to shrinkage discovery to hardware tracking — the valuation report alone is replicable by any player with API access, making hardware conversion rate the single most important leading indicator to monitor.

---

## FactBank

| ID | Question | Answer | Confidence | Sources |
|---|---|---|---|---|
| VQ-1 | How many country clubs are there in the US? | CMAA, Club Benchmarking, and NCA sources consistently place total U.S. private clubs at approximately 5,659. A narrower, analytically actionable subset is 3,887 clubs with annual revenue above $1M, as measured in the CMAA/Club Benchmarking/NCA Economic Impact Report. The universe includes golf, country, yacht, and racquet clubs and is not a pure country-club-only census; a country-club-only filter would produce a smaller number, though no primary source in the evidence set isolates that figure. *(Gap: No primary source isolates country clubs from the broader private-club universe; the 5,659 and 3,887 figures include yacht, racquet, and other club types.)* | High | [CMAA — Private Club Industry Economic Impact Report (Executive Summary)](https://www.cmaa.org/media/01hnzs2i/economic-impact-report_executive-summary.pdf)<br>[Club Management Magazine — New Economic Impact Report Highlights the Significant Contribution](https://www.club-mgmt.com/clubmanagement/2025january_february/MobilePagedArticle.action?articleId=2036669)<br>[Club Director Magazine — Private Club Industry Economic Impact Report](https://www.clubdirectormagazine.com/clubdirector_open/library/item/2025_year_in_review/4312620/) |
| VQ-2 | How many country clubs are there in Northern California? | No primary industry census (CMAA, NGCOA, or state association) provides a verified Northern California private country club count in the evidence set. The strongest available directional source is GoPrivateGolf, a secondary directory, which lists 47 private golf courses in the Bay Area and separately references 50 private country clubs in the same region; Bay Area definition boundaries are not standardized. Sonoma and Napa Valley evidence is anecdotal, with one travel source citing six golf clubs within those two valleys combined. *(Gap: No CMAA chapter, NGCOA state affiliate, or California business registry source provides a verified count. Northern California versus Bay Area versus Napa/Sonoma geographic definitions are inconsistent across the sources consulted.)* | Low | [GoPrivateGolf — All 47 Private Golf Courses in The Bay Area, CA](https://www.goprivategolf.com/in/the-bay-area)<br>[Travel Classics — Vintage Greens: Golf in California's Wine Country](https://travelclassics.com/travel-classics-archive/vintage-greens-golf-in-californias-wine-country/) |
| VQ-3 | What is the average size of their wine cellars (bottle count and SKU count)? | No average private-club wine cellar size, bottle count, or SKU count benchmark appears in any CMAA, Club Benchmarking, or industry survey source in the evidence set. Consumer wine-cellar design guides provide room-size-to-bottle-capacity heuristics but are not valid substitutes for observed institutional inventory data. The proposed segmentation into under 500, 500–2,500, 2,500–10,000, and 10,000+ bottle tiers, and the 1,060-club 'large cellar' target (representing approximately 27% of the 3,887-club universe), are hypotheses rather than validated market measurements. *(Gap: Need paid/private CMAA or Club Benchmarking F&B operations survey tables, or primary club interviews collecting actual bottle counts and SKU distributions. No such data was accessible in the provided evidence set.)* | Low | [CMAA — Reports and White Papers](https://www.cmaa.org/club-operations/research/reports-and-white-papers/)<br>[Wine Cellar Authority — Wine Cellar Size Guide](https://winecellarauthority.com/blogs/wine-cellar-design-and-construction/wine-cellar-dimensions-guide?srsltid=AfmBOooW8o59qR-MI5dLsdOPbZpxzNbDYGjGhDIeR1Mw8AZFKddiPDmU) |
| VQ-4 | What is the range of membership numbers across these clubs? | No primary CMAA or Club Benchmarking source in the evidence set provides a membership-size range or distribution across U.S. private clubs. The only numeric signal found is a secondary aggregator (WifiTalents) claiming an average of 450 members per club, with methodology not disclosed and some statistics labeled as directional. This figure should be treated as a rough order-of-magnitude placeholder rather than a validated benchmark. *(Gap: Need CMAA or Club Benchmarking membership-demographic tables with medians, quartiles, and club-type breakouts. No primary-source range distribution was present in the materials reviewed.)* | Low | [WifiTalents — Private Club Industry: Data Reports 2026](https://wifitalents.com/private-club-industry-statistics/)<br>[CMAA — Surveys](https://www.cmaa.org/club-operations/research/surveys/) |
| VQ-5 | What percentage of these members hold multiple club memberships? | No credible source in the evidence set provides a percentage of private-club members holding multiple memberships. The NCGA defines the term 'multi-member' in a golf-handicap context, and HFTP commentary discusses evolving member preferences, but neither source quantifies multi-membership prevalence among country-club or HNW households. *(Gap: Requires a survey-based or wealth-management source quantifying multi-club membership among private-club members or HNW households. This data point was not found in any of the six tracks.)* | Low | [NCGA — What is a multi-member?](https://support.ncga.org/knowledge/what-is-a-multi-member)<br>[HFTP — Private Members' Clubs 2.0 - Evolution Continues](https://www.hftp.org/news/4129008/private-members-clubs-20-evolution-continues) |
| VQ-6 | What are the top 5 pain points of private clients with large cellars in terms of wine management and consumption? | The five best-supported pain points across the evidence are: (1) inventory shrinkage and beverage variance — FoodTrak estimates clubs lose approximately 5% of F&B revenue to kitchen-related overuse, and RestaurantOwner cites 3–4% of sales lost to theft in restaurants; (2) lack of real-time inventory visibility and stale wine lists — multiple club-targeted vendors (bevSavvy, BinWise, MyWineGuide) position live list-to-inventory synchronization as their core value proposition; (3) spoilage and storage-condition failures from improper temperature and humidity management; (4) missed optimal drinking windows causing financial loss from forgotten or over-aged bottles; and (5) poor bottle-location traceability during movement within or between cellars. Evidence weight is strongest for shrinkage (moderate, with numeric benchmarks) and weakest for drinking-window and location pain (primarily vendor-claimed rather than independently measured). *(Gap: Missing independent club-specific ranking of pain points with quantified dollar impact for wine programs specifically rather than general F&B. Most evidence outside shrinkage is vendor-marketing framing rather than third-party measurement.)* | Medium | [FoodTrak — Reducing F&B Subsidies Through Procurement and Culinary Control](https://www.foodtrak.com/docs/ArticleBooklet-ReducingSubsidies201303.pdf)<br>[RestaurantOwner — 75 Percent of All Inventory Shrinkage Happens as a Result of Theft](https://www.restaurantowner.com/public/75-Percent-of-All-Inventory-Shrinkage-Happens-as-a-Result-of-Theft.cfm)<br>[bevSavvy — Digital Wine Lists for Golf and Country Clubs](https://bevsavvy.com/digital-wine-lists-for-golf-clubs/)<br>[InVintory — The Real Cost of Mismanaging a Wine Cellar (and How Apps Prevent It)](https://invintory.com/blog/the-real-cost-of-mismanaging-a-wine-cellar-and-how-apps-prevent-it/)<br>[foreUP — Top 3 Things Clubs Do Wrong with Food & Beverage Inventory](https://www.foreupgolf.com/top-3-things-clubs-do-wrong-with-food-beverage-inventory/) |
| VQ-7 | What is the consignment model for wine? Can a member of a golf club exchange bottles of their personal wine with other members? | The evidence across federal and state sources does not support a lawful member-to-member wine consignment or exchange model inside private clubs. Federal TTB regulations (27 CFR Part 11) govern consignment sales in trade-buyer contexts involving licensed and bonded actors, not private individuals. New York SLA explicitly states club licenses may not be used so members can purchase bottle or case goods for off-premises use. Texas TABC requires club wine purchases to come from licensed package stores. California ABC license documentation does not affirmatively authorize member resale. The Florida evidence in the record is limited to a secondary 'bottle club' BYOB explainer that distinguishes possession and consumption from resale. No sourced operating example was found of a private club lawfully running a member-to-member consignment marketplace in any of these four states. *(Gap: Florida primary authority (DBPR/ABT statutes and advisories) was not found in the evidence set. No state-approved club member-consignment operating model was sourced in CA, FL, NY, or TX. Federal edge-case interpretation under TTB Industry Circular 2022-1 regarding payment timing remains contested in secondary legal commentary.)* | Medium | [eCFR — 27 CFR Part 11 -- Consignment Sales](https://www.ecfr.gov/current/title-27/chapter-I/subchapter-A/part-11)<br>[New York State Liquor Authority — Notice to Club Licensees](https://sla.ny.gov/system/files/documents/2018/08/notice-club-licensees-102314-2.pdf)<br>[Texas Alcoholic Beverage Commission — Private Club Permit (N) On-Premise Retailers](https://www.tabc.texas.gov/static/sites/default/files/2021-08/private-club-permit-n-on-premise-retailers-lc.pdf)<br>[California ABC — License Types](https://www.abc.ca.gov/licensing/license-types/)<br>[TTB — Wine FAQs](https://www.ttb.gov/regulated-commodities/beverage-alcohol/wine/wine-faqs)<br>[Glover Law Firm — Welcome to the Club](https://www.gloverlaw.net/articles/welcometotheclub) |

---

## Decision Memo

### DQ-1 — Is this a worthwhile business?

**Recommendation** (confidence: Medium): Yes, with three hard conditions that must be resolved within 90 days before meaningful capital deployment. CellarEye occupies a real and currently unoccupied whitespace — no evidenced competitor combines automated cellar-level valuation, physical bottle tracking, and sommelier AI — and structural demand from insurers and club finance teams is directionally validated by primary sources. However, the three most critical commercial inputs (enterprise API unit economics, club CFO willingness-to-pay, and legal classification of the product as 'market analytics' rather than a regulated 'appraisal') are all unvalidated at this stage, meaning the business is a conditional pursue, not an unconditional one. If all three conditions resolve favorably within the 90-day window, this is a fundable venture with a credible $62M SAM and a defensible sequenced product ladder; if two or more fail, the recommended pivot is to the Luxury Hotel Beachhead (P4).

**Supporting evidence:**
- No evidenced competitor currently combines automated cellar-level valuation reporting, physical bottle-level tracking, and virtual sommelier AI in a single integrated offering, confirming a genuine product whitespace. _[VQ-6]_
- Insurance carriers Chubb and PURE already require regular valuation updates for insured wine collections, confirming that cellar valuation is an existing operational need rather than a hypothetical one. _[VQ-6]_
- The analytically grounded SAM of 3,887 U.S. private clubs with revenue above $1M is validated by gold-standard CMAA/Club Benchmarking/NCA sources, providing a credible market denominator. _[VQ-1]_
- Inventory shrinkage (estimated at 3–5% of F&B revenue) and stale wine list pain are recurring, independently corroborated operational problems across club and restaurant hospitality, validating product-market fit at the pain level. _[VQ-6]_

**Counter evidence:**
- No insurance underwriter has confirmed willingness to pay for or require automated cellar valuation data from CellarEye specifically; demand is inferred from public marketing materials, not validated procurement evidence. _[VQ-6, VQ-7]_
- The entire Year 1 revenue model depends on club CFO willingness-to-pay for standalone valuation reports, which has not been tested in any structured buyer interview. _[VQ-3, VQ-4]_
- The 500,000-wine pricing database is described in competitive analysis as replicable by any player with API access, meaning the valuation report alone is not a durable moat without the hardware layer. _[VQ-3]_

**Assumptions:**
- Enterprise API pricing from Liv-ex and Wine-Searcher will support gross margins above 60% on valuation reports at the planned price points.
- Club CFOs will treat automated valuation reports as a finance-department budget item distinct from general IT or F&B software, enabling a $3,000–$6,000 ACV purchase.
- Legal counsel will confirm that 'market analytics' labeling is sufficient to avoid state appraiser licensure requirements in California and Florida.
- Hardware conversion from valuation report customers will occur at sufficient rates to deepen the moat and justify the sequencing strategy.

**What would change our mind:** If fewer than 3 of 10 structured club CFO discovery interviews result in expressed willingness to pay $3,000 or more per year for automated cellar valuation reports, and if enterprise API pricing from either Liv-ex or Wine-Searcher exceeds $0.10 per lookup, the business case is falsified and the recommendation flips to Pivot to P4 (Luxury Hotel Beachhead).

**Kill signals:**
- Fewer than 3 of 15 pilot clubs convert to paid valuation subscriptions at $3,000+ ACV within 6 months of receiving a free cellar health check.
- Legal counsel determines 'market analytics' framing does not insulate from appraiser licensing requirements in California or Florida AND no licensed appraiser partnership can be structured within 60 days.
- Liv-ex or Wine-Searcher enterprise API pricing confirmed above $0.10 per lookup, making per-report COGS exceed 40% of a $500 single-report price.

---

### DQ-2 — What is the revenue potential and market opportunity?

**Recommendation** (confidence: Medium): Model the primary SAM conservatively at $62M, derived from 3,887 revenue-qualified U.S. private clubs (CMAA-verified) at a blended $16K average annual contract value across subscription and hardware tiers. Limit the initial SOM to 50 club subscriptions in Year 1 ($225K ARR), scaling to 200 subscriptions by Year 3 ($900K ARR) before hardware conversion uplift. The 1,060-club 'large cellar' target is a reasonable working hypothesis at roughly 27% of the universe but must be validated through primary club interviews before being cited in investor materials. Do not include the hotel or HNW private-cellar market in Year 1 revenue projections; treat them as Year 3+ optionality worth a rough additional $28M SAM based on approximately 1,750 AAA Four Diamond hotels, pending cellar-size penetration data.

**Supporting evidence:**
- The 3,887-club universe with revenue above $1M is validated by gold-standard CMAA/Club Benchmarking/NCA sources and represents the most defensible SAM denominator available. _[VQ-1]_
- Some luxury hotels demonstrably operate wine programs at or well above 2,500 bottles (The Little Nell at 20,000 bottles; Luce Intercontinental at 8,000 bottles), confirming that the hotel segment contains accounts large enough to warrant CellarEye's workflow. _[VQ-3]_
- Beverage cost benchmarks from club-specific white paper data show a 2-percentage-point gap between lower- and higher-performing clubs' beverage cost ratios (34.9% vs. 32.9%), confirming that wine program efficiency is a material financial lever that justifies technology investment. _[VQ-6]_
- Auction houses (Sotheby's, Christie's) offer free manual wine estimates, meaning CellarEye's value must be positioned as recurring, automated, portfolio-level analytics rather than a simple point-in-time appraisal to justify a paid subscription. _[VQ-3]_

**Counter evidence:**
- The 1,060-club 'large cellar' segment is not validated from any primary source; it is only arithmetically derivable as 27% of the 3,887-club universe and should be treated as a hypothesis. _[VQ-3]_
- No primary source quantifies the share of AAA Four/Five Diamond hotels with 2,500+ bottle wine programs, so the hotel market extension is directionally supported but cannot be sized with confidence. _[VQ-3]_
- Commercial wine-storage and HNW private-cellar market estimates conflict materially across sources (USD 465M vs. USD 3.24B depending on category definition), making the expansion TAM poorly bounded. _[VQ-3, VQ-4]_

**Assumptions:**
- Approximately 27% of revenue-qualified clubs (roughly 1,060) maintain cellars large enough to generate meaningful valuation analytics value.
- Average ACV of $4,500 per club subscription is achievable and defensible relative to mainstream beverage software comparables.
- Hotel expansion timing is Year 3 or later and contingent on 20+ successful club deployments generating reference accounts.
- HNW private-cellar market is accessed indirectly through club member relationships rather than as a direct acquisition channel.

**What would change our mind:** If direct club interviews with 20+ F&B directors and CFOs reveal that fewer than 20% of clubs maintain wine programs exceeding 500 bottles, the 1,060-club large-cellar SAM segment collapses to below 200 viable accounts, making the $62M SAM figure structurally overstated and requiring a full market re-size.

**Kill signals:**
- CMAA releases updated data showing revenue-qualified club count has declined more than 20% from the 3,887 baseline.
- Liv-ex 1000 index drops more than 15% over 12 consecutive months, collapsing the 'unlock hidden equity' value narrative and undermining club CFO appetite for valuation services.

---

### DQ-3 — What are the key benefits and features?

**Recommendation** (confidence: Medium): Prioritize four features in MVP build order, sequenced by evidence weight of underlying pain: (1) Automated cellar-level mark-to-market valuation report — the core differentiator with no direct competitor evidenced; (2) Shrinkage and beverage-variance discovery module — the most quantifiably evidenced pain point across club and restaurant hospitality; (3) Live wine-list-to-inventory synchronization — repeatedly validated as a recurring workflow failure across multiple club-targeted vendors; (4) Drinking-window and aging alerts — well-evidenced as a collector pain point, lower urgency for institutional buyers. Virtual sommelier AI (wine pairing and staff recommendation support) should be built as a fifth feature but positioned as a member-facing upsell layer, not a primary institutional sales driver, as the evidence base for club-specific ROI from AI pairing remains thin.

**Supporting evidence:**
- No evidenced competitor (BinWise, Uncorkd, Preferabli, SevenFifty, CellarTracker, or Vivino) combines automated cellar-level valuation reporting, physical bottle-level tracking, and sommelier AI, creating a clear feature whitespace that CellarEye can occupy. _[VQ-6]_
- Inventory shrinkage of 3–5% of F&B revenue is the most numerically validated pain point in private clubs and restaurants, directly quantifying the ROI case for the shrinkage discovery module. _[VQ-6]_
- Multiple club-targeted vendors (bevSavvy, BinWise, MyWineGuide) position real-time inventory-to-wine-list synchronization as the core problem they solve, confirming this as a persistent workflow failure across the target segment. _[VQ-6]_
- Academic literature confirms active research in AI-driven food and wine pairing and recommender systems, supporting technical plausibility of the virtual sommelier feature. _[VQ-6]_

**Counter evidence:**
- BinWise already offers variance reporting and inventory controls targeting clubs, meaning the shrinkage detection feature faces a direct incumbent with a large installed base of 50+ POS integrations. _[VQ-6]_
- Club-specific ROI evidence for AI wine pairing and virtual sommelier features is thin; academic support exists for the technology but business-case evidence in private clubs is absent. _[VQ-6]_
- No direct certified integrations between CellarEye or major wine-tech competitors and Jonas Club Software, Clubessential, or Oracle OPERA were substantiated in the evidence set, leaving the operational deployment path uncertain. _[VQ-6]_

**Assumptions:**
- The absence of combined valuation-plus-tracking-plus-AI functionality in evidenced competitors reflects a real gap rather than an evidence gap in the research.
- Club finance teams will prioritize valuation and shrinkage features over member-facing sommelier AI in initial purchase decisions.
- Integration with Jonas and Clubessential is technically achievable, even if commercially unvalidated, within the Year 1 product timeline.

**What would change our mind:** If direct competitive research on Alfred Technologies, InCellar, or another unresearched competitor reveals a deployed product combining automated valuation, physical tracking, and sommelier AI with existing club POS integrations, the whitespace thesis is falsified and CellarEye must identify a narrower differentiation lane.

**Kill signals:**
- A well-funded competitor (BinWise parent company, Jonas/Clubessential internally, or a new entrant) launches an automated cellar-level valuation report feature with native POS integration within 12 months.
- Discovery research with 10+ club F&B directors reveals that valuation reports are not a CFO-level purchase and must be approved through a technology committee alongside Jonas/Clubessential renewals, extending the sales cycle beyond 9 months.

---

### DQ-4 — What could the pricing be of the system per year (automated inventory management + client-facing sommelier app + other revenue streams)?

**Recommendation** (confidence: Medium): Structure a four-tier price architecture with clear institutional-versus-consumer separation: (1) Single valuation report at $500 per report — entry point for clubs not ready to subscribe, must be positioned as analytics not appraisal; (2) Valuation subscription at $3,000–$6,000 per year — quarterly refresh, shrinkage flagging, and drinking-window alerts, targeting club CFOs as primary buyer; (3) Full-stack subscription with hardware (NFC/IoT) at $9,600–$18,000 per year — adds physical bottle-level tracking and real-time inventory integration; (4) Advisor/broker license at $10,000–$25,000 per year — conditional launch only if broker willingness-to-pay interviews validate a procurement path. Do not launch the $500 standalone report without explicit product labeling as market analytics, given that auction houses offer free manual estimates and the single-report price anchors buyer perception.

**Supporting evidence:**
- Mainstream beverage inventory SaaS typically prices at $10–$100 per month at entry level (approximately $120–$1,200 annually), meaning CellarEye's $3,000–$6,000 subscription must be justified as a higher-value analytics and financial reporting service rather than an operations tool. _[VQ-3, VQ-6]_
- Enterprise club management platforms (Jonas, Clubessential, Northstar) are quote-only with no public pricing, confirming that club technology buyers are accustomed to customized pricing conversations rather than self-serve catalog purchases. _[VQ-4]_
- Auction houses (Christie's, Sotheby's) offer free manual wine estimates, which undercuts a $500 standalone valuation report unless CellarEye is explicitly positioned as faster, recurring, and non-consignment-oriented analytics. _[VQ-7]_

**Counter evidence:**
- CellarEye's own publicly visible app pricing (Premium at $129/year, Premium+ at $299/year, Starter+ at $39/year) creates a buyer-perception anchor that is 10–20x below the proposed club subscription tiers, requiring clear product-line separation to avoid confusion. _[VQ-3]_
- No direct willingness-to-pay evidence from club CFOs, GMs, or beverage directors exists in any track, meaning all proposed price points are hypotheses rather than validated buyer-confirmed figures. _[VQ-3, VQ-4]_
- Public enterprise pricing for Liv-ex and Wine-Searcher APIs is absent, leaving the COGS floor for any price tier uncertain and potentially making the $3,000–$6,000 tier structurally unprofitable if API costs are high. _[VQ-3]_

**Assumptions:**
- Club CFOs will evaluate the valuation subscription against the cost of commissioned manual appraisals and insurance compliance workflows, not against general beverage software pricing.
- The institutional product line ($3K–$18K) can be cleanly separated in brand and sales motion from the consumer app tier ($39–$299/year) to prevent price anchoring.
- The advisor/broker license tier ($10K–$25K) is not launched until validated by structured broker interviews.

**What would change our mind:** If structured pricing interviews with 10 club CFOs reveal that the perceived value ceiling for any standalone wine analytics subscription is below $2,000 per year, the proposed $3,000–$6,000 tier is not achievable and pricing must be restructured around volume or per-report fees.

**Kill signals:**
- BinWise or a comparable beverage inventory incumbent announces a valuation reporting feature at no additional cost to existing subscribers, eliminating willingness-to-pay for CellarEye's standalone analytics at any price above zero.
- Competitive appraisal benchmarking (EG-4) reveals that licensed independent appraisers charge less than $500 per comprehensive cellar report with faster turnaround than CellarEye's automated system can achieve.

---

### DQ-5 — What features or additional revenue opportunities are we missing?

**Recommendation** (confidence: Medium): Three high-potential additions are supported by the evidence and not yet in the core product roadmap: (1) Digital member wine lockers — allowing members to register personally owned bottles stored at the club, with drink-window and condition alerts delivered to their mobile device; multiple club-targeted vendors market this and it creates a direct member-to-platform relationship without requiring member-to-member resale; (2) Pre-arrival wine ordering and cellar reservation — members pre-select bottles for upcoming dining visits, reducing sommelier staffing burden and increasing bottle throughput; (3) Insurance compliance documentation package — a structured report format explicitly designed to satisfy Chubb/PURE carrier requirements, potentially enabling CellarEye to be listed as a preferred valuation provider by carriers. Three revenue opportunities appear legally foreclosed or unvalidated and should be deferred: member-to-member wine consignment or exchange (legally blocked across all evidenced jurisdictions), insurance underwriter data feed licensing (unvalidated procurement path), and RFID/NFC bottle-level tracking without Jonas/Clubessential integration (high friction without ERP connectivity).

**Supporting evidence:**
- Digital member wine lockers and pre-arrival ordering are repeatedly featured in club-targeted wine software products (MyWineGuide, bevSavvy), confirming market acceptance of these features without requiring member-to-member resale. _[VQ-6, VQ-7]_
- PURE Insurance offers protection up to 150% of scheduled value when market value has risen, meaning market-movement tracking is an already-recognized carrier requirement that CellarEye's quarterly refresh service directly addresses. _[VQ-6]_
- Member-to-member wine consignment or exchange is legally unsupported across all evidenced jurisdictions (NY, TX, CA, and inferred FL), confirming this must be permanently removed from the product roadmap. _[VQ-7]_
- Competitors' capabilities cluster into separate functional buckets with no single player combining valuation, physical tracking, and AI recommendation, suggesting that feature integration is itself a defensible product strategy. _[VQ-6]_

**Counter evidence:**
- The insurance compliance documentation package requires carrier buy-in or preferred-provider listing to generate meaningful demand, and no carrier has confirmed willingness to direct clients to a specific automated valuation provider. _[VQ-6, VQ-7]_
- Alfred Technologies already serves both hotel and private-collector segments with wine inventory management, meaning the member-facing digital locker and pre-arrival ordering space is not entirely unoccupied. _[VQ-6]_

**Assumptions:**
- Digital member locker and pre-arrival ordering features do not require new ABC/TTB licensing as long as the club, not CellarEye, remains the licensed retailer.
- Insurance carriers can be approached as demand-generation partners (directing existing clients to use CellarEye for compliance documentation) rather than as paying customers in Year 1.
- Physical bottle-level tracking via NFC is architecturally ready as a premium add-on and does not require Jonas/Clubessential integration to function as a standalone physical audit layer.

**What would change our mind:** If legal review determines that operating a digital member locker platform (where member-owned bottles are registered and tracked within a licensed club's system) creates ABC compliance exposure in California or Florida, this feature must be restructured or deferred.

**Kill signals:**
- State ABC enforcement action against any private club operating a digital member locker or member-wine registration system in California, Texas, New York, or Florida.
- A carrier (Chubb, PURE, or AIG) publicly announces that automated software-generated wine valuations are not acceptable for scheduled coverage updates, eliminating the insurance compliance documentation opportunity.

---

### DQ-6 — With an annual operating budget of $1M, can this business be cashflow positive?

**Recommendation** (confidence: Medium): No, not in Year 1 at the planned revenue level, and probably not in Year 2 without significant acceleration. The modeled Year 1 opex of approximately $710K–$930K (lean to fuller build) versus $345K total revenue (of which only $225K is recurring ARR) implies an operating loss of roughly $365K–$585K. Year 2 cashflow positivity requires reaching approximately 150 club subscriptions at $4,500 ACV ($675K ARR) while holding opex flat — a 3x revenue increase that requires validated sales productivity data not yet in evidence. The business can operate within the $1M budget ceiling in Year 1 and should be funded as a 24-month runway to first cashflow-positive quarter, with the explicit condition that API cost scenarios and club CAC are validated within the first 90 days before committing the full annual budget.

**Supporting evidence:**
- Modeled Year 1 P&L shows total revenue of $345K versus opex of $710K–$930K, producing an operating loss of $365K–$585K even in the lean staffing scenario, confirming cashflow positivity is not achievable in Year 1. _[VQ-1, VQ-3]_
- SaaS gross margin benchmarks of 70–85% are achievable at the per-customer level if API costs remain near the low scenario ($0.01–$0.05 per lookup), but operating leverage is overwhelmed by payroll at $225K recurring revenue. _[VQ-3]_
- Liv-ex and Wine-Searcher APIs are technically available for B2B valuation use cases, supporting the product's technical feasibility, but enterprise pricing terms are absent and represent the largest unresolved COGS variable. _[VQ-3]_

**Counter evidence:**
- No club-specific CAC, close-rate, or sales-cycle benchmark was found in any track, meaning the 50-club Year 1 target and the implied sales productivity per hire are unvalidated assumptions. _[VQ-1, VQ-4]_
- Hardware one-time revenue ($120K from 10 conversions) is excluded from standard ARR definitions and inflates the apparent Year 1 revenue figure; true recurring ARR is $225K, not $345K. _[VQ-3]_
- If Liv-ex or Wine-Searcher API pricing is above $0.10 per lookup at scale, annual API cost alone could reach $30K+ for 50 accounts, materially compressing gross margin and pushing cashflow breakeven further out. _[VQ-3]_

**Assumptions:**
- The $1M annual budget is available as committed capital for a full 12-month operating period without milestone-based tranche releases.
- Sales cycle for club subscriptions averages 3–6 months, enabling 50 closed accounts by month 12 if outreach begins in month 1.
- Founders absorb at least one of the four critical Year 1 roles (likely ops/customer success), reducing loaded payroll below the $528K–$596K lean-team estimate.
- API cost per lookup is confirmed below $0.05 at negotiated enterprise rates before full product launch.

**What would change our mind:** If API pricing is confirmed below $0.05 per lookup AND club discovery interviews yield expressed willingness to pay $4,500+ ACV from at least 5 of 10 CFOs interviewed, the Year 2 cashflow-positive path becomes credible at 100–120 subscriptions and the recommendation upgrades to 'cashflow positive achievable by Q3 Year 2.' Conversely, if CAC benchmarking through pilot outreach reveals that closing one club subscription requires more than $8,000 in sales expense, the LTV:CAC ratio at $4,500 ACV falls below 2:1 and the model is structurally unviable without a price increase.

**Kill signals:**
- API pricing confirmed above $0.10 per lookup, making annual API COGS exceed $30K for 50 accounts and gross margin fall below 50% on the subscription tier.
- Pilot sales funnel after 6 months shows fewer than 8 clubs in late-stage evaluation despite outreach to 50+ prospects, implying a CAC that makes the unit economics unworkable within the $1M budget.
- Total Year 1 opex tracks above $950K by month 9 without a corresponding revenue acceleration, leaving less than $50K runway to adjust the cost structure.

---

### DQ-7 — What would be the critical hires?

**Recommendation** (confidence: Medium): Build a four-person Year 1 core team: (1) Wine-domain operations lead — hire a former private-club F&B director or wine director (not a floor sommelier) at a loaded cost of approximately $108K–$169K; this role supplies buyer credibility, club-operating knowledge, and wine-program domain expertise that a technical founder typically cannot replicate; (2) Full-stack engineer — the highest-priority technical hire at a loaded cost of approximately $168K–$247K, responsible for MVP build, API integration, and report generation pipeline; (3) Sales and partnerships lead — hire someone with existing private-club or hospitality-enterprise relationships at a base loaded cost of approximately $108K–$169K with OTE of $130K–$180K; club sales cycles are relationship-dependent and a technical founder cold-calling club GMs is a structural disadvantage; (4) Ops and customer success hybrid — loaded cost of approximately $84K–$143K, can be absorbed by a founder in Year 1 to preserve budget. Add fractional legal counsel at approximately $15K–$20K annually from Day 1; defer full-time data engineering until Year 2.

**Supporting evidence:**
- A former private-club F&B director profile is more commercially valuable for the wine-domain lead role than a floor sommelier, because the need is buyer trust and operational credibility rather than wine service execution. _[VQ-6]_
- Fractional general counsel is well-evidenced as the appropriate legal structure for Year 1 startups needing recurring contract, compliance, IP, and policy support without full-time overhead, at approximately $15K–$20K annually. _[VQ-7]_
- Sommelier and beverage-director compensation data conflicts across sources, ranging from $46K average to $125K+ for wine director roles, confirming that the wine-domain hire must be scoped and priced against the actual commercial responsibilities rather than a generic title. _[VQ-6]_

**Counter evidence:**
- No club-specific CAC or sales-cycle benchmark was found, meaning the productivity requirement implied by the sales lead hire (50 closed accounts in Year 1) is unvalidated and may require a second sales hire sooner than planned. _[VQ-1, VQ-4]_
- Full-stack engineer loaded cost of $168K–$247K is the largest single budget line; if a founding engineer is not already on the team, this hire alone consumes 17–25% of the annual operating budget. _[VQ-3]_

**Assumptions:**
- At least one founder absorbs the ops/customer-success function in Year 1 to avoid a fifth full-time hire.
- The wine-domain lead is compensated at the F&B director range ($85K–$125K base) rather than the floor sommelier range ($46K–$60K), reflecting the commercial seniority required.
- The sales lead has an existing network of relationships with private-club GMs or CFOs in Northern California, reducing ramp time to first closed deal below 90 days.

**What would change our mind:** If a founder already holds deep private-club F&B relationships and wine-domain credibility, the wine-domain lead hire can be deferred to Year 2, freeing approximately $120K–$150K of loaded payroll budget to either extend runway or accelerate the engineering hire.

**Kill signals:**
- After 9 months of operation, the sales lead has not closed any paid subscription deals and the pipeline shows fewer than 5 clubs in active late-stage evaluation, indicating either the wrong hire profile or a fundamental product-market fit problem requiring a strategy pivot.
- The full-stack engineer hire is not secured within 60 days of funding close, delaying MVP delivery past the 6-month target and compressing the window for Year 1 customer acquisition.

---

### DQ-8 — Is expansion from clubs to high-end hotels, resorts, and wine storage facilities a logical next step? And can clubs/resorts serve as a funnel to HNW private-cellar clients?

**Recommendation** (confidence: Medium): Yes, hotel expansion is the logical Year 3 move and should be formally activated as the fallback path (P4) if club momentum stalls before Year 2. The hotel case is stronger technically (Oracle OPERA and Lightspeed have documented open APIs versus club ERP lock-in) and has a larger reward ceiling per account (named examples run 8,000–20,000 bottle programs). However, hotel expansion should not be activated until CellarEye has 20+ club reference accounts, because Alfred Technologies already has named hotel case studies and CellarEye would enter as a second mover without proof points. The club-to-HNW private-cellar funnel is a plausible thesis but is entirely unvalidated: no evidence in any track documents a SaaS vendor successfully using institutional hospitality deployments as a repeatable acquisition channel for high-net-worth individual clients. Pursue this hypothesis opportunistically through member locker features rather than as a planned revenue stream.

**Supporting evidence:**
- Oracle OPERA Cloud publishes REST APIs through OHIP and Lightspeed has a documented Oracle OPERA integration for hotel room-charge workflows, confirming that luxury hotel POS/PMS environments are materially more open to third-party integration than private-club ERPs. _[VQ-1, VQ-3]_
- There are approximately 145 AAA Five Diamond and 1,750 AAA Four Diamond hotels in the U.S., establishing a tangible market denominator for hotel expansion planning. _[VQ-1]_
- Named luxury hotel accounts demonstrably operate wine programs well above the 2,500-bottle threshold (The Little Nell at 20,000 bottles; Luce Intercontinental at 8,000 bottles), confirming account-level fit for CellarEye's workflow in the hotel segment. _[VQ-3]_

**Counter evidence:**
- Alfred Technologies already has published case studies at Château Frontenac and Post Hotel & Spa, meaning CellarEye would enter the hotel segment as a second mover against an established competitor whose commercial strength (ACV, churn, deployment count) is unquantified but nonzero. _[VQ-6]_
- No documented precedent was found in any track showing a SaaS vendor using institutional hospitality deployments as a repeatable acquisition channel for HNW private-cellar individual clients, leaving the club-to-HNW funnel thesis entirely unvalidated. _[VQ-5]_
- No primary source quantifies the share of AAA Four/Five Diamond hotels maintaining 2,500+ bottle wine programs, so the hotel SAM penetration rate is unknown and the addressable account count within the 1,750-hotel universe cannot be reliably estimated. _[VQ-3]_
- Commercial wine-storage market estimates conflict materially across sources and category definitions, making the wine-storage-facility expansion wedge poorly bounded and inadvisable as a near-term strategic priority. _[VQ-3]_

**Assumptions:**
- CellarEye's club reference base of 20+ accounts is sufficient social proof to overcome Alfred Technologies' head start in the luxury hotel segment.
- The club-to-HNW member funnel is accessed through digital member locker features rather than requiring a separate direct-to-consumer sales motion.
- Wine storage facilities are a Year 4+ expansion opportunity and are not included in any Year 1–3 revenue planning.

**What would change our mind:** If pilot sales outreach to 15 luxury hotels yields 5 or more discovery calls from F&B directors or GMs expressing active interest before CellarEye has reached 20 club accounts, the hotel expansion timeline should be accelerated to Year 2 and run in parallel with club acquisition rather than sequentially.

**Kill signals:**
- Alfred Technologies announces a U.S. Series A or significant commercial expansion into private clubs, indicating it is moving to compete in CellarEye's primary segment and will arrive in hotels with substantially more resources.
- Discovery calls with 10 luxury hotel F&B directors reveal that purchasing authority for wine technology sits with a corporate technology committee rather than the property-level GM, extending the hotel sales cycle beyond 12 months and making it incompatible with the $1M budget constraint.

---

## Appendix: Track Evidence Packages

### CT1: Market Sizing & Segmentation

```json
{
  "track_id": "CT1",
  "track_name": "Market Sizing & Segmentation",
  "relevance": "High",
  "findings": [
    {
      "id": "F1",
      "title": "U.S. private club universe is supported at 5,659 total clubs, with 3,887 clubs in the economic-impact analysis universe",
      "feeds_questions": [
        "VQ-1",
        "DQ-2"
      ],
      "evidence_weight": "strong",
      "content": "CMAA/Club Benchmarking/NCA sources consistently state there are approximately 5,659 private clubs in the U.S. The CMAA Economic Impact Report further narrows its measured universe to 3,887 identifiable clubs with revenue above $1 million, which is the closest hard-evidence base available for TAM/SAM modeling in this track. This supports using 3,887 as an analytically grounded operating market universe, while 5,659 remains the broader top-line club count.",
      "sources": [
        {
          "name": "CMAA — Private Club Industry Economic Impact Report (Executive Summary)",
          "url": "https://www.cmaa.org/media/01hnzs2i/economic-impact-report_executive-summary.pdf"
        },
        {
          "name": "Club Management Magazine — New Economic Impact Report Highlights the Significant Contribution...",
          "url": "https://www.club-mgmt.com/clubmanagement/2025january_february/MobilePagedArticle.action?articleId=2036669"
        },
        {
          "name": "Club Director Magazine — Private Club Industry Economic Impact Report",
          "url": "https://www.clubdirectormagazine.com/clubdirector_open/library/item/2025_year_in_review/4312620/"
        }
      ]
    },
    {
      "id": "F2",
      "title": "Geographic concentration evidence is strongest for Florida, not Northern California",
      "feeds_questions": [
        "VQ-2",
        "DQ-2"
      ],
      "evidence_weight": "moderate",
      "content": "The CMAA executive summary explicitly states that Florida is the state containing the most clubs, and the South is the largest club region by economic impact. By contrast, the provided Northern California evidence is fragmented: GoPrivateGolf says the Bay Area has 50 private country clubs and lists 47 private golf courses, but this is a secondary directory rather than an industry census. This creates a contradiction in go-to-market logic: Florida is count-supported, while Northern California is only partially count-supported and more strongly supported by wine-culture fit.",
      "sources": [
        {
          "name": "CMAA — Private Club Industry Economic Impact Report (Executive Summary)",
          "url": "https://www.cmaa.org/media/01hnzs2i/economic-impact-report_executive-summary.pdf"
        },
        {
          "name": "GoPrivateGolf — All 47 Private Golf Courses in The Bay Area, CA",
          "url": "https://www.goprivategolf.com/in/the-bay-area"
        }
      ]
    },
    {
      "id": "F3",
      "title": "Northern California country-club count is only thinly evidenced in the provided materials",
      "feeds_questions": [
        "VQ-2",
        "DQ-2"
      ],
      "evidence_weight": "thin",
      "content": "No primary CMAA, NGCOA, or state-level census source in the results gives a definitive Northern California private country club count. The strongest available count-like source is GoPrivateGolf, which says the Bay Area has 50 private country clubs and also markets a list of 47 private golf courses, but this is a directory and its Bay Area definition is not standardized. Sonoma/Napa evidence is anecdotal, including a travel article stating there are six golf clubs within the Sonoma and Napa Valleys.",
      "sources": [
        {
          "name": "GoPrivateGolf — All 47 Private Golf Courses in The Bay Area, CA",
          "url": "https://www.goprivategolf.com/in/the-bay-area"
        },
        {
          "name": "Travel Classics — Vintage Greens: Golf in California's Wine Country",
          "url": "https://travelclassics.com/travel-classics-archive/vintage-greens-golf-in-californias-wine-country/"
        }
      ]
    },
    {
      "id": "F4",
      "title": "No hard evidence was found for private-club wine-cellar size distribution or average bottle/SKU count",
      "feeds_questions": [
        "VQ-3",
        "DQ-2"
      ],
      "evidence_weight": "absent",
      "content": "The provided CMAA research pages and public report excerpts do not disclose bottle-count distributions, average cellar sizes, or SKU counts for private clubs. Consumer wine-cellar design guides provide storage-capacity heuristics for rooms of different square footage, but they do not measure actual club inventories. As a result, the claimed segmentation into under 500, 500–2,500, 2,500–10,000, and 10,000+ bottles cannot be validated from the evidence supplied.",
      "sources": [
        {
          "name": "CMAA — Reports and White Papers",
          "url": "https://www.cmaa.org/club-operations/research/reports-and-white-papers/"
        },
        {
          "name": "CMAA — Private Club Industry Economic Impact Report (Executive Summary)",
          "url": "https://www.cmaa.org/media/01hnzs2i/economic-impact-report_executive-summary.pdf"
        },
        {
          "name": "Wine Cellar Authority — Wine Cellar Size Guide: Plan the Perfect Cellar Dimensions",
          "url": "https://winecellarauthority.com/blogs/wine-cellar-design-and-construction/wine-cellar-dimensions-guide?srsltid=AfmBOooW8o59qR-MI5dLsdOPbZpxzNbDYGjGhDIeR1Mw8AZFKddiPDmU"
        }
      ]
    },
    {
      "id": "F5",
      "title": "The 1,060 'large-club' target is not validated; it is only reverse-engineerable as 27.3% of the 3,887-club universe",
      "feeds_questions": [
        "VQ-3",
        "DQ-2"
      ],
      "evidence_weight": "thin",
      "content": "Given the lack of cellar-size distribution data, the 1,060-club target cannot be directly checked against observed bottle-count tiers. Numerically, 1,060 divided by 3,887 equals 27.3%, so the target can only be interpreted as an assumed share of the >$1M-revenue club universe rather than a measured segment. This is a hard contradiction with the market model if the 1,060 figure has been presented as empirically validated rather than hypothesized.",
      "sources": [
        {
          "name": "CMAA — Private Club Industry Economic Impact Report (Executive Summary)",
          "url": "https://www.cmaa.org/media/01hnzs2i/economic-impact-report_executive-summary.pdf"
        }
      ]
    },
    {
      "id": "F6",
      "title": "Membership-size evidence is weak and not supported by primary CMAA statistics in the provided results",
      "feeds_questions": [
        "VQ-4",
        "DQ-2"
      ],
      "evidence_weight": "thin",
      "content": "No primary CMAA table in the provided materials gives average member counts or a membership-size distribution across U.S. private clubs. The only numeric membership signal surfaced is a secondary aggregator claiming the average number of members per club is 450, but it labels some stats as single-source or directional and does not expose methodology. This means membership-based revenue modeling remains weakly evidenced in this track.",
      "sources": [
        {
          "name": "WifiTalents — Private Club Industry: Data Reports 2026",
          "url": "https://wifitalents.com/private-club-industry-statistics/"
        },
        {
          "name": "CMAA — Surveys",
          "url": "https://www.cmaa.org/club-operations/research/surveys/"
        }
      ]
    },
    {
      "id": "F7",
      "title": "No survey-based evidence quantifies cost-basis versus market-value gaps for private-club wine inventories",
      "feeds_questions": [
        "DQ-2"
      ],
      "evidence_weight": "absent",
      "content": "No private-club industry survey in the provided materials quantifies wine inventory held at historical cost versus current market value. Available evidence only supports the general accounting point that inventory is commonly tracked at cost, while wine-market tools like CellarTracker separately estimate current market value and note methodological differences such as buyer-side prices being around 30% above seller net at auction. The 'hundreds of thousands of dollars of unlocked value' claim is therefore plausible for some clubs but not benchmark-validated here.",
      "sources": [
        {
          "name": "CellarTracker Support — Automatic Cellar Valuation",
          "url": "https://support.cellartracker.com/article/20-automatic-cellar-valuation"
        },
        {
          "name": "Baker Tilly — Accounting for the Cost of Making Wine",
          "url": "https://www.bakertilly.com/insights/accounting-for-the-cost-of-making-wine"
        },
        {
          "name": "RHN CPA — Winery Accounting 101: How To Properly Value Your Inventory For Long-Term Business Success",
          "url": "https://www.rhncpa.com/winery-accounting-101-how-to-properly-value-your-inventory-for-long-term-business-success/"
        }
      ]
    }
  ],
  "validation_question_responses": [
    {
      "question_id": "VQ-1",
      "question": "How many country clubs are there in the US?",
      "answer": "The strongest evidence in the provided materials says there are approximately 5,659 private clubs in the United States. A narrower, analytically useful subset is the 3,887 identifiable clubs with revenue above $1 million used in the CMAA/Club Benchmarking/NCA Economic Impact Report. The evidence refers to private clubs broadly, including golf, country, yacht, and racquet clubs, so it is not a pure country-club-only census.",
      "confidence": "High",
      "key_sources": [
        {
          "name": "CMAA — Private Club Industry Economic Impact Report (Executive Summary)",
          "url": "https://www.cmaa.org/media/01hnzs2i/economic-impact-report_executive-summary.pdf"
        },
        {
          "name": "Club Management Magazine — New Economic Impact Report Highlights the Significant Contribution...",
          "url": "https://www.club-mgmt.com/clubmanagement/2025january_february/MobilePagedArticle.action?articleId=2036669"
        }
      ],
      "gaps": "The materials do not isolate country clubs only from the broader private-club universe."
    },
    {
      "question_id": "VQ-2",
      "question": "How many country clubs are there in Northern California?",
      "answer": "I did not find a primary industry census for Northern California country clubs in the provided results. The only numeric source surfaced is GoPrivateGolf, which says the Bay Area has 50 private country clubs and separately lists 47 private golf courses; this is useful directional evidence but not a validated market count for all of Northern California. Sonoma/Napa evidence is anecdotal, with one travel source mentioning six golf clubs in the Sonoma and Napa Valleys.",
      "confidence": "Low",
      "key_sources": [
        {
          "name": "GoPrivateGolf — All 47 Private Golf Courses in The Bay Area, CA",
          "url": "https://www.goprivategolf.com/in/the-bay-area"
        },
        {
          "name": "Travel Classics — Vintage Greens: Golf in California's Wine Country",
          "url": "https://travelclassics.com/travel-classics-archive/vintage-greens-golf-in-californias-wine-country/"
        }
      ],
      "gaps": "No CMAA, NGCOA, or state/regional association count for Northern California was present."
    },
    {
      "question_id": "VQ-3",
      "question": "What is the average size of their wine cellars (bottle count and SKU count)?",
      "answer": "No average private-club wine-cellar size or SKU-count benchmark was found in the provided evidence. CMAA public materials shown here do not disclose cellar bottle counts, cellar-size bands, or SKU distributions, and the consumer wine-cellar design sources are not valid substitutes for observed club inventory data. The proposed 1,060 large-club segmentation therefore cannot be validated from this track's evidence.",
      "confidence": "Low",
      "key_sources": [
        {
          "name": "CMAA — Reports and White Papers",
          "url": "https://www.cmaa.org/club-operations/research/reports-and-white-papers/"
        },
        {
          "name": "CMAA — Private Club Industry Economic Impact Report (Executive Summary)",
          "url": "https://www.cmaa.org/media/01hnzs2i/economic-impact-report_executive-summary.pdf"
        }
      ],
      "gaps": "Need club-level F&B or wine program survey data showing bottle-count and SKU-count distributions."
    },
    {
      "question_id": "VQ-4",
      "question": "What is the range of membership numbers across these clubs?",
      "answer": "The provided materials do not contain a primary-source range distribution for club membership counts. The only numeric signal found is a secondary aggregator claiming an average of 450 members per club, but its methodology is not shown and it labels some statistics as directional. So this track cannot robustly answer membership range beyond saying the evidence is weak.",
      "confidence": "Low",
      "key_sources": [
        {
          "name": "WifiTalents — Private Club Industry: Data Reports 2026",
          "url": "https://wifitalents.com/private-club-industry-statistics/"
        },
        {
          "name": "CMAA — Surveys",
          "url": "https://www.cmaa.org/club-operations/research/surveys/"
        }
      ],
      "gaps": "Need CMAA or Club Benchmarking membership-demographic tables with quartiles or ranges by club type."
    }
  ],
  "decision_question_inputs": [
    {
      "question_id": "DQ-2",
      "relevant_evidence": "This track strongly supports the top-line market universe at 5,659 U.S. private clubs and the operational SAM base of 3,887 clubs with revenue above $1M. It does not validate the more specific assumptions that drive the revenue model—Northern California club count, large-cellar penetration, average cellar size, membership distribution, or the prevalence of six-figure mark-to-market inventory gains—so those inputs should be treated as hypotheses rather than confirmed market facts.",
      "evidence_weight": "moderate"
    }
  ],
  "evidence_gaps": [
    {
      "id": "G1",
      "description": "No primary-source count of private country clubs in Northern California was found.",
      "affected_questions": [
        "VQ-2",
        "DQ-2"
      ],
      "suggested_resolution": "Obtain NCGA, regional CMAA chapter, NGCOA state chapter, or state business registry data and reconcile Bay Area/Napa/Sonoma definitions."
    },
    {
      "id": "G2",
      "description": "No public CMAA/Club Benchmarking data on wine-cellar bottle-count tiers or SKU-count distributions was found.",
      "affected_questions": [
        "VQ-3",
        "DQ-2"
      ],
      "suggested_resolution": "Access paid/private CMAA or Club Benchmarking F&B operations survey tables, or run direct club interviews collecting cellar bottle and SKU counts."
    },
    {
      "id": "G3",
      "description": "Membership-size distributions across private clubs were not available in primary-source materials provided.",
      "affected_questions": [
        "VQ-4",
        "DQ-2"
      ],
      "suggested_resolution": "Source CMAA membership-demographic reports or Club Benchmarking member census data with medians, quartiles, and club-type breakouts."
    },
    {
      "id": "G4",
      "description": "No survey-based benchmark quantifies the gap between book-cost wine inventory and current market value in private clubs.",
      "affected_questions": [
        "DQ-2"
      ],
      "suggested_resolution": "Collect anonymized club cellar inventories with acquisition-cost data and compare against third-party market pricing to build an empirical benchmark."
    }
  ],
  "sources_consulted": 115,
  "queries_executed": 30
}
```

### CT2: Client Pain & Behavior

```json
{
  "track_id": "CT2",
  "track_name": "Client Pain & Behavior",
  "relevance": "High",
  "findings": [
    {
      "id": "F1",
      "title": "Inventory shrinkage and beverage variance are the clearest quantified operational pain points for clubs and adjacent hospitality operators",
      "feeds_questions": [
        "VQ-6",
        "DQ-3",
        "DQ-5"
      ],
      "evidence_weight": "moderate",
      "content": "Hard evidence from club-adjacent sources shows meaningful cost leakage: FoodTrak states private clubs lose approximately 5% of total F&B revenue to kitchen-related overuse, while RestaurantOwner cites the National Restaurant Association that 75% of inventory shrinkage is due to theft and estimates independent restaurants lose 3%–4% of sales to theft. A club-specific white paper shows beverage cost at 34.9% vs. 32.9% of F&B revenue for lower- vs. higher-performing clubs, indicating beverage control materially affects outcomes. Contradiction: shrinkage severity varies sharply across sources, with Sculpture Hospitality claiming bars can lose roughly 20% of inventory to free drinks, over-pouring, and theft, which is much higher than broader restaurant benchmarks.",
      "sources": [
        {
          "name": "FoodTrak — Reducing F&B Subsidies Through Procurement and Culinary Control",
          "url": "https://www.foodtrak.com/docs/ArticleBooklet-ReducingSubsidies201303.pdf"
        },
        {
          "name": "RestaurantOwner — 75 Percent of All Inventory Shrinkage Happens as a Result of Theft",
          "url": "https://www.restaurantowner.com/public/75-Percent-of-All-Inventory-Shrinkage-Happens-as-a-Result-of-Theft.cfm"
        },
        {
          "name": "Colonial Country Club — How F&B Impacts Club Financial Outcomes",
          "url": "https://www.colonialcc.com/Files/Library/2025FoodBeverageWhitepaperFINAL.pdf"
        },
        {
          "name": "Sculpture Hospitality — Is Liquor Inventory Control Costing You $50,000 Profit Per Year?",
          "url": "https://www.sculpturehospitality.com/blog/70-of-bar-losses-are-at-retail-value-inventory-control"
        }
      ]
    },
    {
      "id": "F2",
      "title": "Clubs and wine programs are explicitly marketed around real-time inventory visibility and live wine-list updates, implying persistent workflow pain from stale lists and disconnected stock data",
      "feeds_questions": [
        "VQ-6",
        "DQ-3",
        "DQ-5"
      ],
      "evidence_weight": "moderate",
      "content": "Multiple vendor sources aimed at clubs and hospitality position 'real-time updates' as the core benefit: bevSavvy says changes to digital wine lists reflect instantly, BinWise says digital wine menus stay aligned with inventory updates, and MyWineGuide markets club-specific inventory management with digital wine lockers and menu management. ForeUP also states clubs commonly rely on spreadsheets for physical inventories and frames outdated manual inventory workflows as a recurring frustration. This is soft evidence because it is vendor-claimed pain framing rather than third-party measurement, but it is consistent across several products targeting clubs.",
      "sources": [
        {
          "name": "bevSavvy — Digital Wine Lists for Golf and Country Clubs",
          "url": "https://bevsavvy.com/digital-wine-lists-for-golf-clubs/"
        },
        {
          "name": "BinWise — Simplify & Automate Updates with Wine List Menu Software",
          "url": "https://home.binwise.com/blog/wine-list-menu-management"
        },
        {
          "name": "My Wine Guide — Wine Software for Private Clubs",
          "url": "https://www.mywineguide.com/wine-software-for-clubs"
        },
        {
          "name": "foreUP — Top 3 Things Clubs Do Wrong with Food & Beverage Inventory",
          "url": "https://www.foreupgolf.com/top-3-things-clubs-do-wrong-with-food-beverage-inventory/"
        }
      ]
    },
    {
      "id": "F3",
      "title": "Private collectors' pain points center on spoilage risk, poor recordkeeping, bottle-location uncertainty, and missed optimal drinking windows",
      "feeds_questions": [
        "VQ-6",
        "DQ-3"
      ],
      "evidence_weight": "moderate",
      "content": "Collector-facing sources repeatedly cite direct management failures: improper temperature and humidity can cause premature aging or spoilage, poor recordkeeping during bottle movement increases loss and breakage risk, and missed drinking windows create financial loss from forgotten bottles. CollectorCellar.ai and Wine Cellar Specialists both frame inventory tracking and maturity/drinking guidance as core needs, while InVintory explicitly ties forgotten bottles and missed drink windows to direct financial losses. This is mostly soft/vendor evidence, but the same pain themes recur across independent collector software and storage content.",
      "sources": [
        {
          "name": "andte — Mastering Wine Cellar Management: Unveiling Challenges and Solutions",
          "url": "https://andten.com/blogs/dehumidifier-basics/mastering-wine-cellar-management-unveiling-challenges-and-solutions?srsltid=AfmBOoqUhRUMF1RIX_-FFuuVL510uDcDXaGqxoN5QnDlgt2bEz0-eEJ5"
        },
        {
          "name": "Appellation — A Complete Guide to Wine Inventory Management",
          "url": "https://appellationtransport.com/a-complete-guide-to-wine-inventory-management/"
        },
        {
          "name": "InVintory — The Real Cost of Mismanaging a Wine Cellar (and How Apps Prevent It)",
          "url": "https://invintory.com/blog/the-real-cost-of-mismanaging-a-wine-cellar-and-how-apps-prevent-it/"
        },
        {
          "name": "CollectorCellar.ai — Wine Cellar Management with AI-Powered Maturity & Drinking Guidance",
          "url": "https://www.collectorcellar.ai/"
        },
        {
          "name": "Wine Cellar Specialists — Proper and Effective Wine Cellar Management",
          "url": "https://www.winecellarspec.com/proper-and-effective-wine-cellar-management-for-your-growing-wine-collection/"
        }
      ]
    },
    {
      "id": "F4",
      "title": "Sommelier coverage across shifts is a plausible pain point, but hard club-specific evidence is thin",
      "feeds_questions": [
        "VQ-6",
        "DQ-3",
        "DQ-5"
      ],
      "evidence_weight": "thin",
      "content": "Salary evidence suggests expert wine labor is expensive: Vinology says Advanced Sommeliers can earn up to $100,000 and Master Sommeliers up to $190,000, while Club + Resort Chef reports median sommelier salary across certification levels at $62,000 in country clubs. CMSA describes sommelier roles broadly but does not quantify staffing shortages or club coverage gaps. The evidence supports costliness of expertise, not the prevalence of all-shift coverage problems, so the pain point is directionally supported but not strongly validated.",
      "sources": [
        {
          "name": "Vinology — What Does a Sommelier Do? Discover the Role & Salary",
          "url": "https://www.vinology.com/sommelier/?srsltid=AfmBOorZFiPhxEL-VM_K3pzL04W_wWNKjzGo3RdCmq_C6w1Eqz0FdaKY"
        },
        {
          "name": "Club + Resort Chef — How Much Do Sommeliers in a Country Club Make?",
          "url": "https://clubandresortchef.com/how-much-do-sommeliers-in-a-country-club-make/"
        },
        {
          "name": "Court of Master Sommeliers Americas — Careers for Sommeliers",
          "url": "https://www.mastersommeliers.org/about-sommeliers/careers-for-sommeliers/"
        }
      ]
    },
    {
      "id": "F5",
      "title": "The searched evidence does not establish a percentage of private-club members with multiple club memberships",
      "feeds_questions": [
        "VQ-5"
      ],
      "evidence_weight": "absent",
      "content": "No credible source in the result set provides a percentage for private-club members holding multiple club memberships. The closest items are NCGA's definition of a 'multi-member' and general commentary about club complexity, but neither quantifies prevalence among high-net-worth or country-club members.",
      "sources": [
        {
          "name": "NCGA — What is a multi-member?",
          "url": "https://support.ncga.org/knowledge/what-is-a-multi-member"
        },
        {
          "name": "HFTP — Private Members' Clubs 2.0 - Evolution Continues",
          "url": "https://www.hftp.org/news/4129008/private-members-clubs-20-evolution-continues"
        }
      ]
    },
    {
      "id": "F6",
      "title": "Federal and state evidence in the record does not support member-to-member wine consignment or exchange inside private clubs",
      "feeds_questions": [
        "VQ-7",
        "DQ-5"
      ],
      "evidence_weight": "moderate",
      "content": "Hard evidence shows the applicable legal pathways are tied to licensed and bonded actors, not ordinary club members: 27 CFR Part 11 governs consignment sales in trade-buyer contexts, TTB wine guidance addresses bonded premises transfers, New York SLA states package stores alone may sell wine for off-premises consumption and club licenses may not be used so members can buy bottle or case goods for off-premises use, and Texas TABC says private-club wine purchases must come from licensed package stores. California sources in the record describe club license privileges and storage rules but do not authorize member-to-member resale, and the only Florida item is a secondary law-firm explainer describing 'bottle clubs' as BYOB without resale. No sourced operating example was found of a private club legally running a member-to-member consignment marketplace in California, Florida, New York, or Texas.",
      "sources": [
        {
          "name": "eCFR — 27 CFR Part 11 -- Consignment Sales",
          "url": "https://www.ecfr.gov/current/title-27/chapter-I/subchapter-A/part-11"
        },
        {
          "name": "TTB — Wine FAQs",
          "url": "https://www.ttb.gov/regulated-commodities/beverage-alcohol/wine/wine-faqs"
        },
        {
          "name": "New York State Liquor Authority — Notice to Club Licensees",
          "url": "https://sla.ny.gov/system/files/documents/2018/08/notice-club-licensees-102314-2.pdf"
        },
        {
          "name": "Texas Alcoholic Beverage Commission — Private Club Permit (N) On-Premise Retailers",
          "url": "https://www.tabc.texas.gov/static/sites/default/files/2021-08/private-club-permit-n-on-premise-retailers-lc.pdf"
        },
        {
          "name": "California ABC — License Types",
          "url": "https://www.abc.ca.gov/licensing/license-types/"
        },
        {
          "name": "California ABC — Frequently Asked Questions",
          "url": "https://www.abc.ca.gov/licensing/frequently-asked-questions/"
        },
        {
          "name": "Glover Law Firm — Welcome to the Club",
          "url": "https://www.gloverlaw.net/articles/welcometotheclub"
        }
      ]
    },
    {
      "id": "F7",
      "title": "There is a contradiction between primary regulatory sources and secondary commentary on how broadly 'consignment sales' restrictions apply",
      "feeds_questions": [
        "VQ-7",
        "DQ-5"
      ],
      "evidence_weight": "thin",
      "content": "Primary federal sources in the record focus on bonded premises, trade practices, and trade-buyer relationships rather than private collector exchanges. Secondary legal commentary from Hinman & Carmichael says TTB Industry Circular 2022-1 implies payment terms over 30 days may invite scrutiny and frames 'no payment until sold' as the prohibited feature, but it also argues the circular creates confusion. This contradiction cannot be resolved from the current record and leaves federal-edge interpretation uncertain even though the state-level club resale pathway remains unsupported.",
      "sources": [
        {
          "name": "Hinman & Carmichael LLP — TTB and Consignment Sales – Is There a Disconnect Between Policy Development and Business Reality?",
          "url": "https://www.beveragelaw.com/booze-rules/ttb-and-consignment-sales-is-there-a-disconnect-between-policy-development-and-business-reality"
        },
        {
          "name": "eCFR — 27 CFR Part 11 -- Consignment Sales",
          "url": "https://www.ecfr.gov/current/title-27/chapter-I/subchapter-A/part-11"
        },
        {
          "name": "TTB — Wine FAQs",
          "url": "https://www.ttb.gov/regulated-commodities/beverage-alcohol/wine/wine-faqs"
        }
      ]
    },
    {
      "id": "F8",
      "title": "Academic evidence in this track weakly supports AI wine-pairing and recommendation features, but not club-specific ROI",
      "feeds_questions": [
        "DQ-3",
        "DQ-5"
      ],
      "evidence_weight": "thin",
      "content": "Semantic Scholar results show active academic work on AI-driven food and wine pairing and recommender systems, including a 2024 paper on AI in gastronomy and a 2023 wine recommender system paper. These sources support the plausibility of virtual sommelier and pairing-recommendation functionality, but they do not provide club-specific adoption, satisfaction, or revenue lift metrics. Academic evidence for recommendation features exists, while business-case evidence in private clubs is still thin.",
      "sources": [
        {
          "name": "Semantic Scholar — Exploring the Convergence of Artificial Intelligence in Gastronomy (2024)",
          "url": "https://www.semanticscholar.org/paper/27f6bb3609b7574a0bbea868cd43be4134eea120"
        },
        {
          "name": "Semantic Scholar — soMLier: a South African wine recommender system (2023)",
          "url": "https://www.semanticscholar.org/paper/9064d2318a577648e0691a3605a0b10ac71d3731"
        },
        {
          "name": "Semantic Scholar — Food and beverage flavour pairing: A critical review of the literature (2020)",
          "url": "https://www.semanticscholar.org/paper/fe839b3c646a83b8e000d138ab86b4081153571c"
        }
      ]
    }
  ],
  "validation_question_responses": [
    {
      "question_id": "VQ-5",
      "question": "What percentage of these members hold multiple club memberships?",
      "answer": "This track did not find a credible percentage for private-club members holding multiple memberships. The result set includes NCGA's definition of a 'multi-member' and general discussion of private-club complexity, but no quantified prevalence for country-club or HNW members.",
      "confidence": "Low",
      "key_sources": [
        {
          "name": "NCGA — What is a multi-member?",
          "url": "https://support.ncga.org/knowledge/what-is-a-multi-member"
        },
        {
          "name": "HFTP — Private Members' Clubs 2.0 - Evolution Continues",
          "url": "https://www.hftp.org/news/4129008/private-members-clubs-20-evolution-continues"
        }
      ],
      "gaps": "Needs a survey-based or industry-association source quantifying multi-club membership among private-club members or HNW households."
    },
    {
      "question_id": "VQ-6",
      "question": "What are the top 5 pain points of private clients with large cellars in terms of wine management and consumption?",
      "answer": "The best-supported pain points in this track are: inventory shrinkage/variance, lack of real-time inventory visibility, outdated wine lists or inventory mismatch, spoilage/storage-condition failures, and missed optimal drinking windows. Harder evidence is strongest for shrinkage, with FoodTrak estimating clubs lose about 5% of F&B revenue to kitchen-related overuse and RestaurantOwner citing 3%–4% of sales lost to theft in restaurants; the other pain points are primarily evidenced through repeated vendor positioning across club and collector software. Sommelier coverage and bottle-location traceability also appear as pain points, but the quantitative support is thinner.",
      "confidence": "Medium",
      "key_sources": [
        {
          "name": "FoodTrak — Reducing F&B Subsidies Through Procurement and Culinary Control",
          "url": "https://www.foodtrak.com/docs/ArticleBooklet-ReducingSubsidies201303.pdf"
        },
        {
          "name": "RestaurantOwner — 75 Percent of All Inventory Shrinkage Happens as a Result of Theft",
          "url": "https://www.restaurantowner.com/public/75-Percent-of-All-Inventory-Shrinkage-Happens-as-a-Result-of-Theft.cfm"
        },
        {
          "name": "bevSavvy — Digital Wine Lists for Golf and Country Clubs",
          "url": "https://bevsavvy.com/digital-wine-lists-for-golf-clubs/"
        },
        {
          "name": "BinWise — Simplify & Automate Updates with Wine List Menu Software",
          "url": "https://home.binwise.com/blog/wine-list-menu-management"
        },
        {
          "name": "InVintory — The Real Cost of Mismanaging a Wine Cellar (and How Apps Prevent It)",
          "url": "https://invintory.com/blog/the-real-cost-of-mismanaging-a-wine-cellar-and-how-apps-prevent-it/"
        }
      ],
      "gaps": "Missing independent, club-specific ranking of pain points with quantified dollar impact for wine programs specifically rather than general F&B."
    },
    {
      "question_id": "VQ-7",
      "question": "What is the consignment model for wine? Can a member of a golf club exchange bottles of their personal wine with other members?",
      "answer": "The evidence in this track does not support a lawful member-to-member wine consignment or exchange model inside private clubs. Primary sources show wine sale and transfer rules are tied to licensed or bonded actors; New York explicitly says clubs cannot be used for members to purchase bottle or case goods for off-premises use, and Texas requires club wine purchases through licensed package stores. California sources in the record do not affirmatively authorize member resale, and the only Florida evidence is a secondary BYOB 'bottle club' explainer that explicitly distinguishes possession/consumption from resale.",
      "confidence": "Medium",
      "key_sources": [
        {
          "name": "New York State Liquor Authority — Notice to Club Licensees",
          "url": "https://sla.ny.gov/system/files/documents/2018/08/notice-club-licensees-102314-2.pdf"
        },
        {
          "name": "Texas Alcoholic Beverage Commission — Private Club Permit (N) On-Premise Retailers",
          "url": "https://www.tabc.texas.gov/static/sites/default/files/2021-08/private-club-permit-n-on-premise-retailers-lc.pdf"
        },
        {
          "name": "eCFR — 27 CFR Part 11 -- Consignment Sales",
          "url": "https://www.ecfr.gov/current/title-27/chapter-I/subchapter-A/part-11"
        },
        {
          "name": "TTB — Wine FAQs",
          "url": "https://www.ttb.gov/regulated-commodities/beverage-alcohol/wine/wine-faqs"
        },
        {
          "name": "California ABC — License Types",
          "url": "https://www.abc.ca.gov/licensing/license-types/"
        }
      ],
      "gaps": "Florida primary authority is missing, and no searched source provides a state-approved club member-consignment operating model in CA, FL, NY, or TX."
    }
  ],
  "decision_question_inputs": [
    {
      "question_id": "DQ-3",
      "relevant_evidence": "This track supports features tied to the strongest recurring pains: shrinkage detection, real-time inventory visibility, live wine-list syncing, spoilage/drink-window alerts, and possibly virtual sommelier support for staff knowledge gaps. Evidence is strongest for shrinkage and workflow inefficiency; support for AI pairing and all-shift sommelier substitution exists but is thinner.",
      "evidence_weight": "moderate"
    },
    {
      "question_id": "DQ-5",
      "relevant_evidence": "The legal findings rule out member-to-member consignment/exchange as a near-term feature or revenue stream based on the current record. More promising additions are digital member lockers, pre-arrival ordering, drink-window guidance, and live inventory/menu synchronization, all of which appear repeatedly in club-targeted product positioning.",
      "evidence_weight": "moderate"
    }
  ],
  "evidence_gaps": [
    {
      "id": "G1",
      "description": "No credible percentage was found for how many private-club members hold multiple club memberships.",
      "affected_questions": [
        "VQ-5"
      ],
      "suggested_resolution": "Search CMAA, NGCOA, club benchmarking firms, wealth-management surveys, or commission primary survey work among club GMs and members."
    },
    {
      "id": "G2",
      "description": "Most pain-point evidence outside shrinkage is vendor-marketing evidence rather than independent club-specific measurement.",
      "affected_questions": [
        "VQ-6",
        "DQ-3",
        "DQ-5"
      ],
      "suggested_resolution": "Interview club F&B directors/cellar managers and obtain internal KPI benchmarks on beverage variance, list-update time, stockouts, and staff coverage."
    },
    {
      "id": "G3",
      "description": "Florida primary legal authority on bottle clubs, member-owned wine, and any exchange/resale pathway was not found in the result set.",
      "affected_questions": [
        "VQ-7",
        "DQ-5"
      ],
      "suggested_resolution": "Pull Florida DBPR/ABT primary statutes, rules, and advisories or obtain a Florida alcohol-law memo."
    },
    {
      "id": "G4",
      "description": "No concrete operating example was found of a licensed private club running a lawful member-to-member wine consignment or exchange program.",
      "affected_questions": [
        "VQ-7",
        "DQ-5"
      ],
      "suggested_resolution": "Targeted legal and industry case-study search across club operators, winery-club programs, and alcohol counsel publications."
    },
    {
      "id": "G5",
      "description": "Academic queries for wine inventory shrinkage and HNW cellar behavior failed due to rate limits, leaving peer-reviewed support sparse.",
      "affected_questions": [
        "VQ-6",
        "DQ-3"
      ],
      "suggested_resolution": "Re-run academic database searches in Semantic Scholar, Google Scholar, ABI/INFORM, and hospitality journals."
    }
  ],
  "sources_consulted": 120,
  "queries_executed": 31
}
```

### CT3: Pricing & Willingness-to-Pay

```json
{
  "track_id": "CT3",
  "track_name": "Pricing & Willingness-to-Pay",
  "relevance": "High",
  "findings": [
    {
      "id": "F1",
      "title": "Enterprise club-management platforms expose little to no public pricing; available evidence is quote-only, with only weak third-party estimates suggesting high annual spend",
      "feeds_questions": [
        "DQ-4",
        "DQ-6",
        "DQ-2"
      ],
      "evidence_weight": "moderate",
      "content": "Hard evidence shows Jonas and Northstar do not publish public prices in the supplied results: Jonas says 2,300+ clubs use its software, but provides no pricing, while Northstar pages and review listings describe F&B/POS capability without module prices. Soft evidence from CheckThat.ai claims Jonas may require $3,000–$8,000/year of middleware on top of base subscription and frames total costs as materially higher, but this is not vendor-authored and is not F&B-module-specific. The practical implication is that club ERP/F&B systems are likely enterprise-budget purchases, but this track cannot establish a verified annual dollar benchmark from primary sources.",
      "sources": [
        {
          "name": "Jonas Club Software — Helping Clubs Thrive",
          "url": "https://www.jonasclub.com/about/"
        },
        {
          "name": "Northstar — Best Club Management Software",
          "url": "https://www.globalnorthstar.com/club-management"
        },
        {
          "name": "Capterra — Jonas Club Management Software Pricing",
          "url": "https://www.capterra.com/p/124932/Jonas-Club-Management/"
        },
        {
          "name": "Capterra — Northstar Clubs & Associations Software",
          "url": "https://www.capterra.com/p/87109/Northstar-Club-Management/"
        },
        {
          "name": "CheckThat.ai — Clubessential Alternatives: Top 6 Competitors Compared",
          "url": "https://checkthat.ai/brands/clubessential/alternatives"
        }
      ]
    },
    {
      "id": "F2",
      "title": "Publicly visible beverage/wine software pricing in the result set mostly sits in the low hundreds per month, below the proposed $3,000–$6,000 annual bureau tier",
      "feeds_questions": [
        "DQ-4",
        "DQ-6",
        "DQ-2"
      ],
      "evidence_weight": "moderate",
      "content": "Hard evidence is limited but directionally useful: BinWise states that wine tracking apps average about $10 to $100 per month depending on enterprise size and scanner configuration, and a secondary roundup cites subscription pricing starting at $99/month for a BinWise-like use case. Uncorkd does not publish prices, but its own pricing page confirms quote-based pricing by number of iPads and inventory selections, while a Techli article states restaurants buy Uncorkd on a monthly subscription. This suggests mainstream inventory/menu SaaS comparables often anchor below or around ~$1,200 annually at entry level, so CellarEye's proposed $3,000–$6,000/year must be justified as a higher-touch analytics/data service rather than simple inventory software.",
      "sources": [
        {
          "name": "BinWise — Best Wine Tracking App and Wine Inventory App Options",
          "url": "https://home.binwise.com/blog/wine-tracking-app"
        },
        {
          "name": "WifiTalents — Top 10 Best Wine Inventory Software of 2026",
          "url": "https://wifitalents.com/best/wine-inventory-software/"
        },
        {
          "name": "Uncorkd — iPad Beverage Menu Pricing",
          "url": "https://www.uncorkd.biz/pricing/"
        },
        {
          "name": "Techli — Uncorkd Demystifies The Wine List, Without The Snobbery",
          "url": "https://techli.com/uncorkd-ipad-wine-list/4256/"
        }
      ]
    },
    {
      "id": "F3",
      "title": "Auction houses publicly offer free wine estimates, which weakens willingness-to-pay for a simple one-off valuation unless CellarEye is positioned differently",
      "feeds_questions": [
        "DQ-4",
        "DQ-2",
        "DQ-6"
      ],
      "evidence_weight": "strong",
      "content": "Hard evidence from primary sources shows Christie’s invites sellers to request a free online wine appraisal or valuation, and Sotheby’s offers a complimentary estimate request for wine consignments. Christie’s separately discloses buyer-side premium structure for wine purchases, indicating that major auction houses monetize through auction economics rather than upfront estimate fees. This directly cuts against a $500 standalone report if CellarEye is framed as a basic estimate, but leaves room if it is framed as independent, non-consignment, recurring market analytics with faster turnaround or portfolio reporting.",
      "sources": [
        {
          "name": "Christie's — Sell Wine Online",
          "url": "https://www.christies.com/en/selling-guide/wine-online"
        },
        {
          "name": "Christie's — Auction Estimates Overview",
          "url": "https://www.christies.com/selling-services/auction-services/auction-estimates/overview/"
        },
        {
          "name": "Christie's — Financial Information",
          "url": "https://www.christies.com/en/help/buying-guide-important-information/financial-information"
        },
        {
          "name": "Sotheby's — Consign Wine",
          "url": "https://www.sothebys.com/en/consign/wine"
        }
      ]
    },
    {
      "id": "F4",
      "title": "Wine data/API comparables are the closest analog to premium annual pricing, but public prices are absent in the result set",
      "feeds_questions": [
        "DQ-4",
        "DQ-6"
      ],
      "evidence_weight": "thin",
      "content": "Hard evidence confirms Liv-ex exposes API functionality for price data and automation use cases, and Vinous states the Vinous/Liv-ex API is available to Vinous Enterprise subscribers with Liv-ex Gold tier and above, with no additional charge for that API service to eligible users. However, no public enterprise price card for Liv-ex Gold, Liv-ex API access, or Wine-Searcher enterprise/API access appears in the supplied results. This means the best premium-priced benchmark category is visible conceptually but unpriced, leaving the top end of willingness-to-pay poorly bounded.",
      "sources": [
        {
          "name": "Liv-ex — Price Data API v2 PDF",
          "url": "https://bluehost-sites.s3-eu-west-1.amazonaws.com/Price_Data_API_v2.pdf"
        },
        {
          "name": "Liv-ex — Active Markets v3 PDF",
          "url": "https://files.liv-ex.com/Active_Markets_v3.pdf"
        },
        {
          "name": "Liv-ex — Automation Report PDF",
          "url": "https://files.liv-ex.com/Liv-ex_Automation_Report.pdf"
        },
        {
          "name": "Vinous — Vinous/Liv-ex API",
          "url": "https://vinous.com/statics/vinous-liv-ex-api"
        }
      ]
    },
    {
      "id": "F5",
      "title": "There is no credible public evidence in this track for private-club F&B software budget levels or direct club CFO willingness-to-pay",
      "feeds_questions": [
        "DQ-2",
        "DQ-4",
        "DQ-6"
      ],
      "evidence_weight": "absent",
      "content": "The supplied results include vendor marketing pages and one budgeting blog, but none provide audited or survey-based annual spend levels for private-club F&B technology or direct willingness-to-pay data from club CFOs. As a result, this track cannot validate whether clubs will pay $3,000–$6,000/year for automated wine valuation without primary interviews or proprietary budget data.",
      "sources": [
        {
          "name": "FinancialModelslab — Private Members Club Running Costs",
          "url": "https://financialmodelslab.com/blogs/operating-costs/private-members-club?srsltid=AfmBOorQ3U-XDrVWgF_1btbjc3Myq2G_GbuSGDuj1JOfzlJFssXoG0VM"
        },
        {
          "name": "Buyers Edge Platform — Club Management Software to Streamline Operations",
          "url": "https://buyersedgeplatform.com/club-management-software/"
        },
        {
          "name": "XLerant — BudgetPak for Private Clubs",
          "url": "https://xlerant.com/budgetpak-demo-for-private-clubs/"
        }
      ]
    },
    {
      "id": "F6",
      "title": "CellarEye's own public pricing pages are inconsistent, complicating external price anchoring and product positioning",
      "feeds_questions": [
        "DQ-4",
        "DQ-6"
      ],
      "evidence_weight": "moderate",
      "content": "The deep-dive evidence notes a contradiction in CellarEye's own publicly visible pricing: one page reportedly shows Premium at $129/year and Premium+ at $299/year, while another variant shows Starter+ at $39/year or $8.99/month and a custom Collector's Club tier. This is not a market comparable, but it matters because a proposed $500 report or $3,000–$6,000 subscription sits far above the company’s visible app-level pricing and may confuse buyers unless clearly separated as a bureau/enterprise analytics offering.",
      "sources": [
        {
          "name": "CellarEye dev site",
          "url": "https://www-dev.cellareye.com/"
        },
        {
          "name": "CellarEye live site variant",
          "url": "https://cellareye.com/?srsltid=AfmBOop_bAYqsQ1S1lUwYrukbPa6bNhP1mnJLIpcA-dY-atG7PLUr9vf"
        }
      ]
    }
  ],
  "validation_question_responses": [],
  "decision_question_inputs": [
    {
      "question_id": "DQ-2",
      "relevant_evidence": "This track helps bracket revenue potential by showing that enterprise club systems are likely high-ticket but publicly opaque, while standalone beverage tools often price in the low hundreds per month. It also shows auction houses give free estimates, so revenue upside for CellarEye depends on selling recurring, independent analytics rather than a simple one-off estimate.",
      "evidence_weight": "moderate"
    },
    {
      "question_id": "DQ-4",
      "relevant_evidence": "The strongest pricing signal is negative: auction houses offer free estimates, and mainstream beverage software appears materially cheaper than the proposed $3,000–$6,000 annual bureau. That means a viable CellarEye price architecture likely requires explicit separation from app/inventory pricing and positioning closer to enterprise analytics or data-service value, but public API/data benchmarks remain unpriced.",
      "evidence_weight": "moderate"
    },
    {
      "question_id": "DQ-6",
      "relevant_evidence": "This track indicates risk to cashflow-positive viability if CellarEye tries to charge $500 for what buyers perceive as a basic estimate, or $3,000–$6,000 for what buyers compare to low-cost inventory SaaS. It also leaves a major hole: no direct evidence of club budget authority or CFO willingness-to-pay was found, so unit-economics viability remains unvalidated from the demand side.",
      "evidence_weight": "moderate"
    }
  ],
  "evidence_gaps": [
    {
      "id": "G1",
      "description": "No primary-source pricing for Jonas, Clubessential, or Northstar F&B modules was found in the supplied results.",
      "affected_questions": [
        "DQ-4",
        "DQ-6",
        "DQ-2"
      ],
      "suggested_resolution": "Obtain vendor quotes from 3-5 clubs or run direct mystery-shop outreach requesting pricing for membership + F&B/POS modules at typical private-club scale."
    },
    {
      "id": "G2",
      "description": "No direct willingness-to-pay evidence from club CFOs, GMs, or beverage directors appears in this track.",
      "affected_questions": [
        "DQ-4",
        "DQ-6",
        "DQ-2"
      ],
      "suggested_resolution": "Run structured buyer interviews using a mock CellarEye valuation report and test reactions to $500 one-off and $3,000–$6,000 annual subscription price points."
    },
    {
      "id": "G3",
      "description": "Manual independent wine-appraisal fee schedules were not found; only free auction-house estimate pathways were evidenced.",
      "affected_questions": [
        "DQ-4",
        "DQ-2"
      ],
      "suggested_resolution": "Solicit 3-5 quotes from licensed independent wine appraisers for insurance, estate, or divorce-use valuations to benchmark non-consignment pricing and turnaround."
    },
    {
      "id": "G4",
      "description": "Public enterprise pricing for Liv-ex, Wine-Searcher, and similar wine data/API services is absent, limiting the upper-end benchmark for annual analytics subscriptions.",
      "affected_questions": [
        "DQ-4",
        "DQ-6"
      ],
      "suggested_resolution": "Request enterprise/API pricing sheets, minimum contracts, and lookup caps directly from Liv-ex and Wine-Searcher commercial teams."
    },
    {
      "id": "G5",
      "description": "The result set does not contain trustworthy survey or benchmark data on private-club F&B technology budgets.",
      "affected_questions": [
        "DQ-6",
        "DQ-2",
        "DQ-4"
      ],
      "suggested_resolution": "Use CMAA/HFTP/club benchmarking studies or interview club finance leaders to establish software budget bands and approval thresholds."
    }
  ],
  "sources_consulted": 75,
  "queries_executed": 17
}
```

### CT4: Adjacent Markets & Expansion Sequencing

```json
{
  "track_id": "CT4",
  "track_name": "Adjacent Markets & Expansion Sequencing",
  "relevance": "Medium",
  "findings": [
    {
      "id": "F1",
      "title": "Luxury hotels are a large adjacent account base, but the dataset does not support a count of how many have 2,500+ bottle wine programs",
      "feeds_questions": [
        "DQ-8",
        "DQ-2"
      ],
      "evidence_weight": "moderate",
      "content": "AAA states there are roughly 145 Five Diamond hotels and roughly 1,750 Four Diamond hotels, establishing a sizeable luxury-hotel universe for expansion. However, AAA property lists do not disclose cellar sizes, so this search set cannot answer the specific question of how many AAA Four/Five Diamond hotels maintain 2,500+ bottle programs. This is hard evidence on market denominator, but only absent/thin evidence on the 2,500+ bottle penetration rate.",
      "sources": [
        {
          "name": "AAA Newsroom — Four Hotels Earn Prestigious AAA Five Diamonds",
          "url": "https://newsroom.aaa.com/2025/12/four-hotels-earn-prestigious-aaa-five-diamonds/"
        },
        {
          "name": "AAA Newsroom — Five Diamond Hotels 2024 PDF",
          "url": "https://newsroom.aaa.com/wp-content/uploads/2024/04/AAA-Five-Diamond-Hotels-2024-2.pdf"
        },
        {
          "name": "AAA Newsroom — Four Diamond Hotels 2025 PDF",
          "url": "https://newsroom.aaa.com/wp-content/uploads/2024/04/AAA-Four-Diamond-Hotels-2025-1.pdf"
        }
      ]
    },
    {
      "id": "F2",
      "title": "Some luxury hotels clearly operate wine programs far above the 2,500-bottle threshold",
      "feeds_questions": [
        "DQ-8",
        "DQ-2"
      ],
      "evidence_weight": "moderate",
      "content": "The search set includes named hospitality examples with very large inventories: The Little Nell states it has 20,000 bottles of wine, and Alfred case studies cite Luce Intercontinental managing an 8,000-bottle inventory. Alfred also documents deployments at Château Frontenac and Post Hotel & Spa, showing this category uses specialized wine-inventory tooling in hotel settings. This is hard evidence that the hotel segment contains accounts materially large enough for CellarEye's workflow, even though prevalence is unquantified.",
      "sources": [
        {
          "name": "The Little Nell — Learn",
          "url": "https://www.thelittlenell.com/learn"
        },
        {
          "name": "Alfred Technologies — Business Case Luce Intercontinental",
          "url": "https://www.alfredtechnologies.com/case-studies/luce-intercontinental"
        },
        {
          "name": "Alfred Technologies — Château Frontenac, Quebec City",
          "url": "https://www.alfredtechnologies.com/case-studies/chateau-frontenac"
        },
        {
          "name": "Alfred Technologies — Business Case Post Hotel & Spa",
          "url": "https://www.alfredtechnologies.com/case-studies/post-hotel-spa"
        }
      ]
    },
    {
      "id": "F3",
      "title": "Hotel systems appear more integration-friendly than club ERPs at the platform level",
      "feeds_questions": [
        "DQ-8"
      ],
      "evidence_weight": "strong",
      "content": "Oracle Hospitality publicly documents PMS/POS integration partnerships and APIs for OPERA Cloud, while Lightspeed documents a live Oracle OPERA integration supporting room charges, partial payments, and real-time posting. This is hard evidence that luxury hotel environments often run on platforms with published integration paths, supporting the thesis that hotels may be technically easier to enter than private clubs with tighter ERP lock-in. The evidence is platform-level, not hotel-by-hotel account mapping.",
      "sources": [
        {
          "name": "Oracle — Hospitality PMS and POS Integrations",
          "url": "https://www.oracle.com/hospitality/pms-pos-integration-partners/"
        },
        {
          "name": "Oracle — Hotel PMS and Hotel POS Solutions",
          "url": "https://www.oracle.com/hospitality/hotel-property-management/"
        },
        {
          "name": "Lightspeed — Oracle Hospitality OPERA Cloud",
          "url": "https://www.lightspeedhq.com/integrations/oracle-hospitality/"
        },
        {
          "name": "Lightspeed Support — Setting up the Oracle OPERA integration",
          "url": "https://k-series-support.lightspeedhq.com/hc/en-us/articles/23505854589467-Setting-up-the-Oracle-OPERA-integration"
        },
        {
          "name": "PR Newswire — Lightspeed Restaurant Achieves Oracle Validated Integration with Oracle Hospitality OPERA Cloud Services",
          "url": "https://www.prnewswire.com/news-releases/lightspeed-restaurant-achieves-oracle-validated-integration-with-oracle-hospitality-opera-cloud-services-645656243.html"
        }
      ]
    },
    {
      "id": "F4",
      "title": "There is direct competitive precedent for wine-inventory software in hotels, but commercial traction is not disclosed",
      "feeds_questions": [
        "DQ-8",
        "DQ-2"
      ],
      "evidence_weight": "moderate",
      "content": "Alfred Technologies markets explicitly to restaurants, bars, hotels, and private wine collectors, and announced U.S. expansion in 2022. Its hotel case studies claim operational improvements at Château Frontenac and Post Hotel & Spa, and an 8,000-bottle inventory managed at Luce Intercontinental, but none of the sources provide customer counts, ACV, churn, or deployment scale. This is hard evidence that hotels are a real software category and that a competitor already straddles B2B hospitality and private collectors, but only thin evidence that institutional wins reliably convert into HNW consumer acquisition.",
      "sources": [
        {
          "name": "PR Newswire — ALFRED TECHNOLOGIES' WINE & SPIRITS INVENTORY AND MANAGEMENT SOLUTIONS ARE NOW AVAILABLE IN THE U.S.",
          "url": "https://www.prnewswire.com/news-releases/alfred-technologies-wine--spirits-inventory-and-management-solutions-are-now-available-in-the-us-301453620.html"
        },
        {
          "name": "Alfred Technologies — Customer Success Stories",
          "url": "https://www.alfredtechnologies.com/customer-success-stories"
        },
        {
          "name": "Alfred Technologies — Château Frontenac, Quebec City",
          "url": "https://www.alfredtechnologies.com/case-studies/chateau-frontenac"
        },
        {
          "name": "Alfred Technologies — Business Case Post Hotel & Spa",
          "url": "https://www.alfredtechnologies.com/case-studies/post-hotel-spa"
        }
      ]
    },
    {
      "id": "F5",
      "title": "Commercial wine-storage market size is only weakly bounded because third-party estimates conflict materially",
      "feeds_questions": [
        "DQ-2",
        "DQ-8"
      ],
      "evidence_weight": "thin",
      "content": "The result set contains conflicting market-report estimates across adjacent categories. DataIntelo sizes the global wine storage service market at USD 3.24B in 2024, while Global Market Insights sizes the U.S. wine cellar market at USD 465.3M in 2025; these are not directly comparable because one appears to measure services and the other equipment/systems. This is soft evidence only and is insufficient to size a U.S. commercial wine-storage-facility expansion wedge with confidence.",
      "sources": [
        {
          "name": "DataIntelo — Wine Storage Service Market Research Report 2033",
          "url": "https://dataintelo.com/report/wine-storage-service-market"
        },
        {
          "name": "Global Market Insights — Wine Cellar Market Size & Share, Growth Analysis 2026-2035",
          "url": "https://www.gminsights.com/industry-analysis/wine-cellar-market"
        },
        {
          "name": "Market Intelo — Fine Wine Storage Services Market Research Report 2033",
          "url": "https://marketintelo.com/report/fine-wine-storage-services-market"
        }
      ]
    },
    {
      "id": "F6",
      "title": "No strong precedent was found for a hospitality SaaS vendor using institutional deployments as a repeatable funnel into HNW private-cellar customers",
      "feeds_questions": [
        "DQ-8"
      ],
      "evidence_weight": "absent",
      "content": "The provided results do not contain a documented case study showing a SaaS company that won private clubs or hotels first and then converted those institutional relationships into a meaningful HNW individual-customer channel. Alfred is the closest adjacent example because it serves both hospitality and private collectors, but the sources do not show the directionality, economics, or conversion rates of that motion. This leaves the hotel-to-HNW funnel thesis unvalidated.",
      "sources": [
        {
          "name": "PR Newswire — ALFRED TECHNOLOGIES' WINE & SPIRITS INVENTORY AND MANAGEMENT SOLUTIONS ARE NOW AVAILABLE IN THE U.S.",
          "url": "https://www.prnewswire.com/news-releases/alfred-technologies-wine--spirits-inventory-and-management-solutions-are-now-available-in-the-us-301453620.html"
        },
        {
          "name": "Alfred Technologies — Customer Success Stories",
          "url": "https://www.alfredtechnologies.com/customer-success-stories"
        },
        {
          "name": "Inside Self-Storage — Is Your Self-Storage Market Ripe for Wine Storage?",
          "url": "https://www.insideselfstorage.com/wine-storage/is-your-self-storage-market-ripe-for-wine-storage-here-s-how-to-successfully-design-build-and-operate-it"
        }
      ]
    },
    {
      "id": "F7",
      "title": "The HNW private-cellar opportunity is only supported by broad residential wine-cellar market estimates, not by a collector-specific TAM",
      "feeds_questions": [
        "DQ-2",
        "DQ-8"
      ],
      "evidence_weight": "thin",
      "content": "The available sources estimate broad U.S. wine-cellar or wine-cellars-and-coolers markets, such as USD 465.3M U.S. market value in 2025 from Global Market Insights and USD 0.9B U.S. market size in 2024 from a LinkedIn-posted report summary, but neither isolates HNW collectors or institutional-to-consumer acquisition dynamics. This is soft and partially contradictory evidence, useful only as directional confirmation that a residential storage category exists. It does not establish a credible HNW collector SAM for sequencing decisions.",
      "sources": [
        {
          "name": "Global Market Insights — Wine Cellar Market Size & Share, Growth Analysis 2026-2035",
          "url": "https://www.gminsights.com/industry-analysis/wine-cellar-market"
        },
        {
          "name": "LinkedIn — United States Wine Cellars Market Size, Competitive Risks & Growth",
          "url": "https://www.linkedin.com/pulse/united-states-wine-cellars-market-size-competitive-1ryee"
        },
        {
          "name": "Cognitive Market Research — Wine Cellars Market Report",
          "url": "https://www.cognitivemarketresearch.com/wine-cellars-market-report"
        }
      ]
    }
  ],
  "validation_question_responses": [],
  "decision_question_inputs": [
    {
      "question_id": "DQ-8",
      "relevant_evidence": "This track supports club → hotel as a plausible next step. There is a large AAA luxury-hotel universe, direct evidence that some hotels run 8,000- to 20,000-bottle programs, and strong platform-level evidence that Oracle OPERA and Lightspeed environments are integration-friendly. But the hotel → HNW private-cellar funnel is not validated: no source shows repeatable institutional-to-consumer conversion, and commercial wine-storage / HNW TAM evidence is weak and contradictory.",
      "evidence_weight": "moderate"
    },
    {
      "question_id": "DQ-2",
      "relevant_evidence": "This track provides only directional market-opportunity input, not a clean TAM. The hotel denominator is tangible at roughly 145 AAA Five Diamond and 1,750 AAA Four Diamond hotels, and some named accounts have very large wine programs; however, the share with 2,500+ bottles is unknown. Commercial storage and HNW private-cellar market estimates conflict materially by category definition, so revenue-pool sizing from this track should be treated as thin.",
      "evidence_weight": "thin"
    }
  ],
  "evidence_gaps": [
    {
      "id": "G1",
      "description": "No verified count of AAA Four/Five Diamond hotels with 2,500+ bottle wine programs.",
      "affected_questions": [
        "DQ-8",
        "DQ-2"
      ],
      "suggested_resolution": "Build a bottom-up list of AAA Four/Five Diamond hotels and collect wine-program size from hotel websites, wine spectator awards, sommeliers, and direct outreach."
    },
    {
      "id": "G2",
      "description": "No hotel-by-hotel mapping of PMS/POS stacks for target luxury properties.",
      "affected_questions": [
        "DQ-8"
      ],
      "suggested_resolution": "Profile the top 50 target hotels and verify OPERA, Lightspeed, Simphony, or alternative stack usage through job postings, vendor references, and discovery calls."
    },
    {
      "id": "G3",
      "description": "No documented precedent showing hospitality SaaS deployments convert into HNW private-cellar customers at measurable rates.",
      "affected_questions": [
        "DQ-8"
      ],
      "suggested_resolution": "Interview vendors serving both hospitality and collectors, especially Alfred or comparable firms, and request customer-origin data, channel split, and conversion stories."
    },
    {
      "id": "G4",
      "description": "Commercial wine-storage market estimates are inconsistent across services, equipment, and logistics categories.",
      "affected_questions": [
        "DQ-2",
        "DQ-8"
      ],
      "suggested_resolution": "Obtain a primary-industry or analyst source specific to U.S. commercial wine-storage facilities and separate facility services from cellar hardware/equipment."
    },
    {
      "id": "G5",
      "description": "No collector-specific U.S. HNW private-cellar market size was found.",
      "affected_questions": [
        "DQ-2",
        "DQ-8"
      ],
      "suggested_resolution": "Use wealth-manager, insurer, auction-house, and specialty storage data to estimate the number of U.S. collectors above threshold cellar sizes and asset values."
    }
  ],
  "sources_consulted": 76,
  "queries_executed": 18
}
```

### CT5: Ops & Unit Economics

```json
{
  "track_id": "CT5",
  "track_name": "Ops & Unit Economics",
  "relevance": "High",
  "findings": [
    {
      "id": "F1",
      "title": "A $345K Year-1 revenue plan fits under a $1M budget but is unlikely to be cash-flow positive with a conventional 4-5 person team",
      "feeds_questions": [
        "DQ-6"
      ],
      "evidence_weight": "moderate",
      "content": "The modeled Year-1 plan produces $345,000 total revenue from 50 club subscriptions at $4,500 ($225,000 recurring) plus 10 hardware conversions at $12,000 ($120,000 one-time). Using the deep-dive staffing model, loaded payroll alone is about $528,000-$596,000 for a lean team (2 engineers, 1 wine-domain lead, 1 sales lead) and $684,000-$752,000 for a 3-engineer team; adding API, infrastructure, marketing, and G&A yields total opex of about $710,000 in a lean case and about $930,000 in a fuller build. That implies an operating loss of roughly $365,000 to $585,000 even though the company remains within the $1M annual budget ceiling. ARR treatment is also disputed internally: standard SaaS definitions exclude one-time setup/hardware revenue, so the modeled recurring ARR is $225,000 rather than $345,000.",
      "sources": [
        {
          "name": "Software Equity Group — ARR: Annual Recurring Revenue",
          "url": "https://softwareequity.com/blog/arr"
        },
        {
          "name": "Breaking Into Wall Street — SaaS Metrics",
          "url": "https://breakingintowallstreet.com/kb/venture-capital/saas-metrics/"
        },
        {
          "name": "Scale With CFO — SaaS Financial Model Template",
          "url": "https://www.scalewithcfo.com/post/saas-financial-model-template"
        },
        {
          "name": "The SaaS CFO — How to Calculate Your Cash Burn Rate",
          "url": "https://www.thesaascfo.com/how-to-calculate-your-cash-burn-rate/"
        }
      ]
    },
    {
      "id": "F2",
      "title": "Public evidence confirms wine pricing APIs exist, but not their commercial pricing; lookup-cost scenarios remain assumed rather than market-verified",
      "feeds_questions": [
        "DQ-6"
      ],
      "evidence_weight": "thin",
      "content": "Liv-ex publicly documents multiple APIs and Wine-Searcher publicly markets a trade API for pricing and wine knowledge, which supports the technical feasibility of a valuation product. However, no public source in this track gives enterprise price-per-lookup terms for either provider, so the required $0.01/$0.05/$0.10 lookup assumptions are scenario inputs rather than confirmed vendor quotes. Under the deep-dive model, if 50 customers each trigger 500 lookups/month, annual API cost would be about $3,000 at $0.01, $15,000 at $0.05, and $30,000 at $0.10 per lookup.",
      "sources": [
        {
          "name": "Liv-ex — API Library",
          "url": "https://www.liv-ex.com/api-library/"
        },
        {
          "name": "Liv-ex — Price Data API v2",
          "url": "https://bluehost-sites.s3-eu-west-1.amazonaws.com/Price_Data_API_v2.pdf"
        },
        {
          "name": "Wine-Searcher — Automatically Check Prices & Wine Knowledge API",
          "url": "https://www.wine-searcher.com/trade/api?srsltid=AfmBOopKMSMVmLG-ePHbMK9H3R9MzTvI8I6EsyLqqp0-xS7Rm_J5TyDX"
        },
        {
          "name": "Vinous — Vinous/Liv-ex API Service",
          "url": "https://vinous.com/statics/vinous-liv-ex-api"
        }
      ]
    },
    {
      "id": "F3",
      "title": "Unit economics can preserve software-like gross margin if API and hosting costs stay moderate, but operating leverage is overwhelmed by payroll at the proposed revenue level",
      "feeds_questions": [
        "DQ-6"
      ],
      "evidence_weight": "moderate",
      "content": "Benchmark sources cited in the track state healthy SaaS gross margins are commonly around 70%-85%, and healthy LTV:CAC is typically at least 3:1. The modeled valuation business appears capable of software-like gross margins because direct delivery costs are modest relative to revenue if API costs stay near the lower scenarios, but this does not solve cash flow because payroll dominates the P&L at only $225,000 recurring revenue. This means contribution economics may be viable per customer while the overall Year-1 operating model remains negative.",
      "sources": [
        {
          "name": "Scale With CFO — SaaS Financial Model Template",
          "url": "https://www.scalewithcfo.com/post/saas-financial-model-template"
        },
        {
          "name": "Lucid/Maxio benchmark article — Unit economics templates for SaaS",
          "url": "https://www.lucid.now/blog/unit-economics-templates-for-saas-key-metrics-to-track/"
        },
        {
          "name": "Churnkey — Understanding Unit Economics in SaaS",
          "url": "https://churnkey.co/blog/understanding-unit-economics-in-saas/"
        },
        {
          "name": "GSquared CFO — SaaS Unit Economics",
          "url": "https://www.gsquaredcfo.com/blog/saas-unit-economics"
        }
      ]
    },
    {
      "id": "F4",
      "title": "The most defensible Year-1 critical hires are wine-domain lead, full-stack engineer, sales/partnerships lead, and an ops/customer-success operator",
      "feeds_questions": [
        "DQ-7"
      ],
      "evidence_weight": "moderate",
      "content": "The hiring deep dive supports 4 core Year-1 roles: a wine-domain lead to supply cellar credibility and club operating know-how, a full-stack engineer to build the MVP, a sales/partnerships lead with club or hospitality relationships, and an ops/customer-success hybrid unless a founder fills that seat. Compensation evidence is mixed but directionally consistent: wine-domain lead loaded cost is modeled at about $108,000-$169,000; a full-stack engineer at about $168,000-$247,000; sales/partnerships lead loaded base at about $108,000-$169,000 with OTE of roughly $130,000-$180,000+; and ops/customer-success at about $84,000-$143,000 loaded. The track explicitly notes that a former private-club F&B director may be a stronger fit than a floor sommelier because the need is commercial operations and buyer trust, not just wine service.",
      "sources": [
        {
          "name": "Club + Resort Chef — How Much Do Sommeliers in a Country Club Make?",
          "url": "https://clubandresortchef.com/how-much-do-sommeliers-in-a-country-club-make/"
        },
        {
          "name": "7shifts — Sommelier Salary",
          "url": "https://www.7shifts.com/blog/sommelier-salary/"
        },
        {
          "name": "ZipRecruiter — Food & Beverage Director Salary",
          "url": "https://www.ziprecruiter.com/Salaries/Food-Beverage-Director-Salary"
        },
        {
          "name": "PayScale — Food and Beverage Director Salary",
          "url": "https://www.payscale.com/research/US/Job=Food_and_Beverage_Director/Salary"
        },
        {
          "name": "Coursera — Full-Stack Developer Salary",
          "url": "https://www.coursera.org/articles/full-stack-developer-salary"
        },
        {
          "name": "Top Startups — Startup Salary & Equity Database",
          "url": "https://topstartups.io/startup-salary-equity-database/?title=Founding%20full%20stack%20engineer"
        }
      ]
    },
    {
      "id": "F5",
      "title": "Wine-domain compensation evidence is contradictory across sources, so loaded-cost planning should use a range rather than a point estimate",
      "feeds_questions": [
        "DQ-7",
        "DQ-6"
      ],
      "evidence_weight": "moderate",
      "content": "Sommelier and beverage-lead compensation data conflicts across sources. SalaryExpert reports average U.S. sommelier gross salary at $46,773, Indeed reports about $20.04/hour, and BinWise reports median sommelier salary across certification levels at $62,000 with Certified Sommeliers around $60,000-$70,000; separate director-level sources place wine/beverage leadership materially higher, including F&B director averages near $82,813-$95,735 and wine & beverage director ranges of $85,000-$125,000. The contradiction matters operationally because the startup likely needs a manager-operator profile closer to beverage director compensation than entry-level sommelier compensation.",
      "sources": [
        {
          "name": "SalaryExpert — Sommelier Salary in the United States",
          "url": "https://www.salaryexpert.com/salary/job/sommelier/united-states"
        },
        {
          "name": "Indeed — Sommelier salary in United States",
          "url": "https://www.indeed.com/career/sommelier/salaries"
        },
        {
          "name": "BinWise — Wine Sommelier Salary",
          "url": "https://home.binwise.com/blog/sommelier-salary"
        },
        {
          "name": "ZipRecruiter — Food & Beverage Director Salary",
          "url": "https://www.ziprecruiter.com/Salaries/Food-Beverage-Director-Salary"
        },
        {
          "name": "PayScale — Food and Beverage Director Salary",
          "url": "https://www.payscale.com/research/US/Job=Food_and_Beverage_Director/Salary"
        }
      ]
    },
    {
      "id": "F6",
      "title": "Fractional legal counsel is well supported for Year 1; fractional data engineering is plausible but weakly evidenced",
      "feeds_questions": [
        "DQ-7",
        "DQ-6"
      ],
      "evidence_weight": "moderate",
      "content": "The legal side has direct support: several startup-law sources describe fractional general counsel as appropriate when a company needs recurring contract, compliance, IP, and policy help without full-time overhead, and one source estimates first-year startup legal spend around $15,000-$20,000 excluding financing. By contrast, support for a fractional data engineer is indirect; the track only found general startup evidence that a strong full-stack engineer can cover broad early product needs, not role-specific proof that data engineering can always stay fractional. So Year 1 fractional legal is evidence-backed, while fractional data engineering is a pragmatic but weakly sourced assumption.",
      "sources": [
        {
          "name": "BizTech Lawyers — What Is a Fractional GC and Why Are More Startups Hiring One",
          "url": "https://www.biztechlawyers.com/legal-articles/what-is-a-fractional-gc-and-why-are-more-startups-hiring-one"
        },
        {
          "name": "Outside GC — Fractional General Counsel: A Right-Sized Solution for Startups and SMEs",
          "url": "https://outsidegc.com/blog/fractional-general-counsel-a-right-sized-solution-for-startups-and-smes/"
        },
        {
          "name": "Velawood — Planning for Your First Year of Legal Fees",
          "url": "https://velawood.com/startup-cents-planning-for-your-first-year-of-legal-fees/"
        },
        {
          "name": "Scale Firm — What Early-Stage Startups Need From Legal Counsel",
          "url": "https://scalefirm.com/post/what-early-stage-startups-need-from-legal-counsel-and-what-they-dont/"
        },
        {
          "name": "Pangea — Startup Full-Stack Dev",
          "url": "https://pangea.app/blog/article/startup-full-stack-dev"
        }
      ]
    },
    {
      "id": "F7",
      "title": "This track found no hard evidence for club-specific CAC or sales-cycle benchmarks, so customer acquisition economics remain unvalidated",
      "feeds_questions": [
        "DQ-6",
        "DQ-7"
      ],
      "evidence_weight": "absent",
      "content": "The search results only produced generic SaaS CAC formulas and benchmark commentary, not private-club or wine-tech CAC, close-rate, or sales-cycle data. As a result, this track cannot quantify customer acquisition cost, CAC payback, or the productivity requirement for the proposed sales hire using sector-specific evidence.",
      "sources": [
        {
          "name": "Lighter Capital — How to Calculate Customer Acquisition Cost for SaaS",
          "url": "https://www.lightercapital.com/blog/how-to-calculate-customer-acquisition-cost-cac"
        },
        {
          "name": "Maxio — Customer Acquisition Cost (CAC)",
          "url": "https://www.maxio.com/saaspedia/cac-customer-acquisition-cost"
        },
        {
          "name": "NetSuite — Customer Acquisition Cost",
          "url": "https://www.netsuite.com/portal/resource/articles/erp/customer-acqusition-cost.shtml"
        }
      ]
    }
  ],
  "validation_question_responses": [],
  "decision_question_inputs": [
    {
      "question_id": "DQ-6",
      "relevant_evidence": "The modeled business can operate within a $1M annual budget, but the evidence in this track indicates it is unlikely to be cash-flow positive at $345,000 total Year-1 revenue if staffed with 2-3 engineers, a wine-domain lead, and a sales lead. The strongest support is the modeled P&L showing roughly $710,000-$930,000 of annual opex versus $345,000 revenue, plus unresolved API pricing and absent club-specific CAC data.",
      "evidence_weight": "moderate"
    },
    {
      "question_id": "DQ-7",
      "relevant_evidence": "This track supports a 4-role Year-1 build: wine-domain lead, full-stack engineer, sales/partnerships lead, and ops/customer-success unless a founder covers it. Fractional legal counsel is well supported for Year 1; fractional data engineering may work but lacks strong direct evidence.",
      "evidence_weight": "moderate"
    }
  ],
  "evidence_gaps": [
    {
      "id": "G1",
      "description": "No public enterprise pricing was found for Liv-ex or Wine-Searcher APIs, so API cost scenarios are assumptions rather than verified commercial terms.",
      "affected_questions": [
        "DQ-6"
      ],
      "suggested_resolution": "Request enterprise quotes, usage caps, and minimums directly from Liv-ex and Wine-Searcher and re-run the P&L under quoted pricing."
    },
    {
      "id": "G2",
      "description": "No club-specific CAC, conversion, or sales-cycle evidence was found, preventing a defensible acquisition-cost model for the Year-1 plan.",
      "affected_questions": [
        "DQ-6",
        "DQ-7"
      ],
      "suggested_resolution": "Collect comparable private-club or hospitality-enterprise sales benchmarks through direct interviews, CRM data from similar vendors, or pilot funnel testing."
    },
    {
      "id": "G3",
      "description": "Compensation for sommelier versus beverage-director profiles is inconsistent across sources, and the exact role definition materially changes loaded-cost planning.",
      "affected_questions": [
        "DQ-6",
        "DQ-7"
      ],
      "suggested_resolution": "Define the actual responsibilities of the wine-domain hire, then price against current job postings for club F&B directors, wine directors, and certified sommeliers in target geographies."
    },
    {
      "id": "G4",
      "description": "The ops/customer-success role is recommended by the deep dive, but this track did not find hard market compensation data specific to the proposed scope.",
      "affected_questions": [
        "DQ-7",
        "DQ-6"
      ],
      "suggested_resolution": "Benchmark customer success and implementation-manager salaries in hospitality SaaS and decide whether a founder can absorb the function in Year 1."
    }
  ],
  "sources_consulted": 115,
  "queries_executed": 27
}
```

### CT6: Tech & Competitor Landscape

```json
{
  "track_id": "CT6",
  "track_name": "Tech & Competitor Landscape",
  "relevance": "High",
  "findings": [
    {
      "id": "F1",
      "title": "BinWise has strong evidence for beverage inventory management, reporting, and broad POS integrations, but not for cellar-level valuation or sommelier AI",
      "feeds_questions": [
        "DQ-3",
        "DQ-5",
        "DQ-2"
      ],
      "evidence_weight": "strong",
      "content": "BinWise explicitly markets beverage inventory management for restaurants, country clubs, bars, and hotels, including purchasing, invoicing, perpetual inventory, variance reporting, and integrations with 'over 50 different point of sale systems.' Hard evidence also shows automated reporting features such as inventory reports and variance reports that help identify depletion and potential shrinkage. There is no hard evidence in the supplied results that BinWise offers automated cellar-level mark-to-market valuation, club-specific integrations with Jonas/Clubessential/Oracle OPERA, or wine pairing / virtual sommelier functionality.",
      "sources": [
        {
          "name": "BinWise — Complete Bar Inventory Software System",
          "url": "https://home.binwise.com/"
        },
        {
          "name": "BinWise — BinWise Pro",
          "url": "https://home.binwise.com/binwise-pro"
        },
        {
          "name": "BinWise — Simplify & Automate Updates with Wine List Menu Software",
          "url": "https://home.binwise.com/blog/wine-list-menu-management"
        }
      ]
    },
    {
      "id": "F2",
      "title": "BinWise shows evidence of shrinkage/variance controls, but RFID and valuation claims are weaker and partly blog-based",
      "feeds_questions": [
        "DQ-3",
        "DQ-5"
      ],
      "evidence_weight": "moderate",
      "content": "BinWise product and blog materials provide hard evidence for variance reporting and inventory controls intended to surface losses, with the product page stating users can use variance reports to account for what they 'sell, break, or otherwise deplete.' However, claims around RFID-enabled tracking and wine value calculators come from blog content rather than core product documentation, so evidence for physical bottle-level tracking and formal valuation workflows is weaker. This is a material distinction for CellarEye's differentiation around physical tracking plus valuation.",
      "sources": [
        {
          "name": "BinWise — BinWise Pro",
          "url": "https://home.binwise.com/binwise-pro"
        },
        {
          "name": "BinWise — 10 Benefits of Cloud Based Inventory Software for Bars",
          "url": "https://home.binwise.com/blog/cloud-based-inventory-software"
        }
      ]
    },
    {
      "id": "F3",
      "title": "Uncorkd evidence supports digital wine list and beverage menu management, not automated valuation or operational inventory controls",
      "feeds_questions": [
        "DQ-3",
        "DQ-5"
      ],
      "evidence_weight": "moderate",
      "content": "Uncorkd's supplied results consistently describe an iPad wine list and digital beverage menu platform with analytics on menu behavior and an online management platform for updating lists. The evidence supports front-of-house menu merchandising and beverage management workflows across restaurants, country clubs, and multi-location hospitality venues. There is no hard evidence here for cellar inventory reconciliation, mark-to-market valuation, shrinkage detection, or named integrations with Jonas, Clubessential, or Oracle OPERA.",
      "sources": [
        {
          "name": "Uncorkd — The Benefits of Digital Menus and iPad Wine Lists for Restaurants",
          "url": "https://www.uncorkd.biz/blog/benefits-ipad-wine-list-digital-menu-apps/"
        },
        {
          "name": "Uncorkd — iPad Wine List and Beverage Menus App for Restaurants",
          "url": "https://www.uncorkd.biz/product/ipad-menus/"
        },
        {
          "name": "Uncorkd — Homepage",
          "url": "https://www.uncorkd.biz/"
        }
      ]
    },
    {
      "id": "F4",
      "title": "Preferabli is well-evidenced as an AI recommendation and discovery platform, not an inventory or valuation platform",
      "feeds_questions": [
        "DQ-3",
        "DQ-5",
        "DQ-2"
      ],
      "evidence_weight": "strong",
      "content": "Preferabli is described by multiple sources as AI-driven recommendation software for wine, spirits, and food, with GenAI conversational recommendations and broad B2B2C product discovery use cases. This is strong evidence for virtual sommelier / pairing-adjacent functionality. There is no evidence in the supplied results that Preferabli offers inventory management, cellar-level valuation, shrinkage detection, or certified club POS integrations.",
      "sources": [
        {
          "name": "Progressive Grocer — Preferabli Enters the Conversation With GenAI for Wine Tips",
          "url": "https://progressivegrocer.com/preferabli-enters-conversation-genai-wine-tips"
        },
        {
          "name": "WineBusiness — Preferabli, the Leading AI-driven Software in Wine, Spirits and Food",
          "url": "https://www.winebusiness.com/news/vendor/article/296101"
        },
        {
          "name": "The Buyer — How Preferabli is using GenAI for personal wine recommendations",
          "url": "https://www.the-buyer.net/insight/preferabli-genai-personalised-wine-experiences"
        },
        {
          "name": "PR Newswire — Preferabli announces acquisition of Libation Labs",
          "url": "https://www.prnewswire.com/news-releases/preferabli-the-leading-ai-driven-software-in-wine-spirits-and-food-announces-acquisition-of-libation-labs-302358257.html"
        }
      ]
    },
    {
      "id": "F5",
      "title": "SevenFifty is evidenced as a wholesale ordering marketplace and distributor connectivity layer, not a cellar valuation or tracking platform",
      "feeds_questions": [
        "DQ-3",
        "DQ-5",
        "DQ-2"
      ],
      "evidence_weight": "strong",
      "content": "SevenFifty's own materials show a marketplace and integrated ordering system for wine, beer, and spirits, with reach to '200K+ buyers' through the Provi marketplace and tools for order entry and tracking across distributors. This positions SevenFifty around procurement and distributor connectivity rather than cellar operations. No supplied evidence shows bottle-level inventory tracking, valuation reports, shrinkage detection, sommelier AI, or named club/hotel POS integrations such as Jonas, Clubessential, or Oracle OPERA.",
      "sources": [
        {
          "name": "SevenFifty — Homepage",
          "url": "https://go.sevenfifty.com/"
        },
        {
          "name": "SevenFifty — Integrated Ordering",
          "url": "https://go.sevenfifty.com/integrated-ordering/"
        },
        {
          "name": "Hospitality Technology — Provi, SevenFifty Complete Integration",
          "url": "https://hospitalitytech.com/provi-sevenfifty-complete-integration"
        },
        {
          "name": "SevenFifty — Ordering",
          "url": "https://buyer.sevenfifty.com/static_pages/ordering"
        }
      ]
    },
    {
      "id": "F6",
      "title": "CellarTracker provides strong evidence for consumer cellar management and pricing reference features, but not club operations integrations or shrinkage workflows",
      "feeds_questions": [
        "DQ-3",
        "DQ-5",
        "DQ-2"
      ],
      "evidence_weight": "strong",
      "content": "CellarTracker states it has over 1.2 million wine searches in a week, 13 million reviews, and tools to track collections, manage cellar inventory, recommend wines with AI, and show 'what your wine and collection is worth.' App-store metadata further cites over 8.8 million users globally and 13.6 million wine ratings and reviews. This is strong evidence for consumer wine database scale, cellar tracking, and recommendation capabilities, but there is no supplied evidence for club/hotel POS integration, shrinkage detection, or formal automated cellar-level financial reporting for institutions.",
      "sources": [
        {
          "name": "CellarTracker — Homepage",
          "url": "https://www.cellartracker.com/"
        },
        {
          "name": "US Chamber of Commerce — How CellarTracker Uses AI and Community Data to Drive Growth",
          "url": "https://www.uschamber.com/co/good-company/the-leap/cellartracker-ai-user-growth"
        },
        {
          "name": "App Store — CellarTracker: #1 Wine Tracker",
          "url": "https://apps.apple.com/us/app/cellartracker-1-wine-tracker/id6446102275"
        },
        {
          "name": "CellarTracker — Mobile App",
          "url": "https://mobileapp.cellartracker.com/"
        }
      ]
    },
    {
      "id": "F7",
      "title": "Vivino has strong evidence in image recognition and consumer wine discovery, but supplied evidence does not support enterprise cellar valuation or physical tracking",
      "feeds_questions": [
        "DQ-3",
        "DQ-5",
        "DQ-2"
      ],
      "evidence_weight": "strong",
      "content": "Vivino is documented as using image recognition to identify wine labels and wine lists, with one case study citing 20 million users globally and millions of label images in its system. The app can identify a wine and return ratings, reviews, and average pricing, which is strong evidence for recognition and discovery. There is no supplied hard evidence that Vivino Enterprise offers automated cellar-level valuation reports, shrinkage detection, NFC/IoT bottle tracking, or certified club POS integrations.",
      "sources": [
        {
          "name": "PTC — Vivino's App to Identify Wine Labels",
          "url": "https://www.ptc.com/en/case-studies/vivino?srsltid=AfmBOoqqCU7Y8OhQFJNix5qnIEeQwjclNuePnBbzV3nvDfoCQdKIZgr-"
        },
        {
          "name": "VentureBeat — Vivino helps you find that wine with image recognition",
          "url": "https://venturebeat.com/ai/vivino-helps-you-find-that-wine"
        },
        {
          "name": "Diginomica — Uncorking wine information with OCR technology at Vivino",
          "url": "https://diginomica.com/uncorking-wine-information-with-ocr-technology-at-vivino"
        }
      ]
    },
    {
      "id": "F8",
      "title": "Evidence for InCellar and Alfred Technologies is absent or insufficient in the supplied search results",
      "feeds_questions": [
        "DQ-3",
        "DQ-5"
      ],
      "evidence_weight": "absent",
      "content": "The supplied search results do not contain reliable primary-source evidence for InCellar features, and Alfred Technologies does not appear in the provided search results list. Because this track must rely on the supplied evidence set, no substantiated conclusions can be made here about their inventory, valuation, integrations, or AI capabilities.",
      "sources": []
    },
    {
      "id": "F9",
      "title": "No supplied evidence ties BinWise, Uncorkd, Preferabli, SevenFifty, CellarTracker, or Vivino directly to Jonas Club Software, Clubessential, or Oracle OPERA",
      "feeds_questions": [
        "DQ-3",
        "DQ-5"
      ],
      "evidence_weight": "moderate",
      "content": "Jonas Club Software and Clubessential clearly market their own inventory/POS ecosystems, but the supplied competitor evidence does not show direct certified integrations from the named wine-tech competitors to Jonas, Clubessential, or Oracle OPERA. This absence matters because integration availability is central to switching costs and deployment friction. The lack of evidence does not prove no integrations exist; it only means they were not substantiated in the provided materials.",
      "sources": [
        {
          "name": "Jonas Club Software — Inventory Management",
          "url": "https://www.jonasclub.com/inventory-management/"
        },
        {
          "name": "Clubessential — Mobile POS",
          "url": "https://www.clubessential.com/mobile-pos/"
        },
        {
          "name": "Clubessential — Partners",
          "url": "https://www.clubessential.com/partners/"
        }
      ]
    },
    {
      "id": "F10",
      "title": "The evidence set supports a whitespace at the intersection of valuation, physical tracking, and sommelier AI",
      "feeds_questions": [
        "DQ-3",
        "DQ-5",
        "DQ-2"
      ],
      "evidence_weight": "moderate",
      "content": "Across the evidenced competitors, capabilities cluster into separate buckets: BinWise in inventory/reporting, Preferabli in recommendation AI, CellarTracker and Vivino in consumer cellar/discovery, and SevenFifty in ordering. No supplied source shows one competitor combining automated cellar-level valuation reporting, physical bottle-level tracking via NFC/IoT, and virtual sommelier functionality. This supports CellarEye's proposed positioning, but only as a conclusion bounded by the current evidence set, not as definitive proof of the entire market.",
      "sources": [
        {
          "name": "BinWise — BinWise Pro",
          "url": "https://home.binwise.com/binwise-pro"
        },
        {
          "name": "Preferabli — Progressive Grocer coverage",
          "url": "https://progressivegrocer.com/preferabli-enters-conversation-genai-wine-tips"
        },
        {
          "name": "CellarTracker — Homepage",
          "url": "https://www.cellartracker.com/"
        },
        {
          "name": "PTC — Vivino's App to Identify Wine Labels",
          "url": "https://www.ptc.com/en/case-studies/vivino?srsltid=AfmBOoqqCU7Y8OhQFJNix5qnIEeQwjclNuePnBbzV3nvDfoCQdKIZgr-"
        },
        {
          "name": "SevenFifty — Homepage",
          "url": "https://go.sevenfifty.com/"
        }
      ]
    },
    {
      "id": "F11",
      "title": "Switching costs appear moderate to high where inventory is tightly embedded with POS, accounting, and purchasing, but implementation-friction evidence is mixed",
      "feeds_questions": [
        "DQ-5",
        "DQ-2"
      ],
      "evidence_weight": "moderate",
      "content": "Jonas markets inventory as integrated with purchase order, general ledger, accounts payable, and POS, while Clubessential emphasizes real-time data-sharing across website, mobile app, reservations, accounting, POS, and reporting. That is hard evidence that core club systems create workflow lock-in once adopted. However, contradictions remain: some vendors market quick onboarding and modular SaaS, while integrated suite vendors imply deeper switching pain, so the practical level of lock-in varies by deployment depth.",
      "sources": [
        {
          "name": "Jonas Club Software — Inventory Management",
          "url": "https://www.jonasclub.com/inventory-management/"
        },
        {
          "name": "Jonas Club Software — Point of Sale",
          "url": "https://www.jonasclub.com/point-of-sale/"
        },
        {
          "name": "Clubessential — Club Management Software",
          "url": "https://www.clubessential.com/club-management-software/"
        }
      ]
    }
  ],
  "validation_question_responses": [],
  "decision_question_inputs": [
    {
      "question_id": "DQ-3",
      "relevant_evidence": "This track shows competitors are fragmented by function: BinWise is strong in inventory and reporting; Preferabli is strong in recommendation AI; CellarTracker and Vivino are strong in consumer cellar/discovery; SevenFifty is strong in ordering. No supplied evidence shows a competitor combining automated cellar-level valuation, physical bottle tracking, and sommelier AI, which strengthens CellarEye's feature narrative if those capabilities are real and integrated.",
      "evidence_weight": "strong"
    },
    {
      "question_id": "DQ-5",
      "relevant_evidence": "The main missing/defensible feature cluster emerging from this track is the combination of mark-to-market valuation, physical bottle-level tracking, and guest/member-facing sommelier intelligence. The evidence also suggests integrations into club software stacks and shrinkage analytics are important moats, but direct certified integrations for wine-tech vendors were not substantiated in the provided evidence set.",
      "evidence_weight": "moderate"
    },
    {
      "question_id": "DQ-2",
      "relevant_evidence": "This track contributes indirectly to market opportunity by clarifying whitespace: if no incumbent offers automated cellar-level valuation reports as a standalone or integrated capability, that may create an entry wedge. But this track does not quantify TAM, pricing power, or adoption rates, so it should not be used alone to estimate revenue potential.",
      "evidence_weight": "thin"
    }
  ],
  "evidence_gaps": [
    {
      "id": "G1",
      "description": "No supplied primary-source evidence for Alfred Technologies and insufficient evidence for InCellar, leaving gaps in the competitor matrix.",
      "affected_questions": [
        "DQ-3",
        "DQ-5"
      ],
      "suggested_resolution": "Collect official product pages, case studies, pricing materials, and integration documentation for Alfred Technologies and InCellar before making final claims about whitespace."
    },
    {
      "id": "G2",
      "description": "Direct certified integrations between major wine-tech competitors and Jonas Club Software, Clubessential, or Oracle OPERA were not substantiated in the provided results.",
      "affected_questions": [
        "DQ-3",
        "DQ-5"
      ],
      "suggested_resolution": "Search partner directories, vendor integration pages, and customer case studies; if possible, confirm with Jonas/Clubessential partner teams which beverage or wine platforms are officially supported."
    },
    {
      "id": "G3",
      "description": "Evidence for automated cellar-level valuation reports among competitors is mostly negative-by-absence rather than based on exhaustive market-wide proof.",
      "affected_questions": [
        "DQ-3",
        "DQ-2"
      ],
      "suggested_resolution": "Run a targeted search on terms such as 'wine cellar valuation software', 'automated wine collection valuation', and 'insurance wine valuation platform' across vendor sites, analyst reports, and enterprise procurement sources."
    },
    {
      "id": "G4",
      "description": "Switching cost evidence is directional but not quantified with implementation timelines, migration costs, or churn data for the named competitors in this track.",
      "affected_questions": [
        "DQ-5",
        "DQ-2"
      ],
      "suggested_resolution": "Interview club operators and implementation partners to gather real deployment timelines, training burdens, migration complexity, and replacement frequency for incumbent systems."
    }
  ],
  "sources_consulted": 120,
  "queries_executed": 28
}
```

## Appendix: Research Plan

```json
{
  "venture_name": "CellarEye Wine Inventory & Virtual Sommelier Platform for Private Clubs",
  "domain_summary": "CellarEye is pursuing a Wine Cellar Market Analytics Report as a low-friction software-only entry product for U.S. private clubs with large wine cellars, leveraging a 500,000-wine pricing database to deliver automated cellar valuations, shrinkage discovery, and a bridge to hardware/IoT upsell — targeting club CFOs and finance heads at 1,060+ large clubs with 2,500+ bottle cellars.",
  "tracks": [
    {
      "track_id": "CT1",
      "track_name": "Market Sizing & Segmentation",
      "relevance": "High",
      "relevance_reason": "Foundational for validating the $62M SAM claim, confirming club counts, cellar sizes, and membership distributions that underpin the entire revenue model and Year 1 target of $345K ARR.",
      "feeds_validation_questions": [
        "VQ-1",
        "VQ-2",
        "VQ-3",
        "VQ-4"
      ],
      "feeds_decision_questions": [
        "DQ-2"
      ],
      "tavily_queries": [
        "how many private country clubs in the United States 2024 2025 CMAA NGCOA total count",
        "number of private golf and country clubs in Northern California Bay Area Napa Sonoma region",
        "average wine cellar size bottles private country club fine dining F&B inventory",
        "private club membership size range average members per club United States CMAA statistics",
        "Club Management Association of America CMAA industry report 2024 club count demographics",
        "ClubCorp Invited Clubs portfolio number of clubs wine program size",
        "private club wine cellar inventory value average cost held at cost vs market value"
      ],
      "semantic_scholar_queries": [
        "private club industry market size membership demographics United States",
        "wine inventory management country club food and beverage operations",
        "fine wine collection valuation cellar size distribution high net worth"
      ],
      "deep_dive_topics": [
        "Segment the 3,887 CMAA-reported U.S. private clubs by cellar size tier (under 500 bottles, 500–2,500, 2,500–10,000, 10,000+) and cross-reference with geographic concentration in Northern California, Florida, and New York to validate the 1,060 large-club primary target and Northern California beachhead strategy.",
        "Quantify the gap between wine inventory held at cost basis versus current market value across private clubs, using any available industry survey data, to validate the 'hundreds of thousands of dollars of unlocked value' claim central to the valuation report pitch."
      ],
      "key_terms": [
        "CMAA",
        "NGCOA",
        "private club census",
        "wine cellar inventory",
        "bottle count by club size",
        "club membership demographics",
        "fine dining F&B program",
        "SAM TAM private clubs wine"
      ]
    },
    {
      "track_id": "CT2",
      "track_name": "Client Pain & Behavior",
      "relevance": "High",
      "relevance_reason": "Directly addresses VQ-5 through VQ-7 and validates the pain points that justify the valuation report, shrinkage discovery, and virtual sommelier features — including the legally critical consignment/member exchange question.",
      "feeds_validation_questions": [
        "VQ-5",
        "VQ-6",
        "VQ-7"
      ],
      "feeds_decision_questions": [
        "DQ-3",
        "DQ-5"
      ],
      "tavily_queries": [
        "top pain points private club wine cellar management inventory shrinkage spoilage",
        "country club wine list management challenges digital wine list real-time availability",
        "high net worth wine collector pain points cellar management optimal drinking window tracking",
        "wine consignment model member to member exchange private club legal TTB ABC regulations",
        "private club multiple membership percentage HNW members belonging to more than one club",
        "sommelier staffing challenges private clubs cost of master sommelier availability all shifts",
        "country club F&B wine inventory shrinkage theft loss percentage annual cost"
      ],
      "semantic_scholar_queries": [
        "wine inventory shrinkage food and beverage operations hospitality",
        "wine consumption behavior high net worth individuals cellar management",
        "sommelier recommendation systems wine pairing consumer satisfaction",
        "wine consignment legal framework alcohol beverage regulation"
      ],
      "deep_dive_topics": [
        "Map the full legal landscape of member-to-member wine consignment and exchange at private clubs: what do TTB federal regulations and state ABC laws (California, Florida, New York, Texas) actually permit, and are there any licensed consignment models operating within clubs today that CellarEye could replicate or enable?",
        "Identify and rank the top 5-7 operational pain points for club F&B directors and cellar managers — covering shrinkage, outdated wine lists, lack of real-time inventory visibility, sommelier availability across shifts, dynamic pricing for aging inventory, and multi-location cellar coordination — with evidence of dollar-cost impact where available."
      ],
      "key_terms": [
        "wine shrinkage",
        "cellar spoilage",
        "optimal drinking window",
        "sommelier staffing",
        "wine consignment",
        "TTB regulations",
        "ABC law member exchange",
        "digital wine list",
        "HNW wine collector",
        "multiple club memberships",
        "wine pairing recommendations"
      ]
    },
    {
      "track_id": "CT3",
      "track_name": "Pricing & Willingness-to-Pay",
      "relevance": "High",
      "relevance_reason": "Directly informs DQ-4 and DQ-6 — the pricing architecture and cashflow-positive viability of the business depend on understanding comparable SaaS pricing, club F&B budgets, and the willingness-to-pay envelope for automated valuation versus manual appraisal.",
      "feeds_validation_questions": [],
      "feeds_decision_questions": [
        "DQ-2",
        "DQ-4",
        "DQ-6"
      ],
      "tavily_queries": [
        "Jonas Club Software pricing annual cost per club SaaS subscription",
        "Clubessential Northstar club management software pricing F&B module cost",
        "BinWise wine inventory management software pricing per location annual subscription",
        "Uncorkd digital wine list pricing restaurant club subscription cost",
        "wine appraisal cost per collection Sotheby's Christie's Zachys independent appraiser fee schedule",
        "private club F&B technology budget annual spending food and beverage software",
        "SaaS pricing models hospitality club management per-seat per-location per-transaction"
      ],
      "semantic_scholar_queries": [],
      "deep_dive_topics": [
        "Build a competitive pricing matrix comparing: (a) club management SaaS platforms (Jonas, Clubessential, Northstar) F&B module pricing, (b) standalone wine inventory software (BinWise, Uncorkd, SevenFifty) subscription pricing, (c) manual wine appraisal services (Sotheby's, Christie's, independent appraisers) per-collection fees, and (d) wine data API subscriptions (Liv-ex, Wine-Searcher enterprise tiers) — to bracket the $500 single report / $3,000–$6,000/year subscription pricing proposed for CellarEye's valuation bureau."
      ],
      "key_terms": [
        "SaaS pricing per club",
        "F&B technology budget",
        "wine appraisal fee",
        "club management software cost",
        "per-location pricing",
        "wine inventory SaaS ACV",
        "willingness to pay club CFO",
        "BinWise pricing",
        "Uncorkd pricing"
      ]
    },
    {
      "track_id": "CT4",
      "track_name": "Adjacent Markets & Expansion Sequencing",
      "relevance": "Medium",
      "relevance_reason": "Important for DQ-8 but secondary to validating the primary club beachhead; the Avalon passport already identifies the luxury hotel path (P4) as the runner-up, so this track refines rather than discovers the expansion thesis.",
      "feeds_validation_questions": [],
      "feeds_decision_questions": [
        "DQ-8",
        "DQ-2"
      ],
      "tavily_queries": [
        "AAA Five Diamond Four Diamond hotels United States number wine program size",
        "luxury hotel wine cellar management technology Oracle OPERA Lightspeed POS integration",
        "commercial wine storage facility market size United States Domaine WineCare Urban Cellar",
        "SaaS vendor expansion sequence private club to hotel hospitality case study",
        "high net worth private wine cellar market size United States HNW collector segment",
        "Alfred Technologies wine inventory hotel case study Chateau Frontenac"
      ],
      "semantic_scholar_queries": [
        "luxury hotel food and beverage technology adoption wine management",
        "wine storage facility market commercial self-storage wine industry"
      ],
      "deep_dive_topics": [
        "Evaluate the club-to-hotel-to-HNW-private-cellar expansion sequence: how many AAA Four/Five Diamond hotels maintain wine programs with 2,500+ bottles, what is the commercial wine storage facility market size, and is there precedent for a B2B hospitality SaaS vendor successfully using institutional deployments as a funnel to acquire HNW individual customers?"
      ],
      "key_terms": [
        "AAA Five Diamond hotels",
        "luxury hotel wine program",
        "Oracle OPERA API",
        "Lightspeed POS",
        "wine storage facility",
        "Domaine wine storage",
        "HNW private cellar",
        "B2B to B2C expansion",
        "Alfred Technologies"
      ]
    },
    {
      "track_id": "CT5",
      "track_name": "Ops & Unit Economics",
      "relevance": "High",
      "relevance_reason": "Directly answers DQ-6 ($1M budget cashflow question) and DQ-7 (critical hires), and must model unit economics under the three API cost scenarios specified in CC-1.",
      "feeds_validation_questions": [],
      "feeds_decision_questions": [
        "DQ-6",
        "DQ-7"
      ],
      "tavily_queries": [
        "SaaS startup $1M budget cashflow positive timeline hospitality vertical",
        "customer acquisition cost CAC private club SaaS enterprise hospitality software",
        "sommelier salary cost United States certified sommelier tech company hire",
        "wine industry SaaS startup critical hires founding team roles",
        "early stage SaaS unit economics contribution margin per customer club management",
        "Liv-ex API enterprise pricing cost per lookup wine data API commercial terms",
        "Wine-Searcher trade API pricing enterprise subscription cost per query"
      ],
      "semantic_scholar_queries": [],
      "deep_dive_topics": [
        "Model a detailed Year 1 P&L for the Wine Valuation Bureau path: revenue from 50 club subscriptions at $4,500 avg plus 10 hardware conversions at $12,000 avg, against a cost structure including 2-3 engineers, 1 wine-domain expert (sommelier/wine director), 1 sales lead, API data costs at $0.01/$0.05/$0.10 per lookup, cloud hosting, PDF generation infrastructure, and marketing — to determine whether $345K ARR can be achieved cash-flow-positive within a $1M annual operating budget.",
        "Identify the 3-5 critical hires for Year 1, with loaded cost estimates: wine-domain lead (sommelier or former club F&B director), full-stack engineer, sales/partnerships lead with club-industry relationships, and determine whether fractional roles (legal counsel, data engineer) are sufficient."
      ],
      "key_terms": [
        "SaaS unit economics",
        "CAC LTV ratio",
        "contribution margin",
        "API cost per lookup",
        "COGS per report",
        "loaded cost per hire",
        "sommelier compensation",
        "club sales cycle length",
        "time to breakeven",
        "operating budget $1M"
      ]
    },
    {
      "track_id": "CT6",
      "track_name": "Tech & Competitor Landscape",
      "relevance": "High",
      "relevance_reason": "Essential for validating the 'no competitor offers automated cellar-level valuation reports' claim, mapping competitor feature sets and integrations, and identifying competitive moats and switching costs that inform DQ-3 and DQ-5.",
      "feeds_validation_questions": [],
      "feeds_decision_questions": [
        "DQ-3",
        "DQ-5",
        "DQ-2"
      ],
      "tavily_queries": [
        "BinWise wine inventory management features integrations club POS Jonas Clubessential",
        "Uncorkd digital wine list platform features pricing restaurant club",
        "Preferabli wine recommendation AI technology sommelier platform features",
        "SevenFifty wine ordering platform features integrations hospitality",
        "CellarTracker wine collection management features professional commercial use",
        "InCellar wine cellar management app features inventory tracking",
        "virtual sommelier AI wine pairing recommendation technology startup landscape 2024 2025",
        "wine recognition AI image scan label identification technology patent Vivino"
      ],
      "semantic_scholar_queries": [],
      "deep_dive_topics": [
        "Build a comprehensive competitor feature matrix covering BinWise, Uncorkd, Preferabli, SevenFifty, InCellar, CellarTracker, Alfred Technologies, and Vivino Enterprise — mapping each across: (a) inventory management, (b) real-time pricing/valuation, (c) wine pairing/virtual sommelier, (d) club/hotel POS integration (Jonas, Clubessential, Oracle OPERA), (e) IoT/NFC cellar monitoring, (f) automated reporting, (g) mark-to-market valuation, (h) shrinkage detection — to confirm CellarEye's unique positioning at the intersection of valuation + physical tracking + sommelier AI.",
        "Assess switching costs and integration moats: which competitors have certified integrations with Jonas Club Software or Clubessential, what is the typical implementation timeline, and how locked-in are clubs once they adopt a particular wine inventory system?"
      ],
      "key_terms": [
        "BinWise",
        "Uncorkd",
        "Preferabli",
        "SevenFifty",
        "InCellar",
        "CellarTracker",
        "Alfred Technologies",
        "Vivino Enterprise",
        "Jonas Club Software integration",
        "Clubessential API",
        "wine recognition AI",
        "NFC bottle tracking",
        "IoT cellar monitoring",
        "virtual sommelier",
        "mark-to-market wine valuation",
        "POS integration club"
      ]
    }
  ]
}
```
