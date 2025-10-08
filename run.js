#!/usr/bin/env bash
# Usage: ./run.js <url> <js-one-liner>

URL="$1"
JS_ONE_LINER="$2"

nix-shell -p python3 python3Packages.playwright --run "
# Install playwright browsers if not already installed
export PLAYWRIGHT_BROWSERS_PATH=\$HOME/.cache/ms-playwright
playwright install chromium 2>/dev/null || true

python3 - \"$URL\" \"$JS_ONE_LINER\" <<'PYTHON_SCRIPT'
import sys
import asyncio
from playwright.async_api import async_playwright

async def main():
    if len(sys.argv) < 3:
        print('Usage: ./run-playwright.sh <url> <js-one-liner>', file=sys.stderr)
        sys.exit(1)
    
    url = sys.argv[1]
    js_one_liner = sys.argv[2]
    
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            await page.goto(url)
            result = await page.evaluate(js_one_liner)
            print(result)
            await browser.close()
    except Exception as e:
        print(f'Error evaluating JavaScript: {e}', file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    asyncio.run(main())
PYTHON_SCRIPT
"
