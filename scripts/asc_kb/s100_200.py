"""100s General Principles and 200s Presentation."""

from . import C

# ── 100 General Principles ──────────────────────────────────────────────────────────────────

C(
    "105",
    tag="One rulebook: the Codification is the only authoritative source of nongovernmental US GAAP.",
    alias=["gaap hierarchy", "codification", "authoritative", "nonauthoritative", "materiality", "analogy", "ifrs", "sec guidance", "fasb"],
    re=None,
    truth="Financial statements are a language spoken between strangers — investors, lenders and regulators who never see your ledger. A language needs one dictionary, so the FASB Codification is the single authoritative source of US GAAP for nongovernmental entities, with SEC rules layered on top for registrants. When the dictionary is silent you reason by analogy to authoritative GAAP first, and only then look at textbooks, IFRS or practice.",
    analogy=(
        "The Referee's Rulebook",
        "A soccer referee cannot invent an offside rule mid-game because it feels fair. When a weird play is not covered, she finds the closest rule in the official book and applies its logic; only after that does she glance at what TV commentators think. The Codification is the official book, SEC rules are the extra rules of the professional league, and IFRS, Big 4 guides and textbooks are the commentators — useful, but never binding.",
    ),
    recog=[
        "Every policy decision starts by locating the governing Topic/Subtopic — the Codification is authoritative; Accounting Standards Updates are not authoritative in their own right (they only amend the Codification).",
        "Transaction not addressed? First analogize to accounting for similar transactions within authoritative GAAP, then consult nonauthoritative sources (practice, Concepts Statements, IFRS, AICPA papers, textbooks).",
        "SEC 'S' sections (S99 SEC Materials, SAB topics) bind only SEC registrants.",
        "Nothing in the Codification needs to be applied to immaterial items — materiality is the universal filter.",
    ],
    meas=(
        "Framework — measurement comes from the governing Topic",
        "Apply the measurement attribute required by the Topic that governs the transaction (historical cost, amortized cost, fair value, NRV…).",
        "Stay consistent period to period; a change of principle goes through ASC 250.",
    ),
    je=[
        (
            "Policy by analogy: forgivable state grant (pre-ASU 2025-10 practice)",
            "A business receives a $500,000 state job-creation grant, forgivable if 50 jobs are kept for 3 years. Before the new ASC 832 recognition model becomes effective, no Topic prescribes grant accounting for business entities, so management analogizes (commonly to IAS 20) and defers the grant until the conditions are reasonably assured.",
            [("DR", "Cash — operating", 500000), ("CR", "Deferred grant income (liability)", 500000)],
            "Recognize into income as the job-retention conditions are met; disclose the policy chosen by analogy (ASC 832 disclosures).",
        ),
    ],
    traps=[
        ("Is an Accounting Standards Update (ASU) authoritative?", "No. ASUs only update the Codification and explain the basis for conclusions; you cite the Codification paragraph the ASU amended (105-10-05-5)."),
        ("Can you apply IFRS when US GAAP is silent?", "Only as nonauthoritative guidance and only after first analogizing to similar transactions within authoritative GAAP (105-10-05-2). Document why the analogy was chosen."),
        ("Is SAB guidance binding on a private real estate fund?", "No. SEC staff guidance in the S sections applies to SEC registrants only; a private fund may look to it as nonauthoritative practice."),
        ("Can an immaterial item be booked outside GAAP?", "Yes — the Codification need not be applied to immaterial items (105-10-05-6), but auditors aggregate uncorrected misstatements, so 'immaterial' is tested quantitatively and qualitatively."),
    ],
    cites=["105-10-05-1", "105-10-05-2", "105-10-05-6"],
)

# ── 200 Presentation ────────────────────────────────────────────────────────────────────────

C(
    "205",
    tag="Tell a comparable story — separate what is gone (discontinued ops) and warn if the entity may not survive (going concern).",
    alias=["discontinued operations", "disc ops", "held for sale", "going concern", "substantial doubt", "liquidation basis", "comparative statements", "strategic shift"],
    re="support",
    truth="Readers use last year's statements to forecast next year, so comparative periods must be comparable. If management exits a major part of the business (a strategic shift), that piece is carved out as discontinued operations so the continuing business can be projected cleanly. And because every number assumes the entity keeps operating, management must warn readers when that assumption is in doubt — or abandon it entirely once liquidation is imminent.",
    analogy=(
        "The Airline That Sells Its Cargo Division",
        "An airline sells its entire cargo business. If next year's report mixed old cargo revenue with passenger revenue, you could not tell whether the passenger business grew. So the airline shows cargo on a single separate line for every year presented. And if the airline might run out of cash within a year, the pilot must announce it before takeoff — that's the going-concern warning; if the plane is definitely landing for good, you switch to 'what can we sell the parts for' (liquidation basis).",
    ),
    recog=[
        "Discontinued operations: a component (or group) is disposed of or classified as held for sale AND the disposal represents a strategic shift with a major effect on operations and results (205-20-45-1B).",
        "Held-for-sale classification when all criteria are met: committed plan, available for immediate sale, active program to find a buyer, sale probable within one year, reasonable price, plan unlikely to change (205-20-45-1E / 360-10-45-9).",
        "Going concern: every annual and interim period, evaluate whether it is probable the entity cannot meet obligations as they come due within one year after the date the statements are issued (or available to be issued).",
        "Liquidation basis: when liquidation is imminent — a plan is approved and the likelihood of return from liquidation is remote, or liquidation is imposed by others.",
    ],
    meas=(
        "Held for sale: lower of carrying amount and fair value less cost to sell; liquidation basis: expected cash",
        "Disposal group held for sale measured at the lower of carrying amount or fair value less costs to sell; depreciation stops.",
        "Liquidation basis measures assets at the amount of cash expected to be collected and accrues estimated disposal costs (undiscounted).",
    ),
    je=[
        (
            "Classify a disposal group as held for sale",
            "A REIT decides to exit its entire senior-housing segment (a strategic shift). Carrying amount of the disposal group is $12,000,000; fair value less costs to sell is $11,400,000.",
            [("DR", "Loss on classification as held for sale (discontinued operations)", 600000), ("CR", "Valuation allowance — assets held for sale", 600000)],
            "Present assets and liabilities of the disposal group separately on the balance sheet for all periods presented; stop depreciating.",
        ),
    ],
    traps=[
        ("Is the sale of one apartment community a discontinued operation?", "Usually not. Only a strategic shift with a major effect qualifies (e.g., exiting a property type or major geography). A single property sale stays in continuing operations with the gain under ASC 610-20/360."),
        ("From which date is the going-concern look-forward period measured?", "One year after the date the financial statements are issued (or available to be issued) — not one year from the balance-sheet date."),
        ("Can management's refinancing plan alleviate substantial doubt?", "Only if it is probable of being effectively implemented and probable of mitigating the conditions within the look-forward period; otherwise disclose substantial doubt (205-40-50-7 to 50-9)."),
        ("Can corporate overhead be allocated to discontinued operations?", "No — general corporate overhead may not be allocated (205-20-45-9). Interest may be allocated only on debt assumed by the buyer or required to be repaid, and optionally other consolidated interest under the ratio method."),
    ],
    lens="Selling an entire market or product line (e.g., the student-housing portfolio) can trigger disc-ops presentation; lender maturity walls and covenant breaches on a property-level loan feed the going-concern assessment of single-asset entities.",
    cites=["205-20-45-1B", "205-20-45-1E", "205-40-50-1"],
)

C(
    "210",
    tag="A snapshot of what you own and owe — classified by liquidity, never netted without a legal right of setoff.",
    alias=["balance sheet", "statement of financial position", "current assets", "current liabilities", "working capital", "offsetting", "right of setoff", "classified balance sheet", "unclassified"],
    re="support",
    truth="The balance sheet answers one question: can this entity pay its bills? Splitting items into current (turns to cash or comes due within a year or the operating cycle) and noncurrent tells readers about liquidity. Netting a receivable against a payable would hide the gross exposure, so offsetting is banned unless a legally enforceable right of setoff exists and you intend to use it.",
    analogy=(
        "Your Wallet vs. Your Mortgage",
        "Your personal balance sheet has cash in your wallet and a paycheck due Friday (current) and a retirement account plus a 30-year mortgage (noncurrent). You cannot 'net' the $500 your friend owes you against your $500 credit-card bill — the card company never agreed to collect from your friend. Only if all three of you sign an agreement letting the bank take your friend's payment could you net them.",
    ),
    recog=[
        "Current assets: cash and other assets reasonably expected to be realized in cash, sold or consumed within one year or the operating cycle if longer.",
        "Exclude from current assets cash restricted for noncurrent purposes, e.g., funds designated to acquire or construct noncurrent assets or to retire long-term debt (210-10-45-4).",
        "Current liabilities: obligations expected to be liquidated using current assets or by creating other current liabilities.",
        "Offset only when a right of setoff exists: each party owes determinable amounts, the reporting entity has the right and intends to set off, and the right is enforceable at law (210-20-45-1).",
    ],
    meas=(
        "Presentation Topic — carrying amounts come from other Topics",
        "No measurement of its own; it classifies and presents amounts measured under other Topics.",
        "Reclassify between current and noncurrent at each balance-sheet date as maturities approach.",
    ),
    je=[
        (
            "Reclassify the current portion of a mortgage",
            "At year-end, $1,250,000 of principal amortization on a property mortgage is due within the next 12 months.",
            [("DR", "Mortgage note payable — noncurrent", 1250000), ("CR", "Current portion of long-term debt", 1250000)],
            "Presentation-only entry; reverse or re-compute at the next reporting date.",
        ),
    ],
    traps=[
        ("A borrower breached a DSCR covenant at year-end and the loan is now callable. How is it classified?", "Current, unless the lender waives the right to demand repayment for more than one year from the balance-sheet date (or a grace period cure is probable) — see ASC 470-10-45-11."),
        ("Can you net overdraft at Bank A against cash at Bank B?", "No. Different counterparties — no right of setoff. The overdraft is a liability (and a financing cash flow)."),
        ("Must a real estate company present a classified balance sheet?", "No. Many real estate entities present unclassified balance sheets because their operating cycle does not fit the current/noncurrent split; SEC Rule 5-02 still governs registrant line items."),
        ("Are lender-held replacement reserves current assets?", "Generally not when they are restricted to fund capital improvements (noncurrent assets); classify by the nature of the restriction and disclose it."),
    ],
    lens="Tenant security deposits held in trust, lender escrows (tax, insurance, replacement reserves) and the current portion of property mortgages are the classic multifamily classification questions.",
    cites=["210-10-45-4", "210-20-45-1"],
)

C(
    "215",
    tag="Reconcile beginning-to-ending equity — the bridge between two balance sheets.",
    alias=["statement of changes in equity", "stockholders equity statement", "partners capital statement", "members equity", "equity rollforward"],
    re="support",
    truth="Equity changes for only a handful of reasons: owners put money in or take it out, the business earns or loses, and a few value changes park in OCI. The statement of shareholder equity lists each cause so readers can see whether equity grew from performance or simply from new capital.",
    analogy=(
        "The Bank Statement for Ownership",
        "A checking-account statement starts with the opening balance, lists every deposit and withdrawal, and lands on the closing balance. The equity statement does the same for owners' stake: opening equity + contributions + net income − distributions ± OCI = closing equity.",
    ),
    recog=[
        "Present changes in each component of equity (capital, retained earnings/accumulated deficit, AOCI, noncontrolling interest) for every period an income statement is presented.",
        "This Topic only links to guidance — the substance is in Topic 505 (Equity) and SEC Rule 3-04 for registrants (including interim periods).",
    ],
    meas=(
        "Presentation — amounts measured under 505, 220, 718 and other Topics",
        "Contributions at the fair value of consideration received; distributions when declared.",
        "Roll forward each equity account; totals must tie to the balance sheet.",
    ),
    je=[
        (
            "Declare a quarterly distribution to LP investors",
            "A multifamily partnership's GP declares a $400,000 distribution to limited partners.",
            [("DR", "Partners' capital — distributions", 400000), ("CR", "Distributions payable", 400000)],
            "Shows as 'distributions' in the partners' capital rollforward; paid via financing cash flows.",
        ),
    ],
    traps=[
        ("Where is the substantive equity guidance?", "Topic 505 — Topic 215 only points to it."),
        ("Do SEC registrants present equity changes for interim periods?", "Yes — Regulation S-X Rule 3-04 requires changes in equity for the current and comparative year-to-date interim periods (in a statement or note)."),
        ("Are distributions in excess of earnings a loss?", "No. They reduce capital (often shown as 'distributions in excess of accumulated earnings' in REITs), not income."),
    ],
    lens="Partnership capital rollforwards (GP/LP contributions, preferred returns, promote distributions) are the multifamily version of this statement.",
    cites=["215-10-50-1"],
)

C(
    "220",
    tag="Net income plus the parked value changes (OCI) — and, from 2027, disaggregated expense captions.",
    alias=["comprehensive income", "oci", "other comprehensive income", "aoci", "recycling", "reclassification adjustments", "dise", "expense disaggregation", "asu 2024-03", "income statement"],
    re="support",
    truth="Some value changes are real but are not the result of this period's operations — translation of a foreign subsidiary, fair-value moves on a cash-flow hedge, unrealized gains on available-for-sale debt. Parking them in other comprehensive income keeps net income a clean measure of performance while still showing every change in wealth. When the parked item is realized, it is 'recycled' into net income. The newer 220-40 rules also force entities to open up the big expense lines into natural components such as employee compensation and depreciation.",
    analogy=(
        "The Stadium Parking Lot",
        "OCI is the parking lot next to the stadium. Cars (gains and losses) that arrive early wait in the lot — they are counted as 'at the event' (comprehensive income) but not yet 'in the stands' (net income). When the game starts — the hedged interest is paid, the security is sold — the cars drive into the stadium. Counting a car twice (in the lot and in the stands) is the reclassification-adjustment mistake.",
    ),
    recog=[
        "Only items specifically designated by a Topic go to OCI (e.g., AFS debt unrealized gains/losses, CTA, effective cash-flow hedge results, pension gains/losses and prior service cost).",
        "Report comprehensive income in one continuous statement or two consecutive statements.",
        "Reclassify (recycle) amounts out of AOCI when the underlying item affects earnings, with disclosure by component.",
        "220-40 (ASU 2024-03): public business entities disclose, in tabular form, the natural components of relevant expense captions — effective for annual periods beginning after December 15, 2026 (pending content).",
    ],
    meas=(
        "Presentation — the measurement comes from the underlying Topic (e.g., fair value for hedges)",
        "OCI items are measured under their governing Topic, presented net of tax or before tax with a tax line.",
        "AOCI is reclassified to earnings when the underlying transaction affects earnings.",
    ),
    je=[
        (
            "Cash-flow hedge of a floating-rate property loan",
            "A borrower designates a pay-fixed/receive-SOFR swap as a cash-flow hedge. The swap's fair value rises $180,000 during the quarter.",
            [("DR", "Derivative asset — interest rate swap", 180000), ("CR", "AOCI — cash flow hedges", 180000)],
            "Hedge accounting defers the fair-value change in AOCI.",
        ),
        (
            "Recycle hedge results as interest accrues",
            "Net swap settlements of $45,000 for the quarter reduce the effective interest cost of the hedged loan.",
            [("DR", "AOCI — cash flow hedges", 45000), ("CR", "Interest expense", 45000)],
            "Reclassification adjustment: the amount moves from the parking lot into earnings in the same line as the hedged item.",
        ),
    ],
    traps=[
        ("Can management elect to present an unusual gain in OCI?", "No. Only items that a Topic specifically designates are OCI; everything else goes through net income."),
        ("What is a reclassification adjustment?", "The entry that moves an amount previously in OCI into net income when realized — needed to avoid double counting in comprehensive income."),
        ("Do extraordinary items still exist?", "No. ASU 2015-01 eliminated them; unusual or infrequent items are presented within continuing operations or disclosed (220-20 / 225-20)."),
        ("What does DISE require in the expense note?", "Tabular disaggregation of each relevant expense caption into purchases of inventory, employee compensation, depreciation, intangible amortization and DD&A (plus certain other items), with a qualitative description of the remainder."),
    ],
    lens="Interest-rate swaps and caps on floating-rate multifamily loans are the most common source of OCI for property owners that apply hedge accounting.",
    cites=["220-40-50-6"],
)

C(
    "225",
    legacy=True,
    tag="Legacy home of income-statement guidance — now superseded and moved into Topic 220 (220-20, 220-30).",
    alias=["income statement", "statement of operations", "unusual items", "infrequent items", "business interruption insurance", "extraordinary items", "p&l", "superseded"],
    re="support",
    truth="The income statement measures how well management used resources during the period. Items that are unusual or infrequent are still part of performance — hiding them below the line would flatter results — so they stay in continuing operations but are shown or disclosed separately so readers can judge recurring earnings. Topic 225's paragraphs have been superseded: the same rules now live in Subtopics 220-20 (unusual or infrequently occurring items) and 220-30 (business interruption insurance); this card keeps the concept searchable under its legacy number.",
    analogy=(
        "The Restaurant's One-Off Wedding",
        "A café's monthly sales jump because it catered one enormous wedding. The owner still counts that revenue — it really happened — but she flags it on her report so the bank does not assume every month will look like that. That flag is the 'unusual or infrequently occurring' disclosure.",
    ),
    recog=[
        "Topic 225 is status-only in the current Codification — cite 220-20 and 220-30 for live guidance.",
        "Items that are unusual in nature or infrequent in occurrence are presented as a separate component of income from continuing operations or disclosed in the notes — never net of tax, never as extraordinary (220-20-45-1).",
        "Business-interruption insurance recoveries may be classified in any income-statement line that is not contrary to GAAP; disclose the nature and amount and the line used.",
        "Recognize insurance recoveries only when realization is probable (loss recoveries) — gain portions follow gain-contingency rules (450-30).",
    ],
    meas=(
        "Presentation — amounts measured under other Topics",
        "Measure each item under its own Topic; present pre-tax.",
        "No subsequent measurement.",
    ),
    je=[
        (
            "Business-interruption insurance recovery after a fire",
            "A 240-unit community loses three months of rent after a fire. The insurer settles the business-interruption claim for $310,000, paid in cash.",
            [("DR", "Cash — operating", 310000), ("CR", "Business interruption insurance recovery (other income)", 310000)],
            "Disclose the nature and amount and the income-statement line used; do not net it against lost rent.",
        ),
    ],
    traps=[
        ("A workpaper cites 'ASC 225-20'. Is that current?", "No. Topic 225's content was superseded and moved into Topic 220; cite 220-20 (unusual or infrequent items) or 220-30 (business interruption insurance)."),
        ("Can a hurricane loss be shown as an extraordinary item net of tax?", "No. Extraordinary items were eliminated; present the loss pre-tax within continuing operations and disclose it if unusual or infrequent."),
        ("When can a business-interruption recovery be recognized?", "When the claim is settled or the gain contingency is realized — not when the loss merely occurs (recoveries exceeding recognized losses are gain contingencies)."),
        ("Can you net the property-damage insurance recovery against the impairment loss?", "Loss recoveries up to the recognized loss may be recognized when probable; many present the recovery separately and disclose. Any excess is a gain recognized only when realized (see ASC 610-30 on involuntary conversions)."),
    ],
    lens="Casualty events at a property (fires, freezes, hurricanes) create business-interruption and property-damage claims that must be presented and disclosed under this Topic.",
    cites=["225-20-00-1"],
)

C(
    "230",
    tag="Explain the change in cash — operating, investing and financing — including restricted cash.",
    alias=["cash flow statement", "statement of cash flows", "operating activities", "investing activities", "financing activities", "indirect method", "direct method", "restricted cash", "noncash disclosure"],
    re="support",
    truth="Accrual accounting can make a company look profitable while its bank account drains. The cash-flow statement strips accruals away and shows where cash actually came from and went — running the business, investing in long-lived assets, or dealing with lenders and owners. Restricted cash is included in the totals so money cannot 'disappear' by being moved into an escrow.",
    analogy=(
        "The Household Bank Statement",
        "Your salary and grocery bills are operating flows; buying a car is investing; taking out the car loan and paying it down is financing. A raise on paper (accrued income) doesn't pay rent — only the deposit on your bank statement does. Moving money into a locked vacation savings account is not spending it; it is still your cash, just restricted.",
    ),
    recog=[
        "Explain the change during the period in total cash, cash equivalents, and restricted cash and restricted cash equivalents (230-10-45-4) — transfers between them are not cash flows.",
        "Classify each receipt and payment as operating, investing or financing by the nature of the activity; when a flow has aspects of more than one class, use the predominant source or use.",
        "Disclose significant noncash investing and financing activities (e.g., assumption of a mortgage on acquisition, ROU assets obtained for lease liabilities).",
        "Operating cash flows may be presented directly or by reconciling net income (indirect method).",
    ],
    meas=(
        "Cash basis — actual receipts and payments",
        "Report gross receipts and payments except for items with quick turnover, large amounts and short maturities (net permitted).",
        "No subsequent measurement; reconcile to the balance-sheet cash totals.",
    ),
    je=[
        (
            "Capital improvement paid from lender replacement reserve",
            "The lender releases $85,000 from the replacement-reserve escrow (restricted cash) to pay a roofing contractor for capitalized roof replacement.",
            [("DR", "Buildings and improvements", 85000), ("CR", "Restricted cash — replacement reserve", 85000)],
            "Cash-flow statement: $85,000 investing outflow (capital expenditure). The release from restricted cash is NOT a separate flow because restricted cash is inside the total.",
        ),
    ],
    traps=[
        ("Is a deposit into a lender escrow an investing outflow?", "No. Since ASU 2016-18, restricted cash is part of the cash total, so transfers between operating cash and restricted escrow are not reported as cash flows."),
        ("How are debt-prepayment penalties and extinguishment costs classified?", "Financing outflows (230-10-45-15)."),
        ("Where do lessee operating-lease payments go?", "Operating activities; finance-lease principal is financing and interest is operating for a lessee (842-20-45-5)."),
        ("A property is acquired by assuming a $20M mortgage and paying $5M cash. What is the investing outflow?", "$5M. The $20M assumed debt is a noncash investing and financing activity, disclosed separately."),
    ],
    lens="Replacement reserves, tax and insurance escrows and tenant security-deposit accounts are restricted cash; loan fundings, distributions and capital expenditures dominate the investing and financing sections for multifamily owners.",
    cites=["230-10-45-4", "230-10-45-15"],
)

C(
    "235",
    tag="Disclose the accounting policies that materially drive the numbers.",
    alias=["notes to financial statements", "accounting policies", "significant accounting policies", "policy note", "footnotes"],
    re="support",
    truth="The same transaction can be accounted for in more than one acceptable way, so numbers are meaningless unless readers know which method you picked. The policy note is the decoder ring: it discloses the principles and methods that materially affect the statements, especially where GAAP allows choices or where the industry is specialized.",
    analogy=(
        "The Recipe Card",
        "Two bakers can both make 'bread' — one with sourdough starter, one with yeast. The loaf looks similar, but you cannot compare them without the recipe card. The accounting-policy note is the recipe card attached to the financial statements.",
    ),
    recog=[
        "Describe accounting principles and methods of applying them that materially affect financial position, cash flows or results — especially choices among alternatives, industry-specific principles and unusual applications (235-10-50-3).",
        "Required in complete annual financial statements; interim statements need not repeat them if no change since year-end.",
        "Typical policies: basis of consolidation, depreciation methods, revenue recognition, capitalization thresholds, impairment, leases, derivatives.",
    ],
    meas=(
        "Disclosure only",
        "No measurement; the note describes measurement bases used elsewhere.",
        "Update when a policy changes (with ASC 250 disclosures).",
    ),
    je=[
        (
            "Capitalization policy in action — below-threshold repair",
            "Policy note states that individual expenditures under $5,000 are expensed. Maintenance replaces a $3,200 water heater.",
            [("DR", "Repairs and maintenance expense", 3200), ("CR", "Accounts payable", 3200)],
            "The entry is only defensible because the policy is documented and consistently applied; disclose the capitalization policy.",
        ),
    ],
    traps=[
        ("Should the policy note repeat details already disclosed elsewhere?", "No — avoid duplication; cross-reference to other notes (235-10-50-5)."),
        ("Does an interim report need a full policy note?", "Not if policies are unchanged since the last annual statements; disclose changes."),
        ("What policies do auditors expect from a real estate owner?", "Consolidation of JVs/VIEs, purchase-price allocation, depreciation lives, capitalization of development/interest costs, impairment, lessor revenue and collectibility, derivatives and restricted cash."),
    ],
    lens="Real estate policy notes cover capitalization thresholds, component depreciation lives, capitalized interest and carry costs, lessor straight-line and collectibility policies, and in-place lease intangibles.",
    cites=["235-10-50-1", "235-10-50-3"],
)

C(
    "250",
    tag="Principle changes and errors go back in time (retrospective); estimate changes go forward (prospective).",
    alias=["accounting changes", "error corrections", "restatement", "prior period adjustment", "change in estimate", "change in principle", "little r", "big r", "revision", "sab 108"],
    re="support",
    truth="Comparability is the whole point of financial statements. If you change an accounting principle or discover an error, prior periods must be recast as if the new principle (or correct accounting) had always applied — otherwise trend lines lie. A change in estimate is different: it reflects new information, not a mistake, so it flows through the current and future periods only.",
    analogy=(
        "The Bathroom Scale",
        "If you discover your scale was miscalibrated by 5 pounds all year, you correct every entry in your weight log (restatement). If you switch from pounds to kilograms, you convert the old entries so the chart is comparable (retrospective change in principle). But if your doctor simply revises your target weight because you're older, you don't rewrite history — you just aim differently from today (change in estimate).",
    ),
    recog=[
        "Change in accounting principle: retrospective application to all prior periods unless impracticable (250-10-45-5); only direct effects are included.",
        "Change in accounting estimate (useful lives, collectibility, salvage): current and future periods only (250-10-45-17). A change in depreciation method is a change in estimate effected by a change in principle.",
        "Error in previously issued statements: restate prior periods as a prior-period adjustment (250-10-45-23) — 'Big R' reissuance if material to prior statements, 'little r' revision if immaterial to prior periods but material to correct in the current period.",
        "Change in reporting entity: retrospective.",
    ],
    meas=(
        "Retrospective vs. prospective",
        "Cumulative effect on periods before those presented is recorded in opening retained earnings (or other equity) of the earliest period presented.",
        "Estimates: adjust prospectively; no catch-up to prior periods.",
    ),
    je=[
        (
            "Correct a prior-year error: unrecorded depreciation",
            "In 2026 the team finds that 2025 depreciation on a $4.2M building improvement was never recorded ($140,000). Prior year is closed; the error is material to 2025.",
            [("DR", "Retained earnings — prior period adjustment", 140000), ("CR", "Accumulated depreciation — buildings", 140000)],
            "Restate the 2025 comparative statements, disclose the nature of the error and its effect on each line item.",
        ),
        (
            "Change in estimate: shorten the remaining life of a roof",
            "A roof with $300,000 net book value and 10 years remaining is reassessed to 5 years remaining. New annual depreciation is $60,000 (was $30,000).",
            [("DR", "Depreciation expense", 60000), ("CR", "Accumulated depreciation — buildings", 60000)],
            "Prospective: no adjustment to prior years; disclose the effect if material.",
        ),
    ],
    traps=[
        ("Is switching from straight-line to accelerated depreciation retrospective?", "No — it is a change in estimate effected by a change in principle, applied prospectively, and must be justified as preferable."),
        ("Big R vs. little r restatement?", "Big R: error material to prior statements → reissue them with restatement labels. Little r: immaterial to prior periods but correcting in the current period would be material → revise comparatives in the current filing (SAB 108 rollover/iron-curtain analysis)."),
        ("Must a voluntary change in principle be justified?", "Yes — only if the new principle is preferable (250-10-45-2); SEC registrants need a preferability letter from the auditor."),
        ("Is correcting a misclassified capex item in the current year always allowed?", "Only if the prior-period effect is immaterial under both rollover and iron-curtain methods; otherwise restate."),
    ],
    lens="Post-close findings — unrecorded accruals, missed depreciation, wrong straight-line rent schedules — are the everyday source of prior-period adjustments in property accounting.",
    cites=["250-10-45-5", "250-10-45-17", "250-10-45-23"],
)

C(
    "255",
    tag="Optional disclosure of inflation and changing-price effects on a business.",
    alias=["changing prices", "inflation accounting", "current cost", "constant purchasing power", "price level"],
    re=None,
    truth="Historical cost statements measure in dollars of different years, which quietly overstates profits in inflationary times because old, cheap assets are matched against today's revenue. This Topic lets (but does not require) entities disclose current-cost and constant-purchasing-power information so readers can see real, inflation-adjusted performance.",
    analogy=(
        "Grandpa's Candy Bar Price",
        "Grandpa bought a candy bar for 10 cents; you pay $2. Saying candy got '20× more expensive' ignores that a dollar is worth less now. Adjusting Grandpa's dime into today's dollars (constant purchasing power) or asking what it costs to buy the same bar today (current cost) gives the real comparison.",
    ),
    recog=[
        "Disclosures are encouraged, not required, for business entities that prepare GAAP statements.",
        "Supplementary information can present income from continuing operations on a current-cost basis and purchasing-power gains/losses on net monetary items.",
        "Applies to inventory, PP&E and related expenses most affected by price changes.",
    ],
    meas=(
        "Current cost / constant purchasing power (supplementary only)",
        "Current cost is the cost to acquire the same service potential today; constant dollars restate historical amounts using the CPI-U.",
        "Recomputed each period; the primary statements stay on historical cost.",
    ),
    je=[
        (
            "No ledger entry — the primary books stay on historical cost",
            "Management chooses to disclose current-cost depreciation of $1.9M versus historical-cost depreciation of $1.4M in supplementary information. The ledger still records historical-cost depreciation.",
            [("DR", "Depreciation expense", 1400000), ("CR", "Accumulated depreciation — buildings", 1400000)],
            "The $500,000 current-cost difference is disclosed only in supplementary information, never booked.",
        ),
    ],
    traps=[
        ("Are changing-price disclosures required?", "No. They are voluntary (encouraged) for business entities."),
        ("What is a purchasing-power gain on net monetary liabilities?", "In inflation, owing fixed-dollar debt is a gain in real terms because you repay with cheaper dollars — a key point for leveraged real estate."),
        ("Does inflation-adjusted information replace GAAP amounts?", "No — it is supplementary; historical cost remains the basis of the primary statements."),
    ],
    cites=[],
)

C(
    "260",
    tag="Earnings per share: profit for each common share, basic and fully diluted.",
    alias=["eps", "earnings per share", "basic eps", "diluted eps", "treasury stock method", "if-converted", "two-class method", "weighted average shares", "antidilution"],
    re=None,
    truth="Investors own shares, not companies, so they need profit expressed per share. Basic EPS divides profit available to common holders by shares actually outstanding; diluted EPS asks the worst-case question — what if every option, warrant and convertible that would reduce EPS were exercised? Showing both prevents management from hiding dilution in the fine print.",
    analogy=(
        "Splitting the Pizza",
        "Eight friends split a pizza: one slice each (basic EPS). But three more friends hold 'IOU a slice' coupons they can redeem any time. Diluted EPS counts them too: 8 slices over 11 people. Coupons that would give someone more than a normal slice (antidilutive) are ignored because they wouldn't reduce anyone's share.",
    ),
    recog=[
        "Public entities (and entities filing to issue securities) present basic and diluted EPS on the face of the income statement for income from continuing operations and net income.",
        "Basic EPS = income available to common stockholders ÷ weighted-average common shares outstanding (260-10-45-10).",
        "Diluted EPS adds potential common shares using the treasury stock method (options/warrants) and the if-converted method (convertibles) — only if dilutive.",
        "Participating securities (e.g., unvested restricted shares with nonforfeitable dividends, OP units in some structures) require the two-class method.",
    ],
    meas=(
        "Ratio — weighted-average shares",
        "Weight shares by the portion of the period outstanding; retroactively adjust for stock splits and dividends.",
        "Recompute each period; year-to-date diluted EPS is computed independently, not by adding quarters.",
    ),
    je=[
        (
            "Preferred dividends reduce the EPS numerator",
            "A company declares $250,000 of cumulative preferred dividends. Net income is $5,000,000; income available to common is $4,750,000.",
            [("DR", "Retained earnings", 250000), ("CR", "Dividends payable — preferred", 250000)],
            "EPS numerator deducts cumulative preferred dividends for the period whether or not declared.",
        ),
    ],
    traps=[
        ("Do you include antidilutive options in diluted EPS?", "No. Potential shares are included only if they reduce EPS (or increase loss per share); the control number is income from continuing operations."),
        ("How are shares from a stock split treated?", "Retroactively restate all periods presented as if the split occurred at the beginning of the earliest period."),
        ("When is the two-class method required?", "When participating securities exist — e.g., unvested share-based awards with nonforfeitable rights to dividends. Losses are not allocated to participating securities that do not share in losses."),
        ("Are UPREIT operating-partnership units dilutive?", "Redeemable OP units are evaluated as potential common shares (if-converted); the income attributable to them is added back to the numerator."),
    ],
    cites=["260-10-45-10"],
)

C(
    "270",
    tag="Quarterly reports are an integral part of the annual period, not mini-years.",
    alias=["interim reporting", "quarterly reporting", "10-q", "integral view", "discrete view", "interim tax rate", "estimated annual effective tax rate"],
    re="support",
    truth="A quarter is a slice of a year, and many costs (annual bonuses, property taxes, repairs) benefit the whole year. Under the integral view, interim periods estimate and allocate year-long items so each quarter reflects its fair share, while still recognizing real events — like an impairment — when they happen.",
    analogy=(
        "Paying for a Year-Long Gym Membership",
        "If you pay a $1,200 annual gym fee in January, you don't say January cost $1,200 and the rest of the year was free. You think of it as $100 a month. Interim reporting spreads year-long costs across the quarters that benefit from them.",
    ),
    recog=[
        "Each interim period is viewed primarily as an integral part of the annual period (270-10-45-1 to 45-2).",
        "Revenue is recognized on the same basis as the annual period; costs directly associated with revenue follow the annual method.",
        "Costs that benefit more than one interim period (e.g., annual property taxes, major repairs) may be allocated among periods.",
        "Income taxes use an estimated annual effective tax rate applied to year-to-date ordinary income (ASC 740-270).",
    ],
    meas=(
        "Same measurement as annual, with estimates allocated",
        "Apply annual policies; estimate annual amounts and allocate them to periods benefited.",
        "Re-estimate each quarter; changes are accounted for prospectively in the current interim period.",
    ),
    je=[
        (
            "Accrue one quarter of annual property taxes",
            "A community's annual real-estate tax bill is estimated at $960,000, payable in December. Q1 accrual:",
            [("DR", "Real estate tax expense", 240000), ("CR", "Accrued real estate taxes", 240000)],
            "Re-estimate each quarter when assessments or millage rates change.",
        ),
    ],
    traps=[
        ("Can an impairment loss be deferred to later quarters?", "No. Losses that are not temporary (impairments, inventory write-downs that won't recover) are recognized in the interim period they occur."),
        ("Is the interim tax provision computed on quarterly income alone?", "No. Apply the estimated annual effective rate to year-to-date ordinary income; discrete items are recorded in the quarter they occur."),
        ("What does ASU 2025-11 change?", "It clarifies interim reporting: a comprehensive list of interim disclosure requirements in Topic 270 and a principle to disclose events since the last annual period that have a material impact (pending content, effective for PBE interim periods in fiscal years beginning after December 15, 2027)."),
    ],
    lens="Property tax, insurance and annual contract accruals are allocated monthly/quarterly on the integral view in property accounting closes.",
    cites=["270-10-45-1"],
)

C(
    "272",
    tag="LLCs report like their structure: members' equity, no LLC-level tax unless it applies.",
    alias=["llc", "limited liability company", "members equity", "limited liability entities", "pass-through"],
    re="support",
    truth="An LLC mixes corporate liability protection with partnership-style tax pass-through. Its statements must present equity as members' equity (by class if classes differ) and should only show income taxes the LLC itself owes, because members usually pay tax on their share of income.",
    analogy=(
        "A Roommate House with a Shared Lease Shield",
        "Four roommates form a household LLC: nobody's personal savings can be seized if the house is sued, but each roommate reports their own share of the household's profits on their own tax return. The household's books show each roommate's stake (members' equity) and no tax bill of its own.",
    ),
    recog=[
        "Present members' equity (and changes in it) in the statement of financial position; disclose by class if classes have different rights.",
        "Do not present an LLC-level income tax provision unless the LLC is itself taxable (e.g., elected corporate treatment, state entity-level taxes).",
        "Disclose limited-life provisions and different classes of members' interests.",
    ],
    meas=(
        "Same as other entities — Topic 272 is presentation/disclosure",
        "Assets and liabilities measured under the applicable Topics.",
        "Allocate income to members per the operating agreement.",
    ),
    je=[
        (
            "Allocate net income to LLC members",
            "An LLC owning a 180-unit property earns $900,000; the operating agreement allocates 90% to the investor member and 10% to the managing member.",
            [("DR", "Income summary", 900000), ("CR", "Members' equity — investor member", 810000), ("CR", "Members' equity — managing member", 90000)],
            "Allocation per operating agreement; distributions reduce each member's capital account.",
        ),
    ],
    traps=[
        ("Should a single-property LLC record federal income tax expense?", "Generally no — it is disregarded or a partnership for tax; members pay the tax. Record only entity-level taxes (e.g., Texas margin tax)."),
        ("How is equity labeled?", "Members' equity, not stockholders' equity or partners' capital; disclose classes and rights."),
        ("Is a waterfall promote allocation GAAP income allocation?", "Allocation follows the operating agreement; hypothetical liquidation at book value (HLBV) is common practice for complex waterfalls."),
    ],
    lens="Most multifamily properties are held in single-asset LLCs; members' equity rollforwards and waterfall allocations are routine.",
    cites=["272-10-05-2"],
)

C(
    "274",
    tag="Personal financial statements: individuals present assets at estimated current value, not cost.",
    alias=["personal financial statements", "net worth statement", "estimated current value", "individual financial statements"],
    re=None,
    truth="An individual's financial statement is used by lenders to judge what the person could pay back today, so historical cost is useless. Personal statements show assets at estimated current values, liabilities at current amounts, and even the estimated taxes that would be owed if the assets were sold — the result is a realistic net worth.",
    analogy=(
        "The Mortgage Application",
        "When you apply for a mortgage, the bank does not care that you bought your car for $40,000 five years ago; it wants to know what the car is worth today and what you still owe on it. A personal financial statement is that honest 'if I sold everything today' snapshot.",
    ),
    recog=[
        "Present a statement of financial condition (assets at estimated current value, liabilities at estimated current amounts) and optionally a statement of changes in net worth.",
        "Recognize estimated income taxes on the differences between current values and tax bases.",
        "Business interests are presented as a single net investment at estimated current value.",
    ],
    meas=(
        "Estimated current value",
        "Current values based on market quotations, appraisals, discounted cash flows or recent transactions (274-10-35-1).",
        "Remeasure at each statement date; apply methods consistently.",
    ),
    je=[
        (
            "Mark a personal real estate holding to estimated current value",
            "An individual's rental duplex (cost $600,000) is appraised at $910,000; estimated tax on the unrealized gain is $65,000.",
            [("DR", "Investment in real estate (estimated current value)", 310000), ("CR", "Estimated income taxes on unrealized appreciation", 65000), ("CR", "Net worth", 245000)],
            "Personal statements present appreciation net of estimated taxes; this is not a GAAP entity-ledger entry.",
        ),
    ],
    traps=[
        ("Are personal assets shown at cost?", "No — at estimated current value; cost basis is disclosed only as needed for the tax computation."),
        ("How is a closely held business presented?", "As one line — the net investment at estimated current value — not consolidated."),
        ("Are estimated taxes on unrealized gains recorded?", "Yes, as if the assets were realized at their current values."),
    ],
    cites=["274-10-35-1"],
)

C(
    "275",
    tag="Disclose the risks that could hit you hard and soon: estimates and concentrations.",
    alias=["risks and uncertainties", "concentrations", "significant estimates", "vulnerability", "use of estimates"],
    re="support",
    truth="Financial statements are full of estimates and depend on customers, suppliers and markets that could change. Readers cannot see those vulnerabilities from the numbers, so management must disclose the nature of operations, the use of estimates, estimates reasonably possible to change materially in the near term, and concentrations that make a severe impact reasonably possible.",
    analogy=(
        "The Food-Truck with One Customer",
        "A food truck that sells 80% of its lunches to one office tower is doing fine — until that tower closes. Anyone investing in the truck deserves to know about that single-customer dependency even though today's sales look healthy.",
    ),
    recog=[
        "Disclose nature of operations and use of estimates in every set of statements.",
        "Disclose significant estimates when it is at least reasonably possible the estimate will change in the near term (within one year) and the effect would be material.",
        "Disclose concentrations (customer, supplier, market, geographic, labor) when they make the entity vulnerable to a near-term severe impact that is at least reasonably possible (275-10-50-16).",
    ],
    meas=(
        "Disclosure only",
        "No measurement; describes uncertainty in amounts measured elsewhere.",
        "Update each period.",
    ),
    je=[
        (
            "Estimate that is reasonably possible to change: allowance for uncollectible rent",
            "A portfolio concentrated in one metro records a $120,000 increase in its reserve for uncollectible non-lease receivables after a large employer announces layoffs; management discloses the estimate is reasonably possible to change.",
            [("DR", "Bad debt expense", 120000), ("CR", "Allowance for doubtful accounts", 120000)],
            "The entry follows ASC 326 (or 842 for lease receivables); ASC 275 drives the disclosure of the vulnerability.",
        ),
    ],
    traps=[
        ("Does 'reasonably possible' mean likely?", "No — it is more than remote but less than likely, the same scale as ASC 450."),
        ("Must you disclose that 100% of revenue comes from one metro area?", "If it creates vulnerability to a near-term severe impact that is reasonably possible, yes — geographic concentration disclosure."),
        ("Where are cash concentrations above FDIC limits disclosed?", "Credit-risk concentrations are disclosed under ASC 825-10-50-20; many entities also discuss them in the ASC 275 note."),
    ],
    lens="Single-market portfolios, dependence on one employer or university, and reliance on one property manager are typical concentration disclosures in multifamily statements.",
    cites=["275-10-50-1", "275-10-50-16"],
)

C(
    "280",
    tag="Show the business through management's eyes: reportable segments and significant segment expenses.",
    alias=["segment reporting", "segments", "codm", "chief operating decision maker", "reportable segment", "management approach", "asu 2023-07", "segment expenses"],
    re="support",
    truth="A consolidated total can hide a growing business subsidizing a dying one. Segment reporting uses the 'management approach' — show the pieces exactly the way the chief operating decision maker (CODM) reviews them to allocate resources — so investors see the business through management's eyes. Since ASU 2023-07, significant segment expenses regularly provided to the CODM must also be disclosed.",
    analogy=(
        "The Department Store Manager's Dashboard",
        "The store manager doesn't look at one total sales number; she reviews shoes, apparel and electronics separately to decide where to add staff. Segment reporting simply publishes the dashboard she already uses.",
    ),
    recog=[
        "Identify operating segments: components that earn revenue and incur expenses, whose results are regularly reviewed by the CODM, and for which discrete financial information is available (280-10-50-1).",
        "Reportable segments: 10% thresholds on revenue, profit/loss or assets; reportable segments must cover at least 75% of consolidated external revenue.",
        "Disclose a segment profit measure, significant segment expenses provided to the CODM, other segment items, and reconciliations to consolidated totals (quarterly and annually after ASU 2023-07).",
        "Applies to public entities; entities with a single segment still provide full segment disclosures.",
    ],
    meas=(
        "Management approach — whatever measure the CODM uses",
        "Segment amounts are as reported to the CODM (NOI is common for REITs), even if not GAAP.",
        "Reconcile segment totals to consolidated GAAP amounts every period.",
    ),
    je=[
        (
            "No separate ledger entry — segment data is a view of existing entries",
            "A REIT's CODM reviews same-store NOI by region. A $90,000 repair expense at a Sun Belt property is recorded normally and tagged to the Sun Belt segment through the property dimension.",
            [("DR", "Repairs and maintenance expense", 90000), ("CR", "Accounts payable", 90000)],
            "Segment reporting is driven by dimensions/tagging in the GL, not separate entries.",
        ),
    ],
    traps=[
        ("Who is the CODM?", "A function, not a title — the individual or group that allocates resources and assesses performance (often the CEO or an executive committee). Disclose title/position."),
        ("Can a single-segment public company skip segment disclosures?", "No. After ASU 2023-07, entities with one reportable segment provide all required segment disclosures, including significant expenses."),
        ("Can segments be aggregated to hide a weak unit?", "Only if they have similar economic characteristics and are similar in all aggregation criteria; SEC staff challenges aggregation frequently."),
        ("Is NOI an acceptable segment measure?", "Yes if that is what the CODM uses, with a reconciliation to consolidated GAAP income."),
    ],
    lens="Public REITs commonly report segments by property type or region using NOI; the property and region dimensions in the GL drive the disclosure.",
    cites=["280-10-50-1"],
)
