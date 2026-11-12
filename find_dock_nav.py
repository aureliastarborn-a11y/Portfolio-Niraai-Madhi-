with open('found_sections.js', 'r', encoding='utf-8') as f:
    code = f.read()

import re
pos = code.find('tooltip:"Sections"')
if pos != -1:
    print('Found tooltip Sections:')
    print(code[pos:pos+3500])

