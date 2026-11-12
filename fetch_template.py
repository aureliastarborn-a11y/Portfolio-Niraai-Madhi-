import urllib.request
import re
import os

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

req = urllib.request.Request('https://glass-portfolio-v1.21st.app', headers=headers)
html = urllib.request.urlopen(req).read().decode('utf-8')

with open('template_raw.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Saved template_raw.html')

css_matches = re.findall(r'href="([^"]+\.css)"', html)
print('CSS matches:', css_matches)
for css_path in css_matches:
    url = f'https://glass-portfolio-v1.21st.app{css_path}' if css_path.startswith('/') else css_path
    content = urllib.request.urlopen(urllib.request.Request(url, headers=headers)).read().decode('utf-8')
    with open('src/template.css', 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Saved CSS to src/template.css ({len(content)} bytes)')

# Also find JS chunks
js_matches = re.findall(r'src="([^"]+\.js)"', html)
print('JS matches:', js_matches)

# Download image assets if any
img_matches = re.findall(r'src="(/images/[^"]+)"', html)
print('Image matches:', set(img_matches))
os.makedirs('public/images', exist_ok=True)
for img in set(img_matches):
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

