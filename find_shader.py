with open('found_sections.js', 'r', encoding='utf-8') as f:
    code = f.read()

pos = code.find('precision mediump float')
if pos != -1:
    print('Shader found:')
    print(code[pos-100:pos+1500])
else:
    pos = code.find('createShader')
    if pos != -1:
        print('createShader found:')
        print(code[pos-100:pos+1500])

