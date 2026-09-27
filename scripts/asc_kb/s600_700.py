"""600s Revenue and 700s Expenses."""

from . import C

# ── 600 Revenue ─────────────────────────────────────────────────────────────────────────────

C(
    "605",
    legacy=True,
    tag="Legacy revenue Topic — nearly all guidance superseded by ASC 606; remnants for provisions for losses and non-customer contracts.",
    alias=["revenue recognition legacy", "sab 104", "sop 97-2", "multiple element", "percentage of completion", "605", "superseded revenue"],
    re=None,
    truth="Before 2018, US revenue rules were a patchwork of industry-specific pieces — software, construction, real estate, each with its own rulebook. ASC 606 replaced them with one five-step model. Topic 605 survives mainly as history and for a few remnants (e.g., provisions for losses on certain contracts and guidance for arrangements that are not contracts with customers).",
    analogy=(
        "The Old City Map",
        "Your grandfather's city map shows streets that have since been renamed and rerouted. It's useful for understanding why a neighborhood looks the way it does, but you'd never navigate today with it. Topic 605 is that old map; ASC 606 is the GPS.",
    ),
    recog=[
        "Use ASC 606 for contracts with customers; 605 remnants apply only where explicitly retained (605-10-05-3).",
        "Legacy concepts still tested in interviews: SAB 104's four criteria (persuasive evidence, delivery, fixed/determinable fee, collectibility), VSOE for multiple elements, percentage-of-completion vs. completed-contract.",
        "Provision for losses on separately priced extended warranty and product maintenance contracts and certain construction/production contracts remain in 605 subtopics.",
    ],
    meas=(
        "Legacy — see ASC 606",
        "Transaction measurement now follows 606 (transaction price, allocation by standalone selling price).",
        "Loss provisions remain measured under the retained 605 guidance.",
    ),
    je=[
        (
            "Legacy percentage-of-completion (historical illustration)",
            "Under legacy 605-35, a contractor 40% complete on a $5,000,000 contract recognized $2,000,000 of revenue against $1,600,000 of cost.",
            [("DR", "Costs and estimated earnings in excess of billings", 2000000), ("CR", "Contract revenue", 2000000)],
            "Today the same economics are analyzed under ASC 606 (over-time recognition with an input or output method).",
        ),
    ],
    traps=[
        ("Is VSOE still required to separate software elements?", "No. ASC 606 allocates using standalone selling prices, which can be estimated — VSOE was eliminated."),
        ("Does 605 govern real estate sales today?", "No. Sales of real estate follow ASC 606 (customers) or ASC 610-20 (nonfinancial assets to noncustomers); legacy full-accrual/deposit methods are gone."),
        ("What legacy revenue criteria are still asked in interviews?", "SAB 104's four criteria — useful to contrast with 606's control-based five steps."),
    ],
    cites=["605-10-05-3"],
)

C(
    "606",
    tag="The five-step model: revenue when control of a promised good or service transfers, at the amount you expect to be entitled to.",
    alias=["revenue", "revenue recognition", "five step", "5 step", "performance obligation", "transaction price", "variable consideration", "principal agent", "contract asset", "contract liability", "ancillary income", "asc 606"],
    re="core",
    truth="Revenue is the reward for keeping a promise to a customer. So you first identify the promises (performance obligations), put a price on each, and recognize revenue as each promise is kept — at a point in time or over time as the customer gains control. Cash timing is irrelevant; variable amounts are included only to the extent a significant reversal is not probable.",
    analogy=(
        "The Gym Membership with a Personal-Training Bonus",
        "A gym sells a 12-month membership plus five personal-training sessions for $1,200. The gym has made two promises. It earns the membership piece a month at a time and each training session when it happens — not all $1,200 on the day your card is charged. If you get a refund for unused sessions, that's variable consideration the gym must estimate.",
    ),
    recog=[
        "Step 1 — identify the contract: approved, rights and payment terms identifiable, commercial substance, collection of substantially all consideration probable (606-10-25-1).",
        "Step 2 — identify distinct performance obligations. Step 3 — determine the transaction price (variable consideration constrained to amounts not probable of significant reversal). Step 4 — allocate by standalone selling price. Step 5 — recognize when (or as) control transfers.",
        "Over-time recognition if the customer simultaneously receives and consumes the benefits, controls the asset as it's created, or the asset has no alternative use with an enforceable right to payment (606-10-25-27).",
        "Scope excludes leases (ASC 842) — resident rent is not 606 revenue (606-10-15-2).",
        "Principal vs. agent: gross if you control the good/service before transfer; net fee/commission if you arrange for another party.",
    ],
    meas=(
        "Transaction price allocated to performance obligations",
        "Initial: expected consideration including constrained variable consideration, adjusted for significant financing components and noncash consideration.",
        "Subsequent: update variable consideration each period; contract modifications accounted for as separate contracts, prospectively or cumulative catch-up.",
    ),
    je=[
        (
            "Nonrefundable application/amenity fee (point in time)",
            "A community collects $45,000 of nonrefundable application fees in a month for processing screening services (not a lease component).",
            [("DR", "Cash — operating", 45000), ("CR", "Other property income — application fees", 45000)],
            "Screening service is delivered at application; confirm the fee is not a disguised lease payment (which would be straight-lined under 842).",
        ),
        (
            "Property management fee revenue (over time, variable)",
            "A management company earns 3% of collected revenue; September collections are $1,400,000.",
            [("DR", "Management fees receivable", 42000), ("CR", "Management fee revenue", 42000)],
            "Series of distinct daily services; variable fee allocated to the month it relates to.",
        ),
    ],
    traps=[
        ("Is apartment rent 606 revenue?", "No. Leases are excluded from 606 (606-10-15-2(a)); rent is lessor income under ASC 842. Non-lease services (e.g., separately contracted cleaning, some utilities) may be 606 unless combined under the lessor practical expedient."),
        ("When do you constrain variable consideration?", "Include only the amount for which it is probable that a significant reversal of cumulative revenue will not occur when the uncertainty resolves."),
        ("A management company passes through on-site payroll reimbursements. Gross or net?", "Depends on control: if the manager is the employer and controls the staff service, reimbursements are gross revenue (principal); if acting as agent, net."),
        ("Are contract assets and receivables the same?", "No. A receivable is an unconditional right (only time must pass); a contract asset is conditional on something other than time (e.g., further performance)."),
        ("Is selling a property to a buyer 606?", "Only if the buyer is a customer (sale in the ordinary course, e.g., a homebuilder). Otherwise ASC 610-20 applies, which borrows 606's control and measurement concepts."),
    ],
    lens="Property accountants apply 606 to non-lease income: application and admin fees, some utility reimbursements, laundry/vending commissions, cable/telecom revenue share, and management/leasing fees at the manager level.",
    cites=["606-10-05-4", "606-10-25-1", "606-10-25-27", "606-10-15-2"],
)

C(
    "610",
    tag="Other income: gains on selling nonfinancial assets (610-20) and involuntary conversions (610-30).",
    alias=["other income", "gain on sale", "sale of property", "610-20", "derecognition of nonfinancial assets", "involuntary conversion", "casualty gain", "insurance proceeds", "in substance nonfinancial"],
    re="core",
    truth="Selling a building you used to earn rent is not revenue from customers, but it should follow the same logic: derecognize when the buyer gets control, and measure the gain using the consideration you expect. And when fire or condemnation forces you to give up an asset, the insurer's or government's cash is a separate monetary transaction — the gain or loss is recognized even if you rebuild.",
    analogy=(
        "Selling Your Car vs. Totaling It",
        "Selling your car to a neighbor: once she drives off with the keys and title, the sale is done and your gain or loss is price minus book value. If your car is totaled and the insurer pays you, that's also a 'sale' of sorts — the car turned into cash, and any gain counts even if you immediately buy a new car.",
    ),
    recog=[
        "610-20: first evaluate control under ASC 810 (if you still control the entity holding the asset, don't derecognize); then derecognize when the counterparty obtains control and a contract exists (applying 606 contract and control criteria) (610-20-25-1 to 25-3).",
        "Partial sales: when control of a subsidiary is lost, recognize any retained noncontrolling interest at fair value.",
        "610-30: involuntary conversions of nonmonetary assets to monetary assets are monetary transactions — recognize gain or loss even if reinvested (610-30-25-3).",
        "Insurance proceeds above the recognized loss are gain contingencies recognized when realized.",
    ],
    meas=(
        "Consideration (606 transaction-price concepts) minus carrying amount",
        "Gain = consideration (including variable consideration constrained, noncash consideration at fair value) − carrying amount of assets derecognized.",
        "Subsequent: update variable consideration (e.g., earn-outs) with changes in gain.",
    ),
    je=[
        (
            "Sell an apartment community (not a business, buyer is not a customer)",
            "Sale price $42,000,000 less $840,000 selling costs; carrying amount: building $31,000,000, accumulated depreciation $9,500,000, land $6,000,000; the $24,000,000 mortgage is repaid from proceeds.",
            [
                ("DR", "Cash — operating", 17160000),
                ("DR", "Mortgage note payable", 24000000),
                ("DR", "Accumulated depreciation — buildings", 9500000),
                ("CR", "Buildings and improvements", 31000000),
                ("CR", "Land", 6000000),
                ("CR", "Gain on sale of real estate", 13660000),
            ],
            "Gain = 42,000,000 − 840,000 − (31,000,000 − 9,500,000 + 6,000,000) = 13,660,000. Present in continuing operations unless a strategic shift (ASC 205-20).",
        ),
        (
            "Insurance settlement after a fire (involuntary conversion)",
            "A fire destroyed a building wing with a carrying amount of $1,100,000 (already written off to a casualty loss). The insurer settles for $1,600,000.",
            [("DR", "Insurance receivable", 1600000), ("CR", "Casualty loss (recovery up to loss recognized)", 1100000), ("CR", "Gain on involuntary conversion", 500000)],
            "Gain is recognized when the settlement is realized, even though the wing will be rebuilt.",
        ),
    ],
    traps=[
        ("Is a property sale revenue?", "Only if the buyer is a customer (ordinary activities). Typical dispositions by owners are 610-20 gains."),
        ("Seller retains a 20% interest in the JV that buys the property. Gain?", "If control of the entity is lost, derecognize 100% and measure the retained interest at fair value — full gain (ASU 2017-05)."),
        ("Can you defer the insurance gain until the building is rebuilt?", "No. Involuntary conversions are monetary transactions — recognize gain when realized, even if reinvested (tax deferral under IRC §1033 is a separate matter)."),
        ("What's an 'in substance nonfinancial asset'?", "A financial asset (e.g., cash in a subsidiary) promised to a counterparty in a contract where substantially all the fair value is in nonfinancial assets — it follows 610-20."),
    ],
    lens="Dispositions of communities, land parcels and JV interests, plus fire and hurricane insurance settlements, are measured here.",
    cites=["610-20-25-1", "610-30-25-3"],
)

# ── 700 Expenses ────────────────────────────────────────────────────────────────────────────

C(
    "705",
    tag="Cost of sales and vendor consideration: rebates from suppliers usually reduce cost, not boost revenue.",
    alias=["cost of sales", "cogs", "vendor rebates", "vendor consideration", "volume rebates", "cost of services"],
    re=None,
    truth="Money a supplier gives back to you is usually a price reduction, not income, because you didn't do anything for the supplier — you just bought more. So vendor rebates and allowances reduce the cost of what you bought unless you provided a distinct service to the vendor at fair value.",
    analogy=(
        "The Coffee-Shop Punch Card",
        "When your tenth coffee is free, you didn't 'earn income' from the coffee shop — your coffee just got cheaper on average. Vendor rebates work the same way for a business.",
    ),
    recog=[
        "Consideration from a vendor is a reduction of the purchase price of the vendor's goods/services (705-20-25-1), unless it is payment for a distinct good or service the entity transfers to the vendor (then revenue/other income at up to fair value) or a reimbursement of specific incremental costs.",
        "Recognize rebates contingent on volume when it is probable the milestone will be achieved and the amount is estimable (systematic allocation).",
    ],
    meas=(
        "Reduction of cost",
        "Allocate rebates to purchases; reduce inventory or expense accordingly.",
        "Re-estimate probable rebates each period.",
    ),
    je=[
        (
            "Volume rebate from an appliance supplier",
            "A portfolio earns a $28,000 year-end volume rebate on appliances purchased for unit renovations (capitalized).",
            [("DR", "Rebate receivable — vendor", 28000), ("CR", "Buildings and improvements — appliances", 28000)],
            "Because the appliances were capitalized, the rebate reduces the asset's cost (and future depreciation), not income.",
        ),
    ],
    traps=[
        ("Is a supplier's marketing allowance revenue?", "Only if it pays for a distinct service provided to the vendor (at fair value); otherwise it reduces cost."),
        ("Can you recognize a volume rebate before the threshold is hit?", "Yes if probable and reasonably estimable — recognize systematically as purchases progress toward the milestone."),
        ("What if the rebate relates to capitalized purchases?", "It reduces the capitalized cost, not current-period income."),
    ],
    cites=["705-20-25-1"],
)

C(
    "710",
    tag="Compensation: accrue earned wages, bonuses and compensated absences (PTO) as employees work.",
    alias=["compensation", "payroll", "pto", "vacation accrual", "compensated absences", "bonus accrual", "deferred compensation", "sabbatical"],
    re="support",
    truth="Employees earn pay by working; the employer's cost exists when the work is done, not when payday arrives. Paid time off that employees have already earned and can carry forward or be paid for is a real obligation, so it is accrued as it's earned.",
    analogy=(
        "The Babysitter's Tab",
        "If the babysitter worked Friday and you pay her next Wednesday, you still owed her on Saturday morning. Unused vacation days she's earned are the same — an IOU that builds with every week she works.",
    ),
    recog=[
        "Accrue compensated absences when all conditions are met: the obligation relates to services already rendered, rights vest or accumulate, payment is probable and the amount estimable (710-10-25-1).",
        "Sick pay that accumulates but does not vest may be (but need not be) accrued.",
        "Deferred compensation contracts: accrue the present value of benefits over the service period to full eligibility.",
    ],
    meas=(
        "Amount expected to be paid",
        "Current pay rates (or expected rates) applied to earned hours, considering anticipated forfeitures.",
        "True up each period as PTO is used or forfeited.",
    ),
    je=[
        (
            "Month-end payroll and PTO accrual for on-site staff",
            "On-site employees earned $64,000 of wages for the last 9 days of the month (paid next month) and accrued $6,500 of vested PTO.",
            [("DR", "Payroll expense — on-site staff", 64000), ("DR", "PTO expense", 6500), ("CR", "Accrued payroll", 64000), ("CR", "Accrued compensated absences", 6500)],
            "Include employer payroll taxes on the accrual per policy.",
        ),
    ],
    traps=[
        ("Must non-vesting accumulating sick pay be accrued?", "Not required (710-10-25-7), though permitted."),
        ("Year-end bonus paid in March — whose expense?", "The year the service was rendered, if the obligation exists and is estimable (accrue at year-end)."),
        ("PTO policy says 'use it or lose it' at year-end. Accrue at December 31?", "Generally no carryforward liability beyond unused days that will be paid/used; accrue only the earned amount that vests or accumulates."),
    ],
    lens="Payroll allocations for leasing and maintenance staff, bonus accruals and PTO are part of the property's operating expense close.",
    cites=["710-10-25-1"],
)

C(
    "712",
    tag="Nonretirement postemployment benefits (severance, disability, continuation) — accrue when earned or when probable.",
    alias=["postemployment benefits", "severance plan", "disability benefits", "cobra", "special termination benefits"],
    re=None,
    truth="Benefits paid to former or inactive employees before retirement — severance under an ongoing plan, disability continuation, health-care continuation — are part of the cost of employing people. If they accumulate or vest with service, accrue them as earned; otherwise accrue when payment becomes probable and estimable.",
    analogy=(
        "The Company Safety Net",
        "A company promises two weeks of pay per year of service to anyone laid off. Every year an employee works, the promised cushion grows — the company is quietly building a debt to that future layoff.",
    ),
    recog=[
        "Benefits that vest or accumulate with service: accrue under ASC 710 conditions (712-10-25-4).",
        "Other postemployment benefits: accrue under ASC 450 when probable and reasonably estimable (712-10-25-5).",
        "Special termination benefits offered for a short period: recognize when employees accept and the amount is estimable (712-10-25-1).",
    ],
    meas=(
        "Expected payment (actuarial where relevant)",
        "Estimate using expected participants, amounts and discounting where appropriate.",
        "Re-estimate periodically.",
    ),
    je=[
        (
            "Accrue severance under an ongoing plan",
            "A reduction in force makes $210,000 of severance under the company's ongoing plan probable and estimable.",
            [("DR", "Severance expense", 210000), ("CR", "Accrued severance", 210000)],
            "Ongoing plans follow 712 (probable/estimable), not 420.",
        ),
    ],
    traps=[
        ("420 vs. 712 for severance?", "Ongoing benefit arrangements (written or substantive) → 712; one-time benefits → 420."),
        ("When is a voluntary early-exit incentive recognized?", "When employees accept the offer and the amount can be estimated (special termination benefits)."),
        ("Are COBRA subsidies postemployment benefits?", "Yes, continuation of health coverage for former employees is a postemployment benefit under 712."),
    ],
    cites=["712-10-25-1", "712-10-25-4"],
)

C(
    "715",
    tag="Retirement benefits: defined benefit plans book the funded status; defined contribution plans expense the contribution.",
    alias=["pension", "defined benefit", "opeb", "401k", "defined contribution", "funded status", "pbo", "multiemployer", "retirement benefits", "service cost"],
    re=None,
    truth="A defined-benefit promise is a debt that grows as employees work and is funded by assets that fluctuate. GAAP puts the net funded status (obligation minus plan assets) on the balance sheet and smooths the volatile remeasurements through OCI. A defined-contribution plan is simple: the employer's cost is the contribution it owes for the period.",
    analogy=(
        "The Grandparents' Promised College Fund",
        "Grandparents promise to pay whatever a grandchild's college costs in 15 years (defined benefit) and invest money now to cover it. If investments underperform, the shortfall is still theirs. A defined-contribution version is just 'we'll put $200 a month in the fund' — whatever it grows to is the grandchild's risk.",
    ),
    recog=[
        "Single-employer DB plans: recognize the funded status (PBO − fair value of plan assets) as an asset or liability (715-30-25-1).",
        "Net periodic pension cost components: service cost (in operating expense with other compensation), interest cost, expected return on assets, amortization of prior service cost and gains/losses (non-service components presented outside operating income).",
        "Actuarial gains/losses and prior service cost first go to OCI, then amortize (corridor approach or faster).",
        "Defined contribution plans (715-70): expense the contribution for the period; multiemployer plans (715-80): expense required contributions and disclose.",
    ],
    meas=(
        "Actuarial present value (PBO) vs. fair value of plan assets",
        "Discount benefits using high-quality corporate bond rates; plan assets at fair value.",
        "Remeasure at year-end (and on significant events); amortize AOCI amounts.",
    ),
    je=[
        (
            "Record 401(k) employer match for property staff",
            "The employer match for the month is $18,400, remitted to the plan trustee the next week.",
            [("DR", "Employee benefits expense — 401(k) match", 18400), ("CR", "Accrued retirement contributions", 18400)],
            "Defined contribution: the cost is the contribution for the period.",
        ),
    ],
    traps=[
        ("Where is service cost presented vs. other pension cost components?", "Service cost with other employee compensation; other components (interest, expected return, amortization) outside operating income (ASU 2017-07)."),
        ("Is the pension liability the ABO or PBO?", "PBO for pension plans (includes future salary increases); APBO for OPEB."),
        ("Does a multiemployer plan withdrawal liability get accrued?", "When withdrawal is probable and the amount estimable (ASC 450)."),
    ],
    cites=["715-30-25-4"],
)

C(
    "718",
    tag="Stock comp: measure equity awards at grant-date fair value and expense over the service period.",
    alias=["stock comp", "stock compensation", "share-based payment", "stock options", "rsu", "restricted stock", "black-scholes", "ltip units", "profits interest", "espp", "esop", "vesting"],
    re="support",
    truth="Paying employees with shares or options is still paying them — the company gives up something valuable instead of cash. So the fair value of the award at grant is compensation expense, recognized over the period employees must work to earn it. Whether the award later ends up 'in the money' doesn't change the grant-date cost for equity-classified awards.",
    analogy=(
        "Paying the Band in Concert Tickets",
        "A venue pays its band with 100 VIP tickets it could have sold for $200 each. The venue's cost is $20,000 — even though no cash left the building, and even if the tickets later resell for more or less.",
    ),
    recog=[
        "Measure equity-classified awards at grant-date fair value (718-10-30-3); recognize over the requisite service period (graded or straight-line).",
        "Performance conditions: recognize when achievement is probable; market conditions are reflected in grant-date fair value (718-10-30-14) and expense isn't reversed if not met.",
        "Forfeitures: policy election to estimate or account as they occur.",
        "Liability-classified awards (cash-settled, certain puttable) are remeasured each period (718-30).",
        "ASU 2024-01 profits interests: illustrations clarify when profits-interest awards (common in real estate sponsor and REIT LTIP structures) are in scope of 718.",
    ],
    meas=(
        "Grant-date fair value (equity); fair value each period (liability)",
        "Options: option-pricing model (Black-Scholes, lattice); RSUs: share price at grant (adjusted for dividends not received).",
        "Subsequent: equity awards not remeasured; modifications measured as incremental fair value.",
    ),
    je=[
        (
            "Quarterly expense for REIT RSUs",
            "A REIT grants 40,000 RSUs at $25 fair value, vesting over 4 years (cliff each year, straight-line policy): $1,000,000 total → $62,500 per quarter.",
            [("DR", "Compensation expense — share-based", 62500), ("CR", "Additional paid-in capital — share-based awards", 62500)],
            "Equity-classified: credit APIC; recognize deferred tax asset where applicable.",
        ),
    ],
    traps=[
        ("If options expire underwater, is the expense reversed?", "No — for service-vested awards, expense reflects grant-date fair value for awards that vest; only forfeitures (failure to vest) reverse expense."),
        ("Market condition not met — reverse the expense?", "No. Market conditions are baked into grant-date fair value; expense stays if the service is rendered."),
        ("Are LTIP units / profits interests stock comp?", "If they are equity-like interests granted for services, yes — ASU 2024-01's examples help determine whether they're share-based payments (718) or cash bonus/profit-sharing (710)."),
        ("Nonemployee awards?", "Since ASU 2018-07, nonemployee awards follow 718 too (measured at grant date)."),
    ],
    lens="REIT and sponsor LTIP units, restricted shares for property executives and profits interests in GP promote vehicles run through 718.",
    cites=["718-10-30-3", "718-10-30-14"],
)

C(
    "720",
    tag="Other expenses: start-up costs, insurance, property taxes, advertising — mostly expensed as incurred.",
    alias=["other expenses", "start-up costs", "organization costs", "property taxes", "real estate taxes", "insurance costs", "advertising", "contributions made", "lease-up costs"],
    re="core",
    truth="Many costs create no asset you can point to: opening a new operation, general advertising, charitable gifts. GAAP expenses them as incurred rather than letting companies capitalize hopes. Property taxes are expensed over the period they relate to (the fiscal period of the taxing authority), accrued monthly, because the tax is the price of owning the property during that time.",
    analogy=(
        "Opening Night Costs for a New Restaurant",
        "A restaurant's pre-opening staff training, soft-launch party and grand-opening flyers create excitement but no asset you could sell. They are costs of getting started — expensed when incurred, not stored on the balance sheet.",
    ),
    recog=[
        "Start-up and organization costs are expensed as incurred (720-15-25-1) — including lease-up marketing for a new community (but not construction costs capitalizable under 360/970).",
        "Advertising: expense as incurred or the first time the advertising takes place (720-35-25-1).",
        "Real and personal property taxes: accrue monthly over the fiscal period of the taxing authority for which the taxes are levied (720-30).",
        "Insurance costs: premiums amortized over the policy period; retroactive insurance and claims-made policies have specific rules (720-20).",
        "Contributions made: expense (at fair value) when made or unconditionally promised (720-25).",
    ],
    meas=(
        "Cost as incurred / systematic accrual",
        "Measure at amount paid or payable; property taxes at best estimate of the tax for the period.",
        "True-up estimates when bills or assessments arrive.",
    ),
    je=[
        (
            "Monthly property-tax accrual",
            "Estimated annual property tax for a community is $1,080,000, paid in arrears in January.",
            [("DR", "Real estate tax expense", 90000), ("CR", "Accrued real estate taxes", 90000)],
            "True up when the assessment/millage is certified; appeals refunds are gain contingencies until realized.",
        ),
        (
            "Lease-up marketing for a newly delivered building",
            "Grand-opening advertising and leasing-center events for a new development cost $65,000.",
            [("DR", "Marketing and advertising expense", 65000), ("CR", "Accounts payable", 65000)],
            "Start-up/advertising costs are expensed — not capitalized into the development.",
        ),
    ],
    traps=[
        ("Can property taxes during construction be capitalized?", "Yes — carrying costs such as property taxes during the development period are capitalized as project costs (ASC 970-340) until the project is substantially complete; after that they're expensed."),
        ("Is lease-up advertising for a new community capitalized?", "No — advertising and start-up costs are expensed as incurred (direct-response advertising capitalization was removed)."),
        ("When is a property-tax appeal refund recognized?", "When realized or when the appeal outcome is final — a gain contingency (450-30)."),
    ],
    lens="Real estate tax accruals, insurance prepaid amortization, marketing costs and pre-opening costs of new developments are recurring 720 items in the property close.",
    cites=["720-15-25-1", "720-35-25-1", "720-30-25-1"],
)

C(
    "730",
    tag="Research and development: expense as incurred — future benefits are too uncertain to capitalize.",
    alias=["r&d", "research and development", "development costs", "in-process r&d", "iprd"],
    re=None,
    truth="Research is a bet whose payoff is uncertain and hard to measure, so GAAP refuses to let companies capitalize the bet. R&D costs are expensed as incurred, with narrow exceptions (e.g., assets with alternative future uses; R&D acquired in a business combination is capitalized as IPR&D).",
    analogy=(
        "The Chef Testing New Recipes",
        "A chef who spends a month experimenting with new dishes can't claim the failed experiments as 'recipe assets'. The ingredients and time were a cost of trying — the reward only shows up if a dish hits the menu and sells.",
    ),
    recog=[
        "R&D costs are charged to expense when incurred (730-10-25-1).",
        "Equipment, facilities and purchased intangibles with alternative future uses are capitalized and depreciated; the depreciation is R&D expense.",
        "R&D arrangements funded by others (730-20): record a liability if repayment is required regardless of outcome.",
        "IPR&D acquired in an asset acquisition is expensed (if no alternative future use); in a business combination it is capitalized as an indefinite-lived intangible until completion.",
    ],
    meas=(
        "Expense as incurred",
        "Costs of materials, personnel, contract services, allocated indirect costs.",
        "None (expensed).",
    ),
    je=[
        (
            "Expense a prop-tech pilot study",
            "An owner pays a research firm $120,000 to test novel smart-building energy algorithms with uncertain outcomes.",
            [("DR", "Research and development expense", 120000), ("CR", "Accounts payable", 120000)],
            "No capitalization — outcome uncertain and no alternative future use.",
        ),
    ],
    traps=[
        ("Is IPR&D in an asset acquisition capitalized?", "No, expensed unless it has an alternative future use; in a business combination it is capitalized (indefinite-lived until complete)."),
        ("Are software development costs R&D?", "Software for sale follows 985-20 (capitalize after technological feasibility); internal-use software follows 350-40."),
        ("US GAAP vs IFRS on development costs?", "IFRS (IAS 38) capitalizes development costs once criteria are met; US GAAP generally expenses R&D."),
    ],
    cites=["730-10-25-1"],
)

C(
    "740",
    tag="Income taxes: current tax + deferred tax on temporary differences; uncertain positions need 'more likely than not'.",
    alias=["income taxes", "deferred tax", "dta", "dtl", "valuation allowance", "uncertain tax positions", "fin 48", "utp", "effective tax rate", "reit tax", "trs", "asu 2023-09", "rate reconciliation"],
    re="support",
    truth="Tax rules and accounting rules disagree about timing. If you've already recorded income that will be taxed later, you owe tax later — a deferred tax liability. If you've recorded expenses you'll deduct later, you'll save tax later — a deferred tax asset, but only if you'll have profits to use it. And tax positions that might not survive an audit can only be booked if they're more likely than not to be sustained.",
    analogy=(
        "The Restaurant Tip Jar and the Tax Man",
        "A waiter's credit-card tips land on the paycheck next month, but he earned them tonight. Tonight's 'income' comes with a tax bill that shows up later — a deferred tax liability. If he's promised a deduction he can only use when he has income next year, that future savings is real only if next year's income is likely.",
    ),
    recog=[
        "Current tax = taxes payable/refundable for the year; deferred tax = enacted rate × temporary differences plus carryforwards.",
        "Valuation allowance when it is more likely than not (>50%) that some or all of a DTA will not be realized.",
        "Uncertain tax positions: recognize only if more likely than not to be sustained on technical merits (740-10-25-6); measure as the largest amount >50% likely to be realized on settlement.",
        "ASU 2023-09: enhanced rate-reconciliation categories and income taxes paid disaggregated by jurisdiction (PBEs: annual periods beginning after Dec 15, 2024).",
        "REITs that distribute ≥90% of taxable income and partnerships generally have minimal federal tax; taxable REIT subsidiaries (TRS) and state entity-level taxes still fall under 740.",
    ],
    meas=(
        "Enacted tax rates on temporary differences (undiscounted)",
        "Deferred taxes measured using enacted rates expected to apply when differences reverse; not discounted.",
        "Remeasure for enacted rate changes in the period of enactment (through continuing operations).",
    ),
    je=[
        (
            "Deferred tax on accelerated tax depreciation in a TRS",
            "A taxable REIT subsidiary's tax depreciation exceeds book depreciation by $400,000 this year; blended enacted rate 25%.",
            [("DR", "Deferred income tax expense", 100000), ("CR", "Deferred tax liability", 100000)],
            "Reverses as book depreciation catches up.",
        ),
        (
            "Valuation allowance on a TRS net operating loss",
            "The TRS has a $600,000 DTA from NOLs; negative evidence (cumulative losses) indicates it is not more likely than not to be realized.",
            [("DR", "Deferred income tax expense", 600000), ("CR", "Valuation allowance — DTA", 600000)],
            "Cumulative losses in recent years are significant negative evidence that is hard to overcome.",
        ),
    ],
    traps=[
        ("Is a DTA discounted?", "No — deferred taxes are never discounted."),
        ("Two-step UTP model?", "Step 1 recognition: more likely than not to be sustained on technical merits, assuming examination with full knowledge. Step 2 measurement: largest amount >50% likely to be realized."),
        ("Does a REIT record income tax expense?", "Generally not at the federal level on distributed income, but state taxes (e.g., Texas margin tax) and TRS income taxes are recorded under 740."),
        ("When is the effect of a tax rate change recognized?", "In the period the law is enacted, in income from continuing operations (even if the underlying item was in OCI)."),
    ],
    lens="Multifamily partnerships and REITs are largely pass-through; the 740 work sits in TRSs (e.g., management or services businesses), state margin taxes and tax-exempt status disclosures.",
    cites=["740-10-25-6"],
)
