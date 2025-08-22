# Travel Companion - 100% Free APIs Only

A comprehensive Next.js + TypeScript application using **only completely free APIs with no trials, no credit cards required**.

## Setup Instructions

```bash
npm create next-app@latest travel-companion --typescript --tailwind --eslint --app
cd travel-companion

npm install @types/leaflet leaflet react-leaflet lucide-react @supabase/supabase-js jspdf html2canvas date-fns react-hot-toast
```

## Environment Variables (.env.local)

```env
# 100% Free APIs - No Registration/Keys Required
# (Only add if you want higher limits)

# Optional: For higher limits (still free)
UNSPLASH_ACCESS_KEY=your_unsplash_key_optional
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
travel-companion/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Home Page
│   │   ├── explore/
│   │   │   └── page.tsx                # Explore Map Page
│   │   ├── place/
│   │   │   └── [slug]/
│   │   │       └── page.tsx            # Place Page
│   │   ├── city/
│   │   │   └── [slug]/
│   │   │       └── page.tsx            # City Page
│   │   ├── hotels/
│   │   │   └── page.tsx                # Hotels Page
│   │   ├── monument/
│   │   │   └── [slug]/
│   │   │       └── page.tsx            # Monument Page
│   │   ├── itinerary/
│   │   │   └── page.tsx                # Itinerary Builder
│   │   ├── profile/
│   │   │   └── page.tsx                # User Profile
│   │   ├── reviews/
│   │   │   └── [placeId]/
│   │   │       └── page.tsx            # Reviews Page
│   │   └── api/
│   │       ├── places/[slug]/route.ts  # Place API aggregation
│   │       ├── weather/route.ts        # Weather API
│   │       ├── geocoding/route.ts      # Location services
│   │       └── search/route.ts         # Search API
│   ├── components/
│   │   ├── Map.tsx
│   │   ├── WeatherWidget.tsx
│   │   ├── AirQualityWidget.tsx
│   │   ├── ImageGallery.tsx
│   │   ├── ItineraryPlanner.tsx
│   │   ├── PlaceCard.tsx
│   │   ├── ReviewCard.tsx
│   │   └── ...
│   ├── lib/               # helper functions for API calls
│   │   ├── wiki.ts
│   │   ├── unsplash.ts
│   │   ├── weather.ts
│   │   ├── airquality.ts
│   │   ├── geocoding.ts
│   │   └── countries.ts
│   ├── types/             # TypeScript type definitions
│   │   ├── place.ts
│   │   ├── weather.ts
│   │   ├── country.ts
│   │   └── itinerary.ts
│   └── utils/             # misc utilities
├── public/               # static assets
├── .env.local
└── package.json
```

## Pages & Features Implementation

### 1. Home Page (`/`)
**Purpose**: Entry point to inspire exploration

**Features to implement**:
- Hero search bar → search cities, countries, monuments
- Mini world map preview with trending destinations as markers
- Featured places section (curated from Wikipedia trending articles)
- Weather highlights showing popular cities today
- Call to Action "Plan your trip" button → redirects to Itinerary Builder

**APIs used**:
- Wikipedia API (completely free, no registration)
- Unsplash API (free public images, no key needed for basic use)

### 2. Explore Map Page (`/explore`)
**Purpose**: Full interactive map for filtering/searching destinations

**Features to implement**:
- React-Leaflet + OpenStreetMap tiles (completely free)
- Filters: continent, country, activity type
- Click marker → show quick card with image, summary, "View Details" button
- Search functionality across all destinations

**APIs used**:
- React-Leaflet + OpenStreetMap (completely free, unlimited)
- Wikipedia API (place info on marker click)
- REST Countries API (country data - completely free)
- Nominatim API (geocoding - free, no registration)

### 3. Place Page (`/place/[slug]`)
**Purpose**: Show comprehensive details of a selected destination

**Sections to implement**:
- Hero image (Unsplash public domain) + place name + country
- History/Summary section (Wikipedia)
- Weather forecast (Open-Meteo - no API key required)
- Basic location info and coordinates
- Related places and attractions (Wikipedia links)
- User reviews display
- "Add to itinerary" button

**APIs used**:
- Wikipedia API (place history - completely free)
- Open-Meteo API (weather - no API key required)
- Unsplash public domain images (no API key for basic use)
- REST Countries API (country information - free)

### 4. City Page (`/city/[slug]`)
**Purpose**: City-specific deep dive with local information

**Sections to implement**:
- City intro (Wikipedia summary + images)
- Basic city statistics (population, timezone from REST Countries API)
- Weather information (Open-Meteo)
- Related attractions (Wikipedia category pages)
- Suggested itineraries (user-generated from database)

**APIs used**:
- Wikipedia API (city information - free)
- REST Countries API (country/city data - free)
- Open-Meteo API (weather data - free)

### 5. Hotels Page (`/hotels`) - **SIMPLIFIED**
**Purpose**: Show basic accommodation information

**Features to implement**:
- Search functionality by city/location
- Display general hotel districts/areas for cities (from Wikipedia)
- Link to external booking sites (no API integration)
- Show city center locations and neighborhoods
- Basic travel tips for accommodation

**APIs used**:
- Wikipedia API (city districts and areas - free)
- Nominatim API (location/address lookup - free)

### 6. Monument Page (`/monument/[slug]`)
**Purpose**: Detailed information about specific monuments

**Sections to implement**:
- Hero image + monument title
- Historical background (Wikipedia)
- Location information and coordinates
- Related monuments and nearby places
- Visitor information (from Wikipedia)

**APIs used**:
- Wikipedia API (monument history - free)
- REST Countries API (country context - free)
- Nominatim API (location services - free)

### 7. Itinerary Builder (`/itinerary`)
**Purpose**: Interactive trip planning tool

**Features to implement**:
- Add places to day-by-day itinerary
- Basic trip organization
- Export to PDF functionality (client-side)
- Save itineraries to local database
- Share itineraries with other users

**APIs used**:
- Wikipedia API (place information)
- jsPDF library (client-side PDF generation)
- Internal database only (Supabase free tier)

### 8. User Profile (`/profile`)
**Purpose**: Manage user's travel data and preferences

**Features to implement**:
- View saved itineraries & favorite places
- Edit/delete user reviews
- Change profile settings and preferences
- Travel statistics and history

**APIs used**:
- Internal database only (Supabase free tier)

### 9. Reviews Page (`/reviews/[placeId]`)
**Purpose**: Community feedback and ratings system

**Features to implement**:
- Add new review form (text, star rating)
- Display reviews from other travelers
- Sort reviews by date, rating, helpfulness
- Like/helpful voting system

**APIs used**:
- Internal database only (Supabase free tier)

## 100% Free API Integration Summary

| Feature | API | Limits | Registration | Documentation |
|---------|-----|--------|-------------|---------------|
| Place Info | Wikipedia API | **No limits** | **None** | https://www.mediawiki.org/wiki/API:Main_page |
| Weather | Open-Meteo | **No limits** | **None** | https://open-meteo.com/en/docs |
| Maps | OpenStreetMap + Leaflet | **No limits** | **None** | https://leafletjs.com/ |
| Country Data | REST Countries API | **No limits** | **None** | https://restcountries.com/ |
| Geocoding | Nominatim | 1 req/sec | **None** | https://nominatim.org/release-docs/latest/api/ |
| Images | Unsplash (public) | **No limits** | **None** | https://unsplash.com/photos (public domain) |
| Images | Unsplash API | 50/hour | Free signup | https://unsplash.com/developers |
| Database | Supabase | 500MB DB | Free signup | https://supabase.com/docs |

## Key Benefits of This Approach

✅ **Zero Cost**: All APIs are completely free forever  
✅ **No Credit Cards**: No billing information required  
✅ **No Trials**: Services don't expire  
✅ **Production Ready**: Suitable for real applications  
✅ **Good Limits**: Sufficient for most travel apps  

## Usage Limits (All Reasonable for Travel Apps)

- **Open-Meteo**: Unlimited weather requests
- **Wikipedia**: Unlimited requests (be respectful)
- **Nominatim**: 1 request per second (sufficient for geocoding)
- **REST Countries**: Unlimited country data
- **OpenStreetMap**: Unlimited map tiles
- **Unsplash Public**: Unlimited (public domain images)
- **Supabase**: 500MB database, 50MB file storage

## Alternative Approaches for Hotel Data

Since there are no truly free hotel booking APIs, the app will:

1. **Use Wikipedia** for hotel district information
2. **Link to external sites** like Booking.com, Hotels.com (no API needed)
3. **Show city neighborhoods** good for accommodation
4. **Provide general guidance** rather than real-time prices

## Deployment

- **Frontend**: Vercel (free hosting for Next.js)
- **Database**: Supabase (free PostgreSQL tier)  
- **Images**: Unsplash public domain or user uploads to Supabase storage

This setup gives you a fully functional travel companion app with zero ongoing costs!