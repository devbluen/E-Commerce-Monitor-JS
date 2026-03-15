
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function getPromotions() {

    const browser = await puppeteer.launch({
        headless: true,
        slowMo: 100,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        ]
    });
    const page = await browser.newPage();

    await page.goto('https://www.terabyteshop.com.br/promocoes');
    console.log("⏳ Waiting 5 seconds on Terabyte");
    await new Promise(r => setTimeout(r, 5000));    // wait 5s

    const html = await page.content();
    const $ = cheerio.load(html);

    const products = [];

    console.log("✅ Obtaining products at terabyte");
    $('.product-item').each((index, element) => {
        const productName = $(element).find('.product-item__name').text().trim();
        const productPercent = parseInt($(element).find('.product-promo-bar__percent').text().replace("%", ""));
        const productNewPrice = $(element).find('.product-item__new-price span').text().trim();
        const productOldPrice = $(element).find('.product-item__old-price span').text().trim();
        const productImage = $(element).find('img.image-thumbnail').attr('src');
        const productLink = $(element).find('a.product-item__image').attr('href');

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

    await browser.close();
    return products;
}

module.exports = {
    getPromotions
}