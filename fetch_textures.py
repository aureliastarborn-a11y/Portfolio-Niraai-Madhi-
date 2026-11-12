import urllib.request
import re
import json

headers = {'User-Agent': 'Mozilla/5.0'}

with open('template_raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

js_files = re.findall(r'src="(/_next/static/chunks/[^"]+)"', html)
print('Found JS chunks:', len(js_files))

all_textures = []
for js in js_files:
    url = f'https://glass-portfolio-v1.21st.app{js}'
    try:
        content = urllib.request.urlopen(urllib.request.Request(url, headers=headers)).read().decode('utf-8')
        textures = re.findall(r'(/images/[a-zA-Z0-9_\-\./]+\.(?:jpg|png|webp|svg|hdr|exr|bin|glb|gltf))', content)
        if textures:
            print(f'Textures in {js}:', set(textures))
            all_textures.extend(textures)
    except Exception as e:
        print(f'Error fetching {js}: {e}')

print('All textures:', set(all_textures))

import os
for img in set(all_textures):
    try:
        url = f'https://glass-portfolio-v1.21st.app{img}'
        img_data = urllib.request.urlopen(urllib.request.Request(url, headers=headers)).read()
        local_path = os.path.join('public', img.lstrip('/'))
        os.makedirs(os.path.dirname(local_path), exist_ok=True)
        with open(local_path, 'wb') as f:
            f.write(img_data)
        print(f'Downloaded {img} ({len(img_data)} bytes)')
    except Exception as e:
        print(f'Error downloading {img}: {e}')
