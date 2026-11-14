import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1400, 'height': 900})
        await page.goto('http://localhost:5174', timeout=20000)
        await page.wait_for_timeout(3500)

        # Scroll to about section
        await page.evaluate("() => document.getElementById('about')?.scrollIntoView({ behavior: 'instant' })")
        await page.wait_for_timeout(800)

        ruler = page.locator('.cursor-ew-resize')
        if await ruler.count() > 0:
            box = await ruler.bounding_box()
            if box:
                # 1. Hover on EDUCATION (roughly 35% across)
                await page.mouse.move(box['x'] + box['width'] * 0.38, box['y'] + box['height'] / 2)
                await page.wait_for_timeout(600)
                await page.screenshot(path='scratch/verify_education_no_college.png')
                print('Captured verify_education_no_college.png')

                # 2. Hover on LOCATION (roughly 65% across)
                await page.mouse.move(box['x'] + box['width'] * 0.65, box['y'] + box['height'] / 2)
                await page.wait_for_timeout(600)
                await page.screenshot(path='scratch/verify_location_deep_brown.png')
                print('Captured verify_location_deep_brown.png')

                # 3. Hover on SPECIFICATION (roughly 90% across)
                await page.mouse.move(box['x'] + box['width'] * 0.90, box['y'] + box['height'] / 2)
                await page.wait_for_timeout(600)
                await page.screenshot(path='scratch/verify_spec_deep_brown.png')
                print('Captured verify_spec_deep_brown.png')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())
