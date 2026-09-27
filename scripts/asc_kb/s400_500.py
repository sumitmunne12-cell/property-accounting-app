"""400s Liabilities and 500s Equity."""

from . import C

# ── 400 Liabilities ─────────────────────────────────────────────────────────────────────────

C(
    "405",
    tag="Liabilities: book what you owe; derecognize only when paid or legally released.",
    alias=["liabilities", "accounts payable", "extinguishment", "legal release", "breakage", "supplier finance", "joint and several", "insurance assessments", "accrued liabilities"],
    re="support",
    truth="A liability is a present obligation to give up resources. It stays on the books until the obligation actually ends — you pay it, or the creditor (or a court) legally releases you. Hoping a vendor forgets, or writing off 'old payables' because they're stale, does not extinguish anything. Newer subtopics add transparency to supplier-finance programs and joint-and-several obligations.",
    analogy=(
        "The Borrowed Lawnmower",
        "Borrowing your neighbor's lawnmower creates an obligation to return it. It doesn't vanish because months have passed and the neighbor hasn't asked. Only returning it or the neighbor saying 'keep it' ends the obligation.",
    ),
    recog=[
        "Recognize a liability when a present obligation from a past event exists (goods received, services performed, legal obligation).",
        "Derecognize only when extinguished: the debtor pays the creditor, or is legally released as primary obligor by the creditor or judicially (405-20-40-1).",
        "Unclaimed vendor checks or stale credits are escheated under state unclaimed-property law — not written off to income.",
        "Joint-and-several obligations (405-40): recognize the amount agreed to pay plus any additional amount expected to be paid on behalf of co-obligors.",
        "Supplier-finance programs (405-50): disclose key terms, confirmed amounts outstanding and a rollforward.",
    ],
    meas=(
        "Settlement amount",
        "Initial: amount of the obligation (or fair value when required by another Topic).",
        "Subsequent: remains until paid or legally released; accrue interest where applicable.",
    ),
    je=[
        (
            "Accrue a received-not-invoiced service",
            "Landscaping for September ($14,500) was performed but the vendor invoice has not arrived at month-end.",
            [("DR", "Landscaping expense", 14500), ("CR", "Accrued expenses", 14500)],
            "Reverse on day 1 of the next period when the invoice is entered in A/P.",
        ),
        (
            "Stale vendor check — escheat, don't write off",
            "A $2,300 vendor check voided after 18 months is reclassified pending escheatment to the state.",
            [("DR", "Cash — operating (void check)", 2300), ("CR", "Unclaimed property liability", 2300)],
            "The obligation still exists — it moves to the state under unclaimed-property law.",
        ),
    ],
    traps=[
        ("Can old, unpaid A/P balances be written off to other income?", "Not unless legally extinguished. Unclaimed amounts are typically owed to the state as unclaimed property."),
        ("Is a tenant security deposit a liability?", "Yes — it is refundable, so it is a liability (not revenue) until applied to damages/unpaid rent or refunded."),
        ("How are gift-card or prepaid breakage liabilities derecognized?", "Under ASC 606 breakage guidance (606-10-55-46 to 55-49) when the entity expects to be entitled to breakage — or escheat laws apply."),
        ("What must supplier-finance program buyers disclose?", "Key terms, confirmed obligations outstanding at period-end, where presented, and a rollforward of obligations (ASU 2022-04)."),
    ],
    lens="A/P accruals, security-deposit liabilities, unclaimed vendor checks (escheatment workbench) and accrued property taxes are daily 405 items for property accountants.",
    cites=["405-20-40-1"],
)

C(
    "410",
    tag="If the law makes you clean up when you retire an asset, book the obligation now — at fair value.",
    alias=["aro", "asset retirement obligation", "environmental obligations", "asbestos", "conditional aro", "remediation", "decommissioning", "accretion"],
    re="support",
    truth="If you know that retiring an asset will legally require you to spend money — remove asbestos, plug a well, restore leased land — that cost is part of owning the asset from day one. Recording it only at retirement would make early years look falsely profitable. So the obligation is booked at fair value when incurred and capitalized into the asset, then depreciated and accreted over time.",
    analogy=(
        "The Apartment Security Deposit in Reverse",
        "When you rent an apartment, you know you'll have to repaint the walls white before you leave. That repainting cost exists the day you move in, not the day you move out — it's part of the true cost of living there.",
    ),
    recog=[
        "Recognize the fair value of an ARO in the period incurred if reasonably estimable (410-20-25-4); conditional AROs (timing/method uncertain) are still recognized when estimable.",
        "Capitalize the same amount as an asset retirement cost in the related long-lived asset (410-20-25-5).",
        "Environmental remediation liabilities (410-30) follow ASC 450: accrue when probable and reasonably estimable; not discounted unless timing and amounts are fixed or reliably determinable.",
    ],
    meas=(
        "Fair value (expected present value), then accretion",
        "Initial: expected present value using a credit-adjusted risk-free rate (410-20-30-1).",
        "Subsequent: accretion expense (interest method) plus revisions in timing/amount; asset retirement cost depreciated over the asset's life.",
    ),
    je=[
        (
            "Recognize a conditional ARO for asbestos abatement",
            "On acquiring a 1970s building, the owner estimates legally required asbestos abatement at demolition; expected present value $240,000.",
            [("DR", "Buildings — asset retirement cost", 240000), ("CR", "Asset retirement obligation", 240000)],
            "Conditional ARO: timing uncertain but the legal obligation is unconditional.",
        ),
        (
            "Annual accretion",
            "Accretion at a 6% credit-adjusted risk-free rate.",
            [("DR", "Accretion expense", 14400), ("CR", "Asset retirement obligation", 14400)],
            "Accretion is operating expense, not interest.",
        ),
    ],
    traps=[
        ("Can you skip an ARO because demolition timing is unknown?", "No. A conditional ARO is recognized if fair value is reasonably estimable; uncertainty about timing is reflected in the measurement."),
        ("Is ARO accretion interest expense?", "No — it is classified as an operating item (accretion expense) and is not eligible for interest capitalization."),
        ("Are environmental remediation liabilities discounted?", "Generally not, unless the amount and timing of cash payments are fixed or reliably determinable."),
    ],
    lens="Older multifamily assets often carry conditional AROs for asbestos-containing materials; ground-lease restoration clauses can also create AROs.",
    cites=["410-20-25-4", "410-20-30-1"],
)

C(
    "420",
    tag="Exit and disposal costs: book them when incurred — not when management merely plans them.",
    alias=["exit costs", "restructuring", "disposal costs", "one-time termination benefits", "severance", "contract termination"],
    re=None,
    truth="A plan in a boardroom is not an obligation to anyone outside it. Restructuring costs are recognized only when a liability is actually incurred — employees are told about their severance, a contract is actually terminated, or the service is received — so companies can't create 'cookie-jar' reserves from plans they might later reverse.",
    analogy=(
        "Planning to Quit Your Gym",
        "Deciding you'll cancel your gym membership next month doesn't cost you anything today. The cancellation fee only becomes real when you hand in the form — or the contract says you owe it.",
    ),
    recog=[
        "Recognize exit or disposal costs when the liability is incurred (420-10-25-1), not at commitment to a plan.",
        "One-time termination benefits: when the plan is approved, communicated to employees and meets the 420-10-25-4 criteria; if employees must work beyond the minimum retention period, recognize ratably over that service period.",
        "Contract termination costs: when the contract is terminated per its terms; costs to continue a contract without benefit when the entity ceases using the right.",
    ],
    meas=(
        "Fair value",
        "Initial: fair value of the liability when incurred.",
        "Subsequent: changes due to timing/amount revisions recognized in the same line; accretion if discounted.",
    ),
    je=[
        (
            "Communicate one-time severance",
            "A company closes a regional accounting office and communicates a $450,000 one-time severance plan; employees are not required to render future service beyond the minimum retention period.",
            [("DR", "Restructuring expense — severance", 450000), ("CR", "Accrued restructuring liability", 450000)],
            "Recognized at the communication date because no further service is required.",
        ),
    ],
    traps=[
        ("Can restructuring costs be accrued when the board approves the plan?", "No — only when incurred (communication of benefits meeting criteria, contract termination, etc.)."),
        ("What if severance is paid under an ongoing benefit plan?", "Then ASC 712 (probable and estimable), not 420, applies."),
        ("Are lease exit costs under 420?", "Not after ASC 842 — the ROU asset is tested for impairment under ASC 360; 420 covers other contract termination costs."),
    ],
    cites=["420-10-25-1", "420-10-25-4"],
)

C(
    "430",
    tag="Deferred revenue: cash received before you've earned it is a liability (link Topic → ASC 606).",
    alias=["deferred revenue", "unearned revenue", "contract liability", "prepaid rent", "customer deposits", "advance payments"],
    re="support",
    truth="Cash in advance is a promise you still have to keep. Until you deliver the service, you owe either the service or a refund, so the receipt is a liability. Topic 430 simply points to ASC 606, where deferred revenue is called a contract liability.",
    analogy=(
        "The Concert Ticket",
        "When you buy a concert ticket in March for a show in July, the band has your money but hasn't played. If the show is canceled you get a refund. The band's 'earnings' happen on concert night.",
    ),
    recog=[
        "Recognize a contract liability when consideration is received (or due) before goods or services are transferred (ASC 606).",
        "Relieve it to revenue as performance obligations are satisfied.",
        "Prepaid rent from residents is a lessor liability under ASC 842 (not 606) but is presented the same way.",
    ],
    meas=(
        "Amount received (transaction price allocated)",
        "Initial: consideration received or unconditionally due.",
        "Subsequent: reduced as revenue is recognized; significant financing components adjust the amount where applicable.",
    ),
    je=[
        (
            "Resident prepays next month's rent",
            "On September 28 a resident pays October rent of $1,850.",
            [("DR", "Cash — operating", 1850), ("CR", "Prepaid rent (liability)", 1850)],
            "On October 1, DR Prepaid rent / CR Rental income.",
        ),
    ],
    traps=[
        ("Is prepaid rent revenue when collected?", "No — it is a liability until the rental period begins."),
        ("Where is the real guidance for deferred revenue?", "ASC 606 (contract liabilities) — Topic 430 only links there."),
        ("Can a contract liability and contract asset for different contracts be netted?", "No — netting is at the contract level only."),
    ],
    lens="Prepaid rents and move-in deposits held before lease start are routine liabilities on the multifamily balance sheet.",
    cites=["430-10-05-1"],
)

C(
    "440",
    tag="Commitments: disclose big promises you've made even if nothing is owed yet.",
    alias=["commitments", "purchase obligations", "unconditional purchase obligations", "take-or-pay", "construction commitments", "contractual obligations"],
    re="support",
    truth="A signed promise to pay in the future isn't yet a liability if the other side hasn't performed — but it still locks up your future cash. Disclosing significant commitments (take-or-pay contracts, construction contracts, long-term purchase obligations) lets readers see claims on resources that the balance sheet doesn't show.",
    analogy=(
        "The Wedding Venue Deposit",
        "You signed a contract to hold your wedding at a venue next June for $30,000. You don't owe the full $30,000 today, but anyone judging your finances should know that money is already spoken for.",
    ),
    recog=[
        "Disclose unconditional purchase obligations (non-cancelable, part of financing arrangements, term > 1 year) not recognized on the balance sheet (440-10-50-2, 50-4).",
        "Disclose significant commitments such as capital expenditure contracts and long-term purchase agreements.",
        "Losses on firm purchase commitments are recognized when probable (e.g., price falls below contract price for inventory commitments).",
    ],
    meas=(
        "Disclosure (future minimum amounts); losses on commitments at the expected loss",
        "Disclose nature, term and amounts for each of the next five years.",
        "Accrue a loss on a firm commitment when the loss is probable and estimable.",
    ),
    je=[
        (
            "No entry at signing — recognize when work is performed",
            "An owner signs a $2,400,000 fixed-price renovation contract. No entry at signing; the first $300,000 progress billing is approved.",
            [("DR", "Construction in progress", 300000), ("CR", "Accounts payable — retainage withheld", 30000), ("CR", "Accounts payable", 270000)],
            "The unperformed $2,100,000 is disclosed as a commitment.",
        ),
    ],
    traps=[
        ("Is a signed construction contract a liability?", "Only to the extent work has been performed; the unperformed balance is a disclosed commitment."),
        ("What makes a purchase obligation 'unconditional'?", "Non-cancelable (or cancelable only on remote contingencies), negotiated as part of financing facilities, with a remaining term over one year."),
        ("Must losses on firm commitments be recognized?", "Yes when probable and estimable — commitments are not immune from loss recognition."),
    ],
    lens="Signed renovation and capex contracts, elevator/HVAC service agreements and ground-lease commitments are disclosed; job cost modules track committed vs. incurred cost.",
    cites=["440-10-50-2", "440-10-50-4"],
)

C(
    "450",
    tag="Loss contingencies: accrue if probable AND estimable; disclose if reasonably possible; never book gains early.",
    alias=["contingencies", "loss contingency", "litigation", "lawsuit", "probable", "reasonably possible", "remote", "gain contingency", "legal reserve", "claims", "accrual"],
    re="core",
    truth="Uncertainty is not a reason to ignore a loss. If it is probable that something has already gone wrong — a lawsuit you'll likely lose, a claim you'll likely pay — and you can estimate it, the loss belongs in this period. If it is only reasonably possible, readers still deserve a warning. Gains are asymmetrical: they are recognized only when realized, because booking hoped-for windfalls would overstate results.",
    analogy=(
        "The Burst Pipe Upstairs",
        "A pipe bursts in your unit and floods the neighbor below. Even before the neighbor sends a bill, you know you'll almost certainly pay for their ruined ceiling, and a contractor quotes $8,000–$12,000. You set aside money now — that's the accrual. If you might also sue the plumber who installed the pipe, you don't count that money until you win.",
    ),
    recog=[
        "Accrue a loss contingency when information before issuance indicates it is probable that an asset was impaired or a liability incurred at the balance-sheet date AND the amount is reasonably estimable (450-20-25-2).",
        "If a range is estimable and no amount is better, accrue the minimum of the range and disclose the reasonably possible exposure (450-20-30-1).",
        "Disclose (don't accrue) when reasonably possible, or when probable but not estimable; remote contingencies generally need no disclosure (except guarantees).",
        "Gain contingencies are not recognized until realized (450-30-25-1).",
        "General or unspecified business risks are not accrued (450-20-25-8) — no 'rainy-day' reserves.",
    ],
    meas=(
        "Best estimate (or minimum of range), undiscounted in most cases",
        "Initial: best estimate within the range; if none, the low end.",
        "Subsequent: re-estimate each period; changes through earnings; legal costs expensed as incurred (or accrued per policy).",
    ),
    je=[
        (
            "Accrue a probable slip-and-fall settlement",
            "Counsel concludes it is probable a resident lawsuit will be settled; estimated range $80,000–$150,000 with no better estimate. The insurance deductible is $50,000 and recovery beyond the deductible is probable.",
            [("DR", "Litigation loss expense", 80000), ("CR", "Accrued litigation liability", 80000)],
            "Accrue the minimum of the range; disclose the possible additional $70,000.",
        ),
        (
            "Recognize the probable insurance recovery (gross, not netted)",
            "Insurance recovery above the $50,000 deductible is probable.",
            [("DR", "Insurance recovery receivable", 30000), ("CR", "Litigation loss expense", 30000)],
            "Loss recoveries up to the recognized loss are recognized when probable; present the receivable gross (no offset against the liability).",
        ),
    ],
    traps=[
        ("Probable, reasonably possible, remote — what do they mean?", "Probable = likely to occur; reasonably possible = more than remote but less than likely; remote = slight chance. Accrue only probable-and-estimable."),
        ("Can you net the insurance receivable against the litigation liability?", "No — no right of setoff with the claimant; present gross."),
        ("A lawsuit is filed after year-end about an injury that happened before year-end. Accrue?", "Yes if probable and estimable before issuance — the underlying cause existed at the balance-sheet date (recognized subsequent event, 450-20-25-6 / 855)."),
        ("Can management accrue a general reserve for future repairs or hurricanes?", "No. General or unspecified business risks do not meet the accrual conditions."),
        ("When is an expected insurance gain recognized after a casualty?", "Proceeds above the recognized loss are a gain contingency — recognized when realized (settlement), under 450-30/610-30."),
    ],
    lens="Resident injury claims, fair-housing complaints, construction-defect disputes, property-tax appeals and insurance deductibles are the multifamily contingency portfolio; the accrual is booked at close and disclosed in the notes.",
    cites=["450-20-25-2", "450-20-30-1", "450-30-25-1"],
)

C(
    "460",
    tag="Guarantees: the guarantor books a liability at inception for the stand-ready obligation — even if payout is unlikely.",
    alias=["guarantees", "guarantee", "recourse", "carve-out guarantee", "completion guarantee", "indemnification", "standby letter", "stand ready", "product warranty"],
    re="support",
    truth="Promising to pay someone else's debt if they default is a real service with real value, even if default is unlikely — the lender would charge more without it. So the guarantor recognizes a liability at inception for the fair value of standing ready, and separately accrues any probable loss under ASC 450.",
    analogy=(
        "Co-Signing a Friend's Car Loan",
        "When you co-sign, you haven't paid a cent — but the bank gave your friend a better rate because of your signature. You've taken on a real, valuable obligation to stand ready, and if your friend misses payments, you'll be the one paying.",
    ),
    recog=[
        "At inception, recognize a liability for the guarantee's stand-ready obligation (460-10-25-4), unless scoped out (e.g., guarantees between parent and consolidated subsidiaries, product warranties recognized under other guidance).",
        "Separately apply ASC 450 for the contingent obligation to pay; the liability is the greater of fair value or the 450 amount (460-10-30-3).",
        "Disclose nature, term, maximum potential payments and carrying amount — even if the likelihood of payment is remote.",
    ],
    meas=(
        "Fair value at inception",
        "Initial: fair value of the guarantee (e.g., premium received or an estimate of what a third party would charge) (460-10-30-2).",
        "Subsequent: released systematically as risk expires, plus ASC 450 accruals when payment becomes probable.",
    ),
    je=[
        (
            "Sponsor guarantees a JV's construction loan",
            "A sponsor provides a completion and repayment guarantee on an unconsolidated JV's $40M construction loan; fair value of the guarantee is estimated at $350,000 (no fee received).",
            [("DR", "Investment in unconsolidated JV", 350000), ("CR", "Guarantee liability", 350000)],
            "Debit reflects the benefit to the investee (a contribution); released to income over the guarantee term as risk expires.",
        ),
    ],
    traps=[
        ("Is a guarantee with a remote chance of payout disclosed?", "Yes — guarantees are an exception to the 'remote = no disclosure' rule; disclose maximum potential future payments."),
        ("Does a parent guaranteeing its consolidated subsidiary's debt book a 460 liability?", "No in consolidated statements (scoped out); the guarantee is disclosed and matters in the subsidiary's separate statements."),
        ("Are nonrecourse carve-out ('bad boy') guarantees in scope?", "Yes, typically — but fair value is often minimal because payout depends on the sponsor's own acts; disclose them."),
    ],
    lens="Sponsor carve-out, completion and repayment guarantees on property loans and JV debt are the classic real estate guarantees to recognize and disclose.",
    cites=["460-10-25-4", "460-10-30-2"],
)

C(
    "470",
    tag="Debt: classify by callability, modify vs. extinguish with the 10% test, participation features at fair value.",
    alias=["debt", "mortgage", "loan", "notes payable", "modification", "extinguishment", "10 percent test", "covenant", "refinancing", "participating mortgage", "convertible debt", "tdr debtor", "current portion"],
    re="core",
    truth="Borrowed money must be repaid, so debt is carried at what you owe (adjusted for fees and discounts that are really interest). When a loan is refinanced or restructured, the question is economic: is it the same loan with tweaks (a modification — keep deferring the costs) or effectively a new loan (an extinguishment — book a gain or loss now)? The 10% cash-flow test draws that line objectively.",
    analogy=(
        "Renegotiating Your Phone Plan",
        "If your carrier just lowers your monthly bill a little, it's the same plan with a discount. But if the new terms are so different that the plan's value changes by more than 10%, you've effectively cancelled the old plan and signed a new one — any fees for breaking the old plan hit now.",
    ),
    recog=[
        "Classify debt callable at the balance-sheet date because of a covenant violation as current, unless the lender waives or loses the right to demand repayment for more than one year (470-10-45-11).",
        "Short-term debt can be classified noncurrent if refinanced on a long-term basis before the statements are issued (470-10-45-14).",
        "Modification vs. extinguishment: exchanges/modifications with the same lender whose present value of cash flows differs by ≥10% are extinguishments (470-50-40-10); otherwise modifications.",
        "Troubled debt restructurings by debtors (470-60): gain only if future undiscounted cash flows are less than the carrying amount.",
        "Participating mortgages (470-30): recognize a participation liability at fair value of the lender's share of appreciation.",
    ],
    meas=(
        "Amortized cost (effective interest method)",
        "Initial: proceeds less debt issuance costs (presented as a direct deduction) and discounts.",
        "Subsequent: accrete discounts and amortize issuance costs using the effective interest method; extinguishment gains/losses = reacquisition price − net carrying amount.",
    ),
    je=[
        (
            "Fund a new property mortgage",
            "An owner closes a $30,000,000 agency loan and pays $360,000 of lender and legal fees.",
            [("DR", "Cash — operating", 29640000), ("DR", "Deferred financing costs (contra mortgage)", 360000), ("CR", "Mortgage note payable", 30000000)],
            "Issuance costs reduce the carrying amount of the debt (ASC 835-30) and amortize to interest expense.",
        ),
        (
            "Refinance treated as extinguishment",
            "The old $22M loan (unamortized fees $140,000) is repaid with a prepayment penalty of $440,000 using proceeds from a new lender.",
            [("DR", "Mortgage note payable — old", 22000000), ("DR", "Loss on extinguishment of debt", 580000), ("CR", "Deferred financing costs (contra mortgage)", 140000), ("CR", "Cash — operating", 22440000)],
            "Different lender → always an extinguishment; penalty and unamortized costs expensed.",
        ),
    ],
    traps=[
        ("A DSCR covenant breach at year-end, waiver obtained after year-end for 15 months. Classification?", "Noncurrent is permitted if, before issuance, the lender waives its right to demand repayment for more than one year from the balance-sheet date (and it's not probable a later violation will occur)."),
        ("Refinancing with the same lender — modification or extinguishment?", "Apply the 10% present-value test; below 10% is a modification (new lender fees capitalized, third-party costs expensed), 10% or more is an extinguishment (the reverse)."),
        ("Where are debt issuance costs presented?", "As a direct deduction from the debt's carrying amount (not an asset), except line-of-credit costs, which may be an asset."),
        ("Is prepayment penalty on refinancing a financing cash outflow?", "Yes — debt prepayment and extinguishment costs are financing outflows."),
    ],
    lens="Agency and bank mortgages, construction loans, refinancings, rate-cap covenants and debt-service reserves make 470 central to multifamily accounting.",
    cites=["470-10-45-11", "470-50-40-10", "470-30-25-1"],
)

C(
    "480",
    tag="Some 'shares' are really debt: mandatorily redeemable instruments and fixed-value settlement obligations are liabilities.",
    alias=["liabilities vs equity", "mandatorily redeemable", "redeemable preferred", "temporary equity", "mezzanine", "480", "obligation to repurchase", "variable share"],
    re="support",
    truth="Labels don't matter — obligations do. If an instrument called 'preferred stock' must be redeemed for cash on a fixed date, the issuer has an unavoidable obligation to hand over assets, which is the definition of a liability. ASC 480 reclassifies such instruments (and share-settled obligations that are really fixed-dollar debts) out of equity.",
    analogy=(
        "The IOU Dressed as a Gift",
        "If your aunt gives you $5,000 'as a gift' but writes that you must give it back on your 30th birthday, it's not a gift — it's a loan. The wording on the card doesn't change your obligation.",
    ),
    recog=[
        "Mandatorily redeemable financial instruments are liabilities unless redemption occurs only on liquidation or termination of the entity (480-10-25-4).",
        "Obligations to repurchase the issuer's shares by transferring assets (e.g., forward purchase contracts, written puts) are liabilities.",
        "Obligations to issue a variable number of shares worth a fixed monetary amount are liabilities.",
        "SEC registrants classify redeemable equity outside of permanent equity (temporary equity — 480-10-S99).",
    ],
    meas=(
        "Fair value or present value of the redemption amount",
        "Initial: fair value (mandatorily redeemable at the redemption amount's present value).",
        "Subsequent: accrete to redemption amount; changes recognized as interest cost.",
    ),
    je=[
        (
            "Issue mandatorily redeemable preferred interests",
            "A property JV issues $5,000,000 of preferred equity to a mezzanine investor that must be redeemed in cash in year 5.",
            [("DR", "Cash — operating", 5000000), ("CR", "Mandatorily redeemable preferred interest (liability)", 5000000)],
            "Preferred return payments are recognized as interest expense, not distributions.",
        ),
    ],
    traps=[
        ("Is preferred equity with a fixed redemption date equity?", "No — mandatorily redeemable instruments are liabilities, and the 'dividends' are interest expense."),
        ("What is temporary (mezzanine) equity?", "SEC classification for instruments redeemable outside the issuer's control (e.g., at the holder's option) — not a liability, but not permanent equity."),
        ("Are NCI in a finite-life partnership mandatorily redeemable?", "Instruments redeemable only upon liquidation at the end of the entity's life are excluded; ASC 480 has an indefinite deferral for certain mandatorily redeemable NCI in limited-life subsidiaries (disclosure required)."),
    ],
    lens="Preferred equity used in multifamily capital stacks must be tested for mandatory redemption — the answer changes the capital structure, interest expense and DSCR covenants.",
    cites=["480-10-25-4"],
)

# ── 500 Equity ──────────────────────────────────────────────────────────────────────────────

C(
    "505",
    tag="Equity: owners' residual claim — contributions, distributions, treasury stock, splits and spinoffs.",
    alias=["equity", "stockholders equity", "treasury stock", "dividends", "distributions", "stock split", "stock dividend", "spinoff", "apic", "capital contributions", "partners capital"],
    re="support",
    truth="Equity is whatever is left for owners after every creditor is paid. Transactions with owners — putting money in, taking it out, buying back shares — never create profit or loss, because a company cannot earn income from its own owners. Those flows go straight to equity accounts.",
    analogy=(
        "The Family Business Cookie Jar",
        "When Mom puts $1,000 into the family bakery's cookie jar, the bakery didn't earn anything — it just has more of the family's own money. When the bakery hands $500 back to Dad, it didn't lose anything. Only selling bread creates profit.",
    ),
    recog=[
        "Contributions from owners increase paid-in capital at the fair value of consideration received.",
        "Distributions/dividends reduce equity when declared (liability recognized at declaration).",
        "Treasury stock: cost method (contra-equity) or par-value method; gains/losses on reissuance go to APIC, never income (505-30-30-10).",
        "Stock dividends < 20–25% are capitalized at fair value; larger ones are treated like splits (505-20-25).",
        "Spinoffs to owners are recorded at carrying amount (505-60).",
    ],
    meas=(
        "Fair value of consideration received / carrying amounts",
        "Initial: proceeds net of direct issuance costs.",
        "Subsequent: not remeasured (except certain instruments classified as liabilities or temporary equity).",
    ),
    je=[
        (
            "LP capital call for a renovation program",
            "Limited partners fund a $3,000,000 capital call for unit renovations.",
            [("DR", "Cash — operating", 3000000), ("CR", "Partners' capital — limited partners", 3000000)],
            "Financing inflow; no income effect.",
        ),
        (
            "Treasury stock repurchase (cost method)",
            "A company buys back 20,000 of its shares at $25.",
            [("DR", "Treasury stock", 500000), ("CR", "Cash — operating", 500000)],
            "Contra-equity; reissuance above cost credits APIC.",
        ),
    ],
    traps=[
        ("Can a gain on reissuing treasury stock go to income?", "Never — transactions in an entity's own shares go to equity (APIC)."),
        ("When is a dividend a liability?", "At declaration — not at record or payment date."),
        ("Stock dividend of 10% — fair value or par?", "Small stock dividend (<20–25%): capitalize retained earnings at fair value. Large ones are accounted for like a split (par value or memo only)."),
    ],
    lens="Capital calls, distributions and promote payments to GPs/LPs are equity transactions — never revenue or expense — in multifamily partnerships.",
    cites=["505-30-30-10", "505-20-25-2"],
)
