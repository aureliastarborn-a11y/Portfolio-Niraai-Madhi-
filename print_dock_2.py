with open('found_sections.js', 'r', encoding='utf-8') as f:
    code = f.read()

pos = code.find('tL={home:')
if pos != -1:
    print(code[pos+1000:pos+3500])

