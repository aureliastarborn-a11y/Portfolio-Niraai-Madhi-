with open('found_sections.js', 'r', encoding='utf-8') as f:
    code = f.read()

pos = code.find('VERTEX_SHADER,ee')
if pos != -1:
    print(code[pos-2500:pos+200])

