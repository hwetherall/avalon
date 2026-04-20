# Avalon Information Passport (V2)

## Metadata
- **Venture:** CellarEye Wine Inventory & Virtual Sommelier Platform for Private Clubs
- **Client:** CellarEye (Pedram Mokrian)
- **Generated:** 2026-04-18
- **Upstream chapters used:** Demand Validation, Market Research, Competitor Analysis
- **Path evaluation:** 6 paths identified, 5 scouted and ranked, 1 uninvestigated. Decision-maker selected: The Wine Valuation Bureau (P5).
- **Pipeline version:** Avalon V2 (multi-path)

---

## 0. Argument Summary

**Thesis:** CellarEye should pursue a Wine Cellar Market Analytics Report as a low-friction, software-only revenue bridge to its full-stack hardware product, because it is the only path that eliminates the three most lethal adoption barriers — hardware onboarding, ERP API lock-out, and per-club sales cycle length — simultaneously, while generating cash within a $1M operating budget.

**Strongest evidence for:**
- Chubb, PURE, and AIG-related carriers already require regular valuation updates for insured wine collections and offer both blanket and scheduled coverage, confirming that cellar valuation is an existing operational need in insurance workflows — not a hypothetical one. [Chubb](https://www.chubb.com/sg-en/individuals-families/wine-insurance.html); [PURE Insurance](https://www.pureinsurance.com/coverage-solutions/jewelry-art-collections)
- PURE explicitly advertises protection up to 150% of scheduled value when market value has risen, meaning market-movement tracking is already a recognized pain point that an automated refresh service could address. [PURE Insurance](https://www.pureinsurance.com/coverage-solutions/jewelry-art-collections)
- Liv-ex frames its API-fed pricing as suitable for internal systems and client conversations, indicating an existing B2B workflow market for wine pricing data beyond trading — validating that CellarEye's 500,000-wine database can power a report product. [Liv-ex](https://files.liv-ex.com/How_to_digitally_transform_your_wine_business_v3.pdf)

**Strongest counter:**
- No insurance underwriter confirmed willingness to pay for or require automated cellar valuation data — demand from the buy side is inferred from public marketing materials, not validated by procurement evidence. [Scout field report, investigation finding #2]
- Enterprise API pricing for Wine-Searcher and Liv-ex remains unknown; if per-lookup costs exceed $0.10 at scale, per-report COGS could exceed 40% of report price, making the standalone valuation business structurally unprofitable. [Liv-ex Price Data API v2](https://bluehost-sites.s3-eu-west-1.amazonaws.com/Price_Data_API_v2.pdf)

**Resolution:** The counter-evidence identifies real execution risks but does not falsify the core demand thesis. Insurers already require valuation; the open question is whether they will pay CellarEye specifically for an automated feed or whether clubs themselves will pay for the report to satisfy their insurers. The latter is a lower-friction sales motion that does not require insurer procurement buy-in. On API pricing, CellarEye can negotiate terms before committing capital — this is a 30-day diligence task, not a structural blocker. The alternative paths (P1, P2, P3, P6) all require Jonas/Clubessential API integration that no non-acquired vendor has demonstrably secured, meaning the valuation bureau's risks are knowable and time-bounded while the alternative paths face risks that are structural and potentially unresolvable.

**What would change our mind:**
- If fewer than 3 of 15 pilot clubs convert to paid valuation subscriptions ($3,000+ ACV) within 6 months of receiving a free cellar health check, the standalone demand thesis is falsified.
- If Liv-ex or Wine-Searcher enterprise API pricing exceeds $0.10 per lookup at scale (>10,000 lookups/month), making per-report COGS >40% of a $500 single-report price, the unit economics are structurally broken.

---

## 1. Opportunity Verdict

**Verdict:** Pursue with conditions.

The Wine Valuation Bureau is the correct first path for CellarEye. It monetizes the company's most portable asset — its 500,000-wine pricing database and mark-to-market engine — without requiring hardware deployment, ERP integration, or per-bottle NFC tagging. Within a $1M operating budget, this path offers the fastest route to cash-flow generation. However, three conditions must be resolved within 90 days: (1) enterprise API pricing from Liv-ex and Wine-Searcher must be confirmed at unit economics that sustain >60% gross margin on reports; (2) at least 5 of 10 club CFO discovery interviews must confirm willingness to pay $3,000–$6,000/year for automated cellar valuation; and (3) legal counsel must confirm that "market analytics" product labeling avoids state appraiser licensure requirements in California and Florida. If any condition fails and cannot be restructured within the 90-day window, the Luxury Hotel Beachhead (P4) should be activated as the primary fallback.

### Three Legs
- **Demand:** Moderate support — insurers reference regular valuation as operationally important, and clubs routinely undervalue cellars by hundreds of thousands of dollars, but no buyer has confirmed willingness to pay for *automated* valuation reports specifically. Evidence weight: **moderate**.
- **Market:** The $62M SAM across 3,887 U.S. private clubs is validated by gold-standard sources (CMAA, AAA), and the financialization of fine wine assets is a durable structural trend pushing purchasing authority to finance-level budget holders. Evidence weight: **moderate**.
- **Competitive:** No competitor currently offers automated, API-driven cellar-level valuation reports as a standalone product; auction houses provide manual appraisals, inventory software focuses on operations, and data providers sell raw pricing feeds without client-ready output. Evidence weight: **strong**.

---

## 2. Strategic Direction

### Product Definition

Build a **Wine Cellar Market Analytics Report** — explicitly avoiding the term "appraisal" to sidestep regulated appraiser terminology. The MVP consists of:

1. **Cellar Valuation Report.** A customer uploads their wine list (spreadsheet, CellarTracker export, or manual entry). CellarEye matches each line against its 500,000-wine database, applies vintage-adjusted market pricing, and produces a professional PDF showing current market value, cost-basis-to-market delta, concentration risk by region/vintage, and aging/drinking window flags.
2. **Shrinkage Discovery Module.** Flags the gap between recorded inventory and what a properly valued cellar should contain — directly bridging to the $62,400/year operational pain identified in upstream analysis.
3. **Recurring Refresh Service.** Quarterly revaluations at subscription pricing ($3,000–$6,000/year), anchored to the insurance update cadence already required by carriers like Chubb and PURE.
4. **Hardware Upsell Bridge.** Every report includes a "What You Can't See" section demonstrating the limitations of valuation without physical tracking, creating the explicit hardware upsell path. Hardware (NFC/IoT) remains the terminal moat and is offered as a premium tier from Day 1, not stripped out.

### Target Market

- **Customer:** Head of Finance / CFO at private clubs; secondarily, Club General Managers seeking to justify capital investment in cellar infrastructure.
- **Segment:** Primary: 1,060 large U.S. private clubs with cellars exceeding 2,500 bottles. Insurance brokers and wealth advisors are explicitly **conditional** — do not invest sales resources until broker willingness-to-pay is validated via structured interviews.
- **Geography:** Northern California beachhead (convergence of high wealth, tech-forward boards, active CMAA networks), expanding to Florida and New York.
- **Entry Wedge:** Offer a free "cellar health check" to 10–15 target clubs. The report emphasizes both the hidden equity revelation *and* the shrinkage risk flag — connecting simultaneously to the CFO's balance sheet and operational budget. Convert to $3,000–$6,000/year subscriptions.

### Competitive Positioning

CellarEye is the only player combining wine pricing data with automated cellar-level financial analytics **and** a clear upgrade path to physical inventory tracking. Pure data providers (Liv-ex, Wine-Searcher) sell raw data but no client-ready reports. Auction houses (Sotheby's, Christie's) provide manual appraisals at opaque, high-touch pricing and long timelines. Inventory software (BinWise, Uncorkd) focuses on operations, not financial valuation. The right to win is the **sequenced product ladder**: valuation report → shrinkage discovery → hardware deployment → full-stack platform. Each step increases switching costs. No competitor occupies this full sequence.

### Business Model Framing

**Wedge-first, premium hybrid.** The valuation report is a low-friction, software-light entry product ($500 single report / $3,000–$6,000/year subscription) that generates cash and builds club relationships. Hardware upsell ($9,600–$18,000/year) is the margin-expanding terminal state. The advisor/broker license tier ($10,000–$25,000/year) is **conditional** and launches only if broker willingness-to-pay interviews validate a procurement path.

**Year 1 Revenue Target:** 50 club subscriptions at $4,500 avg ($225,000) + 10 hardware conversions at $12,000 avg ($120,000) = $345,000 ARR. Achievable within $1M budget.

---

## 3. Critical Constraints

**CC-1. Third-party API dependency is existential.** The pricing database relies on Wine-Searcher and Liv-ex APIs. No public enterprise pricing terms exist (scout evidence weight: thin). If per-lookup COGS exceed 40% of report price, the business is structurally unprofitable. Must resolve within 30 days. (→ EG-1, KS-1)

**CC-2. Consignment revenue is legally dead.** Federal TTB and state ABC laws prohibit unlicensed member-to-member wine sales. Do not position reports as facilitating peer-to-peer transactions. (→ CR-3)

**CC-3. Product must be labeled "market analytics," not "appraisal."** Legal counsel must confirm within 45 days that this framing avoids state appraiser licensure requirements. If it does not, restructure as a licensed appraiser partnership. (→ EG-3, KS-3)

**CC-4. Insurance channel is unvalidated and conditional.** Do not allocate sales resources to brokers/underwriters until structured interviews confirm a procurement path. (→ EG-5)

**CC-5. Hardware remains the terminal moat.** Downstream analysis must treat the valuation report as a bridge, not a destination. If fewer than 3 of 15 report customers express hardware upgrade interest within 12 months, the sequencing thesis fails. (→ KS-4)

**CC-6. $1M operating budget ceiling.** All product development, sales, and API costs must fit within the stated annual budget. The valuation report path is viable under this constraint precisely because it strips out hardware deployment and installation labor from the initial cost structure.

---

## 4. Cross-Chapter Risks

**CR-1. The "double gatekeeper" trap.**
*Source:* Market Research × Competitor Analysis. *Severity:* High.
CellarEye is simultaneously dependent on legacy CMS APIs (Jonas/Clubessential) for the full-stack product AND third-party pricing APIs (Liv-ex/Wine-Searcher) for the valuation product. Failure on either dependency kills the corresponding revenue stream. Pursuing both paths in parallel doubles the integration risk surface. (→ CC-1, EG-1)

**CR-2. Fine wine deflation inverts both value propositions.**
*Source:* Market Research × Competitor Analysis. *Severity:* High.
The market chapter warns of sustained premium wine market corrections. If cellars are depreciating, the "unlock hidden equity" sales pitch collapses for the valuation product AND the mark-to-market justification for the full-stack product weakens simultaneously. (→ KS-5)

**CR-3. Regulatory creep from valuation to brokering.**
*Source:* Market Research × Competitor Analysis × Scout. *Severity:* Medium-High.
State ABC boards may view software-driven cellar valuation as a precursor to unlicensed brokering. A valuation report that reveals a $200,000 unrealized gain creates immediate seller intent — and CellarEye has no legal pathway to facilitate that transaction. Scout found no wine-specific state guidance on automated valuation, leaving this risk open. (→ CC-2, CC-3, EG-3)

**CR-4. Pricing database is a weak standalone moat.**
*Source:* Competitor Analysis × Scout. *Severity:* Medium.
The competitor chapter rates the 500,000-wine pricing database as "easily replicable by licensing third-party APIs." If the valuation report is the sole product, any competitor with API access can replicate it. The moat only deepens when the report is the entry to the hardware-backed product ladder. (→ CC-5, KS-4)

**CR-5. Club CFO willingness-to-pay is untested.**
*Source:* Market Research × Scout. *Severity:* Medium-High.
Upstream chapters identify willingness-to-pay validation as missing. The scout did not resolve it. The entire Year 1 revenue model ($225K from 50 subscriptions) is built on an unvalidated assumption about CFO demand for standalone valuation. (→ EG-2, KS-2)

---

## 5. Evidence Gaps

| ID | Gap | Current Evidence Weight | Resolution Action | Deadline |
|---|---|---|---|---|
| EG-1 | Enterprise API commercial terms (Liv-ex and Wine-Searcher): pricing, usage caps, exclusivity, revocability | Thin — Liv-ex confirms API availability and B2B use cases ([Liv-ex](https://files.liv-ex.com/How_to_digitally_transform_your_wine_business_v3.pdf)); no public price card found | Direct outreach to commercial teams at both providers; request enterprise pricing and trial access | 30 days |
| EG-2 | Club CFO willingness to pay for standalone valuation reports | Thin — upstream market chapter flags as missing; scout did not resolve | Run 10 customer discovery interviews with club Heads of Finance, anchored to a mock report | 60 days |
| EG-3 | Legal classification of automated wine valuation ("market analytics" vs. "appraisal") | Absent — scout found no wine-specific state guidance; only general appraiser credential context ([Winery & Wine Appraisals](https://wineryandwineappraisals.com/wine-appraisers/)) | Engage California and Florida beverage/property counsel | 45 days |
| EG-4 | Competitive appraisal pricing benchmarks (Sotheby's, Christie's, independents) | Thin — scout confirmed these services exist ([Sotheby's](https://wine.sothebys.com/pages/sothebys-wine-advisory); [Christie's](https://www.christies.com/en/services/valuations-appraisals-and-professional-advisor-services/contact)) but found no public fee schedules | Commission 2–3 competitive appraisals to establish baseline pricing and turnaround time | 60 days |
| EG-5 | Insurance broker procurement path | Thin to absent — insurer marketing materials confirm valuation matters operationally, but no broker confirmed they would pay for automated data | Conduct 5–10 structured interviews with Chubb, PURE, and AIG private client brokers | 60 days |
| EG-6 | Jonas/Clubessential API integration terms | Thin — Yellow Dog Software documents a Jonas API, but commercial terms, costs, and third-party certification processes are undocumented | Relevant to hardware upsell tier and full-stack product; initiate exploratory conversations with Jonas developer relations | 90 days |
| EG-7 | Alfred Technologies commercial metrics (ACV, deployment count, churn) | Absent — competitor appears across club and hotel segments but no hard commercial data found by any scout | Attempt direct inquiry or interview hotel F&B directors who evaluated Alfred | 90 days |

---

## 6. Unresolved Contradictions

**UC-1. Hardware as moat vs. hardware as barrier.** The competitor chapter rates the physical-to-digital bridge as CellarEye's strongest defensible advantage. The market chapter rates hardware onboarding friction as a High probability, High severity adoption risk. The same asset is simultaneously the company's greatest strength and its greatest sales obstacle. The valuation report attempts to resolve this by sequencing — but whether clubs actually convert from reports to hardware remains entirely unvalidated. (→ KS-4)

**UC-2. Valuation as premium feature vs. weak standalone moat.** The competitor chapter rates mark-to-market valuation as a "Strong" winning factor. The same chapter rates the 500,000-wine pricing database as "easily replicable by licensing third-party APIs." These assessments are in tension: if the data layer is weak, the valuation product built on it inherits that weakness. Resolution depends on whether the report's value is in the data itself or in the client-ready analytics layer built on top of it.

**UC-3. Insurance demand is structural but unmonetized.** Scout evidence confirms insurers already require regular valuation updates ([Chubb](https://www.chubb.com/sg-en/individuals-families/wine-insurance.html); [PURE](https://www.pureinsurance.com/coverage-solutions/jewelry-art-collections)). Yet no insurer confirmed they would pay for automated valuation feeds. The operational need is validated; the commercial pathway is not. The resolution may be that the club, not the insurer, is the paying customer — using CellarEye's report to satisfy their insurer's requirements. This reframes the insurance channel as a demand driver rather than a revenue channel.

---

## 7. Kill Signals

**KS-1.** API access priced above $0.10/lookup at scale, making per-report COGS exceed 40% of report price. **Action:** Kill the standalone valuation product. Evaluate whether a flat-fee data license is available; if not, revert to P4 (Luxury Hotel Beachhead). (→ CC-1, EG-1)

**KS-2.** Fewer than 3 of 15 pilot clubs convert to paid subscriptions ($3,000+ ACV) within 6 months of receiving a free cellar health check. **Action:** Standalone valuation demand thesis is falsified. Kill or pivot to direct hardware sales via P4. (→ EG-2, CR-5)

**KS-3.** Legal counsel determines "market analytics" framing does not insulate from appraiser licensing requirements AND no licensed appraiser partnership can be structured within 60 days. **Action:** Kill the standalone product in affected states. Evaluate restructuring as a white-label data feed to licensed appraisers. (→ CC-3, EG-3)

**KS-4.** Fewer than 3 of 15 valuation-report customers express interest in hardware upgrade within 12 months. **Action:** The sequencing thesis — that valuation is a bridge to hardware — is falsified. Revert to P4 or evaluate P3 (ERP Trojan Horse). (→ CC-5, UC-1)

**KS-5.** Liv-ex 1000 index drops >15% over 12 months. **Action:** The "unlock hidden equity" narrative collapses. Reassess entire positioning; consider pivoting to shrinkage/operational framing only. (→ CR-2)

---

## 7.5. Confidence Ledger

| Claim | Confidence | Top flip-condition |
|---|---|---|
| **Verdict: Pursue with conditions** — valuation bureau is the best first path under $1M budget | **M** | Club CFO discovery interviews (EG-2): if <3 of 10 express willingness to pay $3K+/yr, verdict downgrades to Pivot Recommended |
| **No competitor offers automated cellar-level valuation reports as a standalone product** | **H** | Discovery of a direct competitor (e.g., auction house or fintech) offering automated, API-driven cellar valuation at scale would downgrade to Low |
| **$62M SAM across 3,887 U.S. private clubs** | **H** | If CMAA revises club count downward by >20% or if cellar penetration among counted clubs is <40%, SAM shrinks below viable threshold |
| **Insurance carriers require regular valuation updates** (Chubb, PURE) | **H** | If carriers shift to blanket-only coverage models that eliminate per-item valuation requirements, demand driver disappears |
| **Enterprise API pricing (Liv-ex, Wine-Searcher) supports >60% gross margin on reports** | **L** | Direct pricing confirmation from either provider; if confirmed at <$0.05/lookup, upgrades to High; if >$0.10, triggers KS-1 |
| **"Market analytics" labeling avoids appraiser licensing in CA and FL** | **L** | Legal opinion from state beverage/property counsel; clear guidance either direction resolves the uncertainty |
| **Valuation report customers will convert to hardware upsell (sequencing thesis)** | **L** | First 15 report customers' behavior within 12 months; if ≥3 express hardware interest, upgrades to Medium |
| **Year 1 target of $345K ARR is achievable** | **M** | Dependent on EG-1 (API costs) and EG-2 (CFO WTP); if both resolve favorably, upgrades to High |

---

## 8. Path Context

### Evaluation Method
Multi-path evaluation: 6 strategic paths identified by the Path Cartographer, 5 investigated by independent research scouts, then ranked by the War Table. 1 path (P1: The Shrinkage Killer) was not scouted.

### Chosen Path
**The Wine Valuation Bureau (P5)** (Rank #1 of 5 ranked paths)
Selected by: Innovera recommendation aligned with decision-maker's strategic intent.

### Paths Considered

| Rank | Path | Type | Key Reason For | Key Reason Against |
|------|------|------|----------------|-------------------|
| 1 | P5: The Wine Valuation Bureau | Pivot | Eliminates hardware, ERP, and sales-cycle barriers simultaneously; fastest time to revenue | Entire business rests on third-party APIs with unknown terms; no underwriter confirmed WTP for automated data |
| 2 | P4: The Luxury Hotel Beachhead | Phased Entry | Bypasses club ERP lock-in via Oracle OPERA/Lightspeed open APIs; larger reward ceiling | No evidence on hotel F&B tech purchasing authority; Alfred Technologies has head start in luxury hotels |
| 3 | P3: The ERP Trojan Horse | Hedge | Turns biggest threat (Jonas) into distribution channel; eliminates API lock-out risk | Cedes all pricing power; $1.24M ARR SOM may be too small to attract acquirer interest |
| 4 | P6: The Samsung Play — Sovereign Cellar Infrastructure | Pivot | Regulatory-grade compliance framing unlocks different budgets; Metrc cannabis precedent exists | Evidence concentrated in Texas only; no enforcement pain found; very high execution complexity |
| 5 | P2: The Management Company Lever | Full Commit | Single enterprise deal could deliver 50–100+ clubs overnight | No evidence any management company mandates standardized wine tech; all three targets in corporate restructuring |
| — | P1: The Shrinkage Killer | Wedge-First | (Not scouted) Strongest operational ROI case ($62K/yr shrinkage); core to CellarEye's existing capability | Requires Jonas/Clubessential API access and hardware deployment — the two barriers P5 was chosen to avoid |

### Runner-Up Path
**P4: The Luxury Hotel Beachhead** — Bypass the private-club ERP lock-in entirely by targeting AAA Four/Five Diamond hotels whose POS/PMS systems (Oracle OPERA, Lightspeed) have documented open APIs, using hotel wins as proof points to re-enter the club market with leverage.

If the chosen path encounters a kill signal during downstream analysis (particularly KS-1 on API pricing or KS-2 on club CFO demand), this path should be evaluated as the primary fallback. Oracle OPERA Cloud publishes REST APIs through OHIP covering reservation, inventory, rate, CRM, and front-desk functions — confirming meaningful integration openness compared to club ERPs.

### Key Tradeoff
Addressable market certainty vs. go-to-market friction — the paths with the clearest demand evidence (clubs) face the heaviest ERP gatekeeper and hardware onboarding barriers, while paths that sidestep those barriers (valuation bureau, hotels) have thinner demand evidence and less founder-market alignment.

---

## 9. Strategic Alternative

### P4: The Luxury Hotel Beachhead

**Elevator Pitch:** Bypass the private club ERP lock-in entirely by targeting AAA Four/Five Diamond hotels whose POS/PMS systems (Oracle OPERA, Lightspeed) have documented open APIs, using hotel wins as proof points to re-enter the club market with leverage.

**Why #2:** This path ranked second because it offers a strong reward ceiling and moderate execution complexity, while addressing the ERP gatekeeper problem from a completely different angle. Hotel POS systems are demonstrably more open than club ERPs, and the luxury hotel segment offers larger per-account revenue potential.

**Scout Evidence Summary:**
- Oracle OPERA Cloud publishes REST APIs through OHIP covering reservation, inventory, rate, CRM, and front-desk functions — confirming integration openness.
- Lightspeed has a documented Oracle OPERA integration for hotel room-charge workflows and advertises an open API for custom integrations.
- Third-party hospitality reviews position Lightspeed as "best for hotel restaurants" with multiple PMS integrations.

**Key Risks:**
- No hotel-by-hotel POS/PMS mapping for the top 50 U.S. luxury hotels was found; the "open stack" thesis is validated at the platform level but not at the account level.
- No evidence found on whether CellarEye's NFC/IoT hardware works in commercial hotel refrigeration environments, which differ physically from subterranean cellars.
- No evidence found on F&B technology budgets or purchasing authority at AAA Five Diamond hotels.
- Alfred Technologies has established case studies in this segment (Château Frontenac, Post Hotel & Spa); CellarEye would enter as a second mover against an incumbent whose commercial strength is unquantified.

**Activation Trigger:** If P5 encounters KS-1 (API pricing kills unit economics) or KS-2 (club CFOs do not convert to paid subscriptions), pivot resources to P4. Begin with 5 discovery calls to F&B directors at top-50 U.S. luxury hotels to validate purchasing authority and technology stack.

---

## 10. Downstream Brief: Product & Technology

### Scope Directive

Evaluate the technical feasibility, build cost, and architecture of a **Wine Cellar Market Analytics Report** product that ingests wine inventory data (spreadsheet upload, CellarTracker export, or manual entry), matches against a 500,000-wine pricing database via third-party APIs, and outputs a client-ready PDF report with market valuation, cost-basis delta, concentration analysis, aging windows, and a shrinkage discovery flag. Secondarily, evaluate the technical requirements for a quarterly automated refresh service. The hardware/IoT inventory system is **out of scope** for the MVP but must be architecturally compatible as a premium upsell tier.

### Context Package

- CellarEye's existing platform (www.cellareye.com) already includes: NFC-based bottle location tracking, full-stack inventory management, access to real-time pricing for 500,000 wines, a virtual sommelier app, and IoT cellar monitoring. The valuation report product leverages the pricing database and report generation capabilities without requiring hardware deployment.
- The $62M SAM consists of 3,887 U.S. private clubs (CMAA-verified) and 1,750 AAA Four Diamond hotels. Primary target is 1,060 large clubs with 2,500+ bottle cellars.
- Competitors in the data layer include Wine-Searcher (API documented at [Wine-Searcher API](https://www.wine-searcher.com/trade/api)) and Liv-ex (API documented at [Liv-ex API Library](https://www.liv-ex.com/api-library/); price data API specs at [Liv-ex Price Data API v2](https://bluehost-sites.s3-eu-west-1.amazonaws.com/Price_Data_API_v2.pdf)). Vinous/Liv-ex API page states no additional charge for Vinous Enterprise users ([Vinous/Liv-ex API](https://vinous.com/statics/vinous-liv-ex-api)).
- No competitor currently offers an automated, API-driven cellar-level valuation report as a standalone product. Manual appraisals are provided by Sotheby's ([Sotheby's Wine Advisory](https://wine.sothebys.com/pages/sothebys-wine-advisory)) and Christie's ([Christie's Valuations](https://www.christies.com/en/services/valuations-appraisals-and-professional-advisor-services/contact)) at unknown pricing and timelines.
- Insurance carriers (Chubb, PURE) require regular valuation updates and support both blanket and scheduled coverage structures for wine collections ([Chubb](https://www.chubb.com/sg-en/individuals-families/wine-insurance.html); [PURE](https://www.pureinsurance.com/coverage-solutions/jewelry-art-collections)).

### Constraint Set

- **CC-1 (API dependency).** The product's unit economics depend entirely on third-party API costs. P&T must model per-report COGS under three scenarios: $0.01, $0.05, and $0.10 per API lookup, against a report containing 500–5,000 wine-line lookups.
- **CC-3 (Product labeling).** The report must be titled and structured as "market analytics," not "appraisal." P&T must design the report template, disclaimers, and output format to support this legal distinction.
- **CC-6 ($1M budget).** Total Year 1 technology spend (development, hosting, API costs, report generation infrastructure) must fit within the overall $1M operating budget alongside sales and operations.
- **Data ingestion flexibility.** The MVP must accept wine lists in at least three formats: CSV/Excel upload, CellarTracker export, and manual entry. Matching accuracy against the 500,000-wine database is the core technical challenge.
- **Report must include a "What You Can't See" section.** This section explicitly highlights the limitations of valuation without physical tracking — it is the bridge to the hardware upsell and must be architecturally designed to pull live data from the hardware tier when a customer upgrades.

### Priority Questions

1. **Wine matching accuracy.** What is the expected match rate when a club uploads a spreadsheet with inconsistent naming conventions, missing vintages, or abbreviations? What NLP/fuzzy-matching architecture is required to achieve >90% automated match rate against the 500,000-wine database?
2. **API architecture and cost modeling.** What is the optimal API call architecture (batch vs. real-time, caching strategy, fallback between Liv-ex and Wine-Searcher) to minimize per-report COGS while maintaining data freshness? Model three pricing scenarios per CC-1.
3. **Report generation pipeline.** What technology stack (PDF generation, data visualization, template engine) supports a professional, insurance-grade valuation report that can be produced in <24 hours from data upload?
4. **Quarterly refresh automation.** What infrastructure is required to automatically re-run valuations quarterly, detect material changes (>5% portfolio value shift), and alert subscribers?
5. **Shrinkage discovery algorithm.** How should the system flag the gap between recorded inventory and expected cellar composition? What heuristics (par levels by club size, historical consumption patterns, vintage depletion curves) are available or must be built?
6. **Hardware upsell architecture.** How should the valuation report system be designed so that when a club upgrades to hardware (NFC/IoT), the valuation report automatically incorporates physical tracking data (bottle-level location, consumption logs, condition alerts) without requiring a separate product build?
7. **Data privacy and security.** Club wine inventories represent material financial assets. What security architecture (encryption, access controls, SOC 2 readiness) is required to serve institutional clients?

### Inherited Evidence Gaps

| ID | Gap | P&T Relevance |
|---|---|---|
| EG-1 | Enterprise API commercial terms (Liv-ex, Wine-Searcher) | **Critical.** P&T cannot finalize architecture or cost model without confirmed pricing. Attempt to obtain developer documentation and trial API access during P&T research. Preliminary evidence: Liv-ex API credentials use CLIENT_KEY/CLIENT_SECRET ([Liv-ex API docs](https://files.liv-ex.com/Active_Markets_v3.pdf)); Vinous Enterprise may include API access at no additional charge ([Vinous](https://vinous.com/statics/vinous-liv-ex-api)). |
| EG-3 | Legal classification of automated wine valuation | P&T should design report templates with legal-defensible language. Coordinate with legal counsel on disclaimer text, output format, and absence of "appraisal" terminology. |
| EG-4 | Competitive appraisal pricing benchmarks | P&T should evaluate turnaround time and format