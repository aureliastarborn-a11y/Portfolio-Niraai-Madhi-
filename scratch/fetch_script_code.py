import urllib.request
import re
import os

with open('scratch/page.html', 'r', encoding='utf-8') as f:
    text = f.read()

scripts = list(set(re.findall(r'/_next/static/chunks/[^"\'\s>]+\.js', text)))
print(f'Found {len(scripts)} chunks.')

for script in scripts:
    url = f'https://21st.dev{script}'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp:
            content = resp.read().decode('utf-8', errors='ignore')
            if 'ImagesScrollingAnimation' in content or 'images-scrolling-animation' in content or 'minhxthanh' in content:
                print(f'Match in {url}!')
                with open('scratch/matched_chunk.js', 'w', encoding='utf-8') as out:
                    out.write(content)
                break
    except Exception as e:
        pass
print("Done scanning chunks.")

