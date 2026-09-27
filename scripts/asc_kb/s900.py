"""900s Industry Topics."""

from . import C

C(
    "905",
    tag="Agriculture: growing crops and animals are inventory-like costs; cooperatives and patrons have special rules.",
    alias=["agriculture", "farming", "crops", "livestock", "cooperatives", "patronage", "orchards", "vineyards"],
    re=None,
    truth="A farmer's costs build up in crops and herds long before anything is sold, so growing crops and developing animals accumulate cost like inventory, and long-lived orchards and breeding animals are depreciated like equipment. Cooperatives return earnings to member-patrons based on business done, which is why patronage allocations have their own accounting.",
    analogy=(
        "The Backyard Apple Tree",
        "The seeds, fertilizer and water you pour into this year's apples are the cost of this year's harvest. The apple tree itself, which will fruit for 20 years, is equipment — its cost is spread over those harvests.",
    ),
    recog=[
        "Capitalize costs of growing crops and developing animals held for sale as inventory; expense costs of normal operations when incurred (905-330).",
        "Permanent land development costs are not depreciated; orchards, vineyards and production animals are capitalized during development and depreciated once productive (905-360).",
        "Cooperatives record patronage refunds to members; patrons recognize allocations when notified (905-325).",
        "Source library holds the Overall subtopic (905-10); the industry subtopics (905-330, 905-360, etc.) are referenced there.",
    ],
    meas=(
        "Lower of cost and net realizable value (inventory); cost less depreciation (productive assets)",
        "Accumulate direct and indirect production costs.",
        "Harvested crops may be carried at NRV when immediately marketable at quoted prices, per industry practice.",
    ),
    je=[
        (
            "Capitalize crop-growing costs",
            "A grower spends $180,000 on seed, fertilizer and labor for this season's crop.",
            [("DR", "Inventory — growing crops", 180000), ("CR", "Cash — operating", 180000)],
            "Relieved to cost of sales when the harvest is sold.",
        ),
    ],
    traps=[
        ("Is a vineyard's development cost expensed?", "No — capitalized during development and depreciated over its productive life once commercially productive."),
        ("Can harvested commodities be carried above cost?", "Industry practice permits NRV for harvested crops with immediate marketability at quoted prices and insignificant disposal costs."),
        ("Are patronage dividends from a coop revenue for the member?", "They reduce the member's cost of purchases (or are income if related to sales), recognized when allocated."),
    ],
    cites=["905-10-05-1"],
)

C(
    "908",
    tag="Airlines: industry scope for revenue cycle, flight equipment and maintenance (overview in this source).",
    alias=["airlines", "aircraft", "flight equipment", "frequent flyer", "air traffic liability", "overhaul", "landing slots"],
    re=None,
    truth="Airlines sell tickets long before flights, own fleets of mobile equipment and must maintain them under strict schedules. The industry Topic points to how these realities interact with general GAAP: tickets are contract liabilities (air traffic liability) until flown, aircraft are depreciated by component, and maintenance policies must be applied consistently.",
    analogy=(
        "The Concert Tour Bus Company",
        "A bus company sells tour seats months ahead, owns buses that are always on the road, and must rebuild engines every few years. It earns the fare when the trip happens, and plans for overhauls as part of owning the buses.",
    ),
    recog=[
        "Ticket sales: contract liability (air traffic liability) until transportation is provided (ASC 606).",
        "Loyalty points: separate performance obligation with deferred revenue.",
        "Maintenance: expense-as-incurred, built-in overhaul, or deferral methods applied consistently.",
        "Source library contains the Overall subtopic; industry subtopics are referenced.",
    ],
    meas=(
        "Per underlying Topics (606, 360)",
        "Allocate ticket price between transportation and loyalty points by standalone selling price.",
        "Recognize breakage on unused tickets under 606 breakage guidance.",
    ),
    je=[
        (
            "Sell advance tickets",
            "An airline sells $2,500,000 of tickets for flights next month.",
            [("DR", "Cash — operating", 2500000), ("CR", "Air traffic liability", 2500000)],
            "Revenue recognized when flown.",
        ),
    ],
    traps=[
        ("When is ticket revenue recognized?", "When the transportation is provided (flown), not when sold."),
        ("How is expected ticket breakage handled?", "Recognized in proportion to the pattern of rights exercised if the airline expects to be entitled to breakage (606-10-55-48)."),
        ("Are landing slots amortized?", "Slots with indefinite lives are not amortized but tested for impairment."),
    ],
    cites=["908-10-05-1"],
)

C(
    "910",
    tag="Construction contractors: contract costs, use rates for equipment, and retainage — revenue itself follows 606.",
    alias=["construction contractors", "contract costs", "retainage", "general contractor", "percentage of completion", "cost to cost", "underbillings", "overbillings", "wip schedule"],
    re="support",
    truth="A contractor's profit depends on accurately tracking the costs of each job. Revenue for construction contracts now follows ASC 606 (usually over time), but this Topic keeps industry guidance on which costs belong to contracts (equipment use rates, small tools, pre-contract costs) and on presenting retainage and contract balances.",
    analogy=(
        "The Custom Home Builder's Job Folders",
        "A builder keeps one folder per house: lumber, labor, crane rental hours. Only by charging each cost to the right folder can she tell which houses make money — and the owner's 10% holdback (retainage) is money earned but not yet collectible.",
    ),
    recog=[
        "Contract costs include direct costs and allocable indirect costs; construction equipment costs may be charged using use rates (910-20-25-1).",
        "Revenue: ASC 606 — typically over time using a cost-to-cost input method when the customer controls the work in progress.",
        "Retainage receivable/payable presented and disclosed; contract assets (underbillings) and contract liabilities (overbillings).",
        "Anticipated losses on contracts are recognized immediately (605-35 remnant for provisions for losses).",
    ],
    meas=(
        "Cost-to-cost progress (606), contract costs at cost",
        "Measure progress as costs incurred ÷ total estimated costs.",
        "Update estimates each period with cumulative catch-up.",
    ),
    je=[
        (
            "Owner's view: construction draw with 10% retainage",
            "A developer approves a GC pay application for $500,000 with 10% retainage.",
            [("DR", "Construction in progress", 500000), ("CR", "Retainage payable", 50000), ("CR", "Accounts payable — general contractor", 450000)],
            "Retainage is paid at substantial completion after lien waivers.",
        ),
    ],
    traps=[
        ("Is retainage a contingent liability for the owner?", "No — it is a liability for work performed; only payment timing is deferred (release conditions)."),
        ("Where does construction revenue guidance live now?", "ASC 606; Topic 910 retains cost and presentation guidance."),
        ("When are losses on a fixed-price contract recognized?", "As soon as the loss is evident — the full expected loss, not just the portion to date."),
    ],
    lens="Development and renovation projects track GC draws, retainage and change orders in job-cost modules; contractors on the other side apply 910/606.",
    cites=["910-20-25-1"],
)

C(
    "912",
    tag="Federal government contractors: cost-plus contracts, allowable costs and terminations.",
    alias=["government contractors", "federal contracts", "cost plus", "far", "cas", "unallowable costs", "contract termination claims"],
    re=None,
    truth="Selling to the federal government means dealing with a sovereign customer that sets cost rules (FAR/CAS), can audit, and can terminate for convenience. Contractors track allowable vs. unallowable costs carefully because revenue on cost-plus contracts depends on them, and termination claims are recognized when realization is probable.",
    analogy=(
        "The Reimbursed Business Trip",
        "Your employer reimburses travel costs — but not the minibar. You carefully separate allowable from unallowable receipts because only the allowable ones come back, and an auditor may check.",
    ),
    recog=[
        "Cost-plus revenue follows ASC 606, with variable fees estimated and constrained.",
        "Unallowable costs are excluded from amounts billed to the government.",
        "Termination-for-convenience claims recognized when realization is probable and estimable (912-20-25).",
    ],
    meas=(
        "Transaction price under 606 (costs + fee)",
        "Estimate award/incentive fees as variable consideration.",
        "Adjust for audit disallowances when probable.",
    ),
    je=[
        (
            "Bill allowable costs plus fixed fee",
            "A contractor incurs $900,000 of allowable costs; fixed fee earned is $54,000.",
            [("DR", "Unbilled receivables — government contracts", 954000), ("CR", "Contract revenue", 954000)],
            "Over-time recognition as costs are incurred.",
        ),
    ],
    traps=[
        ("Are unallowable costs billable?", "No — they are expensed and excluded from government billings."),
        ("When are termination claims recognized?", "When realization is probable and the amount estimable — gain-contingency rules apply to amounts above cost."),
        ("Is the government a 'customer' under 606?", "Yes — contracts with the government are contracts with customers."),
    ],
    cites=["912-10-05-3"],
)

C(
    "915",
    legacy=True,
    tag="Development stage entities — reporting requirements removed (ASU 2014-15); Topic is status-only.",
    alias=["development stage", "start-up company", "inception-to-date", "asu 2014-15", "superseded"],
    re=None,
    truth="Start-ups once had to present inception-to-date information and label themselves 'development stage entities'. FASB removed the concept because it added cost without useful information — a young company follows the same GAAP as everyone else, with going-concern and risk disclosures doing the real work.",
    analogy=(
        "The Training Wheels Removed",
        "Kids used to ride with training wheels labeled 'beginner'. Once the rules said everyone rides the same bike, the label disappeared — beginners just ride carefully and wear a helmet (going-concern and risk disclosures).",
    ),
    recog=[
        "No separate recognition model: development-stage presentation requirements were removed by ASU 2014-15 (effective 2015).",
        "Start-up costs are expensed under ASC 720-15; going-concern evaluation under ASC 205-40.",
        "The source library holds only status content for this Topic.",
    ],
    meas=(
        "Same as other entities",
        "Apply the governing Topics.",
        "No inception-to-date presentation.",
    ),
    je=[
        (
            "Organization costs of a new property-management venture",
            "Legal and formation costs of $40,000 for a newly formed entity.",
            [("DR", "Organization costs expense", 40000), ("CR", "Cash — operating", 40000)],
            "Expensed under ASC 720-15; no development-stage labeling.",
        ),
    ],
    traps=[
        ("Must start-ups present inception-to-date results?", "No — removed by ASU 2014-15."),
        ("Where do start-up costs go?", "Expensed as incurred (720-15)."),
        ("Is a going-concern evaluation still required?", "Yes, under ASC 205-40 for every entity."),
    ],
    cites=["915-10-00-1"],
)

C(
    "920",
    tag="Broadcasters: program rights and barter — Topic overview (industry subtopics referenced).",
    alias=["broadcasters", "program rights", "licenses", "fcc license", "barter", "network affiliation"],
    re=None,
    truth="A TV station buys rights to air programs and earns ad revenue when they air. Program rights are assets recognized when the license period begins and the program is available, amortized as aired; FCC licenses are intangibles often with indefinite lives.",
    analogy=(
        "The Movie-Night Subscription",
        "A community theater buys the rights to show a film ten times this year. The rights are an asset when the film arrives and can be shown, and each screening uses part of the cost.",
    ),
    recog=[
        "Recognize program rights as assets when the license period begins, the cost is known, the program is accepted and available for first showing (920-350).",
        "Amortize based on estimated number of showings or revenue pattern.",
        "FCC licenses: indefinite-lived intangibles tested for impairment.",
    ],
    meas=(
        "Cost less amortization (program rights)",
        "Initial: gross license fee (present value if significant financing).",
        "Subsequent: amortize; impairment to net realizable value.",
    ),
    je=[
        (
            "Recognize available program rights",
            "A station's license for a syndicated series ($600,000) becomes available for airing.",
            [("DR", "Program rights", 600000), ("CR", "Program rights obligations", 600000)],
            "Amortize as episodes air.",
        ),
    ],
    traps=[
        ("When are program rights recognized?", "When the license period begins and all conditions are met — not at contract signing."),
        ("Are FCC licenses amortized?", "Typically not (indefinite life), but tested for impairment annually."),
        ("How is advertising barter valued?", "At fair value of goods/services received (606 noncash consideration)."),
    ],
    cites=["920-10-05-1"],
)

C(
    "922",
    tag="Cable television: prematurity period and system construction costs — Topic overview.",
    alias=["cable television", "prematurity period", "cable systems", "franchise costs", "hookup"],
    re=None,
    truth="Building a cable system takes years before subscribers fill it. During the prematurity period, costs are allocated between the portion serving current subscribers (expensed) and the portion for future subscribers (capitalized), so early losses aren't overstated nor profits flattered.",
    analogy=(
        "Building a New Subdivision's Water Lines",
        "A utility lays pipes for 1,000 homes when only 200 are occupied. Costs to serve those 200 are today's expense; the capacity for the future 800 is an investment.",
    ),
    recog=[
        "During prematurity, capitalize system costs and allocate certain costs between current and future subscribers (922-360).",
        "Initial hookup revenue recognized to the extent of direct selling costs; installation costs capitalized.",
        "Franchise costs capitalized and amortized.",
    ],
    meas=(
        "Cost less depreciation",
        "Allocate prematurity costs by subscriber fraction.",
        "Depreciate plant over useful life.",
    ),
    je=[
        (
            "Capitalize new-subscriber installation costs",
            "Installation labor and materials for new drops cost $75,000.",
            [("DR", "Cable plant — subscriber installations", 75000), ("CR", "Accounts payable", 75000)],
            "Depreciated over the estimated period of benefit.",
        ),
    ],
    traps=[
        ("What is the prematurity period?", "The period before the system reaches break-even subscriber levels (usually ≤2 years) during which special cost allocation applies."),
        ("Are reconnection costs capitalized?", "No — expensed as incurred."),
        ("Who applies this Topic?", "Cable system operators; the source library contains only the Overall overview."),
    ],
    cites=["922-10-05-1"],
)

C(
    "924",
    tag="Casinos: gaming chips, promotional allowances and base-jackpot accruals — Topic overview.",
    alias=["casinos", "gaming", "chips", "jackpots", "promotional allowances", "comps"],
    re=None,
    truth="Casinos hold customers' money as chips, promise progressive jackpots and give away free rooms and meals to gamblers. Outstanding chips are liabilities, progressive jackpots are accrued as the obligation builds (base jackpots only when won or unavoidable), and 'comps' are part of the gaming transaction under ASC 606.",
    analogy=(
        "Arcade Tokens",
        "When you buy $20 of arcade tokens, the arcade owes you play (or a refund) until you spend them — the tokens in your pocket are the arcade's liability.",
    ),
    recog=[
        "Chips in customers' hands are a liability.",
        "Progressive jackpots accrued as the incremental amount builds; base jackpots not accrued if the casino can avoid payment by removing the machine.",
        "Complimentaries: allocate gaming revenue to comps by standalone selling price (606).",
    ],
    meas=(
        "Net win (gaming revenue) under 606",
        "Gaming revenue is net of payouts.",
        "Update jackpot accruals as play occurs.",
    ),
    je=[
        (
            "Accrue progressive jackpot increment",
            "A progressive slot's jackpot meter increases by $30,000 during the month.",
            [("DR", "Gaming revenue (reduction)", 30000), ("CR", "Progressive jackpot liability", 30000)],
            "Base jackpots are not accrued before being won when payment is avoidable.",
        ),
    ],
    traps=[
        ("Are base jackpots accrued?", "No, if the casino can avoid paying by removing the game; incremental progressive amounts are accrued."),
        ("How are comps presented?", "Gaming revenue is allocated to the comped goods/services (e.g., room revenue) under 606."),
        ("Is gaming revenue gross wagers?", "No — net win (wagers less payouts)."),
    ],
    cites=["924-10-05-2"],
)

C(
    "926",
    tag="Films: capitalize film costs, amortize using individual-film-forecast, test for impairment.",
    alias=["film costs", "films", "entertainment", "individual film forecast", "participation costs", "episodic television", "content"],
    re=None,
    truth="A film costs a fortune before earning anything, and its revenue arrives unevenly over years through theaters, streaming and licensing. So production costs are capitalized and amortized in proportion to revenue as it's earned (individual-film-forecast method), with impairment testing when the film won't recover its cost.",
    analogy=(
        "The Self-Published Novel",
        "An author spends $50,000 producing a book expected to earn $200,000 over five years. Each year, she expenses the share of production cost matching that year's share of total expected sales.",
    ),
    recog=[
        "Report film costs as a separate asset (926-20-25-1); production overhead included; administrative/distribution costs excluded.",
        "Amortize using the individual-film-forecast method (current revenue ÷ ultimate revenue) or monetized with a group of films.",
        "Test for impairment when indicators exist (fair value, individually or in a film group).",
        "Participation costs accrued as revenue is recognized.",
    ],
    meas=(
        "Capitalized cost less amortization and impairment",
        "Accumulate production costs, including capitalized interest where applicable.",
        "Amortize by revenue ratio; revise ultimate revenue estimates prospectively.",
    ),
    je=[
        (
            "Amortize film costs",
            "A $10,000,000 film expects $25,000,000 ultimate revenue; this year's revenue is $5,000,000 (20%).",
            [("DR", "Film cost amortization", 2000000), ("CR", "Film costs", 2000000)],
            "Individual-film-forecast method.",
        ),
    ],
    traps=[
        ("Are marketing costs capitalized into film costs?", "No — exploitation/marketing costs are expensed as incurred (advertising)."),
        ("How long can ultimate revenue be projected?", "Generally up to 10 years from initial release (20 years for acquired libraries)."),
        ("Is impairment tested per film?", "Individually, or at the film-group level when monetized as a group (e.g., streaming)."),
    ],
    cites=["926-20-25-1"],
)

C(
    "928",
    tag="Music: advances to artists and license fees for masters and copyrights — Topic overview.",
    alias=["music", "royalties", "record masters", "artist advances", "copyrights"],
    re=None,
    truth="Record labels pay artists advances before knowing whether songs will sell. An advance is an asset only if past performance and current popularity make recovery from future royalties likely; otherwise it's expensed. Licensing revenue follows ASC 606's IP license guidance.",
    analogy=(
        "The Book Advance",
        "A publisher advances a famous author $100,000 against future royalties — likely recoverable. The same advance to an unknown first-time author is closer to a bet, better expensed.",
    ),
    recog=[
        "Capitalize artist advances when past performance and current popularity provide a sound basis for estimating recovery from future royalties.",
        "Cost of record masters is capitalized when recoverable from future sales.",
        "License revenue: ASC 606 IP licensing (functional IP at a point in time; sales-based royalties when sales occur).",
    ],
    meas=(
        "Recoverable cost",
        "Advances recorded as assets to the extent recoverable.",
        "Charge to expense as royalties are earned; write down unrecoverable amounts.",
    ),
    je=[
        (
            "Recoverable artist advance",
            "A label pays a proven artist a $250,000 advance recoupable from royalties.",
            [("DR", "Royalty advances", 250000), ("CR", "Cash — operating", 250000)],
            "Reduced as royalties are earned; expensed if recoupment becomes unlikely.",
        ),
    ],
    traps=[
        ("Is every advance an asset?", "No — only if recovery is reasonably assured based on past performance and popularity."),
        ("How are sales-based royalties recognized by the licensor?", "When the later of the sale or usage occurs and the performance obligation is satisfied (606 royalty exception)."),
        ("Source note", "The library contains the Overall subtopic only; industry subtopics are referenced in 928-10-05-1."),
    ],
    cites=["928-10-05-1"],
)

C(
    "930",
    tag="Mining: exploration, development and production phases; stripping costs are production costs.",
    alias=["mining", "extractive", "stripping costs", "mineral rights", "exploration", "development stage mine"],
    re=None,
    truth="Mining is a long bet on what lies underground. Exploration spending before proven reserves exist is usually expensed because the payoff is uncertain; costs to develop a proven mine are capitalized; and waste removal once production starts (stripping) is a cost of the ore extracted in that period.",
    analogy=(
        "Digging for a Buried Treasure Chest",
        "Money spent searching the beach is a gamble (expensed). Once you've found the chest, the cost of digging the tunnel to reach it is part of the treasure's cost (capitalized). Shoveling sand while hauling it out is the cost of that day's haul.",
    ),
    recog=[
        "Exploration costs generally expensed until reserves are established; mineral rights acquisition capitalized.",
        "Development costs capitalized; depleted using units-of-production.",
        "Stripping costs incurred during the production phase are variable production costs included in inventory (930-330).",
    ],
    meas=(
        "Cost; units-of-production depletion",
        "Capitalized development costs and mineral rights at cost.",
        "Deplete over proven and probable reserves.",
    ),
    je=[
        (
            "Production-phase stripping costs",
            "A producing mine incurs $400,000 of stripping costs this month.",
            [("DR", "Inventory — ore", 400000), ("CR", "Accounts payable", 400000)],
            "Production-phase stripping is inventoried, not capitalized as PP&E.",
        ),
    ],
    traps=[
        ("Are production-phase stripping costs capitalized to PP&E?", "No — they are inventory production costs."),
        ("Is mineral exploration capitalized?", "Generally expensed before reserves are established (differs from oil & gas successful-efforts rules)."),
        ("Depletion method?", "Units-of-production based on reserves."),
    ],
    cites=["930-10-05-2"],
)

C(
    "932",
    tag="Oil and gas: successful efforts vs. full cost; reserves disclosures (SEC).",
    alias=["oil and gas", "successful efforts", "full cost", "reserves", "dry hole", "depletion", "ceiling test", "extractive"],
    re=None,
    truth="Drilling is a lottery: some wells hit, many are dry. Successful-efforts accounting capitalizes only the costs tied to discoveries and expenses dry holes; the full-cost method (SEC-permitted) capitalizes all exploration costs in a country-wide pool subject to a ceiling test. Either way, reserve quantities drive depletion and must be disclosed.",
    analogy=(
        "Buying Lottery Tickets",
        "Successful efforts: you only count the cost of winning tickets as your 'investment' and write off the losers. Full cost: you treat all tickets bought as the cost of your winnings, as long as winnings exceed the pile.",
    ),
    recog=[
        "Successful efforts: capitalize acquisition and successful exploratory/development costs; expense geological & geophysical and dry-hole costs.",
        "Full cost (SEC rules, Reg S-X 4-10): capitalize all costs in cost centers, subject to a quarterly ceiling test.",
        "Supplementary reserve-quantity and standardized-measure disclosures (932-235).",
    ],
    meas=(
        "Cost less depletion (units-of-production)",
        "Capitalize per method.",
        "Deplete using proved (developed) reserves; impair under 360 (SE) or ceiling test (FC).",
    ),
    je=[
        (
            "Expense a dry exploratory well (successful efforts)",
            "An exploratory well costing $3,200,000 is found dry.",
            [("DR", "Dry hole expense", 3200000), ("CR", "Wells in progress", 3200000)],
            "Under full cost it would stay in the cost pool.",
        ),
    ],
    traps=[
        ("Which method expenses dry holes?", "Successful efforts."),
        ("What is the full-cost ceiling test?", "Capitalized costs less related deferred taxes cannot exceed the present value (10%) of future net revenues from proved reserves plus certain other amounts."),
        ("Are reserve disclosures audited?", "Supplementary reserve information is required but typically unaudited (SEC registrants)."),
    ],
    cites=["932-10-05-1"],
)

C(
    "940",
    tag="Broker-dealers: trade-date accounting, fair value of securities inventory and segregation of customer funds.",
    alias=["broker dealers", "securities firms", "trade date", "customer segregation", "net capital", "commissions", "soft dollars"],
    re=None,
    truth="Broker-dealers hold customers' cash and securities and trade for their own account. Their inventory is marked to fair value, customer assets are segregated by regulation, and commissions are earned when trades execute — all to show whether the firm can meet obligations to customers.",
    analogy=(
        "The Pawnbroker and the Currency Exchange",
        "A currency booth holds customers' money briefly and also trades its own stash. Its own stash is valued at today's rates; customers' money must be kept separate and returned on demand.",
    ),
    recog=[
        "Securities transactions recorded on trade date (940-320).",
        "Proprietary securities inventory at fair value with changes in earnings.",
        "Commission revenue recognized on trade date (606).",
        "Customer cash and securities segregated per SEC Rule 15c3-3.",
    ],
    meas=(
        "Fair value (inventory); trade-date basis",
        "Measure positions at fair value.",
        "Remeasure each period; unrealized gains/losses in earnings.",
    ),
    je=[
        (
            "Mark proprietary inventory to fair value",
            "A broker-dealer's trading inventory rises $120,000 in value.",
            [("DR", "Securities owned, at fair value", 120000), ("CR", "Principal transactions revenue", 120000)],
            "Unrealized gains through earnings.",
        ),
    ],
    traps=[
        ("Trade date or settlement date?", "Trade date for regular-way trades."),
        ("Are customer securities on the balance sheet?", "Generally no — held in custody; customer cash payables and receivables are presented."),
        ("Soft-dollar arrangements?", "Research purchased with commissions must be accounted for and disclosed properly."),
    ],
    cites=["940-20-05-1"],
)

C(
    "942",
    tag="Banks and lenders: industry presentation (SEC Article 9) — Topic overview with SEC materials.",
    alias=["banks", "depository institutions", "lending", "credit unions", "article 9", "regulatory capital", "loan loss"],
    re=None,
    truth="Banks turn deposits into loans. Their statements emphasize liquidity, credit quality and capital, so industry guidance governs how loans, deposits and regulatory capital are presented — while credit losses follow CECL (ASC 326) like everyone else.",
    analogy=(
        "The Community Lending Library",
        "A library lends books it borrowed from members. Members can demand their books back anytime (deposits), while the library's loans come back slowly — so the library's report focuses on how many books are out, overdue, and how many it keeps on hand.",
    ),
    recog=[
        "Loans at amortized cost with CECL allowance (326-20); loan fees under 310-20.",
        "Deposits recognized as liabilities.",
        "SEC registrants follow Regulation S-X Article 9 presentation (942-10-S99).",
    ],
    meas=(
        "Amortized cost (loans), face (deposits)",
        "Loans net of deferred fees and allowance.",
        "Update allowance each period.",
    ),
    je=[
        (
            "Originate a commercial real estate loan",
            "A bank funds a $5,000,000 multifamily loan and collects a $25,000 origination fee.",
            [("DR", "Loans receivable", 5000000), ("CR", "Cash — operating", 4975000), ("CR", "Deferred loan fees", 25000)],
            "Fee amortized into interest income (310-20).",
        ),
    ],
    traps=[
        ("Where are bank credit losses measured?", "ASC 326 (CECL)."),
        ("Are origination fees revenue at closing?", "No — deferred and amortized as yield adjustments."),
        ("What is Article 9?", "SEC Regulation S-X rules prescribing bank holding company statement formats and disclosures."),
    ],
    cites=["942-10-05-1"],
)

C(
    "944",
    tag="Insurance: premiums earned over coverage, claims reserves, deferred acquisition costs and LDTI.",
    alias=["insurance", "insurers", "ldti", "claims reserves", "ibnr", "deferred acquisition costs", "dac", "premium deficiency", "reinsurance", "short-duration contracts", "long-duration contracts"],
    re=None,
    truth="An insurer collects premiums today for promises that may come due years later. Premiums are earned over the coverage period, claims are reserved when insured events occur (including those incurred but not reported), and only successful acquisition costs are deferred. For long-duration contracts, LDTI requires updating assumptions so liabilities reflect current expectations.",
    analogy=(
        "The Neighborhood Umbrella Pool",
        "Neighbors each pay $10 into a pool that buys an umbrella for anyone caught in rain this year. The pool 'earns' each $10 a little every day of the year, and when it rains, it must set aside money for umbrellas owed — even to neighbors who haven't reported getting wet yet (IBNR).",
    ),
    recog=[
        "Short-duration premiums: recognized over the contract period in proportion to protection provided.",
        "Claims liabilities (including IBNR) recognized when insured events occur.",
        "Deferred acquisition costs: only incremental direct costs of successful contract acquisition (944-30).",
        "Long-duration contracts (LDTI, ASU 2018-12): update cash-flow assumptions at least annually; discount rate from upper-medium-grade fixed-income yields (changes in OCI); market risk benefits at fair value.",
    ],
    meas=(
        "Unearned premium; claims at ultimate cost; LFPB with current assumptions",
        "Claims reserves at estimated ultimate cost (undiscounted for most short-duration).",
        "Premium deficiency tests; DAC amortized on a constant-level basis (LDTI).",
    ),
    je=[
        (
            "Earn one month of an annual property policy (insurer's side)",
            "An insurer wrote a $1,200,000 annual premium; one month is earned.",
            [("DR", "Unearned premium reserve", 100000), ("CR", "Premiums earned", 100000)],
            "Mirror image of the insured's prepaid insurance amortization.",
        ),
    ],
    traps=[
        ("Is IBNR accrued?", "Yes — incurred-but-not-reported claims are estimated and accrued."),
        ("Which acquisition costs are deferrable?", "Only incremental direct costs of successful contract acquisition (ASU 2010-26)."),
        ("Under LDTI, where do discount-rate changes go?", "OCI for the liability for future policy benefits (instrument-specific credit risk for MRBs also OCI)."),
    ],
    cites=["944-10-05-1"],
)

C(
    "946",
    tag="Investment companies: everything at fair value, no consolidation of portfolio companies (real estate funds often qualify).",
    alias=["investment companies", "funds", "nav", "net asset value", "private equity fund", "real estate fund", "fair value accounting", "open-end fund"],
    re="support",
    truth="An investment company exists to earn returns from capital appreciation and income — not to operate what it owns. So its investments, including controlling stakes and real estate, are measured at fair value, and it does not consolidate operating investees. Investors then see NAV, the number they actually buy and redeem at.",
    analogy=(
        "The Art Collector's Catalog",
        "A collector who buys paintings only to resell them tracks each painting at what it would sell for today — not what she paid — and doesn't 'run' the painters' studios.",
    ),
    recog=[
        "Assess investment-company status at formation and reassess when facts change (946-10-25-1): fundamental characteristics (investment activities, returns from appreciation/income) and typical characteristics.",
        "Investments at fair value, including controlling interests in non-investment companies (no consolidation except of other investment companies or service providers).",
        "Report changes in net assets, financial highlights and schedules of investments.",
    ],
    meas=(
        "Fair value; NAV",
        "Initial: transaction price including transaction costs (then fair value).",
        "Subsequent: fair value each reporting date with changes in net increase in net assets from operations.",
    ),
    je=[
        (
            "Real estate fund records unrealized appreciation",
            "A core real estate fund's properties appraise $6,000,000 above prior fair value.",
            [("DR", "Investments in real estate, at fair value", 6000000), ("CR", "Net change in unrealized appreciation", 6000000)],
            "No depreciation — fair value replaces historical cost.",
        ),
    ],
    traps=[
        ("Does a real estate fund depreciate its buildings?", "Not if it is an investment company under 946 — properties are carried at fair value."),
        ("Does a fund consolidate a majority-owned property LLC?", "No — it measures the controlling interest at fair value (unless the investee is an investment company or provides services to the fund)."),
        ("Can an entity 'elect' investment-company accounting?", "No — it must meet the fundamental characteristics; status is reassessed when circumstances change."),
    ],
    lens="Institutional real estate funds (ODCE-style, closed-end value-add funds) often apply 946 fair-value reporting; the underlying property LLCs keep historical-cost books that roll into the fund's NAV.",
    cites=["946-10-25-1"],
)

C(
    "948",
    tag="Mortgage banking: loans held for sale at lower of cost or fair value; servicing rights recognized.",
    alias=["mortgage banking", "loans held for sale", "servicing rights", "msr", "mortgage originators"],
    re=None,
    truth="A mortgage banker originates loans to sell them, not to hold them. Loans held for sale are carried at the lower of cost or fair value (or fair value by election), and when loans are sold with servicing retained, the right to earn servicing fees is a separate asset.",
    analogy=(
        "The Car Dealer's Lot",
        "A dealer's cars are for sale, so they're valued at the lower of what the dealer paid and what they'll fetch. If the dealer keeps a service contract on each car sold, that contract is a separate asset.",
    ),
    recog=[
        "Classify loans as held for sale or held for investment at origination; transfers at lower of cost or fair value.",
        "Loans held for sale: lower of cost or fair value (or fair value option).",
        "Mortgage servicing rights recognized when servicing is retained on sale (ASC 860-50).",
    ],
    meas=(
        "Lower of cost or fair value / fair value",
        "Held-for-sale loans measured in aggregate or individually.",
        "Servicing rights amortized or at fair value by class.",
    ),
    je=[
        (
            "Write down loans held for sale",
            "A pool of held-for-sale loans with cost $20,000,000 has fair value of $19,700,000.",
            [("DR", "Loss on loans held for sale", 300000), ("CR", "Valuation allowance — loans held for sale", 300000)],
            "Lower of cost or fair value.",
        ),
    ],
    traps=[
        ("Are held-for-sale loans subject to CECL?", "No — they're at lower of cost or fair value (or FVO), outside the amortized-cost CECL model."),
        ("Is an MSR recognized when servicing is retained?", "Yes — at fair value, as part of the sale proceeds."),
        ("Can loans be reclassified from HFS to HFI freely?", "Transfers are at lower of cost or fair value on the transfer date; intent must be documented."),
    ],
    cites=["948-10-05-4"],
)

C(
    "950",
    tag="Title plant: the historical land-records database is capitalized and not depreciated (950-350).",
    alias=["title plant", "title insurance", "land records", "backplant"],
    re=None,
    truth="A title insurer's plant — the indexed history of ownership and liens on local parcels — doesn't wear out if maintained; it becomes more valuable as history accumulates. So construction or purchase costs are capitalized and not depreciated, while daily maintenance is expensed.",
    analogy=(
        "The Family Genealogy Archive",
        "Building a family tree going back 100 years takes effort once. Adding today's births keeps it current (a maintenance cost), but the archive itself doesn't depreciate — it only gets richer.",
    ),
    recog=[
        "Capitalize costs to construct or acquire a title plant until it can be used to issue title insurance (950-350-25).",
        "Expense costs of maintaining the plant and of title searches.",
        "Do not depreciate; test for impairment when events indicate (e.g., plant not maintained, obsolescence).",
    ],
    meas=(
        "Cost, not depreciated",
        "Initial: construction or purchase cost; backplant costs capitalized.",
        "Subsequent: impairment only.",
    ),
    je=[
        (
            "Purchase a county title plant",
            "A title insurer buys a county's title plant for $1,500,000.",
            [("DR", "Title plant", 1500000), ("CR", "Cash — operating", 1500000)],
            "Not depreciated.",
        ),
    ],
    traps=[
        ("Is a title plant depreciated?", "No — it does not diminish with use if properly maintained."),
        ("Are daily updates capitalized?", "No — maintenance costs are expensed."),
        ("Why is this Topic filed under 950-350?", "The only subtopic is Intangibles (title plant is an intangible); the source library contains 950-350."),
    ],
    lens="Title insurance underpins every property acquisition and refinancing; title plant accounting belongs to the title company, not the property owner.",
    cites=["950-350-05-2"],
)

C(
    "952",
    tag="Franchisors: franchise fees under 606 (pre-opening services practical expedient) and franchise costs.",
    alias=["franchisors", "franchise fees", "initial franchise fee", "royalties", "pre-opening services"],
    re=None,
    truth="A franchisor sells the right to use its brand and system. Upfront fees usually relate to the license over the franchise term, recognized over time, unless the private-company practical expedient lets pre-opening services be a separate performance obligation. Ongoing royalties are recognized as franchisees' sales occur.",
    analogy=(
        "Joining a Famous Bakery's Recipe Club",
        "Paying $30,000 to open under a famous bakery brand buys years of using its name and recipes — the bakery earns that fee over the years you bake under its sign, plus a cut of every loaf sold.",
    ),
    recog=[
        "Initial franchise fees: generally part of the symbolic IP license recognized over the term (606); private companies may account for pre-opening services as distinct (ASU 2021-02).",
        "Continuing franchise fees (sales-based royalties) recognized as the franchisee's sales occur.",
        "Costs of continuing franchise fees expensed as incurred (952-10-25-1).",
    ],
    meas=(
        "606 transaction price",
        "Allocate fees among license and distinct pre-opening services where applicable.",
        "Recognize royalties when sales occur.",
    ),
    je=[
        (
            "Receive an initial franchise fee",
            "A franchisor receives a $45,000 initial fee for a 10-year franchise (license recognized over time).",
            [("DR", "Cash — operating", 45000), ("CR", "Contract liability — franchise fees", 45000)],
            "Recognize $4,500 per year over the franchise term.",
        ),
    ],
    traps=[
        ("Is the initial franchise fee earned at opening?", "Generally no under 606 — it's recognized over the license term unless distinct pre-opening services are identified (practical expedient for private companies)."),
        ("How are advertising-fund contributions treated?", "Typically as revenue of the franchisor (principal) with related expenses, unless agent considerations apply."),
        ("Royalty timing?", "As franchisee sales occur (sales-based royalty exception)."),
    ],
    cites=["952-10-25-1"],
)

C(
    "954",
    tag="Health care entities: patient revenue net of implicit price concessions; industry presentation.",
    alias=["health care", "hospitals", "patient service revenue", "implicit price concession", "third-party payors", "charity care"],
    re=None,
    truth="Hospitals often know at the door that they won't collect full charges from every patient. Under ASC 606, revenue is the amount the hospital expects to collect — list prices less contractual adjustments and implicit price concessions — rather than gross charges less 'bad debt'.",
    analogy=(
        "The Pay-What-You-Can Clinic",
        "A clinic's sticker price is $200, but it knows insurers pay $120 and uninsured patients often pay $40. Its real revenue is what it expects to collect, not the sticker.",
    ),
    recog=[
        "Patient service revenue recognized under 606 at expected consideration (net of contractual adjustments, discounts and implicit price concessions).",
        "Charity care is not revenue; disclose cost of charity care.",
        "NFP health care entities also apply 958 presentation (performance indicator).",
    ],
    meas=(
        "Expected collectible consideration (portfolio approach)",
        "Estimate implicit price concessions using historical collections.",
        "Changes due to credit events after recognition are bad debts.",
    ),
    je=[
        (
            "Record patient revenue net of implicit concessions",
            "Gross charges $1,000,000; contractual adjustments $450,000; implicit price concessions $80,000.",
            [("DR", "Patient accounts receivable", 470000), ("CR", "Patient service revenue", 470000)],
            "Revenue is the expected collectible amount.",
        ),
    ],
    traps=[
        ("Is bad debt on self-pay patients an expense?", "Mostly no under 606 — expected shortfalls at inception are implicit price concessions reducing revenue."),
        ("Is charity care revenue?", "No — it's never recognized as revenue; its cost is disclosed."),
        ("Portfolio approach allowed?", "Yes, if results aren't materially different from contract-by-contract."),
    ],
    cites=["954-10-05-2"],
)

C(
    "958",
    tag="Not-for-profits: net assets with/without donor restrictions; contributions vs. exchanges.",
    alias=["not-for-profit", "nfp", "nonprofit", "contributions", "donor restrictions", "net assets", "pledges", "split-interest", "affordable housing nonprofit"],
    re="support",
    truth="A nonprofit has no owners — donors fund a mission and may restrict how their gifts are used. So equity becomes 'net assets' split by donor restriction, contributions are income when unconditional (conditional gifts wait until barriers are overcome), and the statements show how resources were used for programs versus overhead.",
    analogy=(
        "The Scholarship Jar",
        "A school's jar holds money anyone can spend on supplies, plus money a grandparent gave only for scholarships. The school tracks the two piles separately and moves money out of the restricted pile only when it awards a scholarship.",
    ),
    recog=[
        "Contributions (nonreciprocal) recognized when unconditional; conditional contributions (barrier + right of return) recognized when conditions are met (958-605).",
        "Exchange transactions (fees for services) follow 606.",
        "Present net assets without donor restrictions and with donor restrictions; releases when restrictions are met.",
        "Present expenses by function and nature.",
    ],
    meas=(
        "Fair value of contributions",
        "Unconditional promises at fair value (present value for multi-year pledges).",
        "Release restrictions as purpose or time is satisfied; CECL applies to exchange receivables.",
    ),
    je=[
        (
            "Receive a restricted capital-campaign gift for affordable housing",
            "A housing nonprofit receives $2,000,000 restricted to acquiring a senior-housing property.",
            [("DR", "Cash — restricted", 2000000), ("CR", "Contributions — with donor restrictions", 2000000)],
            "Released to net assets without restrictions when the property is placed in service (or per policy).",
        ),
    ],
    traps=[
        ("Is a government grant to a nonprofit a contribution or exchange?", "If the grantor doesn't receive commensurate value, it's a contribution — often conditional (ASU 2018-08)."),
        ("When is a conditional pledge recognized?", "When the barrier is overcome — not when promised."),
        ("Are NFP investments at fair value?", "Most are, with returns reported in the statement of activities."),
    ],
    lens="Nonprofit affordable-housing sponsors and their tax-credit partnerships mix 958 (sponsor) with for-profit GAAP (property partnerships).",
    cites=["958-10-05-1"],
)

C(
    "960",
    tag="Defined benefit pension plan accounting: net assets available for benefits and accumulated plan benefits.",
    alias=["pension plan financial statements", "defined benefit plan", "accumulated plan benefits", "erisa", "form 5500", "plan accounting"],
    re=None,
    truth="This Topic is the plan's own report (not the employer's): does the trust hold enough to pay promised benefits? It shows net assets available for benefits at fair value and the actuarial present value of accumulated plan benefits, so participants can judge the plan's ability to pay.",
    analogy=(
        "The Family Trust Report Card",
        "A trust promises each grandchild a set monthly payment in retirement. Its annual report shows what the trust owns today and what it has already promised — the gap tells everyone how safe the promise is.",
    ),
    recog=[
        "Statement of net assets available for benefits (investments at fair value; contracts with insurers per rules).",
        "Statement of changes in net assets available for benefits.",
        "Actuarial present value of accumulated plan benefits and changes therein (960-20).",
    ],
    meas=(
        "Fair value (assets); actuarial present value (benefits)",
        "Plan investments at fair value (fully benefit-responsive contracts at contract value).",
        "Accumulated plan benefits based on service to date.",
    ),
    je=[
        (
            "Plan records employer contribution receivable",
            "The employer owes the plan a $500,000 contribution for the plan year.",
            [("DR", "Employer contributions receivable", 500000), ("CR", "Employer contributions (additions to net assets)", 500000)],
            "Plan-level books, not the employer's.",
        ),
    ],
    traps=[
        ("Whose financial statements are these?", "The plan's — employer accounting is ASC 715."),
        ("Are future salary increases included in accumulated plan benefits?", "No — accumulated plan benefits are based on service and compensation to date (unlike the employer's PBO)."),
        ("Must a plan prepare financial statements under this Topic?", "The Topic doesn't require it (ERISA does for many plans)."),
    ],
    cites=["960-10-05-4"],
)

C(
    "962",
    tag="Defined contribution plan accounting (401(k)): net assets available for benefits at fair value.",
    alias=["401k plan", "defined contribution plan", "plan financial statements", "participant loans", "fully benefit-responsive", "erisa audit"],
    re=None,
    truth="In a 401(k) plan, each participant owns an individual account and bears the investment risk — there is no promised benefit to measure. The plan's statements therefore show what assets are available for benefits, measured at values meaningful to participants (fair value, contract value for fully benefit-responsive contracts), and how they changed during the year.",
    analogy=(
        "The Class Savings Jars",
        "Each student has a labeled savings jar in the teacher's cabinet. The class report shows how much is in all the jars, how much was added and earned, and how much was paid out — no promises beyond the jars.",
    ),
    recog=[
        "Present statements of net assets available for benefits and changes therein.",
        "Participant loans are notes receivable at unpaid principal plus accrued interest.",
        "Fully benefit-responsive investment contracts at contract value.",
    ],
    meas=(
        "Fair value (contract value for FBRICs)",
        "Investments at fair value.",
        "Remeasure each reporting date.",
    ),
    je=[
        (
            "Record participant loan",
            "A participant borrows $20,000 from their 401(k) account.",
            [("DR", "Notes receivable from participants", 20000), ("CR", "Investments at fair value", 20000)],
            "Plan-level entry.",
        ),
    ],
    traps=[
        ("Are participant loans investments?", "No — presented as notes receivable from participants."),
        ("What's contract value?", "Measurement for fully benefit-responsive investment contracts (e.g., stable value funds)."),
        ("Employer vs plan accounting?", "Employer expenses the match under 715-70; the plan reports under 962."),
    ],
    cites=["962-10-05-4"],
)

C(
    "965",
    tag="Health and welfare benefit plan accounting: benefit obligations including IBNR claims.",
    alias=["health and welfare plans", "veba", "self-insured health plan", "plan benefit obligations", "ibnr claims"],
    re=None,
    truth="A health-and-welfare plan pays medical, dental and disability claims for participants. Its statements show assets available to pay benefits and the benefit obligations — including claims incurred but not yet reported — so participants and regulators see whether the plan is funded.",
    analogy=(
        "The Office Medical Kitty",
        "Coworkers fund a pooled kitty to reimburse each other's medical bills. At month-end, the kitty's treasurer must set aside money for doctor visits that already happened but whose bills haven't come in yet.",
    ),
    recog=[
        "Recognize benefit obligations: claims payable, IBNR, and accumulated eligibility credits/postretirement benefit obligations (965-30).",
        "Present net assets available for benefits (965-20).",
        "Terminating plans (965-40) use the liquidation basis when applicable.",
    ],
    meas=(
        "Fair value (assets); estimated obligations",
        "IBNR estimated using lag studies.",
        "Update each period.",
    ),
    je=[
        (
            "Accrue IBNR claims",
            "A self-insured plan estimates $310,000 of claims incurred but not reported.",
            [("DR", "Benefits expense", 310000), ("CR", "Claims incurred but not reported", 310000)],
            "Plan-level accounting.",
        ),
    ],
    traps=[
        ("Are IBNR claims accrued by the plan?", "Yes — they're part of benefit obligations."),
        ("Employer vs plan?", "The employer accounts for self-insured costs under 450/715-60; the plan reports under 965."),
        ("VEBA assets?", "Presented at fair value as net assets available for benefits."),
    ],
    cites=["965-10-05-4"],
)

C(
    "970",
    tag="Real estate—General: capitalize project costs (preacquisition, taxes, insurance, amenities), allocate them, and account for syndications.",
    alias=["real estate", "real estate general", "project costs", "development", "preacquisition costs", "carrying costs", "amenities", "incidental operations", "970-340", "970-360", "970-835", "syndication", "capitalization", "construction in progress"],
    re="core",
    truth="Building or redeveloping property is a long manufacturing process: land, permits, construction, taxes, insurance and interest all go into producing a finished asset that will earn rent or be sold. So those costs are capitalized into the project until it's substantially complete, then allocated to units or components — while costs of simply operating or marketing the property are expensed.",
    analogy=(
        "Baking a Wedding Cake",
        "Everything that goes into the cake — flour, eggs, the baker's hours, even the oven's electricity while it bakes — is part of the cake's cost. Once the cake is on the table, keeping the room air-conditioned is a cost of the party, not the cake. Development costs are the ingredients; post-completion operating costs are the party.",
    ),
    recog=[
        "Scope: all entities with productive activities relating to real property (970-10-15-3), except property used in non-real estate operations (970-10-15-8).",
        "Preacquisition costs (options, surveys, zoning, traffic studies) are capitalized if directly identifiable with the property and acquisition is probable; otherwise expensed.",
        "Property taxes and insurance are capitalized only while the property is undergoing development activities.",
        "Project costs clearly associated with acquisition, development and construction are capitalized; indirect costs capitalized only if clearly related to projects under development.",
        "Amenities: costs in excess of anticipated proceeds are allocated as common costs to the units benefited.",
        "Incidental operations: net revenue reduces capitalized costs; net costs in excess of revenue are expensed (not capitalized).",
        "Rental projects: capitalize costs until substantially complete and held available for occupancy (no later than one year from cessation of major construction), then expense carrying costs.",
        "Source note: the library contains 970-10 (overview, scope and syndication/project-cost scope); the detailed rules live in 970-340, 970-360 and 970-835, which are referenced there (970-10-15-11).",
    ],
    meas=(
        "Historical cost, allocated by specific identification or relative value",
        "Initial: accumulate land, hard and soft costs, capitalized interest (835-20), taxes and insurance during development.",
        "Allocation to components/units: specific identification, then relative fair value (or relative sales value) methods; subsequently depreciated under 360 or relieved as sold.",
    ),
    je=[
        (
            "Capitalize property taxes during development",
            "A 280-unit ground-up development in the construction phase receives a $96,000 quarterly tax bill.",
            [("DR", "Construction in progress — real estate taxes", 96000), ("CR", "Accrued real estate taxes", 96000)],
            "Capitalize only while development activities are underway; once units are substantially complete and available, expense them.",
        ),
        (
            "Place a completed building in service",
            "Building A ($42,000,000 CIP including capitalized interest and taxes) is substantially complete and available for occupancy.",
            [("DR", "Buildings", 38500000), ("DR", "Site improvements", 2100000), ("DR", "Furniture, fixtures and equipment", 1400000), ("CR", "Construction in progress", 42000000)],
            "Depreciation begins; carrying costs for this building are now expensed.",
        ),
        (
            "Preacquisition option cost expensed after deal falls through",
            "A $75,000 purchase-option deposit and $30,000 of zoning studies were capitalized; the acquisition is abandoned.",
            [("DR", "Abandoned project costs (expense)", 105000), ("CR", "Preacquisition costs", 105000)],
            "Capitalized preacquisition costs are written off when acquisition is no longer probable.",
        ),
    ],
    traps=[
        ("Can property taxes on land held for future development with no activity be capitalized?", "No — taxes and insurance are capitalized only while development activities are in progress; land simply held is carried without capitalizing carrying costs (they are expensed)."),
        ("When does capitalization stop on a rental project?", "When the project is substantially completed and held available for occupancy — no later than one year after major construction activity ends — even if lease-up is slow."),
        ("Are leasing and marketing costs for a new building capitalized?", "Generally no — advertising and start-up costs are expensed (720); only costs directly related to construction are capitalized. Model units/furnishings follow their own analysis."),
        ("How is net income from a parking lot operated on the site before development (incidental operations) treated?", "Net incidental revenue reduces capitalized project costs; net losses are expensed — never capitalized as 'negative income'."),
        ("Why can't my auditor find 970-340 in our library?", "The source export includes only 970-10; 970-340/360/835 content is referenced by 970-10-15-11 and must be read in the full FASB Codification."),
    ],
    lens="Development, redevelopment and major renovation programs (job cost, capex, draws) capitalize hard/soft costs, taxes, insurance and interest under 970/835 until units are placed in service; syndicated partnerships apply the syndication-fee rules.",
    cites=["970-10-15-3", "970-10-15-8", "970-10-15-11"],
)

C(
    "972",
    tag="Common interest realty associations (HOAs, condo associations): funds for future major repairs and common property.",
    alias=["hoa", "homeowners association", "condominium association", "cira", "common interest realty association", "replacement fund", "reserve study", "special assessments"],
    re="support",
    truth="An HOA collects dues from owners to run and eventually rebuild shared property — roofs, pools, elevators. It rarely owns the common areas outright in a way it could sell, so they often aren't recognized as assets; instead, the statements show operating results and the funds set aside for future major repairs, with supplementary information on the reserve study.",
    analogy=(
        "The Shared Beach House Kitty",
        "Five families co-own a beach house and chip in monthly — part for utilities, part saved for the new roof in 10 years. The kitty's report shows what was spent this year and how much is saved for the roof.",
    ),
    recog=[
        "Scope: all common interest realty associations (972-10-15-2, 15-3).",
        "Recognize common real property as an asset only if the association has title and can dispose of it at its discretion (or it generates significant cash flows from nonmembers).",
        "Assessments are revenue when levied for the period; special assessments per purpose.",
        "Disclose funds for future major repairs and replacements and present required supplementary information from the reserve study.",
    ],
    meas=(
        "Assessments as levied; fund accounting for replacement reserves",
        "Initial: assessments receivable at amounts due.",
        "Contract liabilities for assessments collected for future major repairs when applying 606 (practice varies after ASU 2014-09).",
    ),
    je=[
        (
            "Levy monthly assessments split between operating and replacement funds",
            "A condominium association levies $120,000 of monthly dues, $30,000 of which is designated for the replacement fund.",
            [("DR", "Assessments receivable", 120000), ("CR", "Assessment revenue — operating fund", 90000), ("CR", "Assessment revenue — replacement fund", 30000)],
            "Replacement-fund cash is typically held in a separate reserve account.",
        ),
    ],
    traps=[
        ("Does an HOA capitalize its clubhouse?", "Only if it holds title and can dispose of it at its discretion (or it generates significant cash flows from nonmembers); otherwise common property isn't recognized."),
        ("Is the reserve-study information audited?", "It's required supplementary information — unaudited but subject to limited procedures."),
        ("Do replacement-fund assessments go to revenue immediately?", "Under ASC 606 some associations treat them as contract liabilities until the major repair performance obligation is satisfied — a known diversity issue; follow the AICPA guide and be consistent."),
    ],
    lens="Condo-mapped multifamily and mixed-use buildings deal with HOA assessments as expenses of the owner (and HOA books under 972 if managed).",
    cites=["972-10-15-2"],
)

C(
    "974",
    tag="REITs: distribute 90% of taxable income, disclose tax status of distributions, follow SEC Rule 3-15.",
    alias=["reit", "real estate investment trust", "90 percent distribution", "ffo", "funds from operations", "taxable reit subsidiary", "trs", "rule 3-15", "tax status of distributions", "upreit", "op units"],
    re="core",
    truth="A REIT is a tax-advantaged wrapper: it avoids corporate income tax if it distributes at least 90% of its taxable income and meets asset and income tests. The accounting is ordinary GAAP, but readers need to know the tax character of distributions (ordinary income, capital gain, return of capital) and how the REIT maintains its status.",
    analogy=(
        "The Farm Co-op That Passes Through Its Harvest",
        "A co-op farm doesn't keep its harvest; it hands most of it to members, who pay tax on what they receive. As long as it passes through at least 90%, the co-op itself isn't taxed — but members need to know whether each basket was regular produce or a one-time windfall.",
    ),
    recog=[
        "A REIT that distributes ≥90% of taxable income (and meets other tests) is generally not subject to federal corporate income tax (974-10-05-4).",
        "Disclose the tax status of distributions per unit (ordinary income, capital gain, return of capital) (974-10-50-1, pending ASU 2023-06 codification of SEC rule).",
        "SEC Regulation S-X Rule 3-15 governs REIT presentation (974-10-S99-1); TRS income is taxable under 740.",
        "Equity-method and consolidation guidance for REIT JVs is referenced to 974-323/974-810 (not in this source export).",
    ],
    meas=(
        "Standard GAAP (historical cost) — REIT status is a tax and disclosure matter",
        "Assets measured under 360/805; income taxes only for TRSs and state taxes.",
        "Distributions recognized when declared.",
    ),
    je=[
        (
            "Declare a quarterly REIT dividend",
            "A multifamily REIT declares $0.45/share on 50,000,000 shares.",
            [("DR", "Distributions in excess of accumulated earnings", 22500000), ("CR", "Dividends payable", 22500000)],
            "Tax character (ordinary/capital gain/return of capital) disclosed annually.",
        ),
    ],
    traps=[
        ("Is FFO a GAAP measure?", "No — NAREIT FFO is a non-GAAP measure (net income excluding real estate depreciation and gains/losses on sales, plus adjustments) subject to SEC Reg G/Item 10(e) rules."),
        ("Does a REIT record income tax expense?", "For TRSs and certain state taxes, yes; REIT-level federal tax on distributed income, generally no."),
        ("Why 'distributions in excess of accumulated earnings'?", "Because depreciation makes GAAP earnings lower than cash distributions, REIT equity often shows cumulative distributions exceeding earnings."),
        ("What are OP units in an UPREIT?", "Noncontrolling interests in the operating partnership, often redeemable for REIT shares — presented as NCI (or temporary equity if cash-redeemable at the holder's option)."),
    ],
    lens="Public and non-traded multifamily REITs report FFO/AFFO, track REIT taxable income and distribution character, and house third-party services in TRSs.",
    cites=["974-10-05-4", "974-10-S99-1"],
)

C(
    "976",
    tag="Retail land sales: volume sales of subdivided lots with seller financing (revenue now under 606).",
    alias=["retail land", "land sales", "lot sales", "subdivision", "installment method"],
    re="support",
    truth="Retail land companies sell lots from large subdivided tracts in high volume, often with small down payments and seller financing, and promise future improvements. Historically this called for installment and deposit methods; today revenue follows ASC 606, with collectibility and the obligation to complete improvements driving timing.",
    analogy=(
        "Selling Plots in a Lakeside Development",
        "A developer sells 500 lakeside lots with 10% down, promising to pave roads next year. It's not done selling until the promised roads are built, and it can't count on collecting from buyers who might walk away from small deposits.",
    ),
    recog=[
        "Scope: retail land sales on a volume basis of lots from subdivided tracts (976-10-05-2).",
        "Revenue under ASC 606: contract existence (including collectibility of substantially all consideration) and performance obligations for promised improvements.",
        "Legacy 976-605 installment/deposit methods were superseded by ASU 2014-09.",
    ],
    meas=(
        "606 transaction price",
        "Allocate consideration to lot and improvement obligations.",
        "Recognize improvement obligations as performed.",
    ),
    je=[
        (
            "Sale of a lot with an obligation to build roads",
            "A $60,000 lot sale ($6,000 cash, $54,000 note); $8,000 of the price is allocated to the road-completion obligation.",
            [("DR", "Cash — operating", 6000), ("DR", "Notes receivable — lot buyers", 54000), ("CR", "Land sale revenue", 52000), ("CR", "Contract liability — improvements", 8000)],
            "Collectibility must be probable for a contract to exist under 606.",
        ),
    ],
    traps=[
        ("Is the installment method still used for GAAP?", "No — superseded by ASC 606; collectibility is assessed at contract inception."),
        ("How are promised improvements handled?", "As performance obligations (or costs to fulfill) — revenue allocated to them is deferred until performed."),
        ("Source note", "The library holds only 976-10 overview/scope content."),
    ],
    lens="Multifamily developers rarely sell retail lots, but master-planned communities that sell land parcels to homebuilders use the same 606 collectibility and improvement-obligation logic.",
    cites=["976-10-05-2"],
)

C(
    "978",
    tag="Time-sharing: account for each phase separately; uncollectibility reduces revenue; heavy selling costs.",
    alias=["time-share", "timeshare", "vacation ownership", "time-sharing intervals", "points programs"],
    re="support",
    truth="Timeshare sellers market intervals in volume, finance most buyers and expect meaningful defaults — when buyers default, the seller recovers and resells the interval. So projects are tracked by phase, expected uncollectibility is treated as a reduction of revenue, and inventory costs are relieved using a relative sales-value method.",
    analogy=(
        "Selling Weeks at a Beach Condo",
        "A developer sells 52 separate weeks of one condo to 52 families, financing most of them. Some families will stop paying and give their week back — the developer plans for that from the start and resells those weeks.",
    ),
    recog=[
        "Establish and delineate a project and its phases at the outset; account for each phase separately (978-10-25-1).",
        "Revenue under 606 (legacy 978 profit-recognition methods superseded); estimated uncollectibility of notes receivable reduces revenue (variable consideration).",
        "Cost of sales and inventory using the relative sales value method, with recoveries of defaulted intervals considered.",
    ],
    meas=(
        "Relative sales value (inventory relief)",
        "Transaction price net of expected uncollectibility.",
        "True up via cumulative adjustments to cost of sales as estimates change.",
    ),
    je=[
        (
            "Sell a timeshare interval with seller financing",
            "Interval sold for $30,000: $3,000 down, $27,000 note; expected uncollectibility $2,700 reduces revenue.",
            [("DR", "Cash — operating", 3000), ("DR", "Notes receivable — VOI", 27000), ("CR", "Vacation ownership revenue", 27300), ("CR", "Allowance — expected uncollectibility", 2700)],
            "Expected defaults reduce revenue, not bad-debt expense.",
        ),
    ],
    traps=[
        ("Are timeshare defaults bad-debt expense?", "No — estimated uncollectibility is a reduction of revenue under the Topic's model."),
        ("How are inventory costs relieved?", "Relative sales value method, reflecting expected recoveries of repossessed intervals."),
        ("Are selling and marketing costs capitalized?", "Generally expensed as incurred; limited costs related to unsold intervals may be deferred when directly tied to future sales."),
    ],
    lens="Operators that convert apartment buildings to vacation-ownership or short-term rental programs meet time-sharing concepts; the phase-by-phase and seller-financing logic mirrors condo-conversion sell-outs.",
    cites=["978-10-25-1"],
)

C(
    "980",
    tag="Regulated operations: rate regulation can turn costs into regulatory assets (and refunds into regulatory liabilities).",
    alias=["regulated operations", "utilities", "regulatory assets", "regulatory liabilities", "rate regulation", "fas 71"],
    re=None,
    truth="When a regulator sets a utility's prices based on its costs and promises it will recover a cost through future rates, that cost is effectively a receivable from future customers — a regulatory asset — rather than an expense today. The reverse (amounts to be refunded) is a regulatory liability.",
    analogy=(
        "The Parent-Approved Allowance Advance",
        "A teen buys a school laptop with her own savings after her parents promise to raise her allowance next year to cover it. The laptop cost isn't truly 'spent' — it will come back through future allowance.",
    ),
    recog=[
        "Apply when rates are set by a regulator, designed to recover the entity's specific costs, and it is reasonable to assume rates can be charged and collected (980-10-15-2).",
        "Capitalize incurred costs as regulatory assets when it is probable future revenue will recover them.",
        "Recognize regulatory liabilities for amounts to be refunded or future costs collected in advance.",
        "Discontinue 980 accounting (980-20) when criteria are no longer met; write off regulatory assets/liabilities.",
    ],
    meas=(
        "Probable recovery amount",
        "Regulatory assets at incurred cost expected to be recovered.",
        "Amortize as recovered in rates; test for probability of recovery each period.",
    ),
    je=[
        (
            "Defer storm-restoration costs approved for recovery",
            "A utility incurs $8,000,000 of storm costs the commission has approved for recovery in future rates.",
            [("DR", "Regulatory asset — storm costs", 8000000), ("CR", "Accounts payable", 8000000)],
            "Amortized to expense as recovered through rates.",
        ),
    ],
    traps=[
        ("Can an unregulated company use 980?", "No — criteria require cost-based rate regulation with probable recovery."),
        ("What happens on deregulation?", "Discontinue 980 (980-20): eliminate regulatory assets/liabilities through earnings."),
        ("Are regulatory assets tested?", "Yes — they must remain probable of recovery; otherwise written off."),
    ],
    cites=["980-10-05-3"],
)

C(
    "985",
    tag="Software for sale: expense until technological feasibility, then capitalize and amortize.",
    alias=["software", "software to be sold", "technological feasibility", "capitalized software", "985-20", "working model"],
    re=None,
    truth="Building software to sell is R&D until the company knows it can be built — technological feasibility. After that, coding and testing costs create a product asset that is capitalized and amortized as the software is sold, with a net realizable value check.",
    analogy=(
        "Writing a Video Game",
        "Brainstorming and prototyping game ideas is research — much of it will be scrapped. Once you have a detailed design proven to work, the hours spent building the final game create something you'll sell for years.",
    ),
    recog=[
        "Costs before technological feasibility (detailed program design or working model) are R&D expense (985-20-25-1).",
        "Capitalize production costs after feasibility until the product is available for general release.",
        "Amortize the greater of the revenue ratio or straight-line over remaining life; compare to NRV each period.",
    ],
    meas=(
        "Capitalized cost less amortization, limited to NRV",
        "Capitalize direct costs after feasibility.",
        "Amortization method: greater of ratio of current revenue or straight-line.",
    ),
    je=[
        (
            "Capitalize post-feasibility development costs",
            "A software company incurs $900,000 of coding and testing after establishing technological feasibility.",
            [("DR", "Capitalized software development costs", 900000), ("CR", "Accrued payroll", 900000)],
            "Amortized from general release.",
        ),
    ],
    traps=[
        ("Is internal-use software under 985?", "No — internal-use software follows 350-40; 985-20 is for software to be sold, leased or marketed."),
        ("When is technological feasibility reached?", "When a detailed program design is complete (or a working model exists) — in agile practice this is often very late, so little is capitalized."),
        ("Is SaaS software 985-20?", "SaaS offered as a service (customer can't take possession) is generally internal-use software (350-40)."),
    ],
    cites=["985-10-05-1"],
)

C(
    "995",
    legacy=True,
    tag="U.S. steamship entities: legacy deferred-tax guidance on statutory reserve deposits — now superseded (995-740).",
    alias=["steamship", "shipping", "capital construction fund", "statutory reserve deposits", "merchant marine act", "superseded"],
    re=None,
    truth="US shipping companies could deposit earnings in government-sanctioned construction funds to defer taxes. Special accounting once addressed the deferred taxes on these deposits; ASU 2017-15 removed the exception so the general ASC 740 model applies.",
    analogy=(
        "The Tax-Advantaged College Savings Plan",
        "Money saved in a special plan defers tax until withdrawn — but the family still owes tax eventually. GAAP now simply records that future tax like any other deferred tax.",
    ),
    recog=[
        "Topic content (995-740) was superseded by ASU 2017-15; entities apply ASC 740 deferred-tax guidance.",
        "The source library holds status content only.",
    ],
    meas=(
        "ASC 740 (enacted rates, temporary differences)",
        "Recognize deferred taxes on differences created by fund deposits.",
        "Remeasure for rate changes.",
    ),
    je=[
        (
            "Deferred tax on capital construction fund deposits",
            "A steamship entity's fund deposits create a $2,000,000 taxable temporary difference at a 21% rate.",
            [("DR", "Deferred income tax expense", 420000), ("CR", "Deferred tax liability", 420000)],
            "General ASC 740 model — no industry exception.",
        ),
    ],
    traps=[
        ("Is there still a steamship tax exception?", "No — ASU 2017-15 eliminated it."),
        ("Where is the guidance now?", "General accounting under ASC 740 (Income Taxes) now applies; the industry-specific exception was completely eliminated."),
        ("Why keep the Topic number?", "For historical references; the library shows the status table for 995-740."),
    ],
    cites=["995-740-00-1"],
)
