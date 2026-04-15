# nextVerse

A beautiful, minimalist Quran memorization companion designed for modern learners. Practice Islamic verses with support for multiple languages, customizable fonts, and a PWA-enabled mobile experience.

## ✨ Features

- **Interactive Verse Navigation** - Navigate the Quran with intuitive prev/next controls and random verse selection
- **Multi-Language Support** - Arabic text with Bengali translation enabled by default
- **Dynamic Font Selection** - Choose from 4 professional Arabic fonts (Amiri, Al Mushaf Quran, Muhammadi, Nabi)
- **Adjustable Text Size** - Real-time font scaling with dedicated A+/A- controls
- **Practice Mode** - Toggle visibility of Surah/Ayah details for active memorization practice
- **Verse Range Restriction** - Focus your study on specific Surah ranges
- **Progressive Web App** - Install as a native app on mobile devices with offline support
- **Responsive Design** - Optimized for desktop, tablet, and mobile screens
- **Islamic Aesthetic** - Elegant emerald-gold color scheme with geometric Islamic design elements

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern browser with JavaScript enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nextVerse.git
cd next-verse

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Build for Production

```bash
npm run build
npm run start
```

## 📱 PWA Installation

The application is a Progressive Web App and can be installed on any device:

1. **Desktop (Chrome/Edge)**: Click the **Install** icon in the address bar
2. **iOS**: Tap **Share** > **Add to Home Screen**
3. **Android**: Tap menu (⋮) > **Install app**

Once installed, the app works offline with cached Quranic data.

## ⚙️ Configuration

### Settings Modal

Access settings via the ⚙️ icon to customize:

- **Bengali Translation Toggle** - Show/hide Bengali translations
- **Default Detail Visibility** - Pre-configure whether Surah/Ayah names appear
- **Arabic Font Selection** - Choose your preferred Arabic typeface with live preview
- **Surah Range Restriction** - Limit random selection to specific ranges (1-114)

### Fonts

The app includes professional Arabic fonts optimized for Quranic readability:

- **Amiri** (default) - Elegant, web-optimized classicality
- **Al Mushaf Quran** - Traditional Quran manuscript style
- **Muhammadi Quranic** - Modern calligraphic elegance  
- **Nabi** - Refined contemporary rendering

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (React 19 + Webpack)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **PWA**: [next-pwa](https://github.com/shadowwalker/next-pwa)
- **Data**: [Al-Quran API](https://alquran.cloud/) + [Quran.com API](https://quran.com/developers)
- **Language**: TypeScript
- **Deployment**: Vercel-ready

## 📚 Data Sources

- **Arabic Text & Translations**: Al-Quran Cloud API
- **Bengali Translation**: Quran.com API (Resource ID: 161)
- **Surah Metadata**: Integrated from public Quran databases

## 🚢 Deployment

### Deploy to Vercel (Recommended)

```bash
# Push to GitHub
git push origin main

# Import to Vercel
# 1. Go to vercel.com/new
# 2. Connect your GitHub repository
# 3. Vercel auto-detects Next.js configuration
# 4. Click Deploy
```

**Important**: Vercel automatically handles the `--webpack` flag configured in `package.json`, ensuring PWA compatibility.

### Environment Variables

No environment variables required for basic functionality. Future API integrations can be added in `next.config.ts`.

## 📖 Usage Examples

### Basic Workflow
1. Open the app
2. Tap the moon (🌙) or **Random** button to load a verse
3. Use **Prev/Next** to navigate sequentially
4. Tap **Show Context** to reveal Surah/Ayah details
5. Adjust font size with **A+/A-** for comfortable reading

### Practice Mode
1. Open **Settings** → Toggle **Default Show Ayah Details** OFF
2. Each verse loads with hidden details
3. Tap **Show Context** only when you want to check
4. Use **Restrict Surah Range** to focus specific portions

## 🎨 Customization

### Colors & Theme

Edit Tailwind theme variables in `src/app/globals.css`:

```css
--color-islam-emerald: #064e3b;    /* Primary color */
--color-islam-gold: #b45309;        /* Accent color */
--color-islam-cream: #fdfbf7;       /* Background */
```

### Add New Fonts

Add `.ttf` files to `public/font/` and update `src/app/globals.css`:

```css
@font-face {
  font-family: 'YourFont';
  src: url('/font/YourFont.ttf') format('truetype');
}
```

Then add to the Settings dropdown in `src/app/page.tsx`.

## 🐛 Troubleshooting

### App Not Loading?
- Clear browser cache: `Ctrl+Shift+Delete`
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Check console for errors: `F12` → Console tab

### PWA Not Installing?
- Ensure you're on **HTTPS** (required for PWA, automatic with Vercel)
- Check `public/manifest.json` exists
- Verify service worker in DevTools: `F12` → Application → Service Workers

### Fonts Not Displaying?
- Ensure `public/font/` directory contains all 3 font files
- Clear cache and restart dev server
- Check browser console for font loading errors

## 📄 License

This project is licensed under the **MIT License** - see below for details.

### MIT License

```
Copyright (c) 2026 nextVerse Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Attribution

- **Quranic Data**: Al-Quran Cloud API (Open Source)
- **Bengali Translations**: Islamic Network (quran.com)
- **Arabic Fonts**: Various open-source foundries
- **Icons**: Unicode/Emoji Standard

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- [ ] Additional language translations
- [ ] More Arabic font options
- [ ] User account sync across devices
- [ ] Memorization progress tracking
- [ ] Community verse reflections

To contribute:
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📞 Support

- **Issues**: GitHub Issues for bug reports and feature requests
- **Email**: Open GitHub discussions for questions

## 🙏 Acknowledgments

- Al-Quran Cloud for providing free Quranic data
- Islamic Network for Bengali translations
- Next.js team for the incredible framework
- Vercel for seamless deployment

---

**Made with ❤️ for Islamic learners worldwide**

*"Read in the name of your Lord" - Quran 96:1*

