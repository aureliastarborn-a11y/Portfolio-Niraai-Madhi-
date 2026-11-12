import json
import re

with open('scratch/matched_line.txt', 'r', encoding='utf-8') as f:
    line = f.read()

# Look for component name or code in this line
# Find all occurrences of "motion." or "framer-motion" or function definition
pos = line.find('images-scrolling-animation')
print('Position of slug:', pos)
nearby = line[max(0, pos-500):min(len(line), pos+2000)]
print('Nearby slug:', nearby[:500])

# Let's search for "code" or "files"
for m in re.finditer(r'\{[^{}]*"name"[^{}]*"content"[^{}]*\}', line):
    print("Found file object:", m.group(0)[:200])

# Let's search for "export default" or "export function"
for m in re.finditer(r'export (?:default )?function ([A-Za-z0-9_]+)', line):
    print("Found function:", m.group(0))

