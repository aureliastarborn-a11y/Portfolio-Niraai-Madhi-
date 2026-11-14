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

        # 1. Normal state (no hover)
        await page.screenshot(path='scratch/verify_box_normal.png')
        print('Captured verify_box_normal.png')

        # 2. Hover specifically on first row, second column box
        edu_card = page.locator('#education .group').first
        if await edu_card.count() > 0:
            box = await edu_card.bounding_box()
            if box:
                # cellSize is 38
                # First row: row 0 (y = box['y'] + 19)
                # Second column: col 1 (x = box['x'] + 38 + 19 = box['x'] + 57)
                target_x = box['x'] + 57
                target_y = box['y'] + 19
                await page.mouse.move(target_x, target_y)
                await page.wait_for_timeout(600)
                await page.screenshot(path='scratch/verify_box_row1_col2_darkened.png')
                print('Captured verify_box_row1_col2_darkened.png')

                # 3. Hover on second row, fourth column box
                target_x2 = box['x'] + 38 * 3 + 19
                target_y2 = box['y'] + 38 + 19
                await page.mouse.move(target_x2, target_y2)
                await page.wait_for_timeout(600)
                await page.screenshot(path='scratch/verify_box_row2_col4_darkened.png')
                print('Captured verify_box_row2_col4_darkened.png')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())
