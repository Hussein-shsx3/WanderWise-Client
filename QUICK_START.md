# 🚀 WanderWise Frontend - Quick Start Guide

## What Was Built

A complete Next.js frontend for the WanderWise AI Trip Planner following your specified architecture.

## ✅ What's Included

### 📁 Project Structure
- ✅ Organized directory structure matching your specifications
- ✅ TypeScript for type safety
- ✅ React Server Components where appropriate

### 🔐 Authentication
- ✅ Login page with form validation
- ✅ Registration page with password confirmation
- ✅ Redux state management with persistence
- ✅ Axios interceptors for auth tokens
- ✅ Protected routes via Redux state check

### 🏠 Pages
- ✅ Landing page with hero section and features
- ✅ Dashboard with trip cards and quick actions
- ✅ Create itinerary page (AI & Manual modes)
- ✅ View itinerary details with daily breakdown
- ✅ View all itineraries list

### 🎨 UI Components
**Buttons & Forms**
- ✅ Button component (primary, secondary, danger, outline, ghost)
- ✅ Input component with validation
- ✅ Select dropdown component
- ✅ Textarea component

**Feedback**
- ✅ Toast notifications (success, error, info, warning)
- ✅ Spinner/Loading component

**Layout**
- ✅ Card component (Card, CardHeader, CardContent, CardFooter)
- ✅ Container wrapper component
- ✅ Header/Navigation component
- ✅ Footer component

### 🔌 API Integration
- ✅ Axios instance with interceptors
- ✅ Auth service (login, register, verify, forgot password)
- ✅ Itinerary service (CRUD, AI generation, activities)
- ✅ Automatic token handling
- ✅ Error interceptors

### 📊 State Management
- ✅ Redux Toolkit with TypeScript
- ✅ Redux Persist for auth persistence
- ✅ React Query for server state
- ✅ Auth slice (user, token, loading, error states)
- ✅ Itinerary slice (list, current, loading, error states)
- ✅ Async thunks for auth operations
- ✅ Custom hooks for both Redux and React Query

### ⚙️ Configuration
- ✅ Environment variables setup (.env.example, .env.local)
- ✅ React Query client configuration
- ✅ Redux store with persistence
- ✅ AppProviders component

## 🏃 Getting Started

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env.local
# Edit .env.local - set NEXT_PUBLIC_API_URL to your backend URL
```

### 3. Start Development
```bash
npm run dev
```

Visit: http://localhost:3000

### 4. Key Routes
- `/` - Landing page
- `/auth/register` - Sign up
- `/auth/login` - Sign in
- `/dashboard` - Dashboard (requires auth)
- `/itineraries` - All itineraries (requires auth)
- `/itineraries/create` - Create new itinerary (requires auth)
- `/itineraries/[id]` - View itinerary details (requires auth)

## 📝 API Connection

The frontend is pre-configured to connect to your Express backend at `http://localhost:5000/api/v1`.

Update `.env.local` if your server runs on a different port:
```env
NEXT_PUBLIC_API_URL=http://localhost:YOUR_PORT/api/v1
```

## 🔄 Data Flow

1. **User Registration/Login**
   - Form submission → Auth service → API call
   - Response token stored in Redux + cookies
   - Axios interceptor adds token to all requests

2. **Fetching Itineraries**
   - useUserItineraries hook → React Query → itineraryService
   - Cached locally, refetched on mutations
   - Redux also tracks current itinerary

3. **Creating Itinerary**
   - Form submission → useCreateItinerary → itineraryService
   - Request sent with auth token (auto-added by interceptor)
   - Response updates React Query cache
   - Redirects to itinerary details page

## 🎯 Key Files to Review

### Core Setup
- `src/redux/store.ts` - Redux store configuration
- `src/lib/axios.ts` - Axios instance with interceptors
- `src/lib/react-query.ts` - React Query configuration
- `src/providers/AppProviders.tsx` - Provider wrapper

### Services
- `src/services/authService.ts` - All auth API calls
- `src/services/itineraryService.ts` - All itinerary API calls

### Hooks
- `src/hooks/useAuthQuery.ts` - Auth mutations
- `src/hooks/useItineraryQuery.ts` - Itinerary queries and mutations

### Pages
- `src/app/page.tsx` - Landing page
- `src/app/auth/login/page.tsx` - Login page
- `src/app/auth/register/page.tsx` - Registration page
- `src/app/dashboard/page.tsx` - Dashboard
- `src/app/itineraries/create/page.tsx` - Create itinerary
- `src/app/itineraries/[id]/page.tsx` - View itinerary

## 🔧 Next Steps

### To Integrate More Features:

1. **Add Leaflet Maps**
   ```bash
   npm install leaflet react-leaflet
   npm install --save-dev @types/leaflet
   ```
   Then create map components in `src/components/ui/display/Map.tsx`

2. **Add Weather Visualization**
   - Create weather service in `src/services/weatherService.ts`
   - Add weather API integration

3. **Add More Validations**
   - Create validation utilities in `src/lib/validators.ts`
   - Apply to forms

4. **Add Testing**
   ```bash
   npm install --save-dev jest @testing-library/react @testing-library/jest-dom
   ```

5. **Add E2E Tests**
   ```bash
   npm install --save-dev cypress
   ```

## 📦 Dependencies Installed

- `next` - Framework
- `react` & `react-dom` - UI library
- `@reduxjs/toolkit` - State management
- `react-redux` - React bindings for Redux
- `redux-persist` - Redux persistence
- `@tanstack/react-query` - Server state management
- `axios` - HTTP client
- `js-cookie` - Cookie management
- `lucide-react` - Icons
- `tailwindcss` - Styling

## ⚠️ Important Notes

1. **TypeScript**: Project uses strict TypeScript. Fix any type errors in ESLint.

2. **js-cookie Types**: May show type warning. Add if needed:
   ```bash
   npm install --save-dev @types/js-cookie
   ```

3. **CORS**: Ensure backend has CORS enabled for `http://localhost:3000`

4. **Token Expiry**: Currently tokens don't auto-refresh. Add refresh token logic if needed in `src/lib/axios.ts`

## 🌍 Environment Setup for Different Stages

**Development:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

**Production (Render):**
```env
NEXT_PUBLIC_API_URL=https://your-render-app.onrender.com/api/v1
```

## 📚 Architecture Highlights

✨ **Separation of Concerns**
- API calls in services
- State management in Redux/React Query
- UI components are presentational
- Hooks handle business logic

✨ **Reusable Components**
- All UI components are generic and themed
- Easy to apply global style changes
- Consistent design system

✨ **Type Safety**
- Full TypeScript coverage
- Interfaces for all data structures
- Redux hooks are typed

✨ **Best Practices**
- Client-side form validation
- Error handling with user feedback
- Optimistic updates with React Query
- Protected routes with Redux state checks

## 🎉 You're Ready!

The frontend is fully set up and ready to connect with your Express backend. Follow the database and server setup, then start building amazing features!

Happy coding! 🚀
