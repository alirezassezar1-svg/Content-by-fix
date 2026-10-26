# Nononick Content Studio

استودیوی تولید محتوا، سئو، تقویم محتوا و بازآفرینی (React + Vite + Express + Gemini).

یک کد، دو نوع هاست:

## ۱) GitHub Pages (استاتیک، AI داخل مرورگر)
- بیلد آماده در پوشه‌ی `docs/` است. در Settings → Pages: Branch `main` و پوشه‌ی `/docs`.
- روی دکمه‌ی **AI: OFF** (پایین-چپ) بزن و کلید Gemini را وارد کن. کلید فقط در localStorage مرورگر می‌ماند.
- بدون کلید، «موتور آفلاین استودیو» جواب می‌دهد.
- بیلد دوباره: `npm install --legacy-peer-deps && npm run build:pages`

## ۲) هاست Node.js (سرور کامل)
```
npm install --legacy-peer-deps
echo "GEMINI_API_KEY=کلید_تو" > .env
npm run build            # می‌سازد dist/
NODE_ENV=production PORT=3000 npm start
```
- روی هاست با سرور، همه‌ی `/api/*` به `server.ts` می‌رود و کلید Gemini سمت سرور (`.env`) است؛ دکمه‌ی AI لازم نیست.
- فایل `apiShim.ts` خودکار تشخیص می‌دهد سرور هست یا نه.

## ساختار
- `server.ts` — API سمت سرور (Node)
- `studioApi.ts` — همان API داخل مرورگر (پرامپت‌ها باید با server.ts هماهنگ بمانند)
- `studioEngine.ts` — موتور آفلاین مشترک بین هر دو
