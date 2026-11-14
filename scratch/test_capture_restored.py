import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1400, 'height': 900})
        await page.goto('http://localhost:5174', timeout=20000)
        # Wait for loading screen to complete
        await page.wait_for_timeout(3500)

        # Scroll to education section
        await page.evaluate("() => document.getElementById('education')?.scrollIntoView({ behavior: 'instant' })")
        await page.wait_for_timeout(1000)
        await page.screenshot(path='scratch/verify_credentials_restored.png')
        print('Captured verify_credentials_restored.png')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())
