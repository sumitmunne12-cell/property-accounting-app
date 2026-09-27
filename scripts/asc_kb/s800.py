"""800s Broad Transactions."""

from . import C

C(
    "805",
    tag="Business combinations at fair value with goodwill — but most property purchases are asset acquisitions (no goodwill).",
    alias=["business combination", "acquisition", "purchase price allocation", "ppa", "goodwill", "asset acquisition", "screen test", "definition of a business", "bargain purchase", "measurement period", "joint venture formation", "in-place leases"],
    re="core",
    truth="When you buy a business, you're buying a working machine — people, processes and assets — so every identifiable asset and liability is recorded at fair value and the leftover premium is goodwill. But if substantially all of what you bought is one asset or a group of similar assets (like one apartment community), you bought assets, not a business: cost is allocated by relative fair value, transaction costs are capitalized, and no goodwill arises.",
    analogy=(
        "Buying a Food Truck vs. Buying the Food-Truck Company",
        "Buying a single parked food truck is buying an asset — you pay for the truck and its kitchen gear. Buying the whole company — trucks, staff, recipes, catering contracts and brand — is buying a business; the extra you pay for the brand and the team is goodwill.",
    ),
    recog=[
        "Apply the screen: if substantially all of the fair value of gross assets acquired is concentrated in a single identifiable asset or group of similar identifiable assets, it is not a business (805-10-55-5A). A building and its in-place leases are considered a single asset.",
        "Business combinations: identify the acquirer, the acquisition date, recognize identifiable assets and liabilities at fair value (805-20-25-1, 805-20-30-1), recognize goodwill or a bargain-purchase gain.",
        "Acquisition costs are expensed in a business combination but capitalized in an asset acquisition (805-50).",
        "Measurement period up to one year to finalize provisional amounts (adjustments recorded in the period determined).",
        "Joint venture formations (805-60, ASU 2023-05): the JV recognizes a new basis at fair value on formation.",
    ],
    meas=(
        "Fair value (business) / cost allocated by relative fair value (asset acquisition)",
        "Business: acquisition-date fair values; goodwill = consideration + NCI + previously held interest − net identifiable assets.",
        "Asset acquisition: total cost (including transaction costs) allocated to land, building, site improvements, in-place leases and above/below-market leases by relative fair value.",
    ),
    je=[
        (
            "Asset acquisition of a stabilized community (screen test met)",
            "Purchase price $50,000,000 plus $600,000 capitalized transaction costs. Relative-fair-value allocation: land $8.0M, building $38.5M, site improvements $2.3M, in-place leases $1.8M.",
            [
                ("DR", "Land", 8000000),
                ("DR", "Buildings", 38500000),
                ("DR", "Site improvements", 2300000),
                ("DR", "In-place lease intangibles", 1800000),
                ("CR", "Cash — acquisition funding", 50600000),
            ],
            "No goodwill; in-place leases amortize over remaining lease terms (short for residential).",
        ),
    ],
    traps=[
        ("Buying one apartment community with its staff contracts — business or asset?", "Almost always an asset acquisition: substantially all fair value is in a single asset (land, building and in-place leases are treated as one). No goodwill; transaction costs capitalized."),
        ("Are acquisition costs expensed?", "In a business combination yes; in an asset acquisition they're capitalized into the cost of the assets."),
        ("Can a measurement-period adjustment be recorded retrospectively?", "No — since ASU 2015-16 it's recognized in the period the adjustment is determined, with disclosure of prior-period effects."),
        ("Who is the acquirer in a VIE acquisition?", "Historically the primary beneficiary; ASU 2025-03 requires evaluating the accounting acquirer using the general 805 factors when the legal acquiree is a VIE that meets the definition of a business."),
    ],
    lens="Every property acquisition requires the screen test and a purchase-price allocation (land, building, site improvements, in-place and above/below-market leases) that drives future depreciation and amortization.",
    cites=["805-10-55-5A", "805-20-25-1", "805-20-30-1"],
)

C(
    "808",
    tag="Collaborative arrangements: two active partners sharing risks — not automatically customer revenue.",
    alias=["collaborative arrangements", "co-development", "cost sharing", "joint operating activity", "collaboration"],
    re=None,
    truth="Two companies that jointly develop and commercialize something — sharing costs, risks and rewards — are partners, not vendor and customer. Payments between them are presented based on their nature; only when the partner is actually a customer for a distinct good or service does ASC 606 revenue apply.",
    analogy=(
        "Two Neighbors Building a Shared Fence",
        "Two neighbors split the cost of a fence on their property line. When one reimburses the other for half the lumber, that's not a sale — nobody became a customer. They're co-owners of a project.",
    ),
    recog=[
        "In scope when participants are active in a joint operating activity and exposed to significant risks and rewards, not conducted through a separate legal entity (808-10-15-4).",
        "Transactions with a collaborator that is a customer for a distinct unit of account follow ASC 606 (ASU 2018-18).",
        "Other payments are classified by analogy to authoritative guidance or a reasonable, consistently applied policy; revenue from third parties is reported gross by the principal.",
    ],
    meas=(
        "Per the nature of each payment",
        "Measure reimbursements and shared costs as incurred.",
        "Present consistently; disclose nature, rights and obligations and amounts by line.",
    ),
    je=[
        (
            "Cost-sharing reimbursement from a collaborator",
            "Two companies co-develop a technology; the partner reimburses 50% of the $800,000 development costs incurred this quarter.",
            [("DR", "Receivable from collaborator", 400000), ("CR", "Research and development expense", 400000)],
            "Presented as a reduction of the shared cost (policy), not as revenue.",
        ),
    ],
    traps=[
        ("Are all collaborator payments revenue?", "No — only when the collaborator is a customer for a distinct good/service (606); other payments follow policy/analogy."),
        ("Is a JV conducted through an LLC a collaborative arrangement?", "Not the entity itself — arrangements conducted through a separate legal entity follow consolidation/equity-method guidance (though part of an arrangement can be in 808)."),
        ("What disclosures are needed?", "Nature and purpose, rights and obligations, accounting policy, and income-statement classification and amounts between participants."),
    ],
    cites=["808-10-15-4"],
)

C(
    "810",
    tag="Consolidation: control decides — voting interest model or VIE model (power + economics = primary beneficiary).",
    alias=["consolidation", "vie", "variable interest entity", "primary beneficiary", "voting interest", "kick-out rights", "noncontrolling interest", "nci", "intercompany elimination", "de facto agent", "limited partnership"],
    re="core",
    truth="If you control an entity, its assets are effectively yours to direct, so you show them all in your statements — and show the other owners' slice as noncontrolling interest. Control usually comes from votes, but when equity is thin or voting rights are disconnected from economics, the VIE model asks who has the power over the activities that matter most AND exposure to significant benefits or losses.",
    analogy=(
        "Who Really Drives the Car?",
        "Three friends co-own a car, but one friend holds the only key, chooses where it goes, and pays most of the insurance and repairs. On paper ownership is split; in substance, she controls the car and bears its risks. The VIE model looks for the person holding the key and the bills.",
    ),
    recog=[
        "Step 1: does a scope exception apply? Step 2: does the reporting entity hold a variable interest? Step 3: is the legal entity a VIE (insufficient equity at risk, equity holders lack power, disproportionate voting, etc.)?",
        "VIE: consolidate if you're the primary beneficiary — power to direct the activities that most significantly affect economic performance and the obligation to absorb losses or right to receive benefits that could be significant (810-10-25-38A).",
        "Voting interest entities: consolidate with a majority voting interest; limited partnerships are consolidated by the partner with substantive kick-out rights or participating rights control.",
        "Eliminate intercompany balances and transactions; present NCI in equity separately (810-10-45-16).",
        "Changes in ownership without loss of control are equity transactions; loss of control triggers deconsolidation with a gain or loss.",
    ],
    meas=(
        "Consolidate 100% of the subsidiary's carrying amounts; NCI at fair value on acquisition",
        "Initial: as per ASC 805 (business) or ASC 810 VIE initial measurement if not a business.",
        "Subsequent: allocate net income and OCI to parent and NCI; eliminate intercompany items.",
    ),
    je=[
        (
            "Allocate consolidated JV income to the noncontrolling interest",
            "A sponsor consolidates an 80%-owned property JV that earned $1,000,000.",
            [("DR", "Net income attributable to noncontrolling interest", 200000), ("CR", "Noncontrolling interest (equity)", 200000)],
            "NCI is presented in equity; attribution follows the operating agreement (HLBV if waterfalls apply).",
        ),
        (
            "Eliminate intercompany management fees",
            "The consolidated property pays $42,000 of management fees to the sponsor's consolidated management subsidiary.",
            [("DR", "Management fee revenue (intercompany)", 42000), ("CR", "Management fee expense (intercompany)", 42000)],
            "Consolidation elimination — both sides are inside the group.",
        ),
    ],
    traps=[
        ("A GP with 1% equity controls a real estate LP; LPs have no kick-out rights. Consolidate?", "The LP is a VIE (limited partners lack substantive kick-out or participating rights); the GP typically has power, and if its fees/promote are variable interests that could be significant, it is the primary beneficiary and consolidates."),
        ("Are fees paid to a decision maker always variable interests?", "No — fees that are commensurate, at market, and not accompanied by other significant interests are not variable interests (810-10-55-37)."),
        ("Is an increase from 60% to 80% ownership a gain or loss event?", "No — changes in ownership without loss of control are equity transactions (adjust APIC)."),
        ("What are related-party tiebreaker rules?", "When power is shared among a related-party group, the member most closely associated with the VIE consolidates."),
    ],
    lens="Sponsor/LP joint ventures, co-investment vehicles, tax-credit partnerships and single-asset LLCs require consolidation analysis; intercompany management and development fees are eliminated.",
    cites=["810-10-25-38A", "810-10-45-16"],
)

C(
    "815",
    tag="Derivatives at fair value; hedge accounting lets matched risks offset in the same period.",
    alias=["derivatives", "hedging", "hedge accounting", "interest rate swap", "interest rate cap", "rate cap", "cash flow hedge", "fair value hedge", "embedded derivative", "notional", "effectiveness", "sofr swap"],
    re="core",
    truth="A derivative is a bet on something else's price — interest rates, commodities, currencies — whose value can swing wildly with little upfront cash. Hiding it at cost would conceal huge risks, so every derivative is on the balance sheet at fair value. Hedge accounting is the reward for proving the derivative offsets a real risk: gains and losses are timed to hit earnings together with the hedged item, instead of creating artificial volatility.",
    analogy=(
        "Travel Insurance for Your Vacation Budget",
        "You book a trip abroad in six months and fear the euro will rise, so you lock in today's exchange rate with a contract. If the euro rises, the contract gains exactly what your trip got costlier. Hedge accounting shows both effects together — otherwise your 'insurance' would look like a random trading win or loss.",
    ),
    recog=[
        "A derivative has an underlying and notional (or payment provision), little or no initial net investment, and permits net settlement (815-10-15-83); recognize at fair value on the balance sheet.",
        "Changes in fair value go to earnings unless the derivative is designated in a qualifying hedge with contemporaneous documentation (815-20-25-3).",
        "Cash-flow hedges (e.g., swapping floating SOFR debt to fixed): the entire change in fair value of the hedging instrument included in effectiveness goes to OCI and is reclassified when the hedged transaction affects earnings.",
        "Fair-value hedges: both the derivative and the hedged item's change attributable to the hedged risk go through earnings.",
        "Embedded derivatives are bifurcated if not clearly and closely related to the host and the hybrid isn't at fair value (815-15).",
        "Normal purchases and normal sales scope exception for physical-delivery contracts.",
    ],
    meas=(
        "Fair value",
        "Initial: fair value (usually the premium paid for a cap, near zero for an at-market swap).",
        "Subsequent: fair value each reporting date (Level 2, including credit valuation adjustments).",
    ),
    je=[
        (
            "Buy an interest-rate cap required by the floating-rate lender",
            "A borrower pays a $250,000 premium for a 2-year SOFR cap at 4.50% on a $40M loan; not designated as a hedge.",
            [("DR", "Derivative asset — interest rate cap", 250000), ("CR", "Cash — operating", 250000)],
            "Undesignated: all fair-value changes go to earnings.",
        ),
        (
            "Quarter-end mark-to-market on the undesignated cap",
            "Rate expectations fall; the cap's fair value drops to $190,000.",
            [("DR", "Unrealized loss on interest rate cap", 60000), ("CR", "Derivative asset — interest rate cap", 60000)],
            "If designated as a cash-flow hedge, the change would go to OCI and the premium would be amortized into interest expense.",
        ),
    ],
    traps=[
        ("Can hedge documentation be completed at quarter-end?", "No — documentation must be contemporaneous with designation at inception; retroactive designation is prohibited."),
        ("Where does the ineffective portion of a cash-flow hedge go under current GAAP?", "ASU 2017-12 removed separate measurement of ineffectiveness: the entire change in the hedging instrument's fair value included in the effectiveness assessment goes to OCI and is reclassified with the hedged item."),
        ("Is a lender-required rate cap automatically a hedge?", "No. Hedge accounting is elective and requires designation, documentation and effectiveness; many owners leave caps undesignated and mark them through earnings."),
        ("Are environmental credits derivatives?", "Credits within the scope of ASC 818 are scoped out of 815 (815-10-15-82B, pending)."),
    ],
    lens="Floating-rate agency and bridge loans on multifamily assets typically require rate caps; swaps and caps create derivative assets/liabilities, OCI and interest-expense effects.",
    cites=["815-20-25-3"],
)

C(
    "818",
    tag="Environmental credits and obligations (new Topic): compliance credits at cost, obligations as emissions occur.",
    alias=["environmental credits", "carbon credits", "cap and trade", "emission allowances", "rec", "renewable energy certificates", "rins", "environmental credit obligations", "asu 2025"],
    re=None,
    truth="Carbon allowances and renewable-energy certificates became real money, but GAAP had no rule, so companies accounted for them inconsistently. The new Topic 818 (pending, effective for public entities in 2028) treats a credit you'll probably use to settle your own compliance obligation as a cost asset, other credits as assets tested for impairment (or at fair value by election), and your obligation as a liability that builds as you emit.",
    analogy=(
        "The Parking Permit Book",
        "A city requires a permit stamp for every hour you park downtown. You buy a book of stamps (credits) at cost. Every hour you park, you owe the city one stamp (an obligation). At year-end you hand in the stamps you used; any spare stamps you plan to sell are worth only what someone would pay for them.",
    ),
    recog=[
        "Recognize an environmental credit as an asset if it is probable it will be used to settle an obligation, transferred in an exchange, or used in a nonreciprocal transfer; otherwise expense (818-20-25-1).",
        "Classify assets as compliance credits (probable to settle an obligation) or noncompliance credits (818-20-25-2).",
        "Recognize an environmental credit obligation when events on or before the reporting date create the obligation (818-30-25-1).",
        "Pending content: effective for annual periods beginning after December 15, 2027 for PBEs (December 15, 2028 for others).",
    ],
    meas=(
        "Cost (compliance credits); cost less impairment or fair value (noncompliance); obligation at carrying amount of credits held plus fair value of the shortfall",
        "Internally generated or regulator-granted credits: transaction costs only (818-20-30-1); purchased credits at cost.",
        "Compliance credits are not remeasured or amortized; noncompliance credits are tested for impairment or measured at fair value by policy election.",
    ),
    je=[
        (
            "Purchase compliance allowances",
            "A utility buys emission allowances for $300,000 that it will use to settle this year's compliance obligation.",
            [("DR", "Compliance environmental credits", 300000), ("CR", "Cash — operating", 300000)],
            "Measured at cost; no amortization.",
        ),
        (
            "Recognize the obligation as emissions occur",
            "Emissions through the quarter create an obligation settled with credits carried at $280,000.",
            [("DR", "Environmental compliance expense", 280000), ("CR", "Environmental credit obligation", 280000)],
            "Measured using the carrying amount of credits held for settlement; any shortfall at fair value.",
        ),
    ],
    traps=[
        ("Are carbon credits intangible assets under 350?", "Once 818 is effective, in-scope credits follow 818, not 350 or 815."),
        ("Can noncompliance credits be measured at fair value?", "Yes, by class election if eligible (obtained in an exchange, non-grant nonreciprocal transfer or business combination) — 818-20-35-7/35-9."),
        ("Are grants of allowances from a regulator recorded at fair value?", "No — at transaction costs (often zero) under 818-20-30-1."),
    ],
    cites=["818-20-25-1", "818-30-25-1"],
)

C(
    "820",
    tag="Fair value = exit price to market participants; disclose the Level 1/2/3 hierarchy of inputs.",
    alias=["fair value", "exit price", "level 1", "level 2", "level 3", "fair value hierarchy", "valuation techniques", "market approach", "income approach", "cap rate", "nav practical expedient"],
    re="support",
    truth="Many Topics say 'measure at fair value' — ASC 820 defines what that means: the price you'd receive to sell an asset (or pay to transfer a liability) in an orderly transaction with market participants on the measurement date. It's the market's view, not the owner's hopes. The hierarchy tells readers how much judgment went in: Level 1 quoted prices, Level 2 observable inputs, Level 3 unobservable assumptions.",
    analogy=(
        "What a Stranger Would Pay for Your House",
        "Your house's fair value isn't what you paid, or what it means to you because your kids grew up there — it's what a willing stranger would pay today in a normal sale, not a fire sale. A house on a street with identical recent sales is Level 2; a one-of-a-kind castle valued with your own assumptions is Level 3.",
    ),
    recog=[
        "Fair value is an exit price in the principal (or most advantageous) market between market participants (820-10-35-9A).",
        "Consider the asset's characteristics and highest and best use for nonfinancial assets.",
        "Maximize observable inputs and minimize unobservable inputs; categorize the measurement by the lowest-level significant input (820-10-35-37).",
        "Net asset value (NAV) practical expedient for investments in certain funds.",
    ],
    meas=(
        "Exit price",
        "Initial: transaction price is often fair value, but not always (related parties, forced transactions).",
        "Recurring measurements each period; Level 3 rollforwards and significant unobservable inputs (e.g., cap rates, discount rates) disclosed.",
    ),
    je=[
        (
            "Real estate fund marks a property to fair value (investment-company accounting)",
            "An open-end fund's appraiser values a community at $64,500,000 using a 5.0% cap rate (Level 3); prior carrying value $62,000,000.",
            [("DR", "Investments in real estate, at fair value", 2500000), ("CR", "Net unrealized gain on investments", 2500000)],
            "Level 3: disclose the valuation technique and cap/discount rates.",
        ),
    ],
    traps=[
        ("Is fair value an entry price or exit price?", "Exit price — what you'd receive to sell, not what you'd pay to buy."),
        ("Which level is an appraisal using market cap rates?", "Typically Level 3 because significant unobservable inputs (property-specific NOI and cap rate judgments) are used."),
        ("Can a blockage discount be applied to a large Level 1 holding?", "No — Level 1 is quoted price × quantity; blockage factors are prohibited."),
        ("Is fair value of a liability affected by your own credit risk?", "Yes — nonperformance risk, including own credit risk, is reflected."),
    ],
    lens="Impairment measurements, purchase-price allocations, fund NAV reporting, derivative valuations and debt fair-value disclosures all apply ASC 820.",
    cites=["820-10-35-9A", "820-10-35-37"],
)

C(
    "825",
    tag="Financial instruments: fair value option, fair value disclosures, and credit-risk concentration disclosures.",
    alias=["financial instruments", "fair value option", "fvo", "fair value disclosure", "concentration of credit risk", "registration payment arrangements"],
    re="support",
    truth="Some mismatches arise because related assets and liabilities are measured differently. The fair value option lets an entity elect, instrument by instrument and irrevocably, to measure eligible financial items at fair value so economic hedges offset naturally. The Topic also forces transparency: disclose fair values and concentrations of credit risk.",
    analogy=(
        "Using the Same Ruler on Both Sides",
        "If you measure the left side of a table in inches and the right side in centimeters, the table looks crooked even when it's level. The fair value option lets you use the same ruler on both sides of an economic hedge.",
    ),
    recog=[
        "Fair value option may be elected at specified election dates, instrument by instrument, and is irrevocable (825-10-25-1, 25-2).",
        "Upfront costs and fees for FVO items are expensed as incurred (825-10-25-3).",
        "Changes in fair value from instrument-specific credit risk of FVO liabilities go to OCI.",
        "Registration payment arrangements (825-20) are recognized separately under ASC 450 when probable.",
    ],
    meas=(
        "Fair value (FVO) or disclosure of fair value",
        "FVO: fair value at election with changes in earnings (credit-risk component of liabilities in OCI).",
        "Disclose fair value of financial instruments not carried at fair value (PBEs), with hierarchy levels.",
    ),
    je=[
        (
            "FVO elected on a fixed-rate note payable — market rates rise",
            "Fair value of the note falls $150,000 because benchmark rates rose (no change in own credit).",
            [("DR", "Note payable — fair value adjustment", 150000), ("CR", "Gain on change in fair value of debt", 150000)],
            "Any portion from own credit risk would go to OCI instead.",
        ),
    ],
    traps=[
        ("Can the FVO be revoked later?", "No — the election is irrevocable for that instrument."),
        ("Are debt issuance costs deferred for FVO debt?", "No — expensed as incurred."),
        ("Do private companies disclose the fair value of their mortgages?", "Many non-PBEs are exempt from fair-value disclosures for instruments at amortized cost (ASU 2016-01), but PBEs disclose them."),
    ],
    lens="Public REITs disclose the fair value of mortgage debt; concentrations of cash above FDIC limits are disclosed as credit-risk concentrations.",
    cites=["825-10-25-1", "825-10-25-3"],
)

C(
    "830",
    tag="Foreign currency: remeasure transactions at spot (gains in earnings); translate foreign operations (CTA in OCI).",
    alias=["foreign currency", "fx", "translation", "remeasurement", "functional currency", "cta", "cumulative translation adjustment", "exchange rate", "hyperinflationary"],
    re=None,
    truth="Money owed in euros is a different asset than money owed in dollars, so as exchange rates move your euro payable really does cost more or less — that's a transaction gain or loss in earnings. But translating a whole foreign subsidiary's statements into dollars is just changing the measuring unit, not a real economic event for the parent, so those translation differences sit in OCI until the subsidiary is sold.",
    analogy=(
        "The Tourist's Two Wallets",
        "A US tourist in Paris owes a hotel €1,000 due at checkout; if the euro strengthens before checkout, she really pays more dollars (transaction loss). Converting her souvenir-shop business in France into dollars for a family report changes nothing about the shop — it's just a different ruler (translation).",
    ),
    recog=[
        "Determine each entity's functional currency (currency of its primary economic environment) using the 830-10-45 indicators.",
        "Foreign-currency transactions are recorded at the spot rate and monetary items remeasured at each reporting date — gains/losses in earnings (830-20).",
        "Translate foreign-operation statements: assets/liabilities at current rate, income/expense at average rates; differences to CTA in OCI (830-30).",
        "Release CTA to earnings upon sale or complete/substantially complete liquidation of the foreign entity.",
        "Highly inflationary economies (cumulative 3-year inflation ~100%): remeasure as if the reporting currency were functional.",
    ],
    meas=(
        "Spot rate (transactions), current/average rates (translation)",
        "Initial: spot rate at transaction date.",
        "Subsequent: monetary items at the reporting-date spot rate; nonmonetary items at historical rates.",
    ),
    je=[
        (
            "Pay a euro-denominated vendor invoice after the euro strengthened",
            "An invoice of €100,000 was recorded at 1.10 ($110,000); paid when the rate is 1.12 ($112,000).",
            [("DR", "Accounts payable", 110000), ("DR", "Foreign currency transaction loss", 2000), ("CR", "Cash — operating", 112000)],
            "Transaction loss recognized in earnings.",
        ),
    ],
    traps=[
        ("Where do translation adjustments go?", "OCI (CTA), not earnings — until the foreign entity is sold or substantially liquidated."),
        ("Remeasurement vs. translation?", "Remeasurement converts books kept in a non-functional currency into the functional currency (through earnings); translation converts functional currency into the reporting currency (through OCI)."),
        ("Are nonmonetary items (e.g., fixed assets) remeasured at current rates?", "No — at historical rates during remeasurement."),
    ],
    cites=["830-10-45-2"],
)

C(
    "832",
    tag="Government assistance: disclose grants today; ASU 2025-10 adds a recognition model for business-entity grants (pending).",
    alias=["government assistance", "government grants", "grants", "tax abatement", "forgivable loan", "ppp", "erc", "asu 2021-10", "asu 2025-10", "ias 20"],
    re="support",
    truth="Governments hand businesses cash, land and credits to encourage jobs, housing or clean energy. Grants aren't earned from customers and aren't owner contributions, so for years US GAAP had no recognition rule and companies borrowed from IFRS or not-for-profit guidance — Topic 832 required disclosure of what they received. The pending ASU 2025-10 model recognizes a grant only when it's probable the conditions will be met and the grant received, and matches it to the costs it compensates.",
    analogy=(
        "The City's Bike-Lane Bonus",
        "A city pays a café $10,000 to install a bike rack and keep it for five years. The café can't pocket that as 'sales'. It records the money as it keeps its promise — reducing the cost of the rack or recognizing the grant over the years the rack is maintained.",
    ),
    recog=[
        "Current disclosures (annual): nature of the transactions and accounting policy, line items affected and amounts, significant terms and conditions (832-10-50-1).",
        "Pending ASU 2025-10: do not recognize a grant until it is probable the entity will comply with the conditions and the grant will be received (832-10-25-1).",
        "Grants related to assets: deferred income approach or cost accumulation approach (reduce asset cost) (832-10-25-4).",
        "Grants related to income: recognize in earnings as the related costs are expensed (832-10-25-9).",
        "Forgivable loans are grants when forgiveness is probable (832-10-25-3). Tax credits under 740 and below-market loans are excluded.",
    ],
    meas=(
        "Amount received/receivable; nonmonetary grants at fair value (deferred income approach)",
        "Monetary grants at the amount received or receivable when recognition criteria are met.",
        "Recognize systematically over the periods the related costs are expensed; repayments applied first against unamortized deferred income.",
    ),
    je=[
        (
            "Asset-related grant — deferred income approach (pending ASU 2025-10)",
            "An owner receives a $1,000,000 state grant to install EV chargers and solar at a community; compliance is probable.",
            [("DR", "Cash — operating", 1000000), ("CR", "Deferred grant income", 1000000)],
            "Recognize in earnings over the useful life of the installed equipment (matching depreciation).",
        ),
        (
            "Annual recognition of the grant",
            "The equipment is depreciated over 10 years.",
            [("DR", "Deferred grant income", 100000), ("CR", "Grant income", 100000)],
            "Under the cost-accumulation alternative, the grant would reduce the asset's cost instead.",
        ),
    ],
    traps=[
        ("Are LIHTC tax credits government grants under 832?", "No. Income-tax credits are within ASC 740; LIHTC investments often use the proportional amortization method (323-740)."),
        ("Can a business recognize a grant when cash is received?", "Receipt alone isn't conclusive evidence that conditions will be met; recognition waits until compliance is probable (832-10-25-2, pending)."),
        ("Is a property-tax abatement a grant?", "Tax abatements reduce a tax liability; disclose under 832 as government assistance when accounted for by analogy to a grant model."),
    ],
    lens="Affordable-housing subsidies, property-tax abatements, energy-efficiency grants and forgivable municipal loans for workforce housing fall here.",
    cites=["832-10-50-1", "832-10-25-1", "832-10-25-4"],
)

C(
    "835",
    tag="Interest: capitalize it during construction, impute it on below-market notes, amortize debt costs by effective interest.",
    alias=["interest", "capitalized interest", "capitalization of interest", "imputed interest", "effective interest method", "debt issuance costs", "deferred financing costs", "avoidable interest", "construction interest"],
    re="core",
    truth="Interest is the price of money over time. While you build an asset, the money tied up in construction is part of what the asset truly cost — so interest is capitalized. When a note carries no or unrealistically low interest, part of its face amount is really interest, so it's imputed. And fees paid to borrow are just more interest, spread over the loan using the effective interest method.",
    analogy=(
        "The Renovation Loan on Your Kitchen",
        "If you borrow to remodel your kitchen, the interest you pay during the three months of construction is part of what the new kitchen cost — you couldn't use it yet. Once the kitchen is done, interest is just the ongoing cost of your loan.",
    ),
    recog=[
        "Capitalize interest on qualifying assets (constructed for own use, real estate developments) when expenditures have been made, activities are in progress and interest is being incurred (835-20-25-3).",
        "Capitalized amount = weighted-average accumulated expenditures × specific/weighted-average borrowing rate, limited to actual interest incurred.",
        "Stop capitalizing when the asset is substantially complete and ready for its intended use.",
        "Impute interest on notes exchanged for property/goods/services with no or unreasonable stated rates (835-30-25-2).",
        "Debt issuance costs are presented as a direct deduction from debt and amortized via the effective interest method (835-30-45-1A).",
    ],
    meas=(
        "Effective interest method",
        "Initial: capitalized interest added to asset cost; notes at present value.",
        "Subsequent: amortize discounts/premiums/issuance costs into interest expense; capitalized interest depreciated with the asset.",
    ),
    je=[
        (
            "Capitalize construction interest for the quarter",
            "Weighted-average accumulated expenditures on a ground-up development are $12,000,000; construction-loan rate 6%; actual interest incurred $210,000.",
            [("DR", "Construction in progress — capitalized interest", 180000), ("CR", "Interest expense", 180000)],
            "Interest was first accrued/paid to interest expense; $12M × 6% × 3/12 = $180,000 reclassified (capped at actual interest).",
        ),
        (
            "Amortize deferred financing costs",
            "Monthly effective-interest amortization of the loan's issuance costs.",
            [("DR", "Interest expense — amortization of deferred financing costs", 6000), ("CR", "Deferred financing costs (contra mortgage)", 6000)],
            "Presented within interest expense.",
        ),
    ],
    traps=[
        ("Can you capitalize interest on land held for future development with no activity?", "No — activities to prepare the asset must be in progress; land alone qualifies only while development activities are underway."),
        ("When does capitalization stop on a phased development?", "For each part when it is substantially complete and ready for use (e.g., each building as it is completed)."),
        ("Can capitalized interest exceed interest incurred?", "No — capped at total interest cost incurred in the period."),
        ("Are debt issuance costs an asset?", "Not for term debt — they're a contra-liability; revolving line-of-credit costs may be presented as an asset."),
    ],
    lens="Development and major renovation programs capitalize interest and carry costs; every mortgage carries deferred financing cost amortization.",
    cites=["835-20-25-3", "835-30-45-1A", "835-30-25-2"],
)

C(
    "840",
    legacy=True,
    tag="Legacy lease accounting (operating vs. capital leases) — superseded by ASC 842.",
    alias=["840", "old lease standard", "capital lease", "operating lease legacy", "fas 13", "bright line tests", "superseded leases"],
    re="support",
    truth="Under the old standard, a lease was either a capital lease (on the balance sheet) or an operating lease (just rent expense), decided by bright-line tests like 75% of economic life and 90% of fair value. Companies structured leases to land at 89% and keep billions off the balance sheet. ASC 842 replaced it so nearly all lessee leases are recognized — Topic 840 is now status-only.",
    analogy=(
        "The Hidden Credit Card",
        "Imagine a household that reports its mortgage but never mentions a 10-year car lease with fixed payments — the budget looks healthy until the payments come due. ASC 840 let operating leases be that hidden card; ASC 842 put it back in the wallet.",
    ),
    recog=[
        "Legacy capital-lease criteria (any one): ownership transfer, bargain purchase option, lease term ≥ 75% of economic life, PV of minimum payments ≥ 90% of fair value.",
        "Legacy operating leases: straight-line rent expense, no balance-sheet asset/liability.",
        "Superseded: all entities now apply ASC 842; the 840 codification contains status tables only.",
    ],
    meas=(
        "Legacy — see ASC 842",
        "Capital leases at the lower of PV of minimum lease payments or fair value.",
        "Operating leases straight-line; deferred rent for scheduled escalations.",
    ),
    je=[
        (
            "Legacy operating lease rent with a deferred-rent liability (historical)",
            "Under 840, a lessee with escalating office rent recorded straight-line expense of $10,000 while paying $9,000 in year 1.",
            [("DR", "Rent expense", 10000), ("CR", "Cash — operating", 9000), ("CR", "Deferred rent liability", 1000)],
            "Under ASC 842 the deferred rent balance is folded into the ROU asset at transition.",
        ),
    ],
    traps=[
        ("Is 'capital lease' still a GAAP term?", "No — ASC 842 uses 'finance lease' for lessees; lessors use sales-type/direct financing/operating."),
        ("What happened to deferred rent at 842 transition?", "It was reclassified into the ROU asset measurement (ROU = lease liability ± prepaid/accrued rent and unamortized incentives)."),
        ("Did lessor accounting change much from 840 to 842?", "Much less than lessee accounting; the biggest lessor changes were collectibility, initial direct costs and the definition of a lease."),
    ],
    lens="Historical property statements pre-2019/2022 reflect 840; conversion to 842 affected ground leases, equipment leases and the office leases of management companies.",
    cites=["840-10-00-1"],
)

C(
    "842",
    tag="Leases: lessees put a right-of-use asset and lease liability on the books; lessors recognize rent straight-line.",
    alias=["lease", "leases", "rou", "right-of-use", "right of use asset", "lease liability", "lessee", "lessor", "operating lease", "finance lease", "sales-type lease", "straight-line rent", "free rent", "concessions", "ibr", "incremental borrowing rate", "ground lease", "sale-leaseback", "collectibility", "variable lease payments", "cam", "asc 842"],
    re="core",
    truth="If you control the use of someone else's asset for a period and must pay for it, you've acquired a valuable right and taken on a debt — both belong on the balance sheet. The lessee books a right-of-use asset and a lease liability at the present value of the payments. The lessor, meanwhile, earns rent evenly over the lease term (straight-line) because the benefit it gives up — use of the apartment — is delivered evenly, regardless of free-rent months or escalations.",
    analogy=(
        "Leasing a Supercar for Three Years",
        "You lease a supercar for 36 months at $3,000 a month. Even though you don't own it, you've locked in the right to drive it for three years (an asset) and you've promised $108,000 of payments (a liability). The dealership, on the other hand, gave you the first month free as a signing bonus — but it still earns the same average rent every month, because it gives you the same car every month.",
    ),
    recog=[
        "A contract is or contains a lease if it conveys the right to control the use of an identified asset for a period of time in exchange for consideration (842-10-15-3).",
        "Lessee: at commencement, recognize a ROU asset and lease liability (842-20-25-1); short-term leases (≤12 months, no reasonably certain purchase option) may be expensed straight-line by policy (842-20-25-2).",
        "Classification (lessee finance / lessor sales-type) if any criterion is met: ownership transfer, purchase option reasonably certain, major part of economic life, PV ≥ substantially all of fair value, specialized asset (842-10-25-2).",
        "Lessor operating leases (every apartment lease): keep the building on the books, recognize lease payments as income straight-line over the lease term; variable payments in the period earned (842-30-25-11).",
        "Collectibility: if collection of lessor operating-lease payments is not probable, income is limited to cash received and receivables (including straight-line) are reversed (842-30-25-12, 35-3).",
        "Lessor practical expedient: by class of asset, do not separate nonlease components (e.g., utilities/services) when timing and pattern match and the lease component is operating (842-10-15-42A).",
        "Sale-leaseback: sale accounting only if the transfer meets 606 control criteria and no repurchase option precludes it (842-40-25-1).",
    ],
    meas=(
        "Present value of lease payments (lessee); straight-line lease income (lessor operating)",
        "Lessee liability = PV of unpaid lease payments at the rate implicit in the lease or the incremental borrowing rate (842-20-30-1, 30-3); ROU = liability + prepaid rent + initial direct costs − incentives received.",
        "Operating lease (lessee): single straight-line lease cost; liability accretes and ROU amortizes as a plug. Finance lease: interest + straight-line amortization. Remeasure on modifications and reassessment events.",
    ),
    je=[
        (
            "Lessor: 12-month apartment lease with one month free — month 1",
            "Rent $1,800/month, first month free. Total payments $19,800 ÷ 12 = $1,650 straight-line income each month.",
            [("DR", "Straight-line rent receivable", 1650), ("CR", "Rental income", 1650)],
            "No cash in month 1, but income is still earned evenly.",
        ),
        (
            "Lessor: months 2–12 — cash rent collected",
            "Resident pays $1,800.",
            [("DR", "Cash — operating", 1800), ("CR", "Rental income", 1650), ("CR", "Straight-line rent receivable", 150)],
            "Straight-line receivable unwinds to zero by lease end (11 × $150 = $1,650).",
        ),
        (
            "Lessor: collectibility no longer probable (skip)",
            "A resident skips owing $4,200; collection is no longer probable.",
            [("DR", "Rental income — collectibility adjustment", 4200), ("CR", "Rent receivable", 4200)],
            "Under 842, uncollectible operating-lease rent reduces lease income (not bad debt expense); future income is limited to cash received.",
        ),
        (
            "Lessee: commence a 5-year office lease (operating)",
            "Management company signs a 60-month office lease at $8,500/month in arrears; IBR 4.8% (0.4%/month). PV of payments = $452,600.",
            [("DR", "Operating lease right-of-use asset", 452600), ("CR", "Operating lease liability", 452600)],
            "No incentives or initial direct costs, so ROU = liability.",
        ),
        (
            "Lessee: month 1 operating-lease entry",
            "Interest accretion $1,810 (452,600 × 0.4%); straight-line lease cost $8,500; ROU amortization is the plug ($6,690).",
            [("DR", "Operating lease cost", 8500), ("DR", "Operating lease liability", 6690), ("CR", "Cash — operating", 8500), ("CR", "Operating lease right-of-use asset", 6690)],
            "Single straight-line cost in the income statement; operating cash outflow.",
        ),
    ],
    traps=[
        ("Is a resident apartment lease a sales-type lease for the owner?", "No — it's an operating lease: none of the classification criteria are met, so the building stays on the owner's books and rent is recognized straight-line."),
        ("Do you straight-line a 12-month residential lease with one free month?", "Yes. Concessions are part of lease payments and are recognized evenly over the lease term. Many owners argue immateriality for short residential leases — auditors will test that assertion."),
        ("Resident rent receivable goes 90 days past due. Bad debt expense?", "Under 842, if collectibility is not probable, reverse lease income for uncollected amounts (including straight-line) and recognize income on a cash basis. Some entities keep a portfolio-level 450 reserve — ensure the policy and presentation are consistent."),
        ("What discount rate does a lessee use?", "The rate implicit in the lease if readily determinable (rarely for lessees), otherwise the incremental borrowing rate; private companies may elect a risk-free rate by class of asset."),
        ("Are utility reimbursements (RUBS) lease income?", "If the lessor elects the nonlease-component practical expedient and criteria are met, they're combined with the lease and recognized as variable lease income; otherwise they're 606 revenue."),
        ("Can a sale-leaseback with a repurchase option be a sale?", "Generally not — a repurchase option precludes sale accounting unless it's at fair value and alternative assets are readily available (842-40-25-3); failed sale = financing."),
    ],
    lens="Every resident lease is an 842 lessor operating lease: rent, concessions and straight-line receivables, variable utility reimbursements, early-termination fees and collectibility reversals live here. Lessee accounting shows up in ground leases, office leases of management companies and equipment (laundry, copiers) leases.",
    cites=["842-10-15-3", "842-10-25-2", "842-20-25-1", "842-20-30-1", "842-30-25-11", "842-30-25-12", "842-10-15-42A"],
)

C(
    "845",
    tag="Nonmonetary exchanges at fair value — unless the swap lacks commercial substance.",
    alias=["nonmonetary transactions", "barter", "asset exchange", "commercial substance", "like-kind exchange", "nonreciprocal transfer", "1031"],
    re="support",
    truth="Swapping one asset for another is economically a sale and a purchase, so you normally recognize the gain or loss at fair value. But if the swap doesn't really change your future cash flows — no commercial substance — you haven't earned anything, and the new asset simply inherits the old one's carrying amount.",
    analogy=(
        "Trading Baseball Cards",
        "Trading your rare rookie card for a friend's vintage card of equal value is really selling one and buying another — you've realized whatever the rookie card gained. But swapping one ordinary 2024 card for an identical one with a different jersey number changes nothing; there's no gain to celebrate.",
    ),
    recog=[
        "Measure nonmonetary exchanges at fair value of the assets surrendered (or received if more evident) and recognize gain or loss (845-10-30-1).",
        "Use carrying amount (no gain) if fair value isn't determinable, the exchange lacks commercial substance (845-10-30-4), or it facilitates sales to customers.",
        "Boot (cash) of 25% or more makes the exchange monetary.",
        "Exchanges of nonfinancial assets with noncustomers generally fall under ASC 610-20 now; 845 covers what remains.",
    ],
    meas=(
        "Fair value (with commercial substance) or carrying amount",
        "Gain/loss = fair value surrendered − carrying amount surrendered.",
        "New asset recorded at fair value (or carryover basis).",
    ),
    je=[
        (
            "Exchange maintenance vehicles with commercial substance",
            "A property swaps an old truck (cost $60,000, accumulated depreciation $40,000, fair value $25,000) for a different model worth $25,000.",
            [("DR", "Vehicles — new truck", 25000), ("DR", "Accumulated depreciation — vehicles", 40000), ("CR", "Vehicles — old truck", 60000), ("CR", "Gain on exchange of assets", 5000)],
            "Commercial substance → fair value measurement and gain recognition.",
        ),
    ],
    traps=[
        ("Does an IRC §1031 like-kind exchange defer the GAAP gain?", "No. Tax deferral is separate; GAAP generally recognizes the gain on disposing of the relinquished property (610-20)."),
        ("What is commercial substance?", "The entity's future cash flows are expected to change significantly in risk, timing or amount as a result of the exchange."),
        ("When does boot make it monetary?", "When cash is 25% or more of the fair value of the exchange — then it's a monetary transaction in full."),
    ],
    lens="1031 exchanges of communities are tax-deferred but not GAAP-deferred — the book gain is recognized under 610-20.",
    cites=["845-10-30-1", "845-10-30-4"],
)

C(
    "848",
    legacy=True,
    tag="Reference rate reform (LIBOR → SOFR) relief — expired after 2024; paragraphs now superseded.",
    alias=["reference rate reform", "libor", "sofr", "libor transition", "optional expedients", "asu 2020-04", "asu 2022-06", "sunset"],
    re="support",
    truth="When LIBOR was retired, thousands of loans and swaps had to switch to SOFR. Without relief, each amendment could have been an extinguishment or broken a hedge — accounting chaos for a change nobody chose. Topic 848 let entities treat qualifying rate-replacement modifications as continuations and keep hedges alive. The relief sunset on December 31, 2024, and the Topic's paragraphs were superseded after the transition period ended.",
    analogy=(
        "Changing the Measuring Tape Mid-Game",
        "A league switches from yards to meters. Nobody wants every player's stats wiped and restarted just because the ruler changed. The league says: convert the stats, keep the season going. That's what Topic 848 did for LIBOR contracts.",
    ),
    recog=[
        "Optional expedients applied to contract modifications replacing LIBOR (or other retired rates) made through December 31, 2024.",
        "Qualifying debt modifications accounted for as a continuation of the existing contract (no 470-50 extinguishment analysis).",
        "Hedging relationships could continue despite changes in critical terms caused by reference rate reform.",
        "The Topic's content is superseded (status-only) — relevant today for understanding legacy modifications.",
    ],
    meas=(
        "Continuation of existing carrying amounts",
        "No remeasurement solely due to the rate change.",
        "Prospective effective-interest update using the new rate.",
    ),
    je=[
        (
            "Monthly interest accrual after LIBOR-to-SOFR amendment (no modification entry)",
            "A $24M floating-rate loan amended from LIBOR + 2.50% to SOFR + 2.61% (spread adjustment) accrues $120,000 of interest for the month.",
            [("DR", "Interest expense", 120000), ("CR", "Accrued interest payable", 120000)],
            "Under 848 the amendment was a continuation — no extinguishment gain/loss or fee remeasurement.",
        ),
    ],
    traps=[
        ("Can 848 relief be applied to a 2025 amendment?", "No — the relief sunset December 31, 2024 (ASU 2022-06)."),
        ("Did every modification qualify?", "Only changes related to replacing the reference rate (and related spread adjustments); concurrent unrelated changes required normal modification analysis."),
        ("Why does this still matter?", "Loan files and hedge documentation from 2020–2024 rely on 848 elections; auditors of legacy loans ask for the election memo."),
    ],
    lens="Most floating-rate multifamily loans and their caps/swaps transitioned from LIBOR to SOFR under 848 expedients.",
    cites=["848-10-65-1"],
)

C(
    "850",
    tag="Related parties: disclose transactions with insiders because they can't be presumed arm's-length.",
    alias=["related parties", "related party transactions", "affiliates", "management fees to affiliate", "arm's length", "common control", "insiders"],
    re="core",
    truth="When a company deals with its owners, managers or sister companies, the terms may not be what strangers would negotiate. Readers need to know those relationships and amounts to judge whether results were shaped by insiders. The rule is disclosure — the nature of the relationship, the transactions and balances — and never a claim of arm's-length terms unless you can prove it.",
    analogy=(
        "Buying a Car from Your Uncle",
        "If your uncle sells you his car for $1, the transaction is real, but no one would treat it as proof of the car's value. A lender reviewing your finances deserves to know the seller was family.",
    ),
    recog=[
        "Disclose material related-party transactions (other than ordinary compensation): nature of relationship, description, dollar amounts, amounts due to/from (850-10-50-1).",
        "Disclose control relationships even without transactions when the entity's operating results could differ.",
        "Do not imply arm's-length terms unless substantiated (850-10-50-5).",
        "Recognition and measurement follow other Topics.",
    ],
    meas=(
        "Disclosure (amounts measured under other Topics)",
        "Record at transaction amounts; consider whether substance differs from form (e.g., below-market loans).",
        "Update balances due to/from related parties each period.",
    ),
    je=[
        (
            "Monthly management fee to an affiliated property manager",
            "The property's manager is owned by the sponsor; fee is 3% of collections ($1,400,000).",
            [("DR", "Management fees — related party", 42000), ("CR", "Due to affiliate", 42000)],
            "Disclose the relationship, the fee terms and the balance due.",
        ),
    ],
    traps=[
        ("Is a management fee to the sponsor's own company a related-party transaction?", "Yes — disclose nature, terms and amounts, plus balances due, even if the rate is at market."),
        ("Can you state that related-party terms were arm's-length?", "Only if you can substantiate it (850-10-50-5)."),
        ("Are key management compensation arrangements disclosed under 850?", "Ordinary compensation, expense allowances and similar items in the ordinary course are excluded."),
    ],
    lens="Affiliated management, construction, insurance and leasing companies, sponsor loans and intercompany due-to/from balances are the core related-party disclosures for multifamily owners.",
    cites=["850-10-50-1", "850-10-50-5"],
)

C(
    "852",
    tag="Reorganizations: Chapter 11 reporting, fresh-start accounting and quasi-reorganizations.",
    alias=["reorganizations", "bankruptcy", "chapter 11", "fresh-start", "reorganization items", "quasi-reorganization", "liabilities subject to compromise"],
    re=None,
    truth="In bankruptcy, the business is being rebuilt under court supervision, and readers need to separate the cost of reorganizing from ongoing operations. When the company emerges with new owners and a new capital structure, it's effectively a new entity — fresh-start accounting resets assets and liabilities to fair value.",
    analogy=(
        "A House Renovation Under Court Supervision",
        "A homeowner overwhelmed with debt agrees with a judge on a repayment plan. While the plan is negotiated, lawyer fees are clearly separated from normal household bills. When the plan is confirmed and someone new effectively owns the house, it gets a fresh appraisal — a clean starting point.",
    ),
    recog=[
        "During Chapter 11: present liabilities subject to compromise separately; report reorganization items (professional fees, gains/losses from the process) separately from operations.",
        "Fresh-start reporting upon emergence if reorganization value is less than postpetition liabilities and allowed claims, and old shareholders receive less than 50% of the new voting shares (852-10-45-19).",
        "Quasi-reorganizations (852-20): readjust assets and eliminate a deficit through equity with owner approval.",
    ],
    meas=(
        "Fair value / reorganization value at emergence",
        "Allocate reorganization value to assets per ASC 805 principles; excess is goodwill (852-10-45-20).",
        "Liabilities subject to compromise at expected allowed claim amounts.",
    ),
    je=[
        (
            "Record Chapter 11 professional fees as reorganization items",
            "Legal and advisory fees incurred during the bankruptcy total $350,000.",
            [("DR", "Reorganization items — professional fees", 350000), ("CR", "Accrued liabilities", 350000)],
            "Presented separately from operating expenses.",
        ),
    ],
    traps=[
        ("When does fresh-start apply?", "Both conditions: reorganization value < postpetition liabilities and allowed claims, and holders of existing voting shares receive < 50% of the emerging entity's voting shares."),
        ("Are interest costs on prepetition debt accrued in Chapter 11?", "Only to the extent they will be paid or are probable of being an allowed claim; disclose contractual interest not accrued."),
        ("What are liabilities subject to compromise?", "Prepetition unsecured/undersecured obligations that may be impaired by the plan — shown separately at the expected allowed amount."),
    ],
    cites=["852-10-45-19", "852-10-45-20"],
)

C(
    "853",
    tag="Service concessions: operating public infrastructure for a government doesn't make it your PP&E.",
    alias=["service concession arrangements", "public private partnership", "p3", "toll road", "infrastructure concession"],
    re=None,
    truth="When a private operator runs a toll road or airport for a government that controls what services are provided, to whom and at what price — and keeps the residual interest — the operator doesn't own or control the infrastructure. It's providing construction and operating services to the government, so the infrastructure isn't the operator's PP&E, and it doesn't book it as a lease either.",
    analogy=(
        "Running the School Cafeteria",
        "A catering company runs a public school's cafeteria under a 10-year contract. The school decides the menu and prices and keeps the kitchen when the contract ends. The caterer never owned the kitchen — it's providing a service.",
    ),
    recog=[
        "In scope when a public-sector grantor controls the services, customers and pricing and controls any residual interest in the infrastructure (853-10-15-2, 15-3).",
        "The operator shall not recognize the infrastructure as its PP&E, and the arrangement isn't a lease (ASC 842 scope-out).",
        "Revenue for construction, upgrade and operation services follows ASC 606.",
    ],
    meas=(
        "Per ASC 606 transaction price",
        "Allocate consideration to construction and operation performance obligations.",
        "Recognize over time as services are provided.",
    ),
    je=[
        (
            "Construction services under a concession (over-time revenue)",
            "An operator earns $2,000,000 of construction-service revenue this quarter under a toll-road concession.",
            [("DR", "Contract asset", 2000000), ("CR", "Construction services revenue", 2000000)],
            "The road itself is not recorded as the operator's PP&E.",
        ),
    ],
    traps=[
        ("Does the operator depreciate the toll road?", "No — it's not the operator's PP&E; the operator recognizes revenue for services under 606."),
        ("Is the concession a lease of the infrastructure?", "No — service concessions in scope of 853 are excluded from ASC 842."),
        ("Who is the customer?", "ASU 2017-10 clarified the grantor (the government) is the customer of the operation services in all cases in scope."),
    ],
    cites=["853-10-15-2"],
)

C(
    "855",
    tag="Subsequent events: adjust for conditions that existed at year-end; disclose new ones that arose after.",
    alias=["subsequent events", "type 1", "type 2", "recognized subsequent events", "nonrecognized subsequent events", "available to be issued", "date of issuance"],
    re="core",
    truth="The balance sheet is a photo taken on one date, but the photo is developed weeks later. If something after year-end reveals what the scene really looked like on that date (a customer who was already insolvent), you fix the photo. If something new happens after the photo (a hurricane in February), you don't change the photo — you add a caption so readers aren't surprised.",
    analogy=(
        "The Wedding Photo Retouch",
        "You find out after the wedding that the photographer's lens had a smudge on the day — you retouch the photos (recognized event). A guest who spills wine at the after-party doesn't change the ceremony photos; you might mention it in the album notes (nonrecognized event).",
    ),
    recog=[
        "Recognize events that provide evidence about conditions existing at the balance-sheet date (855-10-25-1) — e.g., settlement of a lawsuit for an event before year-end, bankruptcy of a tenant whose deterioration existed at year-end.",
        "Do not recognize events arising after the balance-sheet date (855-10-25-3) — disclose if material (e.g., casualty loss, property acquisition, new debt).",
        "SEC filers evaluate through the issuance date; others through the date statements are available to be issued and disclose that date.",
    ],
    meas=(
        "Same measurement as the underlying Topic",
        "Adjust estimates using the new evidence.",
        "Nonrecognized events: disclose nature and estimate of financial effect (or say it can't be made).",
    ),
    je=[
        (
            "Recognized subsequent event: lawsuit settled after year-end",
            "A slip-and-fall that occurred in November is settled in January (before issuance) for $95,000; nothing had been accrued.",
            [("DR", "Litigation expense", 95000), ("CR", "Accrued litigation liability", 95000)],
            "Condition (the injury and exposure) existed at year-end → adjust the December statements.",
        ),
    ],
    traps=[
        ("A hurricane damages a property two weeks after year-end. Adjust?", "No — the condition arose after the balance-sheet date; disclose the nature and estimated effect."),
        ("Through what date do private companies evaluate subsequent events?", "Through the date the statements are available to be issued, and they disclose that date."),
        ("A major tenant files bankruptcy in February; it was 120 days delinquent at December 31. Adjust?", "Yes — the deterioration existed at year-end, so the collectibility conclusion at year-end is adjusted."),
    ],
    lens="Post-close lawsuit settlements, tenant bankruptcies, refinancings, acquisitions, dispositions and casualty events are assessed during the reporting-package review before statements are released to lenders and investors.",
    cites=["855-10-25-1", "855-10-25-3", "855-10-25-1A"],
)

C(
    "860",
    tag="Transfers of financial assets: a sale only if you surrender control; otherwise it's a secured borrowing.",
    alias=["transfers and servicing", "securitization", "factoring", "sale of receivables", "secured borrowing", "servicing asset", "repurchase agreement", "repo", "participating interest", "true sale"],
    re=None,
    truth="Selling receivables to raise cash is only a sale if you've truly let go — the assets are isolated from you (even in bankruptcy), the buyer can pledge or exchange them, and you have no effective control through repurchase rights. If you keep control, you've really borrowed against the receivables, and both the assets and a liability stay on your books.",
    analogy=(
        "Pawning vs. Selling Your Guitar",
        "Selling your guitar to a stranger means it's gone. Pawning it — getting cash now with the right and expectation to buy it back — means you still own it, you just borrowed against it.",
    ),
    recog=[
        "Sale accounting requires all conditions: legal isolation, transferee's right to pledge or exchange, and no effective control by the transferor (860-10-40-5).",
        "Transfers of portions must meet the participating-interest definition (860-10-40-4D, 40-4E).",
        "Failed sales are secured borrowings (860-30); repurchase agreements are usually secured borrowings.",
        "Servicing assets/liabilities are recognized when servicing is retained in a sale (860-50).",
    ],
    meas=(
        "Fair value of proceeds and retained interests",
        "Sale gain/loss = proceeds (cash + fair value of servicing and other assets) − carrying amount derecognized.",
        "Servicing assets: amortization or fair value measurement by class election.",
    ),
    je=[
        (
            "Sell receivables with servicing retained",
            "Receivables with carrying amount $1,000,000 are sold for $980,000 cash; servicing asset fair value $5,000.",
            [("DR", "Cash — operating", 980000), ("DR", "Servicing asset", 5000), ("DR", "Loss on sale of receivables", 15000), ("CR", "Receivables", 1000000)],
            "Sale accounting only because all 860-10-40-5 conditions are met.",
        ),
    ],
    traps=[
        ("Factoring with full recourse — sale or borrowing?", "Recourse alone doesn't preclude sale treatment, but legal isolation and control conditions must still be met; many recourse factoring arrangements fail and are secured borrowings."),
        ("Is a repo a sale?", "Generally no — repurchase-to-maturity transactions and repos are accounted for as secured borrowings."),
        ("Can you derecognize part of a loan?", "Only if the portion is a participating interest (proportionate, no subordination, pro-rata cash flows)."),
    ],
    cites=["860-10-40-5"],
)
