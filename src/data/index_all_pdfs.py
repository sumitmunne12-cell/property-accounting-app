import os
import json
import fitz

folder = r'02 Property accounting\Real Page manuals'
files = [f for f in os.listdir(folder) if f.lower().endswith('.pdf')]
print('Total PDF files found:', len(files))

catalog = []
for f in sorted(files):
    path = os.path.join(folder, f)
    size_mb = round(os.path.getsize(path) / (1024 * 1024), 2)
    try:
        doc = fitz.open(path)
        pages = len(doc)
        toc = doc.get_toc()
        
        # Extract title and headings from first few pages
        text_preview = ""
        for p in range(min(3, pages)):
            text_preview += doc[p].get_text("text") + " "
        
        text_preview = " ".join(text_preview.split())
        
        # Determine category
        cat = "General"
        fname_lower = f.lower()
        if "ap " in fname_lower or "accounts payable" in fname_lower:
            cat = "Accounts Payable (AP)"
        elif "ar " in fname_lower or "accounts receivable" in fname_lower:
            cat = "Accounts Receivable (AR)"
        elif "general ledger" in fname_lower or "gl " in fname_lower:
            cat = "General Ledger (GL)"
        elif "cash management" in fname_lower or "bank" in fname_lower:
            cat = "Cash Management & Banking"
        elif "approval" in fname_lower:
            cat = "Approval Policy Manager"
        elif "close" in fname_lower:
            cat = "Financial Close"
        elif "report" in fname_lower:
            cat = "Reporting & Analytics"
        elif "job cost" in fname_lower or "replacement reserve" in fname_lower:
            cat = "Job Cost & Reserves"
        elif "fixed assets" in fname_lower:
            cat = "Fixed Assets"
        elif "spend" in fname_lower:
            cat = "Spend Management"
        elif "dashboard" in fname_lower:
            cat = "Dashboards"
        elif "ai finance" in fname_lower:
            cat = "AI Finance Agent"
        elif "company" in fname_lower or "getting started" in fname_lower:
            cat = "Company & Setup"

        # Determine type
        doc_type = "User Guide"
        if "qs.pdf" in fname_lower or "quick steps" in fname_lower:
            doc_type = "Quick Steps (QS)"
        elif "quick help" in fname_lower:
            doc_type = "Quick Help"
        elif "getting started" in fname_lower:
            doc_type = "Getting Started"
        elif "roles and rights" in fname_lower:
            doc_type = "Roles & Security"

        # Extract top chapters from TOC or text
        chapters = []
        if toc:
            for item in toc[:8]:
                if len(item) > 1 and item[1].strip():
                    chapters.append(item[1].strip())
        
        if not chapters:
            # Fallback topics from filename
            base_name = f.replace(".pdf", "")
            chapters = [base_name]

        catalog.append({
            'id': f"pdf_{len(catalog)+1:02d}",
            'filename': f,
            'title': f.replace('.pdf', ''),
            'category': cat,
            'docType': doc_type,
            'pages': pages,
            'sizeMb': size_mb,
            'chapters': chapters[:6],
            'summary': text_preview[:250] + "..." if len(text_preview) > 250 else text_preview
        })
        doc.close()
    except Exception as e:
        print(f"Error on {f}: {e}")

print(f"Indexed {len(catalog)} PDFs.")

# Save to JSON
with open(r'02-property-accounting\src\data\pdfCatalog.json', 'w', encoding='utf-8') as out_f:
    json.dump(catalog, out_f, indent=2)

print("Saved to 02-property-accounting/src/data/pdfCatalog.json")
