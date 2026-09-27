# Deduction Compass — the filing logic behind RealPage Financial Suite menus

**Goal:** given a task never seen before, name the application, the tab/section and the list, and be right most of the time.

**Source.** No `<menu_tree>` attachment came with the request, so everything below is derived from the catalog itself: the `navigation[]` of all 7,107 entries in `src/data/modules/*.js`. `scripts/rp_compass.py` normalizes the paths, holds every rule as data, and scores the rules against the real paths. `npm run build:modules` regenerates the numbers in `scripts/output/compass_report.json`, so the figures here can be re-checked.

**Tags.** **[Data]** means the menu tree shows it and the report measures it. **[Inferred]** comes from RealPage/multifamily practice and the tree does not confirm it.

**How rules are scored.** A rule reads a screen *title* only, never its path, and predicts application → tab/section → list. The prediction is then compared with the screen's real path. *Support* is the number of real-menu-path screens where the rule fired. *Precision* is the share of those it got right.

**A caveat on the Step 3 numbers.** The Step 1 and Step 2 rules are general. The Step 3 list table is a dictionary of RealPage list names built from this same tree, so its accuracy is measured in-sample.

## 0. What was measured and what was left out

| | Count | Note |
|---|---:|---|
| Catalog entries | 7,107 | |
| Excluded: manual topics, not screens | 533 | see below |
| Excluded: no application in the path | 6 | e.g. `Setup › Configuration`, `Accounting Tab › Edit`, `Accounts Payable, Accounts Receivable, or General Ledger › Setup` |
| Excluded: outside Financial Suite | 4 | `Property Management` (OneSite) paths |
| On **manual-chapter paths** (e.g. `Company › Using the Company Application › …`) | 1,863 | The builder fell back to chapter headings. Used for the application only. Rules score 50% here: chapters follow the manual's structure, not the menus |
| On **real menu paths** (`App › All/Setup › …`, including 432 whose tab/section is implied by sibling paths) | **4,701** | All tab, section and list scores use only these |

**Excluded topics (533) [Data]:**

| Category | Count | Examples |
|---|---:|---|
| Report column references | 173 | `Check Register Report Columns`, `Trial Balance Report Columns` |
| Overviews / introductions / "About…" | 158 | `Overview of the Accounts Payable Application`, `A/P Adjustments Overview`, `About Periods` |
| FAQ / troubleshooting / "Why…?" | 97 | `Why Is My Invoice Stuck in the Approval Workflow?`, `Troubleshooting Reconciliation`, `Step 1: Confirm the Beginning Balance` |
| Appendices / help / navigation | 40 | `Appendices`, `Help and Support`, `How to Read Paths`, `Common Tasks` |
| Examples / tips / best practices | 28 | `Best Practices for Preparing Data for Import`, `Examples of Chart Types` |
| Application home pages | 20 | `Accounts Payable Home Page`, `Financial Suite Home Page` |
| Browser how-tos | 11 | `Printing PDF Documents from Safari` |
| Workflow narratives | 6 | `Workflow: Closing Out an Accounting Year`, `Open and Close Process` |

**Label variants folded into one place [Data]:**

| Canonical application | Variants seen (paths) |
|---|---|
| Spend Management | `Spend Management` 263 · `Accounts Payable/Spend Management` 9 · `Spend management` 5 · `Configure (Spend Management)` 1 |
| Job Cost & Reserves | `Job Cost & Reserves` 250 · `Job Cost & Reserves or Replacement Reserves` 63 · `Replacement Reserves` 6 · `Job Cost` 3 |
| Accounts Receivable | `Accounts Receivable` 754 · `Receivable` 5 · `Configure (Accounts Receivable)` 4 · `Accounts receivable` 3 |
| Accounts Payable | `Accounts Payable` 1,301 · `Configure (Accounts Payable)` 4 · `Accounts payable` 1 |
| General Ledger | `General Ledger` 1,057 · `General ledger` 2 · `General Ledger Setup` 1 |
| Dashboards | `Dashboards` 78 · `Dashboards (menu)` 12 |
| Reports | `Reports` 744 · `(Reports` 7 · `Reports Center` (a Reports submenu) |
| Cash Management | `Cash Management` 446 · `(Cash Management) Configure` 1 |

`Configure (X)` is X's `Setup › Configuration` page. Prose prefixes such as "To see Journal entries, go to General Ledger" and trailing prose such as "…Configuration) and is called Turn off" are trimmed.

After normalization, menu paths split **All 3,523 / Setup 1,178**. The request quoted 3,426 / 1,000; those figures count raw labels before variants and implied tabs are folded in.

---

## 1. The blueprint (the "city grid")

### 1.1 How RealPage splits applications

**Applications are split by business object (the subledger that owns the record), not by user role. [Data]** Knowing only the noun in a screen title predicts the application for 81.4% of real menu paths. The noun rules fire on 81.3% of those paths. By application, the rules are right for:

- Financial Close Management 95%
- Job Cost & Reserves 92%
- General Ledger 91%
- Cash Management 89%
- Accounts Payable 85%
- Accounts Receivable 75%

The applications form three layers:

| Layer | Applications | What decides membership |
|---|---|---|
| **Object applications** (one per subledger or record family) | Accounts Payable, Accounts Receivable, Cash Management, General Ledger, Job Cost & Reserves, Spend Management, Fixed Assets, Financial Close Management, Forecasting & Planning, Investor Tracking, Taxes | The record: vendor/bill, customer/charge, bank account, account/journal, job/draw, PO/contract, asset, checklist/work paper, working budget, investor, VAT submission |
| **Platform layer** (shared by every application) | **Company** (1,146 paths), **Reports** (751) | Anything that exists once for the whole company: who, which entity, how records flow, how data gets in, how reports are built |
| **Channel / role applications** | Time & Resources (employee self-service: "My Timesheets", "My Information"), Reporting Portal and Investor Tracking (owners/investors), Finance Agent (AI), Dashboards, Platform Services (customization) | The audience or the tool, not the ledger |

**What Company is for [Data].** Its 794 real-menu screens are the tenant shell. It holds the services every application uses:

| Company submenu | Screens | Role |
|---|---:|---|
| `All › Approvals` (Approval Workbench, workflows, policy manager, configuration) | 136 (+12 `Approval Workbench`) | Routing engine for invoices, payments, POs, journal entries |
| `All › Import Data` (+ `Setup › Import data`) | 133 (+19) | Loading dock for every application: masters, open items, opening balances |
| `All › Configuration`, `All › Central Configuration` | 41, 31 | Company-wide and cross-entity defaults (tabs for AP, AR, Cash, Site View) |
| `All › Entities`, `Segments`, `Locations`, `Departments` | 27, 12, 4, 2 | The property/entity master and its dimensions |
| `Setup › Users/Roles`, `Users`, `Roles`, `Groups`, `Subscriptions` | 27, 23, 16, 10, 24 | Who can do what; which features are switched on |
| `All › Storage`, `Contacts`, `Multi-currency`, `Close Calendar`, `Ledger Sentry`, `Email Templates` | 18, 15, 15, 16, 11, 6 | Shared services: attachments, contact book, currencies, close scheduling, alerts |

**Rule of thumb:** if a thing is used by more than one application, or is about the company, a user or an entity rather than one transaction, it lives in Company.

### 1.2 Testing the lifecycle hypothesis

*Hypothesis:* every application follows Setup → daily entry → periodic processing/close → inquiry & reports.

**Verdict: revised. There are five stages, not four, and each has a fixed place in the menus. [Data]** The missing stage is **Find & fix**. Corrections are never made on the entry screen: you reopen the record from its list. Of the 4,701 real menu paths:

| Stage | Question to ask | Where it lives | Menu-path screens |
|---|---|---|---:|
| 1 **Configure** | Am I changing how future transactions default, validate or route? | `Setup` tab. Small code lists sit under `Setup › More` | 1,178 (209 under More) |
| 2 **Enter & pay** | Am I creating a high-volume transaction or moving money today? | `All › Daily Tasks` | 351 |
| 3 **Find & fix** | Am I opening, correcting, reversing or deleting a record that already exists? | `All › Search & Find` (the record list) | 552 |
| 4 **Process & close** | Am I running a batch, recurring or period-end process? | `All › Periodic Tasks`, with `Month End` nested inside | 602 |
| 5 **Review & report** | Am I reading results rather than changing them? | `All › Reports` (registers, aging, ledgers) | 369 |
| — | *(All-tab list reached without a section)* | `All › <list>` | 1,640 |

How the hypothesis had to change:

- **Master data has no "setup" step. [Data]** Vendors, jobs, bank accounts and journal entries are all created from their Search & Find lists:
  - `Adding Vendor (Supplier) Records` — `Accounts Payable › All › Search & Find › Vendors`
  - `Adding a Job` — `Job Cost & Reserves › All › Search & Find › Jobs`
  - `Adding a Bank Account` — `Cash Management › All › Search & Find › Bank Accounts`
  - `Adding a Journal Entry` — `General Ledger › All › Search & Find Journal Entry`
  - Only *codes* (types, terms, templates, rules) go under Setup.
- **Daily Tasks is narrow. [Data]** It holds the money-moving and intake shortcuts:
  - AP: `Pay A/P Invoices`, `Banking`, `Adjustments`, `Advances`, `AI-Invoice Queue`, `Approve Vendors`
  - AR: `Enter Payments`, `Receive a Payment`, `Manual Deposits`, `Intercompany Billing`
  - Others: `Contributions` (Investor Tracking), `PTO Request` (Time & Resources), `Job Status Inquiry` (Job Cost & Reserves)
- **Month End sits inside Periodic Tasks. [Data]** Examples: `Accounts Payable › All › Periodic Tasks › Month End › Subledger › Close Subledger` and `General Ledger › All › Periodic Tasks › Month End › Books › Close`.
- **Company, Reports, Platform Services, Finance Agent and Fixed Assets have no home-page sections, only All vs Setup. [Data]** Twelve applications use the sections: AP, AR, GL, Cash, Job Cost & Reserves, FCM, Spend, Forecasting & Planning, Time & Resources, Investor Tracking, Reporting Portal and Taxes.
- **Stage accuracy of the section rules on real paths [Data]:** Configure 87.5% · Enter 74.3% · Find & fix 81.4% · Process 82.6% · Review 73.8%.

### 1.3 Naming patterns

**Verbs.** *n* counts the 6,574 non-topic titles. Location shares are measured on menu paths. **[Data]**

| Verb in the title | *n* | Where it points | What it tells you |
|---|---:|---|---|
| Add / Create / Enter | 811 | All-tab list 35% · Setup 24% · Periodic 14% | **Nothing on its own**: every list has Add. Read the noun |
| View / Find | 536 | All-tab list 30% · Setup 22% · Search & Find 15% | Nothing on its own |
| Edit / Change / Update | 247 | Setup 30% · All 29% | Nothing on its own |
| Delete / Inactivate | 308 | All 30% · Setup 30% | Nothing on its own |
| Configure / Set up / Enable / Define | 356 | **Setup 51%**; Company 31% of these | Setup tab of the owning application |
| Customize / Run (a report) | 186 | **Reports 64%** | The application's Reports section |
| Import | 221 | **Company 56%** | Company › Import Data, unless the list has its own Import |
| Approve / Decline | 80 | **Company 64%** | Company › Approvals |
| Reverse / Unpost | 61 | **Search & Find 42%** (AR 40%, AP 23%) | Open the record from its list and reverse it |
| Void | 38 | **Reports 47%** (Check Register); AP 84% | Void from the register |
| Pay | 19 | **Daily Tasks 53%**; AP 89% | AP › Daily Tasks |
| Apply / Receive | 51 | **Daily Tasks 44%**; AR 49% | AR › Daily Tasks |
| Reconcile / Match | 39 | **Periodic Tasks 68%**; Cash 74% | Cash › Periodic Tasks › Reconciliation |
| Close / Open / Reopen | 67 | **Periodic Tasks 44%**; GL 22%, FCM 15% | Each subledger's Month End; the books in GL |
| Generate / Calculate | 99 | Periodic Tasks 30% · no-section All 54% (AP Fees) | A batch process |
| Schedule | 54 | Reports app 55% | Report scheduling (Reports Center) |

**The generic CRUD verbs (1,902 titles) carry no location information. Specific verbs do.**

**Nouns.** **[Data]**

| Noun | *n* | Main application | Main place |
|---|---:|---|---|
| Invoice(s) | 392 | AP 57% · AR 22% | Search & Find 31% |
| Payment(s) | 324 | AP 61% · AR 19% | Daily Tasks 33% · Search & Find 26% |
| Budget(s) | 251 | GL 48% · Forecasting & Planning 18% (also Job Cost) | Periodic Tasks 49% |
| Vendor(s) | 227 | AP 77% · Company 17% | Search & Find 37% |
| Check(s) | 161 | AP 73% · Cash 20% | Daily Tasks › Banking 29% |
| Job(s) | 146 | Job Cost & Reserves 81% (Finance Agent's "Agent Jobs" 7%) | Search & Find 31% |
| Customer(s) | 110 | AR 66% · Reports 14% (groups) | Setup 34% |
| Account group(s) | 105 | GL 93% | Search & Find 69% |
| Journal entry | 104 | GL 77% | Periodic Tasks (adjusting, recurring) 33% · Search & Find 31% |
| Reconciliation | 84 | Cash 86% | Periodic Tasks 81% |
| Journal (as a definition) | 74 | GL 95% | **Setup 74%**: "journal" alone = book definition; "journal entry" = transaction |
| Draw(s) | 71 | Job Cost & Reserves 100% | Search & Find › Draw Workbench / Setup › Draw Models |
| Deposit(s) | 53 | **AR 59%** · Reports 24% | Daily Tasks 50%. Deposits are AR, not Cash |
| Accrual(s) | 47 | GL 75% · Finance Agent 20% | Setup (templates) 41% · Periodic Tasks 27% |
| Bank account(s) | 44 | Cash 72% | Periodic Tasks 35% · Search & Find 30% |
| **Batch(es)** | **9** | — | RealPage corrects single transactions. There is no batch menu. **[Data]** Yardi-trained staff who look for batches will not find them **[Inferred]** |

---

## 2. The deduction method (the "compass")

Run it in your head in three steps. The app runs the same rules (`src/utils/compassEngine.js`).

### Step 1 — Which application? The noun decides.

Name the business object you are working with, then look it up in the families below. They are checked in order: the most specific object wins. Support and precision are measured on real menu paths. **[Data]**

| Rule | If the task's object is … | → Application | Support | Precision | Real paths |
|---|---|---|---:|---:|---|
| A1 | a job, draw, cost code, retainage register, PO/subcontract, asset/depreciation, checklist/work paper, working budget/payroll plan, investor, timesheet/PTO, VAT, AI agent, customization | that specialty application | 733 | 83.1% | `Job Cost & Reserves › All › Search & Find › Draw Workbench › Job Cost › Add`; `Fixed Assets › All › Post Depreciation`; `Spend Management › All › Workbench › Purchase Order › Add` |
| A2 | a bank account, reconciliation, bank feed, funds transfer, other receipt, credit/PC card, available cash, positive pay/ACH file, escheat, check layout | **Cash Management** | 326 | 84.4% | `Cash Management › All › Search & Find › Bank Accounts`; `… › Periodic Tasks › Reconciliation › Bank - New! › Continue`; `… › Periodic Tasks › Funds Transfer` |
| A3 | a customer/resident, A/R invoice or billing, customer payment/deposit, A/R adjustment/statement, sales tax/terms/territory | **Accounts Receivable** | 326 | 83.5% | `Accounts Receivable › All › Daily Tasks › Enter Payments › Receive a Payment`; `… › Daily Tasks › Enter Payments › Deposits`; `… › Reports › Registers & Reports › Sales Register` |
| A4 | a vendor/payee, A/P invoice/bill, check or vendor payment, expense report, bid/contract, 1099, A/P terms/types | **Accounts Payable** | 808 | 83.4% | `Accounts Payable › All › Search & Find › Vendors`; `… › All › A/P Invoices › Reverse`; `… › Daily Tasks › Banking › Checks › Schedule Check Run` |
| A5 | a journal entry, G/L account/account group, accrual/prepaid/allocation, budget, books/period, trial balance/analytics, journal definition | **General Ledger** | 757 | 77.8% | `General Ledger › All › Search & Find › Journal Entry › View Transactions › Reverse`; `… › Periodic Tasks › Accrual › Accrual Workbench`; `… › Periodic Tasks › Recurring Journal Entries › Delete` |
| A6 | a financial statement (Income Statement, Balance Sheet), report writer layout, report group/schedule, dimension group/structure | **Reports** | 247 | 81.0% | `Reports › All › Financial Reporting › Financial Reports › Financial Reports Library`; `Reports › Dimension Groups › Location`; `Reports › All › Reports Center › Scheduled › More Actions › Delete` |
| A7 | no business object: an approval, import, user/role, entity/location, company setting | **Company** | 625 | 79.0% | `Company › All › Approvals › Approval Workbench`; `Company › All › Import Data › Set Up AP Master List, Open Invoices and Adjustments › Accounts Payable Invoices › Template/Import`; `Company › Setup › Users` |

**Tie-breakers, applied before A1–A7 when their trigger words appear. [Data]**

| ID | Rule | Support | Precision | Real paths |
|---|---|---:|---:|---|
| T1 | When several objects appear, the first family in the order above wins: a job beats an invoice, an invoice beats an account, any object beats a platform service | 645 | 70.1% | `Creating an A/P Invoice for a Subcontract` → `Job Cost & Reserves › All › Search & Find › Subcontracts` |
| T2 | Approving or declining a **transaction** (invoice, payment, PO, JE) → Company › Approvals. Approving a **record** (vendor record, bank rec, work paper, expense report, PTO) stays in its own application | 118 | 89.0% | `Company › All › Approvals › Approval Workbench`; `Accounts Payable › All › Daily Tasks › Approve Vendors`; `Cash Management › All › Periodic Tasks › Reconciliation › Approve Reconciliations` |
| T3 | Bulk loads (templates, master lists, open items, opening balances) → Company › Import Data. An Import button on one working list (budget, bank file, funds transfer, payments, expenses) stays on that list | 182 | 77.5% | `Company › All › Import Data › …Accounts Payable Invoices › Template/Import`; `Cash Management › All › Funds Transfer › Import`; `General Ledger › All › Budgets` (`Importing a Budget`) |
| T4 | **Money direction.** Money out to anyone (vendor, resident refund) → AP payment. Money in against a customer charge → AR. Money in with no charge → Cash › Other Receipts | 7 | 71.4% | `Accounts Payable › All › Pay AP Invoices › RealPage Virtual Refunds`; `Cash Management › All › Periodic Tasks › Other Receipts`; `Accounts Receivable › All › Daily Tasks › Enter Payments › Receive a Payment` |
| T5 | Customer/location/vendor groups and dimension structures → Reports › Setup | 56 | 73.2% | `Reports › Dimension Groups › Location`; `Reports › Setup › Dimension Groups › Customer` |
| T6 | A report named after a balance-sheet account → Financial Close Management › Reports | 61 | 78.7% | `Financial Close Management › All › Reports › Prepaid Expenses`; `… › Reports › Notes Payable` |
| T7 | "Create X **from** Y" → Y's list | 8 | 100% | `Accounts Payable › All › Periodic Tasks › Bids and Contracts › Contracts › Create` (PO from a contract); `Accounts Payable › All › A/P Invoices › Edit` (intercompany bill from an A/P invoice) |
| T8 | Moving money between your own accounts → Cash › Funds Transfer, even to a reserve account | 9 | 100% | `Cash Management › All › Periodic Tasks › Funds Transfer`; `… › Periodic Tasks › Bulk Funds Transfer` |
| T9 | A period-end verb (accrue, amortize, allocate) beats the document it is about → GL › Periodic Tasks | 25 | 88.0% | `General Ledger › All › Periodic Tasks › Accrual › Accrual Workbench`; `General Ledger › All › Prepaids` |

**The two tie-break cases in the brief:**

- **Retainage invoice on a construction job: AP or Job Cost & Reserves?**
  - Start in **Job Cost & Reserves**. The invoice is created from the commitment: `Job Cost & Reserves › All › Search & Find › Subcontracts › Creating an A/P Invoice for a Subcontract`, or from the PO in `Spend Management › All › Workbench`. **[Data]**
  - It posts as an ordinary A/P invoice. **[Inferred]**
  - Retainage is tracked in `Job Cost & Reserves › All › Reports › Retainage Register`. **[Data]**
- **Resident deposit refund: AR or AP?**
  - Clear the credit in **AR**: `Accounts Receivable › All › Receive a Payment › Refunding a Customer`. **[Data]**
  - Pay it through **AP**: `Accounts Payable › All › Pay AP Invoices › RealPage Virtual Refunds`, or a check. **[Data]**
  - Deposit interest and state rules decide the amount. **[Inferred]**

### Step 2 — Which tab or section? The verb and the kind of object decide.

| Rule | If … | → Location | Section precision | Real paths |
|---|---|---|---:|---|
| S1 Configure | the verb is configure/enable/define, **or** the object is a code (type, term, template, rule, label, class, category) | `Setup` (small code lists: `Setup › More`) | 87.5% | `Accounts Payable › Setup › Types`; `General Ledger › Setup › Accrual Template › Add`; `Cash Management › Setup › More › Positive Pay Configuration` |
| S2 Enter & pay | you create a high-volume transaction or move money (pay, receive, deposit, create an invoice or PO) | `All › Daily Tasks` | 74.3% | `Accounts Payable › All › Daily Tasks › Pay A/P Invoices`; `Accounts Receivable › All › Daily Tasks › Enter Payments`; `Spend Management › All › Daily Tasks › Create a Purchase Order` |
| S3 Find & fix | the record already exists, or it is master data (view, edit, reverse, delete, add a vendor/job/account) | `All › Search & Find › <record list>` | 81.4% | `Accounts Payable › All › Search & Find › Vendors`; `General Ledger › All › Search & Find › Journal Entry › View Transactions › Reverse`; `Cash Management › All › Search & Find › Bank Accounts` |
| S4 Process & close | recurring, month-end, reconcile, accrue, allocate, depreciate, close/open, expense reports, contracts | `All › Periodic Tasks` (Month End inside) | 82.6% | `Cash Management › All › Periodic Tasks › Reconciliation`; `Accounts Payable › All › Periodic Tasks › Month End › Subledger › Close Subledger`; `General Ledger › All › Periodic Tasks › Recurring Journal Entries` |
| S5 Review | report, register, aging, ledger, analysis, "customize and run" | `All › Reports` | 73.8% | `Accounts Payable › All › Reports › Check Register`; `Accounts Receivable › All › Reports › Registers & Reports › Sales Register`; `Job Cost & Reserves › All › Reports › Retainage Register` |

Company, Reports, Platform Services, Finance Agent and Fixed Assets only split **All vs Setup**. For them, the configure test alone decides the tab. Given the right application, the tab is right **93.1%** of the time. **[Data]**

### Step 3 — Which list or screen? The noun names the list; the state names the action.

1. **The list is named after the object, usually in the plural. [Data]** `Vendors`, `A/P Invoices`, `Payments`, `Journal Entry`, `Bank Accounts`, `Jobs`, `Draw Workbench`, `Budgets`, `Accrual`, `Prepaids`, `Reconciliation`, `Funds Transfer`, `Other Receipts`.
   - Creation shortcuts are named for the action: `Create an A/P Invoice`, `Pay A/P Invoices`, `Enter Payments`, `Create a Purchase Order`.
   - Process lists are named for the process: `Recurring AP Invoices`, `Expense Reports`, `Bids and Contracts`, `Account Maintenance`, `Close Job`, `Lien Releases`.
   - Report groups are named `<object> Reports` or `… & Registers`.
   - The list is right **74.7%** of the time given the right application. The full noun → list table lives in `OBJECTS[].lists` in `rp_compass.py` (in-sample; see the caveat at the top).
2. **The record's state picks the action on that list:**

| State in the scenario | Where to go | Real paths |
|---|---|---|
| Draft / unposted | The object's Search & Find list, filtered by status; edit in place | `Accounts Payable › All › A/P Invoices › Create Future Draft Invoice` **[Data]** |
| Pending approval / stuck / declined | `Company › All › Approvals › Approval Workbench` | `Company › All › Approvals › Approval Workbench › Viewing the Approval Workbench`; `… › Sending a Transaction Back to the Previous Approver` **[Data]** |
| Posted, period open | Reverse (or edit) from the record list | `Accounts Payable › All › A/P Invoices › Reverse`; `General Ledger › All › Search & Find › Journal Entry › View Transactions › Reverse`; `Accounts Receivable › All › Daily Tasks › Enter Payments` (`Reversing a Payment in a Deposit`) **[Data]** |
| Paid (check issued) | Void the payment from the register; voiding reopens the invoice | `Accounts Payable › All › Reports › Check Register › Bank › View › Void`; `Accounts Payable › All › A/P Invoices › Edit › Match Order › Voiding and Reversing a Paid A/P Invoice Simultaneously` **[Data]** |
| Posted in a **closed** period | Reverse into the current open period. Otherwise reopen the books in GL; FCM's Console exposes the same switch | `General Ledger › All › Periodic Tasks › Month End › Books › Close`; `General Ledger › All › Books › Open`; `Financial Close Management › All › Console › Books › Open` **[Data]**. That a controller-only permission gates reopening is **[Inferred]** |

### 15 worked examples

★ = hard (a correction to a posted or paid item, a cross-application flow, or period close). "Compass" is what the engine returns for the task text exactly as written.

| # | Task | Step 1 → application (why) | Step 2 → tab/section (why) | Step 3 → list (why) | Real path in the tree | Compass |
|---|---|---|---|---|---|---|
| 1 ★ | Void a vendor check and restore the invoice | AP: a check is money out (A4) | Normally Find & fix, but a paid item is voided where payments are listed | Check Register → Void. Voiding reopens the invoice | `Accounts Payable › All › Reports › Check Register › Bank › View › Void` (`Voiding Payments from the Check Register`) | ✓ exact |
| 2 ★ | Site entered the wrong invoice date and the batch is already posted | AP: A/P invoice (A4). There is no "batch" in RealPage | Find & fix (S3): it is posted | A/P Invoices → **Reverse** and re-enter; in a closed period, reverse into the open one | `Accounts Payable › All › A/P Invoices › Reverse` (`Reversing A/P Invoices`); topic `What to Do When Your Invoice Has an Incorrect Date or Amount` | ✓ list; state = posted |
| 3 ★ | Refund a resident security deposit after move-out | AR *and* AP: T4 money direction; exception E18 | AR: Daily Tasks › Receive a Payment. AP: payment run | Refunding a Customer → virtual refund or check | `Accounts Receivable › All › Receive a Payment › Refunding a Customer`; `Accounts Payable › All › Pay AP Invoices › RealPage Virtual Refunds` | AP leg ✓, AR offered as "Also consider", E18 shown |
| 4 ★ | Retainage invoice on a construction job | Job Cost & Reserves: the job is the most specific object (T1); E20 | Find & fix: Search & Find | Subcontracts → Create A/P invoice. Track retainage in the Retainage Register | `Job Cost & Reserves › All › Search & Find › Subcontracts › Creating an A/P Invoice for a Subcontract`; `Job Cost & Reserves › All › Reports › Retainage Register` | app + section ✓; list = Jobs (partial) |
| 5 ★ | Reverse a journal entry posted in a closed period | GL: journal entry (A5). "Closed period" is a state, not the object | Find & fix | Journal Entry › View Transactions › Reverse, dated in the open period; else reopen books | `General Ledger › All › Search & Find › Journal Entry › View Transactions › Reverse`; `General Ledger › All › Periodic Tasks › Month End › Books` | ✓ exact; state = closed period |
| 6 ★ | Close the A/P subledger for the month | AP (A4) | Process & close (S4) → Periodic Tasks › Month End | Subledger › Close Subledger | `Accounts Payable › All › Periodic Tasks › Month End › Subledger › Close Subledger` | ✓ exact |
| 7 | Reconcile the operating bank account | Cash (A2) | Process (S4) | Reconciliation → Bank → Continue | `Cash Management › All › Periodic Tasks › Reconciliation › Bank - New! › Continue` (`Reconcile Bank Account Page`) | ✓ exact |
| 8 | Move cash from operating to the reserve account | Cash: own-account transfer (T8) beats "reserve" (Job Cost) | Process | Funds Transfer | `Cash Management › All › Periodic Tasks › Funds Transfer` (`Adding a Funds Transfer`) | ✓ exact |
| 9 ★ | Invoice is stuck in approval | Company: a transaction approval (T2); exception E01 | All tab (Company has no sections) | Approvals › Approval Workbench | `Company › All › Approvals › Approval Workbench` | ✓ exact; state = pending approval |
| 10 | Load open A/P invoices for an acquired property | Company: a bulk load (T3; "load" → import); E02 | All | Import Data › AP master list, open invoices › Template/Import | `Company › All › Import Data › Set Up AP Master List, Open Invoices and Adjustments › Accounts Payable Invoices › Template/Import` | ✓ exact |
| 11 | Post monthly depreciation | Fixed Assets (A1) | Process | Post Depreciation | `Fixed Assets › All › Post Depreciation › All Locations / Select Locations` | ✓ exact |
| 12 ★ | Accrue the utility bill we have not received | GL: the accrual verb beats "bill" (T9) | Setup for the template, then Process | Accrual Template (Invoices Not Received), then Accrual Workbench | `General Ledger › Setup › Accrual Template › Add › Invoices Not Received`; `General Ledger › All › Periodic Tasks › Accrual › Accrual Workbench` | ✓ Accrual (process leg) |
| 13 | Create location groups for a regional roll-up | Reports: groups are reporting setup (T5); E13 | Setup | Dimension Groups › Location | `Reports › Dimension Groups › Location` (`Adding a Location Group`); `Reports › Setup › Dimension groups › Location` | ✓ exact |
| 14 | Enter a resident payment and deposit it | AR: a customer payment (A3). The deposit is AR too | Enter & pay (S2) | Enter Payments → Receive a Payment; Deposits | `Accounts Receivable › All › Daily Tasks › Enter Payments › Receive a Payment`; `… › Enter Payments › Deposits` | ✓ exact |
| 15 | Run the income statement for the owner package | Reports: a named statement (A6); E12 | Review (Reports has no sections) | Financial Reporting › Financial Reports Library | `Reports › All › Financial Reporting › Financial Reports › Financial Reports Library` (`Income Statement Report`) | ✓ exact |

Coverage: AP, AR, GL, Cash, Job Cost & Reserves, Company, Reports and Fixed Assets. Spend Management appears in #4, via the commitment. Nine of the 15 are hard.

---

## 3. Exceptions: where the logic breaks

Each exception is stored as data in `rp_compass.EXCEPTIONS` and matched against the real location. "Screens" is how many real-menu-path screens that the rules mispredict each exception explains. **[Data]**

Across the catalog, **482** screens carry an exception tag. The drill shows the exception instead of the rule when a learner misses one of them.

**Lives in Company, not in its functional application**

| ID | Trap | Why RealPage put it there | Memory hook | Screens | Example path |
|---|---|---|---|---:|---|
| E01 | Approvals and the "available budget" check sought in AP/Spend/GL | One routing engine for every transaction type | Anything waiting for a signature sits on one desk: Company › Approvals | 38 | `Company › All › Approvals › Approval Configuration` |
| E02 | "Import vendors / A/P invoices / JEs / bank rec items" sought in the owning app | One template engine validates every load | Moving in? The loading dock is in Company | 41 | `Company › All › Import Data › Set Up AP Master List, Open Invoices and Adjustments` |
| E03 | Payment priority, inline credits and A/R formatting across entities sought in AP/AR Setup | Cross-entity defaults are set once | Local switch = app Setup; company-wide switch = Central Configuration | 14 | `Company › All › Central Configuration › Accounts Payable` |
| E04 | BVA-user flag, chart-type permission, expense-report approver sought in GL/AP | A permission belongs to the user | About a person? Company › Setup › Users/Roles | 34 | `Company › Setup › Users/Roles` |
| E05 | Vendor restrictions, 1099-by-tax-ID, full-service spend sought in AP Setup | Licensed or shared features are switched on per subscription | Turning a whole feature on? Subscriptions | 18 | `Company › Setup › Subscriptions › Full Service Spend Management` |
| E06 | Mass-inactivate vendors or change a bank's default G/L from the list | Bulk utilities run outside record lists | Mass clean-up = Company utility | 6 | `Company › Setup › Customer Utility Tool › Inactivate Vendors` |
| E07 | Tax codes expected under AR › Setup › Tax | Codes are shared by A/P, A/R and Spend lines | Code in Company, authority in A/R | 16 | `Company › All › Settings › Tax Codes › Add` |
| E08 | "Generate FCM checklists", "post depreciation" sought in FCM or Fixed Assets | The Close Calendar triggers period tasks across applications | Scheduled month-end triggers hang on the Company calendar | 6 | `Company › All › Close Calendar` |
| E09 | Entity default bank, linked vendor/customer, base currency | The entity card owns property-level defaults | Property-level defaults live on the entity card | 15 | `Company › All › Entities › Edit › Additional Information` |
| E10 | Contract-expiration alert sought in Bids and Contracts | Ledger Sentry is the company-wide alert engine | Alerts = Ledger Sentry | 5 | `Company › All › Ledger Sentry › Alerts and Notifications` |
| E11 | AI-invoice scanning, standard vendor types sought in AP Setup | AI is configured once for the agent | AI knobs: Company › AI Configuration / Finance Agent › Setup | 12 | `Company › All › AI Configuration › AI-Invoice Scanning` |

**Lives in Reports or another reporting layer, not in the application's own menu**

| ID | Trap | Why | Hook | Screens | Example path |
|---|---|---|---|---:|---|
| E12 | Income Statement / Annual Budget Statement sought under GL › Reports | Statements are report-writer layouts in a shared library; GL keeps Trial Balance and analytics | Trial balance in GL; the statements you hand an owner in Reports | 34 | `Reports › All › Financial Reporting › Financial Reports › Financial Reports Library` |
| E13 | Location groups, customer groups, departments sought in Company or AR | Groups exist for report roll-ups | Only there to roll up a report? Reports › Setup | 17 | `Reports › Setup › Dimension groups › Location`; `Reports › All › Dimensions` |
| E14 | Stored or scheduled report output sought in the running application | One Process & Store service. Every app's `All › Reports › My Stored Reports` points there | Output goes to one shelf | 2 | `Reports › All › Reports Center › Scheduled › More Actions` |
| E15 | Rent roll / resident deposit audit sought in AR | Resident ledgers are OneSite's. Financial Suite reads them through Reports Center **[Inferred: OneSite ownership]** | Residents are OneSite's; you only read them in Reports Center | 17 | `Reports › All › Reports Center › OneSite Reports › Security Deposits - Multifamily Report` |
| E16 | Custom Report Wizard / Positive Pay report sought in Reports or Cash | Custom reports are built on the customization platform | Build-your-own report = Platform Services | 31 | `Platform Services › All › Custom Reports`; `Reports › All › Operational Reports › Custom Reports` |
| E17 | "Document Dashboard" sends you to Dashboards | It is AP's scanned-invoice inbox | Documents waiting to become invoices = AP | 6 | `Accounts Payable › All › Document Dashboard` |

**Workflows that span applications**

| ID | Trap | Why | Hook | Screens | Example path |
|---|---|---|---|---:|---|
| E18 | Resident refund: AR or AP? | The credit is cleared in AR; the cash leaves as an A/P payment | Decide it in AR, pay it in AP | 9 | `Accounts Receivable › All › Receive a Payment › Refunding an Overpayment` |
| E19 | Bank rec looked for in GL; AI recs looked for in Cash | Matching/approval in Cash; the close work paper is an FCM report; AI-prepared recs queue in Finance Agent. No GL bank-rec path exists **[Data]** | Match in Cash, file in FCM, let the Agent queue | 6 | `Finance Agent › All › Cash Management › Pending Reconciliations` |
| E20 | Capital project invoice: Spend, AP or Job Cost? | Commit in Spend/AP contracts, invoice as A/P coded to a job, draw and retainage in Job Cost, capitalize the asset from AP then activate it in Fixed Assets | Commit in Spend, bill in AP, draw in Job Cost, capitalize in Fixed Assets | 19 | `Accounts Payable › All › Assets`; `Accounts Payable › All › Purchase Orders › Package Purchase Orders` |
| E21 | PO/subcontract "from a contract" sought in Spend | Bids and Contracts is AP's contract register | The contract is AP's; the PO it spawns is Spend's | 9 | `Accounts Payable › All › Periodic Tasks › Bids and Contracts › Contracts` |
| E22 | Check stock, alignment and ACH help sought in Cash | Checks are printed in AP Banking; the layout itself is Cash › Setup › More | Printing problems: AP Banking. Layout design: Cash Setup | 9 | `Accounts Payable › All › Daily Tasks › Banking › ACH / Electronic Payments` |
| E23 | "Set up vendors for ACH" sought in Cash bank configuration | The remittance details are fields on the vendor | Their bank details = vendor record; your bank file = Cash | 5 | `Accounts Payable › All › Vendors › Edit › Payment Information` |

**One feature, two homes**

| ID | Trap | Why | Hook | Screens | Example path |
|---|---|---|---|---:|---|
| E24 | Every "budget" sent to GL › Budgets | GL = posted operating budget/BVA; Forecasting & Planning = working budgets before publishing; Job Cost = job and change-order budgets; Company approvals = the spending check | Operating = GL, draft = F&P, capital = Job Cost, spending check = Company | 13 | `Forecasting & Planning › All › Budgets › Budget details`; `Job Cost & Reserves › All › Search & Find › Jobs › Budgets by Month` |
| E25 | Open/close books assumed GL-only | FCM's Console exposes the same boxes for the close team | Same switch, two panels | 4 | `Financial Close Management › All › Console › Books › Open` |
| E26 | Account labels sought in GL | Each subledger keeps its own labels for G/L accounts | Labels belong to the subledger that uses them | 12 | `Accounts Receivable › Setup › Account Labels`; `Accounts Payable › Setup › Account Labels` |
| E27 | Customer types assumed to be AR-only | Cash keeps its own customers and types for card programs | Card-program customers belong to Cash | 6 | `Cash Management › All › Customer Management › Types` |
| E28 | "Job position" sent to Job Cost | A position is an HR/payroll object | A job *position* is a person's role | 9 | `Forecasting & Planning › All › Job Positions`; `Time & Resources › All › Periodic Tasks › Job Positions` |
| E32 | Mapping G/L accounts to catalog categories, Site View A/P close calendar | Only purchasing needs them | Only purchasing cares? Spend Setup | 10 | `Spend Management › Setup › Configuration › Enable Functionality › Enable Subledger AP Close for Site View` |
| E33 | Currency, segment and foreign-payment switches assumed Company-wide | Company defines currencies; GL and AR decide posting and revaluation | Define in Company, posting behaviour in GL/AR Setup | 13 | `General Ledger › Setup › Configuration › Accounting Settings › Multi-currency Management` |

**Misleading names**

| ID | Trap | Why | Hook | Screens | Example path |
|---|---|---|---|---:|---|
| E29 | "Agent Jobs" / "Agent Accruals" sent to Job Cost / GL | They are the AI agent's scheduled work and proposals | Agent-prefixed = Finance Agent | 15 | `Finance Agent › All › Agent Jobs` |
| E30 | A bare "invoice" assumed A/P | Inside AR the sales-invoice list is just `Invoices` | Check which menu you are in | 24 | `Accounts Receivable › All › Invoices › Edit › Reclassify` |
| E31 | "Posted Payments" assumed to be cash received | It is the A/P disbursement list | A/P posts payments out; A/R enters payments in | 6 | `Accounts Payable › Payments › Payment Requests and Posted Payments` |
| E34 | A register is a report, so no action is expected there | The Check Register lists every issued payment, so it carries Void. Encoded as rule `X:void-from-register`: 14/14 | Void where the checks are listed | 1 (+14 by rule) | `Accounts Payable › All › Check Register › Void a Check That's Already Been Confirmed` |

**Remaining weak spots.** These have no clean rule yet. App precision on menu paths **[Data]**:

- **Finance Agent 37.5%.** Its menus reuse subledger nouns ("Accounts Payable", "Cash Management", "Financial Close Reports").
- **Reporting Portal 50%.** Owner/contact lists look like Company contacts.
- **Forecasting & Planning 65%.** It shares `Budgets` with GL.
- **Reports 68.7%** and **Spend Management 69.5%.** Reports reuses GL report names; Spend shares POs and subcontracts with AP and Job Cost.

---

## 4. App feature: Deduction Compass

A new bottom-bar tab, **Compass**, between Explorer and Triage. It runs fully offline: every prediction comes from `compassRules.json` through deterministic regexes (synonyms → object → tie-breakers → verb → state). There are no API calls.

### 4.1 Tag schema added to every screen

The build writes a `compass` block onto each of the 7,107 screens in `src/data/modules/*.js`. Keys that would be null are omitted. The same values go into the boot-time `src/data/compassIndex.json`, which is 7,107 positional rows parallel to `searchIndex.json`. Opening the tab never loads a module file.

| Field | Values | Assigned from |
|---|---|---|
| `app` | canonical application name (20 values, incl. out-of-scope Property Management) | Normalized `navigation[]` (label variants folded) |
| `tab` | `All` · `Setup` | The real path; implied from sibling paths when the manual skipped it |
| `section` | `Daily Tasks` · `Search & Find` · `Periodic Tasks` · `Reports` · `More` | The real path (Month End → Periodic Tasks, Registers & Reports → Reports), or implied |
| `submenu` | first list after tab/section | The real path |
| `pathKind` | `menu` · `chapter` · `topic` · `none` | Whether the path is a real menu, a manual chapter, a non-screen topic, or has no application |
| `stage` | `configure` · `enter` · `find_fix` · `process` · `review` | Tab/section. Sectionless All-tab screens use the title's verb, else `find_fix` |
| `object` | object id (e.g. `vendor`, `ap_invoice`, `bank_rec`) | Step 1 rules on the title |
| `action` | `create` · `pay` · `receive` · `edit` · `reverse` · `void` · `delete` · `view` · `close` · `reconcile` · `recur` · `configure` · `report` | Verb rules on the title |
| `state` | `draft` · `pending_approval` · `posted` · `paid` · `closed_period` | State rules (rare in titles, common in scenarios) |
| `fit` | `exact` · `location` · `app` · `miss` · `unmatched` | Rules' prediction vs the real path |
| `exc` | `E01`…`E34` | Exception whose location/name pattern matches a screen the rules mispredict |
| `topicKind` | e.g. `report column reference` | Topic classifier (excluded screens only) |

**Build steps** (`scripts/build_realpage_modules.py` → `scripts/rp_compass.py`):

1. Build all nine modules as before.
2. Create one `PathIndex` over every path. It learns which tab/section each submenu belongs to.
3. Run `tag_screen()` on every screen.
4. Write the module files.
5. Write `write_compass()` outputs:
   - `compassIndex.json` (tags + measured metrics)
   - `compassRules.json` (the rules, exported for JS)
   - `scripts/output/compass_report.json` (per-rule support/precision, miss clusters, exception counts)
   - `scripts/output/compass_parity.json` (Python predictions the JS must reproduce)

### 4.2 "Predict, then reveal" drill

- **Deck.**
  - 10 real menu-path screens, one per (application, list), drawn from 3,991 drillable screens.
  - 30% are *trap cards*: screens tagged with an exception. The **Exceptions** chip raises this to 90%. App chips filter the deck.
  - Decks are seeded, so they are reproducible.
- **Prompt.** The screen title rewritten as a task: "Voiding a Check" → "Void a check"; "Vendors List" → "Open the Vendors List".
- **Step 1.** Pick the application from 4 choices. The distractors include whatever the rules would wrongly guess, so traps bite.
- **Step 2.** Pick the stage. Sectioned applications offer the five stages; sectionless ones offer All vs Setup.
- **Step 3.** Pick the list from 4 lists of the same application, preferring the same stage.
- **Feedback.** Each step reveals right (green) or wrong (red) before the next step. Every step builds on the true previous answer.
- **Reveal.**
  - Real path as breadcrumbs, and a ✓/✗ per step.
  - A verdict: rules exact / exception / partial / rule gap.
  - When the screen is an exception: its **trap, why, hook** card, plus "the rules alone would say …".
  - Otherwise: the **rule cards that fired** (noun → application, tie-breaker, stage, list).
  - Buttons: **Screen SOP** (existing `ScreenSopModal`), **In Explorer** (deep link into `RealPageExplorer`), **Mastery** (the Daily Hub task with the same business object, opened in `MasteryModal`).
- **Progress.** Stored in AsyncStorage (`@rp_compass_progress_v1`): per-step accuracy, plus a *weak spots* list of the most-missed exceptions and rules.

### 4.3 Scenario box

1. Type a situation. It is debounced 300 ms; nothing is sent anywhere.
2. **Synonyms** normalize everyday phrasing: "vendor bill" → A/P invoice, "interest income" → other receipt, "move cash" → transfer funds, "load" → import, "undo" → reverse, "NSF" → returned payment. The app shows the result as "Read as …".
3. **State phrases are read, then removed** before objects are matched. "Posted in a closed period" sets the state and cannot be mistaken for the Books object.
4. Three step cards appear:
   - application + the rules that decided it
   - tab/section + the stage question
   - list + the **state hint** (posted → reverse; paid → void from Check Register; closed period → reverse into the open period or reopen books)
5. **Also consider:** the landing for each other application the words point to (a refund shows AP *and* AR).
6. **Exceptions that apply,** matched on their scenario cues.
7. **Candidate screens:** up to 8 real menu-path screens, ranked by predicted application/section/list/object plus word overlap. Tapping one opens its SOP.
8. Links: the matching **Daily Hub mastery** task, and **Search all 7,107 screens**, which hands the text to `CommandSearch` through the new `initialQuery` prop.

### 4.4 Visual map

- An 18-application × 5-stage grid (Property Management excluded). Cells are shaded by screen count and each row shows whether the application uses sections.
- Tap a cell → the lists in that cell (tab › section › list, with counts). Tap a list → its screens (exception-tagged screens are flagged). Tap a screen → its SOP.
- Local back stack with `BackButton` and an edge `SwipeBackView`.

### 4.5 Component structure

```
App.js                                   + 'compass' tab, openInSearch() → CommandSearch initialQuery
src/components/compass/
  DeductionCompass.js                    container: metrics header + SegmentedToggle (Drill | Scenario | Map)
  CompassDrill.js                        deck, 3-step picks, reveal, progress (AsyncStorage)
  ScenarioBox.js                         input, examples, step cards, alternates, exceptions, candidates
  CompassMap.js                          app × stage grid → lists → screens (BackButton/SwipeBackView)
  RuleCard.js                            RuleCard, ExceptionCard, PathCrumbs (ui.js Breadcrumbs)
src/utils/compassEngine.js               deduce(), matchScenario(), buildDeck(), grade(), buildGrid(), cellSubmenus()
src/utils/storage.js                     + getCompassProgress / saveCompassProgress
src/data/compassRules.json               generated: objects, lists, verbs, states, synonyms, tie-breakers, exceptions
src/data/compassIndex.json               generated: per-screen tags + metrics (parallel to searchIndex.json)
scripts/rp_compass.py                    normalizer, rules, tag_screen(), evaluate(), report(), rules_json()
scripts/build_realpage_modules.py        + tagging pass and write_compass()
scripts/test/compass.test.mjs            JS parity with Python (≈810 cases), engine, deck, grid, scenarios
scripts/test/test_rp_compass.py          normalization, topics, scenarios, JS-safe regexes, accuracy floors
```

**Measuring a rule change:** run `python3 scripts/rp_compass.py`. It prints app/tab/section/list precision on the 4,701 real menu paths, per-application scores, and support/precision for every stage rule and tie-breaker. `--misses` lists the mispredictions clustered by (predicted → actual location), which is where new exceptions come from. `npm run test:py` fails if the accuracy on real menu paths drops below its floor.

### 4.6 Code

The files above are the complete, working code; they pass `npm run check`. The core of the matching function, from `src/utils/compassEngine.js`, line-for-line equal to `rp_compass.deduce`:

```js
function pickObject(full, text = full) {
  for (const t of TIES) {
    if (t.re.test(full) && !(t.unlessRe && t.unlessRe.test(full))) return { obj: OBJECT_BY_ID.get(t.force), tie: t.id };
  }
  const objs = objectsIn(text);
  if (!objs.length) return { obj: null, tie: null };
  const m = FROM_CLAUSE.exec(text);
  if (m) {
    const src = objectsIn(m[2]);
    if (src.length && src[0].kind !== 'service' && src[0].app !== objs[0].app) return { obj: src[0], tie: 'T7' };
  }
  const first = objs[0];
  if (first.id === 'bs_rec_report') return { obj: first, tie: 'T6' };
  if (new Set(objs.map((o) => o.app)).size > 1) return { obj: first, tie: 'T1' };
  return { obj: first, tie: null };
}

export function deduce(input, { scenario = false } = {}) {
  let text = (input || '').trim();
  const state = stateOf(text);
  if (scenario) text = normalizeScenario(text);
  const { obj, tie } = pickObject(text, state ? stripStates(text) : text); // Step 1
  const { stage, action } = actionOf(text);
  const rules = tie ? [tie] : [];
  if (!obj) return { object: null, app: null, stage, action, state, tab: null, section: null, submenu: null, rules };
  rules.push(`A:${obj.id}`);
  let landing = null;
  let why = null;
  for (let i = 0; i < obj.lists.length; i++) {                                 // Step 3: a named list
    if (obj.listRes[i].test(text)) { landing = obj.lists[i]; why = `L:${obj.id}:${i}`; break; }
  }
  if (STRONG_CONFIG.test(text) && (!landing || landing.tab !== 'Setup')) {     // "configure" → Setup
    landing = obj.setup || SETUP_CONFIGURATION; why = 'S:configure';
  }
  if (!landing) {                                                              // Step 2: kind × verb
    if (obj.kind === 'code' || (CODE_NOUN.test(text) && obj.kind !== 'output')) {
      landing = obj.kind === 'code' ? obj.home : obj.setup || SETUP_CONFIGURATION; why = 'S:configure';
    } else if (stage === 'review' && obj.report) { landing = obj.report; why = 'S:review'; }
    else if (stage === 'enter' && obj.daily && ['create', 'pay', 'receive'].includes(action)) { landing = obj.daily; why = 'S:enter'; }
    else { landing = obj.home; why = `S:${RULES.stageOfKind[obj.kind]}`; }
  }
  rules.push(why);
  /* …list-name resolution and the void-from-register override, see file… */
}
```

The tag assignment in the build, from `scripts/rp_compass.py`:

```python
def tag_screen(scr, index):
    loc = index.locate(scr['navigation'])          # normalized App › Tab › Section › Submenu
    topic = topic_kind(scr['name'])
    on_menu = bool(loc['app']) and loc['tabSource'] in ('menu', 'implied')
    pred = deduce(scr['name'])                     # the same rules the app runs
    r = score_screen(scr, index)                   # fit: exact | location | app | miss | unmatched
    ...
    return {app, tab, section, submenu, pathKind, stage, object, action, state, fit, exc, topicKind}  # nulls dropped
```
