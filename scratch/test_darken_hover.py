import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1400, 'height': 900})
        await page.goto('http://localhost:5174', timeout=20000)
        await page.wait_for_timeout(3500)

        # Scroll to education section
        await page.evaluate("() => document.getElementById('education')?.scrollIntoView({ behavior: 'instant' })")
        await page.wait_for_timeout(800)

        # 1. Capture normal state
        await page.screenshot(path='scratch/verify_edu_darken_normal.png')
        print('Captured verify_edu_darken_normal.png')

        # 2. Hover / touch with cursor
        edu_card = page.locator('#education .group').first
        if await edu_card.count() > 0:
            box = await edu_card.bounding_box()
            if box:
                # Move cursor over the box
                await page.mouse.move(box['x'] + box['width'] * 0.45, box['y'] + box['height'] * 0.5)
                await page.wait_for_timeout(500)
                await page.screenshot(path='scratch/verify_edu_darken_hover.png')
                print('Captured verify_edu_darken_hover.png')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())
