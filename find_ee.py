with open('found_sections.js', 'r', encoding='utf-8') as f:
    code = f.read()

import re
pos = code.find('ee=')
if pos != -1:
    print('ee definition:')
    print(code[pos-50:pos+1500])
