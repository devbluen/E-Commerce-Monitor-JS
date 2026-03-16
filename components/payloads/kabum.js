
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function getPromotions(callback) {

    try
    {
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

        await page.goto('https://www.kabum.com.br/acabaramdechegar?page_number=1&page_size=100&facet_filters=&sort=-date_product_arrived&variant=null');
        console.log("⏳ Waiting 5 seconds on Kabum");
        await new Promise(r => setTimeout(r, 5000));    // wait 5s

        const html = await page.content();
        const $ = cheerio.load(html);

        console.log("👀 Obtaining the number of pages from the Kabum website.");
        const lastPage = $('.pagination a.page').last().text().trim();
        
        console.log(`✅ ${lastPage} pages were found on the Kabum promotions website.`);

        for (let index = 1; index < lastPage; index++) {

            console.log(`📜 Checking page ${index}/${lastPage} of the Kabum website.`);
            await page.goto(`https://www.kabum.com.br/acabaramdechegar?page_number=${index}&page_size=100&facet_filters=&sort=-date_product_arrived&variant=null`);
            await new Promise(r => setTimeout(r, 2000));    // wait 2s

            console.log(`✅ Obtaining products from the page`);
            const products = [];

            $('.productCard').each((index, element) => {
                const productOldPrice = $(element).find('.oldPriceCard').text().trim();

                if(productOldPrice) {
                    const productName = $(element).find('.nameCard').text().trim();
                    const productNewPrice = $(element).find('.priceCard').text().trim();
                    const productPercent = parseInt($(element).find('div[data-testid="discout_percentage"]').text().replace(/\D/g, ''));
                    const productImage = $(element).find('.imageCard').attr('src');
                    const productLink = `https://www.kabum.com.br${$(element).find('.productLink').attr('href')}`;
                    
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

            await callback(products);
        }

        await browser.close();
    }
    catch(error) {
        console.error("⚠️ Kabum module error", error);
    }
}

module.exports = {
    getPromotions
}