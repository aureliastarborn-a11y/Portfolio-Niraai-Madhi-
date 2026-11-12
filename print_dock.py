with open('found_sections.js', 'r', encoding='utf-8') as f:
    code = f.read()

pos = code.find('tP=')
if pos != -1:
    print(code[pos:pos+2000])

