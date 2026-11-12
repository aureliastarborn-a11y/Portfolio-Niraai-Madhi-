with open('scratch/page.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
# Let's search for "Images Scrolling Animation"
pos = text.find('Images Scrolling Animation')
print("Position:", pos)
if pos != -1:
    print(text[pos:pos+1500])

