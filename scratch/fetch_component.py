import urllib.request
import json
import re
import os

url = 'https://21st.dev/community/components/s/card?preview=%2F%40minhxthanh%2Fcomponents%2Fimages-scrolling-animation'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8')
        print('Fetched HTML length:', len(html))
        
        # Save HTML
        os.makedirs('scratch', exist_ok=True)
        with open('scratch/page.html', 'w', encoding='utf-8') as f:
            f.write(html)
            
        # Search for code
        # Often in __NEXT_DATA__ or window.__INITIAL_STATE__
        next_data_match = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', html)
        if next_data_match:
            data = json.loads(next_data_match.group(1))
            with open('scratch/next_data.json', 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)
            print('Saved scratch/next_data.json')
        else:
            print('No __NEXT_DATA__ found')
except Exception as e:
    print('Error:', e)

