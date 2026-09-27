"""300s Assets."""

from . import C

C(
    "305",
    legacy=True,
    tag="Cash and cash equivalents — the money you can spend today (legacy Topic; guidance now in 230 and the Master Glossary).",
    alias=["cash", "cash equivalents", "three months", "money market", "treasury bills", "restricted cash", "overdraft", "superseded"],
    re="support",
    truth="Cash is the one asset with no measurement debate: a dollar is a dollar. Cash equivalents are investments so short and safe that they are practically cash — original maturities of three months or less and insignificant risk of value change. Topic 305's paragraphs were superseded by Maintenance Update 2017-21; the definitions live in the Master Glossary and the presentation rules in Topic 230.",
    analogy=(
        "The Wallet and the Piggy Bank",
        "Cash is the bills in your wallet. A cash equivalent is the piggy bank on your dresser — you can crack it open this afternoon and know exactly what's inside. A 5-year CD locked in a bank vault is not a cash equivalent: you can get at it, but not without penalty or waiting.",
    ),
    recog=[
        "Cash equivalents: short-term, highly liquid investments readily convertible to known amounts of cash and so near maturity (generally three months or less from original acquisition) that interest-rate risk is insignificant.",
        "An entity's policy for which items it treats as cash equivalents must be disclosed and applied consistently.",
        "Restricted cash (escrows, reserves, security deposits held in trust) is presented separately but included with cash in the cash-flow statement.",
        "Bank overdrafts are liabilities, not negative cash, unless a right of offset exists with the same bank.",
    ],
    meas=(
        "Face / carrying amount (fair value for equivalents)",
        "Record cash at face amount; equivalents at cost, which approximates fair value.",
        "Foreign-currency cash is remeasured at the spot rate (ASC 830).",
    ),
    je=[
        (
            "Sweep excess operating cash into a 90-day Treasury bill",
            "A property sweeps $2,000,000 into a 3-month Treasury bill (a cash equivalent per policy).",
            [("DR", "Cash equivalents — Treasury bills", 2000000), ("CR", "Cash — operating account", 2000000)],
            "Not a cash flow — both sides are inside 'cash, cash equivalents and restricted cash'.",
        ),
    ],
    traps=[
        ("Is a 6-month CD bought 2 months before maturity a cash equivalent?", "Yes — maturity is measured from the date the entity acquires it; three months or less remaining at acquisition qualifies. A 6-month CD bought at issuance does not."),
        ("Where are tenant security deposits held in a trust account presented?", "As restricted cash (with an offsetting security-deposit liability), not operating cash."),
        ("Is an outstanding check overdraft netted against another bank's balance?", "No; book overdrafts at one bank are liabilities. Netting requires a right of setoff with the same institution."),
        ("A citation reads 'ASC 305-10-45'. Valid?", "No — Topic 305 content was superseded; cite the Master Glossary definition and ASC 230."),
    ],
    lens="Operating, security-deposit and escrow accounts at each property roll into cash and restricted cash; bank reconciliations support every balance.",
    cites=["305-10-00-1"],
)

C(
    "310",
    tag="Receivables and loans at amortized cost — fees and costs become yield, troubled loans get special treatment.",
    alias=["receivables", "notes receivable", "loans receivable", "loan fees", "origination fees", "nonaccrual", "troubled debt restructuring", "tdr", "pcd", "amortized cost"],
    re="support",
    truth="A receivable is a promise to pay you later, so its value is the cash you expect to collect. Fees charged and costs paid to originate a loan are really part of the interest you earn, so they are spread over the life of the loan as a yield adjustment instead of hitting income on day one.",
    analogy=(
        "Lending Your Friend Money for a Car",
        "You lend a friend $10,000 and charge a $300 'setup fee'. That fee isn't a windfall today — it's extra interest for being patient over five years. So you recognize it bit by bit as the friend repays, just like interest.",
    ),
    recog=[
        "Recognize a receivable when you have an unconditional right to consideration (e.g., invoice issued for goods delivered, loan funded).",
        "Loan origination fees net of direct loan origination costs are deferred and recognized as a yield adjustment using the interest method (310-20-35-18).",
        "Loans are placed on nonaccrual when collection of interest is doubtful per policy.",
        "Credit losses on amortized-cost receivables follow ASC 326 (CECL); lease receivables from operating leases follow ASC 842 instead.",
    ],
    meas=(
        "Amortized cost",
        "Initial: principal plus/minus deferred net fees/costs, premiums or discounts.",
        "Subsequent: interest method accretion/amortization less write-offs, presented net of the ASC 326 allowance.",
    ),
    je=[
        (
            "Seller financing: note receivable from a property buyer",
            "An owner sells a parcel and takes a $3,000,000 purchase-money note at a market rate; the buyer pays a $30,000 loan fee.",
            [("DR", "Notes receivable", 3000000), ("CR", "Deferred loan fees (contra note)", 30000), ("CR", "Due from buyer — sale proceeds", 2970000)],
            "The $30,000 fee accretes into interest income over the note's term via the interest method; the sale itself follows ASC 610-20.",
        ),
    ],
    traps=[
        ("Are resident rent receivables under ASC 310?", "No. Operating-lease receivables fall under ASC 842-30 (collectibility assessed on a lease-by-lease basis; changes adjust lease income). Non-lease charges under 606 are receivables subject to ASC 326."),
        ("Can loan origination fees be recognized as income when received?", "No. Net fees/costs adjust yield over the loan life using the interest method (straight-line only for revolving lines)."),
        ("Do TDRs still exist for creditors?", "ASU 2022-02 eliminated creditor TDR accounting for entities that adopted CECL; modifications with borrowers in financial difficulty now have disclosure requirements instead."),
    ],
    lens="Notes from seller financing, loans to affiliates and non-lease resident charges sit here; resident lease receivables are 842.",
    cites=["310-20-35-18"],
)

C(
    "320",
    tag="Debt securities by intent: trading (FV-NI), available-for-sale (FV-OCI), held-to-maturity (amortized cost).",
    alias=["debt securities", "afs", "available for sale", "htm", "held to maturity", "trading securities", "bonds", "unrealized gains"],
    re=None,
    truth="The same bond can be a trader's inventory or a pension fund's long-term income stream. GAAP lets intent drive measurement: if you'll trade it, fair value through earnings; if you'll hold it to maturity and can prove it, amortized cost; everything in between is available-for-sale, at fair value with swings parked in OCI until sold.",
    analogy=(
        "Three Ways to Own a Rare Coin",
        "A dealer flipping coins checks today's price every day (trading). A collector who promises to keep the coin forever only cares about what she paid (held-to-maturity). Someone who might sell 'if the price is right' tracks value but doesn't call it profit until she sells (AFS → OCI).",
    ),
    recog=[
        "Classify at acquisition and document: trading, available-for-sale, or held-to-maturity (320-10-25-1).",
        "HTM requires positive intent and ability to hold to maturity; selling HTM securities can taint the whole portfolio.",
        "Recognize purchases/sales on trade date.",
        "Credit losses: HTM under ASC 326-20 (allowance); AFS under ASC 326-30 (allowance limited to the fair-value shortfall).",
    ],
    meas=(
        "Fair value (trading, AFS) or amortized cost (HTM)",
        "Initial: transaction price (fair value) including premium or discount.",
        "Subsequent: trading → FV through net income; AFS → FV with unrealized changes in OCI; HTM → amortized cost less allowance.",
    ),
    je=[
        (
            "AFS bond gains value before sale",
            "A company's AFS corporate bond (amortized cost $1,000,000) has a fair value of $1,040,000 at quarter-end.",
            [("DR", "Fair value adjustment — AFS securities", 40000), ("CR", "OCI — unrealized gain on AFS securities", 40000)],
            "On sale, reclassify the accumulated gain from AOCI into earnings.",
        ),
    ],
    traps=[
        ("Can you reclassify from HTM to AFS whenever you like?", "No. Sales or transfers from HTM call into question intent for the rest of the portfolio, except for narrow circumstances (e.g., significant deterioration in issuer creditworthiness, tax law changes)."),
        ("Where do AFS credit losses go?", "To an allowance through earnings (limited to the amount fair value is below amortized cost); non-credit declines stay in OCI."),
        ("Do equity securities belong in AFS?", "No. Since ASU 2016-01, equity securities follow ASC 321 at fair value through net income."),
    ],
    cites=["320-10-25-1"],
)

C(
    "321",
    tag="Equity securities at fair value through net income — or cost minus impairment if no readily determinable fair value.",
    alias=["equity securities", "stocks", "fv-ni", "measurement alternative", "readily determinable fair value", "observable price changes"],
    re=None,
    truth="A share of stock has no maturity and no contractual cash flows, so its only meaningful value is today's price. GAAP therefore marks equity securities to fair value with changes in net income — no OCI parking lot. When there is no reliable market price, a practical 'measurement alternative' uses cost adjusted for impairment and observable price changes.",
    analogy=(
        "Collectible Sneakers",
        "Popular sneakers trade on resale apps every minute, so you value your pair at today's price. A one-off prototype nobody sells publicly? You carry it at what you paid, adjust it when a comparable pair actually sells, and write it down if it gets damaged.",
    ),
    recog=[
        "Recognize equity securities (not consolidated or equity-method) at fair value; changes go to net income (321-10-35-1).",
        "Without a readily determinable fair value, elect the measurement alternative: cost minus impairment plus/minus observable price changes in orderly transactions for identical or similar securities (321-10-35-2).",
        "Perform a qualitative impairment assessment each reporting period for measurement-alternative investments.",
    ],
    meas=(
        "Fair value through net income (or measurement alternative)",
        "Initial: cost (transaction price).",
        "Subsequent: fair value each period through earnings; or cost − impairment ± observable price changes.",
    ),
    je=[
        (
            "Mark a listed REIT share position to market",
            "A company holds listed REIT shares bought for $500,000; year-end fair value is $465,000.",
            [("DR", "Unrealized loss on equity securities (net income)", 35000), ("CR", "Equity securities — fair value adjustment", 35000)],
            "No OCI option for equity securities.",
        ),
    ],
    traps=[
        ("Can unrealized equity losses go to OCI?", "No. Since ASU 2016-01 equity securities go through net income (except equity-method and consolidated investments)."),
        ("What triggers a remeasurement under the measurement alternative?", "An observable price change in an orderly transaction for an identical or similar investment of the same issuer, or an impairment."),
        ("Is a 10% LP interest in a real estate fund under ASC 321?", "Possibly not — LP interests above 3–5% often require the equity method (323-30); NAV practical expedient may apply to fund interests."),
    ],
    cites=["321-10-35-1", "321-10-35-2"],
)

C(
    "323",
    tag="Significant influence (≈20%) → equity method: carry your share of the investee's book equity and earnings.",
    alias=["equity method", "joint venture", "jv", "significant influence", "20 percent", "investee", "basis difference", "hlbv", "partnership investment", "llc investment"],
    re="core",
    truth="When you can significantly influence an investee but not control it, marking your stake to market ignores your role, and consolidating overstates it. The equity method splits the difference: you carry one line — your investment — and grow or shrink it by your share of the investee's earnings, while distributions are simply cash coming back out of the investment, not income.",
    analogy=(
        "Co-Owning a Food Truck with Friends",
        "You own 30% of a food truck. You don't list the truck's grill and fryer on your personal balance sheet (that would be consolidation), but you also don't just track the price someone might pay for your stake. You record your 30% share of the truck's monthly profit as your earnings, and when the partners hand you cash from the till, your stake shrinks — it's your own money coming back.",
    ),
    recog=[
        "Apply the equity method when the investor has significant influence — presumed at 20% or more of voting stock (323-10-15-8), rebuttable.",
        "Investments in partnerships, LLCs with capital accounts and real estate ventures: more than minor influence (SEC staff view: generally > 3–5%) usually requires the equity method (323-30).",
        "Recognize the investor's share of investee earnings in the period earned; eliminate intra-entity profits.",
        "Test for other-than-temporary impairment when fair value falls below carrying amount.",
    ],
    meas=(
        "Cost adjusted for share of earnings and distributions",
        "Initial: cost (including transaction costs); basis differences vs. underlying book equity are identified and amortized if attributable to depreciable assets.",
        "Subsequent: + share of income, − share of losses (not below zero unless committed to fund), − distributions; OTTI write-downs are not reversed.",
    ),
    je=[
        (
            "Record share of JV earnings",
            "A developer owns 25% of a multifamily JV that earns $2,400,000 for the year.",
            [("DR", "Investment in unconsolidated JV", 600000), ("CR", "Equity in earnings of unconsolidated JV", 600000)],
            "Use HLBV if the JV waterfall makes ownership percentages a poor proxy for economics.",
        ),
        (
            "Receive a JV distribution",
            "The JV distributes $400,000 to the developer.",
            [("DR", "Cash — operating", 400000), ("CR", "Investment in unconsolidated JV", 400000)],
            "Distributions reduce the investment — they are not income (unless the investment is at zero and no commitment exists).",
        ),
    ],
    traps=[
        ("Is a JV distribution income?", "No — it is a return of investment reducing the carrying amount. Classify in cash flows as operating (return on) or investing (return of) using the cumulative-earnings or nature-of-distribution approach."),
        ("What happens when losses exceed your investment?", "Stop at zero unless you guaranteed obligations or committed to provide further support; then continue recording losses."),
        ("How does the SEC view a 4% LP interest in a real estate partnership?", "More than minor influence is generally presumed above 3–5% for partnerships with specific ownership accounts — equity method, not ASC 321."),
        ("What is HLBV?", "Hypothetical liquidation at book value: allocate earnings by computing what each partner would receive if the JV liquidated at book value under the waterfall at each date."),
    ],
    lens="Institutional multifamily ownership is dominated by JVs — the GP/sponsor's promote-bearing interest and the LP's capital interest are often equity-method investments.",
    cites=["323-10-15-8", "323-30-S99-1"],
)

C(
    "325",
    tag="Everything else you invest in: cost-method legacy items, insurance contracts (COLI) and securitization beneficial interests.",
    alias=["investments other", "cost method", "coli", "cash surrender value", "life insurance", "beneficial interests", "securitized"],
    re=None,
    truth="Some investments fit no neat box — a life-insurance policy the company owns on its executives, a residual tranche of a securitization. The rule is to measure them at what you could actually realize: the cash surrender value of the policy, or a beneficial interest's expected cash flows with changes treated as yield or credit loss.",
    analogy=(
        "The Pawnshop Value of a Watch",
        "A company-owned life-insurance policy is like a watch you could pawn tomorrow: whatever the premiums were, it's worth what the pawnshop (insurer) would give you if you surrendered it today.",
    ),
    recog=[
        "Company-owned life insurance: recognize the amount that could be realized under the contract (cash surrender value) — 325-30.",
        "Beneficial interests in securitized financial assets: recognize accretable yield using expected cash flows; reassess when expectations change (325-40).",
        "Legacy cost-method guidance (325-20) was largely superseded by ASC 321.",
    ],
    meas=(
        "Realizable amount / expected cash flows",
        "COLI: cash surrender value; premiums paid in excess reduce earnings.",
        "Beneficial interests: amortized cost with yield adjusted prospectively; credit losses under ASC 326.",
    ),
    je=[
        (
            "Pay a COLI premium",
            "A company pays a $50,000 premium on a key-person policy; cash surrender value increases by $38,000.",
            [("DR", "Cash surrender value of life insurance", 38000), ("DR", "Life insurance expense", 12000), ("CR", "Cash — operating", 50000)],
            "Only the realizable amount is an asset; the rest is expense.",
        ),
    ],
    traps=[
        ("Is a key-person policy recorded at total premiums paid?", "No — at the amount realizable (cash surrender value, adjusted for contract terms)."),
        ("Where did the old 'cost method' go?", "Most equity investments moved to ASC 321 (fair value or the measurement alternative)."),
        ("How are changes in expected cash flows of a beneficial interest recognized?", "Favorable changes adjust yield prospectively; adverse credit-related changes go through the ASC 326 allowance."),
    ],
    cites=[],
)

C(
    "326",
    tag="CECL: book the lifetime expected credit loss on day one — don't wait for the default.",
    alias=["cecl", "credit losses", "current expected credit loss", "allowance", "bad debt", "expected credit loss", "pool", "loss rate", "aging schedule", "afs impairment"],
    re="support",
    truth="If you lend $100 to 100 people and experience says 3 won't pay, you never really had $10,000 of value — you had about $9,700. CECL forces you to recognize that expected shortfall the moment the receivable is born, using history, current conditions and reasonable forecasts, rather than waiting until a specific borrower defaults (the old 'incurred loss' model).",
    analogy=(
        "The Wedding Caterer's RSVP Math",
        "A caterer invited 200 guests knows from experience that about 10% of 'yes' RSVPs never show. She plans food for 180 from day one — she doesn't wait for the wedding night to discover the no-shows. CECL is planning for the no-shows up front.",
    ),
    recog=[
        "Applies to financial assets at amortized cost: trade receivables, loans, HTM debt securities, contract assets, net investments in sales-type/direct financing leases (326-20).",
        "Excludes receivables from operating leases under ASC 842 (326-20-15-3(g)) and loans between entities under common control.",
        "Measure on a pool basis when similar risk characteristics exist (326-20-30-2); individually otherwise.",
        "ASU 2025-05 practical expedient: for current accounts receivable and contract assets, assume current conditions persist for the remaining life.",
        "AFS debt securities use 326-30: allowance limited to the difference between fair value and amortized cost.",
    ],
    meas=(
        "Amortized cost less lifetime expected credit losses",
        "Allowance = lifetime expected credit loss at origination/acquisition, based on historical loss information adjusted for current conditions and reasonable and supportable forecasts.",
        "Re-estimate each period; changes in the allowance go through credit-loss expense; write-offs are charged against the allowance.",
    ),
    je=[
        (
            "Day-one CECL allowance on non-lease receivables",
            "A property management company has $800,000 of 606 fee receivables; its loss-rate model indicates a 2.5% lifetime loss.",
            [("DR", "Credit loss expense", 20000), ("CR", "Allowance for credit losses", 20000)],
            "Re-measured each period through expense; the allowance is a contra-asset.",
        ),
        (
            "Write off an uncollectible account",
            "A $4,500 management-fee receivable is deemed uncollectible.",
            [("DR", "Allowance for credit losses", 4500), ("CR", "Accounts receivable — fees", 4500)],
            "Write-offs hit the allowance, not expense (expense was recognized when the allowance was built).",
        ),
    ],
    traps=[
        ("Does CECL apply to resident rent receivables?", "No. Operating-lease receivables are outside ASC 326; the lessor assesses collectibility under ASC 842-30-25-12/35-3 and records changes as an adjustment to lease income. Many lessors also keep a general reserve under ASC 450 — a policy auditors scrutinize."),
        ("Is a zero-loss expectation allowed?", "Yes for assets like Treasuries or fully collateralized receivables where historical loss is zero and expected to remain so — document it."),
        ("What is the ASU 2025-05 expedient?", "For current accounts receivable and current contract assets, entities may assume current conditions at the balance-sheet date do not change for the remaining life of the asset (private companies can also consider subsequent collections)."),
        ("Can the allowance be recorded only when a receivable is 90 days past due?", "No — that's the incurred-loss mindset. CECL requires a lifetime estimate from day one; aging buckets are just one input."),
    ],
    lens="Operating-lease rent is outside CECL (842 applies), but utility reimbursements, fees and other 606 receivables, notes to affiliates and lessor sales-type lease receivables are inside it.",
    cites=["326-20-15-3", "326-20-30-2"],
)

C(
    "330",
    tag="Inventory at cost, written down to net realizable value when it won't sell for what it cost.",
    alias=["inventory", "lcnrv", "net realizable value", "fifo", "lifo", "average cost", "write-down", "obsolescence", "cost of goods sold"],
    re=None,
    truth="Inventory is cost waiting to be matched against revenue. You carry it at what it cost you, but the moment you know you can't sell it for at least that amount, the loss already happened — so you write it down, never up. Cost flow assumptions (FIFO, LIFO, average) decide which costs leave first.",
    analogy=(
        "The Bakery's Day-Old Bread",
        "Bread cost $3 a loaf to bake. At closing, unsold loaves will only fetch $1 tomorrow as day-old bread. The baker should recognize the $2 loss tonight — not pretend each loaf is still worth $3 until it sells.",
    ),
    recog=[
        "Capitalize costs to bring inventory to its existing condition and location (materials, labor, overhead); abnormal costs (idle capacity, waste) are expensed.",
        "FIFO or average cost: measure at lower of cost and net realizable value (330-10-35-1B). LIFO or retail method: lower of cost or market.",
        "Write-downs create a new cost basis — no reversals in later annual periods.",
    ],
    meas=(
        "Lower of cost and NRV (or cost/market for LIFO)",
        "Initial: purchase price plus conversion costs and allocated fixed overhead based on normal capacity.",
        "Subsequent: compare cost to NRV (estimated selling price less completion and disposal costs) each period.",
    ),
    je=[
        (
            "Write down maintenance-supply inventory held for resale",
            "A company's appliance inventory held for sale (cost $150,000) has NRV of $118,000 after a model change.",
            [("DR", "Cost of sales — inventory write-down", 32000), ("CR", "Inventory", 32000)],
            "The written-down amount is the new cost basis.",
        ),
    ],
    traps=[
        ("Can inventory write-downs be reversed if prices recover?", "Not in later annual periods (the write-down creates a new cost basis). Within the same fiscal year, recoveries of interim write-downs may be recognized (ASC 270)."),
        ("Is LIFO allowed under IFRS?", "No — a classic US GAAP vs IFRS difference; LIFO is permitted under US GAAP and the LIFO conformity rule ties it to tax."),
        ("Are a property's maintenance supplies inventory?", "Usually they are supplies expensed when purchased or consumed (or prepaid), not ASC 330 inventory held for sale — unless held for resale."),
    ],
    cites=["330-10-35-1B"],
)

C(
    "340",
    tag="Prepaids and deferred costs — pay now, expense as the benefit is used; capitalize contract-acquisition costs.",
    alias=["prepaid expenses", "prepaids", "deferred costs", "contract costs", "commissions", "340-40", "cost to obtain a contract", "cost to fulfill", "deferred leasing costs"],
    re="support",
    truth="Paying cash is not the same as consuming a benefit. If you pay a year of insurance today, eleven-twelfths of that payment is still an asset you'll use later. Likewise, a commission paid only because you won a multi-year customer contract is an investment you recover over the contract — it's capitalized and amortized rather than expensed on day one.",
    analogy=(
        "The Annual Streaming Subscription",
        "You pay $120 upfront for a year of streaming. On day one you haven't 'spent' $120 of entertainment — you've prepaid for 12 months. Each month, $10 of that prepayment is consumed.",
    ),
    recog=[
        "Prepaid expenses: recognize an asset when payment precedes the receipt of goods/services; expense as consumed.",
        "Incremental costs of obtaining a contract with a customer (e.g., sales commissions) are capitalized if expected to be recovered (340-40-25-1).",
        "Practical expedient: expense incremental costs when the amortization period would be one year or less (340-40-25-4).",
        "Costs to fulfill a contract are capitalized only if not covered by another Topic, directly related, generate resources used to satisfy future obligations, and are recoverable.",
    ],
    meas=(
        "Cost, amortized on a systematic basis",
        "Initial: amount paid or incurred.",
        "Subsequent: amortize consistent with the transfer of goods/services; test contract-cost assets for impairment against remaining consideration.",
    ),
    je=[
        (
            "Prepay annual property insurance",
            "A community pays a $360,000 annual property insurance premium on January 1.",
            [("DR", "Prepaid insurance", 360000), ("CR", "Cash — operating", 360000)],
            "Amortize $30,000 per month to insurance expense.",
        ),
        (
            "Monthly amortization of the prepaid",
            "End of January.",
            [("DR", "Insurance expense", 30000), ("CR", "Prepaid insurance", 30000)],
            "Recurring journal entry; reconcile the prepaid schedule monthly.",
        ),
    ],
    traps=[
        ("Are leasing commissions paid to brokers for a commercial lease under ASC 340-40?", "No — lessor initial direct costs follow ASC 842 (incremental costs of a lease), not 340-40. For residential leases these are typically immaterial and expensed."),
        ("Can a bonus paid to a sales team be capitalized?", "Only if it is incremental to obtaining specific contracts; bonuses based on general performance are expensed."),
        ("What is the 12-month tax rule vs GAAP prepaid?", "Tax may deduct prepaid benefits not extending beyond 12 months (Treas. Reg. §1.263(a)-4(f)); GAAP still amortizes over the benefit period — a book-tax difference."),
    ],
    lens="Prepaid insurance, prepaid property taxes, prepaid service contracts and deferred financing/leasing costs are recurring close items reconciled by the property accountant.",
    cites=["340-40-25-1", "340-40-25-4"],
)

C(
    "350",
    tag="Goodwill (impairment-only), finite-lived intangibles (amortize), internal-use software and crypto (fair value).",
    alias=["goodwill", "intangible assets", "impairment", "internal-use software", "cloud computing", "saas implementation", "crypto", "bitcoin", "website costs", "in-place lease intangible"],
    re="support",
    truth="Goodwill is the premium paid for things you can't separately name — a workforce, synergies, reputation — so it is never amortized; it is tested for impairment because its value can only be inferred. Identifiable intangibles with a finite life are used up over time and amortized. Software you build for internal use is capitalized only once the project is real and probable to complete, and crypto assets are marked to fair value because their price is their value.",
    analogy=(
        "Buying a Neighborhood Pizza Shop",
        "You pay $500,000 for a pizza shop whose ovens and recipes are worth $350,000. The extra $150,000 buys the loyal customers and the shop's reputation (goodwill) — you can't sell those separately, and they don't wear out on a schedule, so you just check each year that they're still worth it. The five-year lease on the storefront you took over, though, clearly runs out, so that intangible is used up year by year.",
    ),
    recog=[
        "Goodwill: recognized only in business combinations; tested for impairment at the reporting-unit level at least annually (optional qualitative step first) — 350-20-35-3.",
        "Impairment = carrying amount of the reporting unit minus its fair value, limited to goodwill (350-20-35-2); private companies may elect to amortize goodwill (≤10 years).",
        "Finite-lived intangibles amortized over useful life; indefinite-lived tested annually.",
        "Internal-use software: capitalize development costs once authorized and probable to complete (ASU 2025-06 replaces project stages with a probable-to-complete threshold, pending); implementation costs of cloud-computing arrangements follow the same model.",
        "Crypto assets in scope of 350-60: measured at fair value with changes in net income (350-60-35-1).",
    ],
    meas=(
        "Cost less amortization/impairment; crypto at fair value",
        "Initial: cost (or fair value in a business combination/asset acquisition allocation).",
        "Subsequent: amortize finite-lived; impairment tests; crypto remeasured at fair value each period.",
    ),
    je=[
        (
            "Amortize an acquired in-place lease intangible",
            "On acquiring a stabilized community, $1,800,000 of the purchase price is allocated to in-place leases with an average remaining term of 6 months.",
            [("DR", "Amortization expense — in-place leases", 300000), ("CR", "Accumulated amortization — in-place lease intangibles", 300000)],
            "Monthly amortization; residential in-place intangibles are short-lived because leases are ~12 months.",
        ),
        (
            "Goodwill impairment",
            "A reporting unit's carrying amount (including $2,000,000 goodwill) exceeds its fair value by $750,000.",
            [("DR", "Goodwill impairment loss", 750000), ("CR", "Goodwill", 750000)],
            "One-step test since ASU 2017-04; loss capped at goodwill balance; never reversed.",
        ),
    ],
    traps=[
        ("Can goodwill arise from buying a single apartment building?", "Rarely. A single property is usually an asset acquisition (screen test in ASC 805), so no goodwill — excess cost is allocated to the assets acquired."),
        ("Can a goodwill impairment be reversed?", "No — never, even if fair value recovers."),
        ("Are SaaS implementation costs capitalized?", "Implementation costs of a hosting arrangement that is a service contract are capitalized under the internal-use software model (350-40) and amortized over the hosting term, presented like a prepaid."),
        ("How is Bitcoin measured?", "In-scope crypto assets are at fair value through net income under 350-60 (ASU 2023-08) — no more cost-less-impairment."),
    ],
    lens="Purchase-price allocations for acquired communities create in-place lease and above/below-market lease intangibles; property-management software implementations raise internal-use/cloud-cost questions.",
    cites=["350-20-35-2", "350-60-35-1", "350-40-25-12"],
)

C(
    "360",
    tag="PP&E at cost, depreciated over useful life; impaired only when undiscounted cash flows can't recover it.",
    alias=["pp&e", "property plant and equipment", "fixed assets", "depreciation", "capitalization", "impairment", "held for sale", "useful life", "capex", "building improvements", "recoverability test"],
    re="core",
    truth="A building is a bundle of future service bought in one payment. Depreciation spreads that cost across the years the building helps earn rent, so each year's income carries its fair share. Because the asset produces cash flows over decades, it is only written down when its total future undiscounted cash flows can no longer recover its carrying amount — then it drops to fair value.",
    analogy=(
        "The Rideshare Driver's Car",
        "A rideshare driver buys a $30,000 car expecting 5 years of driving. Counting the whole $30,000 as a first-year cost would make year one look like a disaster and years two to five look amazing. Instead she counts $6,000 a year. If a flood ruins the engine so badly that all future fares can't even cover what she has left on the books, she writes the car down to what it's actually worth today.",
    ),
    recog=[
        "Capitalize costs to acquire, construct and prepare an asset for use (including capitalized interest under 835-20 during construction); betterments and replacements that extend life or add capacity are capitalized, routine repairs expensed.",
        "Depreciate systematically and rationally over the useful life (360-10-35-4); land is not depreciated.",
        "Impairment (held and used): test when events indicate carrying amount may not be recoverable; recognize a loss only if undiscounted cash flows < carrying amount, measured as carrying amount − fair value (360-10-35-17).",
        "Held for sale when all 360-10-45-9 criteria are met: stop depreciating, measure at lower of carrying amount or fair value less cost to sell.",
        "Real estate sales guidance (360-20) was superseded; sales of real estate now follow ASC 610-20 or ASC 606.",
    ],
    meas=(
        "Historical cost less accumulated depreciation and impairment",
        "Initial: purchase price plus directly attributable costs (closing costs in asset acquisitions, capitalized interest, development costs).",
        "Subsequent: depreciation; two-step impairment (recoverability with undiscounted cash flows, then fair value); impairment losses are not reversed for held-and-used assets.",
    ),
    je=[
        (
            "Capitalize a roof replacement",
            "A 300-unit community replaces its roofs for $620,000 (extends the building's life). The old roof had a $95,000 net book value (cost $400,000, accumulated depreciation $305,000).",
            [("DR", "Buildings and improvements — roof", 620000), ("CR", "Accounts payable", 620000)],
            "Capitalize the betterment.",
        ),
        (
            "Retire the replaced roof (partial disposition)",
            "Derecognize the old roof component.",
            [("DR", "Accumulated depreciation — buildings", 305000), ("DR", "Loss on disposal of assets", 95000), ("CR", "Buildings and improvements — roof", 400000)],
            "Replaced components must be written off, or the asset base is double-counted.",
        ),
        (
            "Monthly depreciation",
            "Building cost $24,000,000 (land excluded), 30-year straight-line life.",
            [("DR", "Depreciation expense", 66667), ("CR", "Accumulated depreciation — buildings", 66667)],
            "$24,000,000 / 30 / 12 = $66,667 per month.",
        ),
        (
            "Impairment after failed recoverability test",
            "An older asset's carrying amount is $18,000,000; undiscounted cash flows are $16,500,000; fair value is $14,200,000.",
            [("DR", "Impairment loss on real estate", 3800000), ("CR", "Buildings and improvements", 3800000)],
            "Loss is measured to fair value (not to the undiscounted cash flows). New cost basis — no reversal.",
        ),
    ],
    traps=[
        ("Undiscounted or discounted cash flows for the recoverability test?", "Undiscounted — only for the recoverability screen. If it fails, the loss is measured to fair value (a discounted/market-based measure)."),
        ("Can an impairment on a held-and-used property be reversed if the market recovers?", "No. Held-for-sale write-downs can be reversed only up to the cumulative loss previously recognized, while the asset stays held for sale."),
        ("Is a $3,000 appliance replacement capitalized?", "Depends on the capitalization policy and whether it's a unit of property that extends useful life; many owners expense below a threshold. Tax has its own de minimis safe harbor ($2,500/$5,000 per item)."),
        ("When does depreciation start on a renovation?", "When the asset is ready for its intended use (placed in service), not when costs are incurred; construction-in-progress is not depreciated."),
        ("Do you stop depreciating a property you're marketing for sale?", "Only once all held-for-sale criteria are met (including sale probable within one year)."),
    ],
    lens="Fixed-asset registers, capex vs. repair decisions, component depreciation, retirements on unit renovations and impairment testing of underperforming communities all live here.",
    cites=["360-10-35-4", "360-10-35-17", "360-10-45-9"],
)
