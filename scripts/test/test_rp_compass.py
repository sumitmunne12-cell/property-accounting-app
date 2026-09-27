"""Unit tests for the Deduction Compass rules (scripts/rp_compass.py).

Run: npm run test:py   (python3 -m unittest discover -s scripts/test -p "test_*.py")
"""

import os
import re
import sys
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import rp_compass as X  # noqa: E402


def where(d):
    return (d['app'], d['tab'], d['section'], d['submenu'])


class NormalizeTest(unittest.TestCase):
    def test_label_variants_fold_into_one_application(self):
        cases = {
            ('Applications', 'Spend management', 'All', 'Workbench'): 'Spend Management',
            ('Applications', 'Accounts Payable/Spend Management', 'All', 'Workbench'): 'Spend Management',
            ('Applications', 'Job Cost & Reserves or Replacement Reserves', 'Setup', 'Draw Models'): 'Job Cost & Reserves',
            ('Applications', 'General ledger', 'All', 'Budgets'): 'General Ledger',
            ('To see Journal entries, go to General Ledger', 'All', 'Journal entries'): 'General Ledger',
            ('Applications', 'Dashboards (menu)', 'Dashboards (list)'): 'Dashboards',
        }
        for nav, app in cases.items():
            self.assertEqual(X.split_path(list(nav))['app'], app, nav)

    def test_configure_page_is_setup_configuration(self):
        p = X.split_path(['Applications', 'Configure (Accounts Payable)', 'Requiring Attachments on A/P Invoices'])
        self.assertEqual(p['app'], 'Accounts Payable')
        self.assertEqual(p['tokens'][:2], ['Setup', 'Configuration'])

    def test_prose_tail_is_trimmed(self):
        p = X.split_path(['Receivable', 'Setup', 'Configuration and enable the document'])
        self.assertEqual(p['tokens'], ['Setup', 'Configuration'])

    def test_topics_are_recognized(self):
        for name in ('Overview of the Accounts Payable Application', 'Appendices', 'Help and Support',
                     'Check Register Report Columns', 'Why Is My Invoice Stuck in the Approval Workflow?',
                     'Accounts Payable Home Page'):
            self.assertIsNotNone(X.topic_kind(name), name)
        for name in ('Voiding a Check', 'Adding Columns', 'Workflow Wizard Page', 'Reversing a Journal Entry'):
            self.assertIsNone(X.topic_kind(name), name)

    def test_path_index_completes_missing_section(self):
        idx = X.PathIndex([
            ['Applications', 'Accounts Payable', 'All', 'Search & Find', 'A/P Invoices', 'Reverse'],
            ['Applications', 'Accounts Payable', 'All', 'A/P Invoices', 'Edit'],
        ])
        loc = idx.locate(['Applications', 'Accounts Payable', 'All', 'A/P Invoices', 'Edit'])
        self.assertEqual((loc['tab'], loc['section'], loc['submenu']), ('All', 'Search & Find', 'A/P Invoices'))


class DeduceTest(unittest.TestCase):
    SCENARIOS = {
        'void a vendor check and restore the invoice': ('Accounts Payable', 'All', 'Reports', 'Check Register'),
        'reconcile the operating bank account': ('Cash Management', 'All', 'Periodic Tasks', 'Reconciliation'),
        'record interest income the bank deposited': ('Cash Management', 'All', 'Periodic Tasks', 'Other Receipts'),
        'transfer cash from operating to reserve account': ('Cash Management', 'All', 'Periodic Tasks', 'Funds Transfer'),
        'approve an invoice that is stuck in approval': ('Company', 'All', None, 'Approvals'),
        'import opening balances for a new property': ('Company', 'All', None, 'Import Data'),
        'set up a new vendor type': ('Accounts Payable', 'Setup', None, 'Types'),
        'post monthly depreciation': ('Fixed Assets', 'All', 'Periodic Tasks', 'Post Depreciation'),
        'add a draw to the construction job': ('Job Cost & Reserves', 'All', 'Search & Find', 'Draw Workbench'),
        'enter a customer payment and deposit it': ('Accounts Receivable', 'All', 'Daily Tasks', 'Enter Payments'),
        'create location groups for regional reporting': ('Reports', 'Setup', None, 'Dimension Groups'),
        'accrue the utility bill we have not received': ('General Ledger', 'All', 'Periodic Tasks', 'Accrual'),
    }

    def test_scenarios_land_on_the_expected_list(self):
        for text, expected in self.SCENARIOS.items():
            self.assertEqual(where(X.deduce(text, scenario=True)), expected, text)

    def test_record_state_is_read_but_not_mistaken_for_an_object(self):
        d = X.deduce('reverse a journal entry posted in a closed period', scenario=True)
        self.assertEqual(d['state'], 'closed_period')
        self.assertEqual(d['object'], 'journal_entry')
        self.assertEqual(d['action'], 'reverse')

    def test_tie_breakers_are_reported(self):
        self.assertIn('T2', X.deduce('Approving and Declining Transactions')['rules'])
        self.assertIn('T6', X.deduce('Prepaid Expenses Report')['rules'])

    def test_rules_are_javascript_compatible(self):
        pats = [rx for _, _, rx in X.VERB_RULES] + [rx for _, rx, _ in X.STATE_RULES] + [rx for rx, _ in X.SYNONYMS]
        pats += [X.CODE_NOUN, X.STRONG_CONFIG]
        for o in X.OBJECTS:
            pats.append(o['match'])
            pats += [li['match'] for li in o['lists']]
        for t in X.TIE_BREAKERS:
            pats += [t[k] for k in ('trigger', 'unless') if t.get(k)]
        for e in X.EXCEPTIONS:
            pats += [e[k] for k in ('where', 'name', 'cue') if e.get(k)]
        for p in pats:
            self.assertNotRegex(p, r'\(\?<[=!]|\(\?[aiLmsux]|\(\?P<|\\A|\\Z', p)
            re.compile(p)


class CatalogScoreTest(unittest.TestCase):
    """Guards the measured accuracy on the real menu paths against regressions."""

    @classmethod
    def setUpClass(cls):
        cls.rep = X.report(X.evaluate(X.load_screens_from_modules()))

    def test_menu_path_accuracy(self):
        m = self.rep['menuPaths']
        self.assertGreaterEqual(m['screens'], 4500)
        self.assertGreaterEqual(m['appPrecision'], 78)
        self.assertGreaterEqual(m['tabPrecisionGivenApp'], 90)
        self.assertGreaterEqual(m['sectionPrecisionGivenApp'], 78)
        self.assertGreaterEqual(m['submenuPrecisionGivenApp'], 70)

    def test_every_exception_explains_real_screens(self):
        for eid, e in self.rep['exceptions'].items():
            self.assertGreater(e['screensExplained'], 0, eid)


if __name__ == '__main__':
    unittest.main()
