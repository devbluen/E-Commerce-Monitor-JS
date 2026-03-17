
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const path = require('path');

async function getPromotions() {

    let browser;
    try
    {
        browser = await puppeteer.launch({
            headless: process.env.SHOW_NAVIGATOR !== "true",
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--disable-gpu',
                '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            ]
        });
        const page = await browser.newPage();

        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['image', 'font', 'stylesheet', 'media'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

        await page.goto('https://www.terabyteshop.com.br/promocoes', { 
            waitUntil: 'domcontentloaded', 
            timeout: 90000 
        });

        console.log("⏳ Waiting 5 seconds on Terabyte");
        await new Promise(r => setTimeout(r, 5000));    // wait 5s

        const html = await page.content();
        const $ = cheerio.load(html);

        const products = [];

        console.log("✅ Obtaining products at terabyte");
        $('.product-item').each((index, element) => {
            const el = $(element);

            const productName = el.find('.product-item__name').text().trim();
            const productPercent = parseInt(el.find('.product-promo-bar__percent').text().replace("%", ""));
            const productNewPrice = el.find('.product-item__new-price span').text().trim();
            const productOldPrice = el.find('.product-item__old-price span').text().trim();
            const productImage = el.find('img.image-thumbnail').attr('src');
            const productLink = el.find('a.product-item__image').attr('href');

            if(productPercent && productPercent > 0) {
                products.push({
                    name: productName,
                    percent: productPercent,
                    new_price: productNewPrice,
                    old_price: productOldPrice,
                    image: productImage,
                    link: productLink
                });
            }
        });
        return products;
    }
    catch(error) {
        console.error("⚠️ Terabyte module error", error);
        return [];
    }
    finally {
        if(browser)
            await browser.close().catch(e => console.error("Error closing browser:", e.message));
    }
}

module.exports = {
    getPromotions
}