with open('scratch/matched_line.txt', 'r', encoding='utf-8') as f:
    text = f.read()

import re
# Look for unescaped or escaped tsx code
matches = re.findall(r'(\"use client\".*?)(?=\"[,\}])', text)
print("use client matches:", len(matches))
for i, m in enumerate(matches):
    clean = m.encode().decode('unicode_escape')
    print(f"Match {i} length: {len(clean)}")
    with open(f'scratch/code_match_{i}.tsx', 'w', encoding='utf-8') as out:
        out.write(clean)
    print(f"Saved match {i} snippet: {clean[:200]}")

