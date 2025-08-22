# Travel Companion - 100% Free APIs

A comprehensive travel planning application built with Next.js and TypeScript, using **only completely free APIs** with no credit cards or trials required.

## 🌟 Features

- **Interactive Maps**: Explore destinations with OpenStreetMap integration
- **Weather Information**: Real-time weather data from Open-Meteo API
- **Place Information**: Rich content from Wikipedia API
- **Trip Planning**: Create and manage travel itineraries
- **Reviews System**: Community-driven place reviews
- **Image Gallery**: Beautiful destination photos from Unsplash

## 🚀 APIs Used (All 100% Free)

| Service | API | Limits | Registration | Cost |
|---------|-----|--------|-------------|------|
| **Maps** | OpenStreetMap + Leaflet | Unlimited | None | Free |
| **Weather** | Open-Meteo | Unlimited | None | Free |
| **Places** | Wikipedia API | Unlimited | None | Free |
| **Countries** | REST Countries | Unlimited | None | Free |
| **Geocoding** | Nominatim | 1 req/sec | None | Free |
| **Images** | Unsplash (Public) | Unlimited | None | Free |
| **Images** | Unsplash API | 50/hour | Free signup | Free |
| **Database** | Supabase | 500MB | Free signup | Free |

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd travel-companion
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables (Optional)**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your optional API keys:
```env
# Optional: For higher image limits
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_key

# Optional: For user data storage
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:3000`

## 🔑 Getting API Keys (Optional)

### Unsplash API (Optional - for more images)
1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Create a free account
3. Create a new application
4. Copy your Access Key
5. Add to `.env.local` as `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`

**Limits**: 50 requests/hour (free tier)

### Supabase (Optional - for user data)
1. Go to [Supabase](https://supabase.com)
2. Create a free account
3. Create a new project
4. Go to Settings > API
5. Copy your Project URL and anon public key
6. Add to `.env.local`

**Limits**: 500MB database, 50MB file storage (free tier)

## 🌍 Core APIs Explained

### 1. Wikipedia API
- **What**: Place information, history, descriptions
- **Cost**: Completely free, no registration
- **Limits**: No official limits (be respectful)
- **Docs**: https://www.mediawiki.org/wiki/API:Main_page

### 2. Open-Meteo Weather API
- **What**: Weather forecasts, current conditions
- **Cost**: Completely free, no registration
- **Limits**: No limits
- **Docs**: https://open-meteo.com/en/docs

### 3. OpenStreetMap + Leaflet
- **What**: Interactive maps, map tiles
- **Cost**: Completely free, no registration
- **Limits**: No limits (fair use)
- **Docs**: https://leafletjs.com/

### 4. REST Countries API
- **What**: Country information, flags, currencies
- **Cost**: Completely free, no registration
- **Limits**: No limits
- **Docs**: https://restcountries.com/

### 5. Nominatim Geocoding
- **What**: Address to coordinates conversion
- **Cost**: Completely free, no registration
- **Limits**: 1 request per second
- **Docs**: https://nominatim.org/release-docs/latest/api/

## 📁 Project Structure

```
travel-companion/
├── app/                    # Next.js 13+ app directory
│   ├── page.tsx           # Home page
│   ├── explore/           # Map exploration
│   ├── city/[slug]/       # City details
│   ├── place/[slug]/      # Place details
│   ├── monument/[slug]/   # Monument details
│   ├── hotels/            # Hotel information
│   ├── itinerary/         # Trip planning
│   ├── profile/           # User profile
│   └── reviews/           # Reviews system
├── components/            # Reusable components
│   ├── Map.tsx           # Interactive map
│   ├── WeatherWidget.tsx # Weather display
│   ├── PlaceCard.tsx     # Place preview cards
│   └── SearchBar.tsx     # Search functionality
├── lib/                  # API integration
│   ├── wiki.ts          # Wikipedia API
│   ├── weather.ts       # Weather API
│   ├── geocoding.ts     # Location services
│   ├── countries.ts     # Country data
│   └── unsplash.ts      # Image services
├── types/               # TypeScript definitions
└── public/             # Static assets
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Works great with static export
- **Railway**: Good for full-stack apps
- **Render**: Free tier available

## 🔧 Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding New Features
1. Create components in `/components`
2. Add API integrations in `/lib`
3. Define types in `/types`
4. Create pages in `/app`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Verify your API keys are correct
3. Ensure you're using Node.js 18+
4. Check the browser console for errors

## 🎯 Roadmap

- [ ] Offline map support
- [ ] Advanced trip planning
- [ ] Social features
- [ ] Mobile app
- [ ] Multi-language support

---

**Built with ❤️ using 100% free APIs**