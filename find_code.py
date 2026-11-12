import urllib.request
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

chunks = [
    '/_next/static/chunks/3rx7jmld6eggj.js',
    '/_next/static/chunks/22yw_xvmlqw8w.js',
    '/_next/static/chunks/0h2qsuyze9ds1.js',
    '/_next/static/chunks/2onypm0e_h948.js'
]

for js in chunks:
    try:
        url = f'https://glass-portfolio-v1.21st.app{js}'
        req = urllib.request.Request(url, headers=headers)
        content = urllib.request.urlopen(req).read().decode('utf-8')
        if 'Sections' in content:
            print(f'Found "Sections" in {js}')
            with open('found_sections.js', 'w', encoding='utf-8') as f:
                f.write(content)
        if 'sphere' in content.lower():
            print(f'Found "sphere" in {js}')
    except Exception as e:
        print(f'Error {js}: {e}')
