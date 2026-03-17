
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const path = require('path');

async function getPromotions(callback) {

    let browser;
    try
    {
        browser = await puppeteer.launch({
            headless: !process.env.SHOW_NAVIGATOR,
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
            const url = req.url();
            if (url.includes('images.kabum.com.br')) {
                req.continue();
            } else if (['image', 'font', 'media'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

        await page.goto('https://www.kabum.com.br/acabaramdechegar?page_number=1&page_size=100&facet_filters=&sort=-date_product_arrived&variant=null', { 
            waitUntil: 'domcontentloaded', 
            timeout: 90000 
        });

        console.log("⏳ Waiting 5 seconds on Kabum");
        await new Promise(r => setTimeout(r, 5000));    // wait 5s

        const html = await page.content();
        const $ = cheerio.load(html);

        console.log("👀 Obtaining the number of pages from the Kabum website.");
        const lastPage = $('.pagination a.page').last().text().trim();
        
        console.log(`✅ ${lastPage} pages were found on the Kabum promotions website.`);

        for (let index = 1; index < lastPage; index++) {

            console.log(`📜 Checking page ${index}/${lastPage} of the Kabum website.`);

            await page.goto(`https://www.kabum.com.br/acabaramdechegar?page_number=${index}&page_size=100&facet_filters=&sort=-date_product_arrived&variant=null`, { 
                waitUntil: 'domcontentloaded', 
                timeout: 90000 
            });

            await new Promise(r => setTimeout(r, 2000));    // wait 2s

            console.log(`✅ Obtaining products from the page`);
            const products = [];

            $('.product-item, a[href*="/produto/"]').each((index, element) => {
                const el = $(element);
                
                let productImage = el.find('img').attr('src');
                if (!productImage) productImage = el.find('img').attr('data-src');
                if (!productImage || productImage.includes('data:image')) {
                    const srcset = el.find('img').attr('srcset');
                    if (srcset) {
                        productImage = srcset.split(' ')[0];
                    }
                }
                
                const productName = el.find('span.text-sm.line-clamp-2').text().trim();
                const productOldPrice = el.find('.line-through').text().replace(" ", "");
                const productNewPrice = `R$${el.find('span.text-base.font-semibold.text-gray-800').last().text().trim()}`;
                const productPercent = parseInt(el.find('span:contains("%")').text().replace(/\D/g, '')) || 0;
                const productLink = `https://www.kabum.com.br${el.attr('href')}`;

                // Old
                // const productOldPrice = $(element).find('.oldPriceCard').text().trim();
                // const productLink = `https://www.kabum.com.br${$(element).find('.productLink').attr('href')}`;
                // const productName = $(element).find('.nameCard').text().trim();
                // const productNewPrice = $(element).find('.priceCard').text().trim();
                // const productPercent = parseInt($(element).find('div[data-testid="discout_percentage"]').text().replace(/\D/g, ''));
                // const productImage = $(element).find('.imageCard').attr('src');
                
                if(productName && productNewPrice) {
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

            console.log(products);
            await callback(products);
        }
    }
    catch(error) {
        console.error("⚠️ Kabum module error", error);
    }
    finally {
        if(browser)
            await browser.close().catch(e => console.error("Error closing browser:", e.message));
    }
}

module.exports = {
    getPromotions
}