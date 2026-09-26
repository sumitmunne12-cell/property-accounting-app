#!/usr/bin/env python3
"""Quality audit of generated module screens: how much of each field comes from the
manual text vs. knowledge-base fallbacks, plus suspicious values worth a look."""
import json
import glob
import os
import re
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

tot = Counter()
odd = []
for f in sorted(glob.glob(os.path.join(ROOT, 'src/data/modules/0*.js'))):
    s = open(f, encoding='utf-8').read()
    d = json.loads(s[s.index('= {') + 2:s.rindex(';')])
    c = Counter()
    for sm in d['submodules']:
        for x in sm['screens']:
            c['screens'] += 1
            sop = x['accountantActionSOP']
            if any(re.match(r'^\d+\. (Use the filters|Open the screen|Click Add|Locate the record|Filter to the items|Open the approval|Download the import|Run or open|Open the .* and set|Open the setup|Read this topic)', t) for t in sop):
                c['sop_fallback'] += 1
            if x['purpose'].startswith(('Use this procedure', 'Use this screen', 'The ')) and "functionality" in x['purpose']:
                c['purpose_fallback'] += 1
            if any(k['name'] in ('Filters & search', 'Required header fields', 'Screen actions', 'Reporting period / As-of date', 'Configuration options', 'Key terms') for k in x['keyFieldsAndFilters']):
                c['fields_generic'] += 1
            if 'Per the manual' in x['glAccountingImpact']:
                c['gl_manual_quote'] += 1
            nav = x['navigation']
            if any(len(n) > 80 for n in nav) or len(nav) > 9:
                odd.append((os.path.basename(f), x['id'], ' > '.join(nav)[:200]))
    tot.update(c)
    print(os.path.basename(f), dict(c))
print('TOTAL', dict(tot))
print('odd navigation paths:', len(odd))
for o in odd[:25]:
    print('  ', o)
