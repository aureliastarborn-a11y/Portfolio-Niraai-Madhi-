import json
import re

with open('scratch/component_direct.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Search for any file with code
# In Next.js RSC payload, strings might be escaped JSON
for line in text.splitlines():
    if 'use client' in line or 'framer-motion' in line or 'motion.' in line:
        print('Found line with keywords, len:', len(line))
        with open('scratch/matched_line.txt', 'w', encoding='utf-8') as out:
            out.write(line)
        break

# Let's search with regex for tsx/jsx code
pattern = r'("code":\s*"|"content":\s*")(.*?)(",\s*"\w+":|"}\])'
m = re.search(r'"code":"(.*?)"', text)
if m:
    code = m.group(1).encode('utf-8').decode('unicode_escape')
    with open('scratch/extracted_code.tsx', 'w', encoding='utf-8') as out:
        out.write(code)
    print("Found code with regex!")
else:
    print("Regex for code not found directly, checking other keys...")
    m2 = re.search(r'\\nimport\s.*?(?=")', text)
    if m2:
        print("Found escaped import!")

