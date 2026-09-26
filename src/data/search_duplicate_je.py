import os
import fitz

folder = r'02 Property accounting\Real Page manuals'
terms = [
    'duplicate journal',
    'copy journal',
    'duplicate entry',
    'duplicate an entry',
    'copy an entry',
    'copy entry',
    'duplicate transaction',
    'reversing journal',
    'reverse journal',
    'duplicate'
]

matches = []

for f in sorted(os.listdir(folder)):
    if not f.lower().endswith('.pdf'):
        continue
    filepath = os.path.join(folder, f)
    try:
        doc = fitz.open(filepath)
        for page_num in range(len(doc)):
            page_text = doc[page_num].get_text('text')
            lower_text = page_text.lower()
            
            for term in ['duplicate', 'copy']:
                if term in lower_text and 'journal' in lower_text:
                    # check if duplicate or copy is near journal
                    lines = page_text.split('\n')
                    for i, line in enumerate(lines):
                        if (term in line.lower() or 'clone' in line.lower()) and any(j in line.lower() or (i>0 and j in lines[i-1].lower()) or (i<len(lines)-1 and j in lines[i+1].lower()) for j in ['journal', 'entry', 'je', 'transaction']):
                            context = " ".join(lines[max(0, i-2):min(len(lines), i+4)])
                            matches.append({
                                'file': f,
                                'page': page_num + 1,
                                'line': line.strip(),
                                'context': context.strip()
                            })
        doc.close()
    except Exception as e:
        pass

print(f"Total relevant occurrences found: {len(matches)}")
for m in matches[:15]:
    print("---")
    print(f"FILE: {m['file']} (Page {m['page']})")
    print(f"LINE: {m['line']}")
    print(f"CONTEXT: {m['context']}")
