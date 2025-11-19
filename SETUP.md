# WanderWise - Frontend

The Next.js frontend for WanderWise, an AI-powered trip planner application.

## 🚀 Features

- **AI-Powered Trip Planning**: Generate personalized itineraries using OpenRouter AI
- **Real-time Weather**: Display weather forecasts for destinations
- **Interactive Maps**: Visualize destinations with Leaflet.js
- **User Authentication**: Secure login and registration
- **Trip Management**: Create, edit, and manage multiple itineraries
- **Responsive Design**: Beautiful TailwindCSS UI for all devices

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages (login, register)
│   ├── dashboard/         # User dashboard
│   ├── itineraries/       # Itinerary pages (list, create, details)
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Landing page
│
├── components/
│   ├── layout/            # Header, Footer
│   ├── ui/                # Reusable UI components
│   │   ├── buttons/       # Button components
│   │   ├── forms/         # Input, Select, Textarea
│   │   ├── feedback/      # Toast, Spinner
│   │   ├── display/       # Card, Avatar, Badge
│   │   └── typography/    # Text styling components
│   ├── pages/             # Page-specific components
│   └── Container.tsx      # Layout wrapper
│
├── hooks/                 # React Query hooks
│   ├── useAuthQuery.ts    # Auth mutations
│   └── useItineraryQuery.ts # Itinerary queries/mutations
│
├── redux/
│   ├── slices/            # Redux state slices (auth, itinerary)
│   ├── thunks/            # Async thunks
│   ├── store.ts           # Store configuration
│   └── hooks.ts           # Typed Redux hooks
│
├── services/              # API service layer
│   ├── authService.ts
│   └── itineraryService.ts
│
├── lib/
│   ├── axios.ts           # Configured axios instance
│   ├── react-query.ts     # React Query client setup
│   └── utils.ts           # Utility functions
│
├── types/                 # TypeScript interfaces
│   ├── auth.ts
│   ├── itinerary.ts
│   ├── weather.ts
│   └── index.ts
│
├── providers/
│   └── AppProviders.tsx    # Redux + React Query providers
│
└── styles/
    └── globals.css        # Global Tailwind styles
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with TypeScript
- **Styling**: TailwindCSS + Tailwind typography
- **State Management**: Redux Toolkit + Redux Persist
- **Data Fetching**: React Query (TanStack Query)
- **HTTP Client**: Axios with interceptors
- **UI Components**: Custom components + Lucide Icons
- **Maps**: Leaflet.js (optional)

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## 🚀 Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Build

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## 📝 Key Architecture Decisions

### State Management
- **Redux**: Used for global auth state with persistence
- **React Query**: Used for server state (itineraries, API calls)
- This combination provides separation of concerns: local state vs server state

### API Integration
- **Services Layer**: All API calls go through service files
- **Axios Interceptors**: Auto-attach auth tokens, handle 401 errors
- **Error Handling**: Centralized error handling in response interceptors

### Authentication Flow
1. User logs in/registers
2. Token stored in Redux + cookies
3. Axios interceptor adds token to requests
4. On 401, token cleared and user redirected to login

### Form Handling
- Local component state for form data
- Validation before submission
- React Query mutations for async operations
- Toast notifications for feedback

## 🔑 Environment Variables

```env
# Required
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Optional
NEXT_PUBLIC_APP_NAME=WanderWise
NEXT_PUBLIC_APP_DESCRIPTION=AI-Powered Trip Planner
NEXT_PUBLIC_ENABLE_AI_GENERATION=true
```

## 📚 Component Usage Examples

### Button
```tsx
import { Button } from "@/components/ui/buttons/Button";

<Button variant="primary" size="md">
  Click me
</Button>
```

### Input
```tsx
import { Input } from "@/components/ui/forms/Input";

<Input
  label="Email"
  type="email"
  error={errors.email}
  onChange={handleChange}
/>
```

### Card
```tsx
import { Card, CardHeader, CardContent } from "@/components/ui/display/Card";

<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

## 🔗 API Endpoints Used

### Auth
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/verify` - Verify email
- `POST /api/v1/auth/forgot-password` - Forgot password
- `POST /api/v1/auth/reset-password` - Reset password

### Itineraries
- `GET /api/v1/itineraries` - Get all user itineraries
- `POST /api/v1/itineraries` - Create itinerary
- `POST /api/v1/itineraries/generate` - Generate AI itinerary
- `GET /api/v1/itineraries/:id` - Get specific itinerary
- `PUT /api/v1/itineraries/:id` - Update itinerary
- `DELETE /api/v1/itineraries/:id` - Delete itinerary
- `POST /api/v1/itineraries/:id/days/:dayNumber/activities` - Add activity
- `PUT /api/v1/itineraries/:id/days/:dayNumber/activities/:activityId` - Update activity
- `DELETE /api/v1/itineraries/:id/days/:dayNumber/activities/:activityId` - Delete activity

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🆘 Troubleshooting

### Port 3000 already in use
```bash
# Use different port
npm run dev -- -p 3001
```

### API connection issues
- Check if backend server is running on the correct port
- Verify CORS is enabled on backend
- Check `.env.local` has correct API URL

### Clear Next.js cache
```bash
rm -rf .next
npm run dev
```
