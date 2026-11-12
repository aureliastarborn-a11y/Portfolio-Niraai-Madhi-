import urllib.request
import os

headers = {'User-Agent': 'Mozilla/5.0'}

os.makedirs('public/_next/static/media', exist_ok=True)
fonts = [
    'inter_medium-s.p.150sv01hgjk4j.ttf',
    'inter_regular-s.p.432tkj802eolg.ttf'
]

for font in fonts:
    url = f'https://glass-portfolio-v1.21st.app/_next/static/media/{font}'
    try:
        data = urllib.request.urlopen(urllib.request.Request(url, headers=headers)).read()
        with open(f'public/_next/static/media/{font}', 'wb') as f:
            f.write(data)
        print(f'Downloaded {font} ({len(data)} bytes)')
    except Exception as e:
        print(f'Error {font}: {e}')
