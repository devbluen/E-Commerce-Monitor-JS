# 🛒 E-Commerce-Monitor-JS
Search engine for deals on e-commerce stores. The system notifies you directly on Discord about the promotions.

# ⚙️ How to install?
#### 1. Clone the repository
Place these commands in your PowerShell or command prompt.
```bash
git clone https://github.com/devbluen/E-Commerce-Monitor-JS
cd E-Commerce-Monitor-JS
```

#### 2. Install Packages
```bash
npm install
npx puppeteer browsers install chrome
```

#### 3. Configure environment variables
Create a `.env` file in the root folder
```bash
DISCORD_BOT_TOKEN = 
DISCORD_ROOM = 
DISCORD_MENTION_ROLE = 
DISCORD_DELAY_MESSAGE = 5
SYSTEM_LOOP = 10
PROMOTION_MINIMUM_VALUE = 30
SHOW_NAVIGATOR = false
```

#### 4. Run System
```bash
node .
```

# 📝 Packages
- Cheerio
- Discord.Js
- Puppeteer
- DotEnv

# ⚠️ Observations
Using this project on machines outside of Latin America may cause problems with the captcha system, so please be aware of this before uploading.
We also don't know how it will work outside of Windows.