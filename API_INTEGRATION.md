# 🔌 Frontend API Integration Guide

This document describes how the frontend connects with the backend API.

## 📋 Base Configuration

```typescript
// src/lib/axios.ts
BASE_URL: http://localhost:5000/api/v1
TIMEOUT: 30 seconds
```

Environment variable: `NEXT_PUBLIC_API_URL`

## 🔐 Authentication

### Token Management
- Tokens are stored in Redux state and httpOnly cookies
- Axios interceptor automatically adds token to all requests
- On 401 response, token is cleared and user redirected to login

### Request Header
```
Authorization: Bearer <token>
```

## 📡 API Endpoints Reference

### AUTH ENDPOINTS

#### Register
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "firstName": string,
  "lastName": string,
  "email": string,
  "password": string
}

Response:
{
  "success": boolean,
  "message": string,
  "user": { _id, firstName, lastName, email, isVerified },
  "token": string,
  "refreshToken"?: string
}
```

**Frontend Usage:**
```typescript
import { useRegister } from "@/hooks/useAuthQuery";

const { mutate: register, isPending } = useRegister();

register(
  { firstName, lastName, email, password },
  {
    onSuccess: (response) => {
      // Handle success
      dispatch(setAuth({
        user: response.user,
        token: response.token
      }));
    },
    onError: (error) => {
      // Handle error
    }
  }
);
```

#### Login
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": string,
  "password": string
}

Response:
{
  "success": boolean,
  "message": string,
  "user": { _id, firstName, lastName, email, isVerified },
  "token": string,
  "refreshToken"?: string
}
```

**Frontend Usage:**
```typescript
import { useLogin } from "@/hooks/useAuthQuery";

const { mutate: login, isPending } = useLogin();

login(
  { email, password },
  {
    onSuccess: (response) => {
      dispatch(setAuth({
        user: response.user,
        token: response.token
      }));
    }
  }
);
```

#### Verify Email
```
POST /api/v1/auth/verify
Content-Type: application/json

{
  "token": string
}

Response:
{
  "success": boolean,
  "message": string,
  "user": User
}
```

#### Forgot Password
```
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": string
}

Response:
{
  "success": boolean,
  "message": string
}
```

#### Reset Password
```
POST /api/v1/auth/reset-password
Content-Type: application/json

{
  "token": string,
  "newPassword": string
}

Response:
{
  "success": boolean,
  "message": string
}
```

---

### ITINERARY ENDPOINTS

#### Get All User Itineraries
```
GET /api/v1/itineraries
Headers: Authorization: Bearer <token>

Response:
{
  "success": boolean,
  "message": string,
  "data": Itinerary[],
  "count": number
}
```

**Frontend Usage:**
```typescript
import { useUserItineraries } from "@/hooks/useItineraryQuery";

const { data: itinerariesResponse, isLoading, error } = useUserItineraries();
const itineraries = itinerariesResponse?.data || [];
```

#### Create Itinerary (Manual)
```
POST /api/v1/itineraries
Headers: Authorization: Bearer <token>
Content-Type: application/json

{
  "destination": string,
  "startDate": string (ISO),
  "endDate": string (ISO),
  "budget"?: number,
  "travelStyle"?: "budget" | "comfort" | "luxury",
  "preferences"?: string[],
  "useAI"?: false
}

Response:
{
  "success": boolean,
  "message": string,
  "data": Itinerary,
  "itinerary": Itinerary
}
```

**Frontend Usage:**
```typescript
import { useCreateItinerary } from "@/hooks/useItineraryQuery";

const { mutate: createItinerary, isPending } = useCreateItinerary();

createItinerary(
  {
    destination: "Paris",
    startDate: "2024-06-01",
    endDate: "2024-06-07",
    travelStyle: "comfort",
    preferences: ["museums", "cafes"]
  },
  {
    onSuccess: (response) => {
      router.push(`/itineraries/${response._id}`);
    }
  }
);
```

#### Generate AI Itinerary
```
POST /api/v1/itineraries/generate
Headers: Authorization: Bearer <token>
Content-Type: application/json

{
  "destination": string,
  "startDate": string (ISO),
  "endDate": string (ISO),
  "budget"?: number,
  "travelStyle": "budget" | "comfort" | "luxury",
  "preferences"?: string[],
  "numberOfDays": number
}

Response:
{
  "success": boolean,
  "message": string,
  "data": Itinerary,
  "itinerary": Itinerary
}
```

**Frontend Usage:**
```typescript
import { useGenerateAIItinerary } from "@/hooks/useItineraryQuery";

const { mutate: generateAI, isPending } = useGenerateAIItinerary();

generateAI(
  {
    destination: "Tokyo",
    startDate: "2024-07-01",
    endDate: "2024-07-10",
    travelStyle: "luxury",
    numberOfDays: 10
  },
  {
    onSuccess: (response) => {
      router.push(`/itineraries/${response._id}`);
    }
  }
);
```

#### Get Specific Itinerary
```
GET /api/v1/itineraries/:id
Headers: Authorization: Bearer <token>

Response:
{
  "success": boolean,
  "message": string,
  "data": Itinerary,
  "itinerary": Itinerary
}
```

**Frontend Usage:**
```typescript
import { useItinerary } from "@/hooks/useItineraryQuery";

const { data: response, isLoading } = useItinerary(id);
const itinerary = response?.data || response?.itinerary;
```

#### Update Itinerary
```
PUT /api/v1/itineraries/:id
Headers: Authorization: Bearer <token>
Content-Type: application/json

{
  "destination"?: string,
  "startDate"?: string (ISO),
  "endDate"?: string (ISO),
  "budget"?: number,
  "travelStyle"?: "budget" | "comfort" | "luxury",
  "preferences"?: string[],
  "dayItineraries"?: DayItinerary[],
  "aiNotes"?: string
}

Response:
{
  "success": boolean,
  "message": string,
  "data": Itinerary
}
```

**Frontend Usage:**
```typescript
import { useUpdateItinerary } from "@/hooks/useItineraryQuery";

const { mutate: updateItinerary, isPending } = useUpdateItinerary();

updateItinerary(
  {
    id: itineraryId,
    data: { budget: 5000 }
  },
  { onSuccess: () => { /* ... */ } }
);
```

#### Delete Itinerary
```
DELETE /api/v1/itineraries/:id
Headers: Authorization: Bearer <token>

Response:
{
  "success": boolean,
  "message": string
}
```

**Frontend Usage:**
```typescript
import { useDeleteItinerary } from "@/hooks/useItineraryQuery";

const { mutate: deleteItinerary, isPending } = useDeleteItinerary();

deleteItinerary(itineraryId, {
  onSuccess: () => router.push("/itineraries")
});
```

---

### ACTIVITY ENDPOINTS

#### Add Activity to Day
```
POST /api/v1/itineraries/:id/days/:dayNumber/activities
Headers: Authorization: Bearer <token>
Content-Type: application/json

{
  "name": string,
  "description": string,
  "time": string (HH:MM),
  "duration": number (minutes),
  "location": {
    "name": string,
    "latitude": number,
    "longitude": number
  },
  "category": "attraction" | "dining" | "accommodation" | "transport" | "shopping" | "activity",
  "estimatedCost"?: number,
  "notes"?: string
}

Response:
{
  "success": boolean,
  "data": Itinerary
}
```

**Frontend Usage:**
```typescript
import { useAddActivity } from "@/hooks/useItineraryQuery";

const { mutate: addActivity } = useAddActivity();

addActivity({
  itineraryId: "123",
  dayNumber: 1,
  activity: {
    name: "Eiffel Tower",
    description: "Visit the iconic Eiffel Tower",
    time: "09:00",
    duration: 120,
    location: { name: "Eiffel Tower, Paris", latitude: 48.8584, longitude: 2.2945 },
    category: "attraction"
  }
});
```

#### Update Activity
```
PUT /api/v1/itineraries/:id/days/:dayNumber/activities/:activityId
Headers: Authorization: Bearer <token>
Content-Type: application/json

{ Activity fields }

Response: { success, data: Itinerary }
```

#### Delete Activity
```
DELETE /api/v1/itineraries/:id/days/:dayNumber/activities/:activityId
Headers: Authorization: Bearer <token>

Response: { success, data: Itinerary }
```

---

## 📊 Data Types

### User
```typescript
{
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}
```

### Itinerary
```typescript
{
  _id?: string;
  userId?: string;
  destination: string;
  coordinates: {
    name: string;
    latitude: number;
    longitude: number;
  };
  startDate: string; // ISO date
  endDate: string; // ISO date
  duration: number; // days
  dayItineraries: DayItinerary[];
  budget?: number;
  travelStyle?: "budget" | "comfort" | "luxury";
  preferences?: string[];
  aiGenerated: boolean;
  aiNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### DayItinerary
```typescript
{
  day: number;
  date: string; // ISO date
  weather?: {
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    icon: string;
  };
  activities: Activity[];
  summary?: string;
}
```

### Activity
```typescript
{
  id?: string;
  _id?: string;
  name: string;
  description: string;
  time: string; // HH:MM
  duration: number; // minutes
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
  category: "attraction" | "dining" | "accommodation" | "transport" | "shopping" | "activity";
  estimatedCost?: number;
  notes?: string;
}
```

---

## ⚠️ Error Handling

All API responses include error information:

```typescript
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

Axios interceptor automatically handles:
- **401 Unauthorized**: Clears token and redirects to login
- **403 Forbidden**: Redirects to login
- **500 Server Error**: Returned to component for UI handling

---

## 🔄 Common Patterns

### Query Pattern (GET requests)
```typescript
const { data, isLoading, error } = useUserItineraries();

if (isLoading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
return <ItinerariesList data={data} />;
```

### Mutation Pattern (POST/PUT/DELETE)
```typescript
const { mutate, isPending, isError } = useCreateItinerary();

const handleSubmit = (formData) => {
  mutate(formData, {
    onSuccess: (response) => {
      showToast("Success!", "success");
      router.push(`/itineraries/${response._id}`);
    },
    onError: (error) => {
      showToast(error.message, "error");
    }
  });
};
```

---

## 🚀 Testing API Integration

Use these tools to test endpoints:

1. **Postman**: Import API collection
2. **REST Client VSCode Extension**: Add requests to `requests.http`
3. **cURL**: Direct command line testing

Example:
```bash
# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get itineraries (with token)
curl -X GET http://localhost:5000/api/v1/itineraries \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📝 Notes

- All dates should be in ISO format (YYYY-MM-DD)
- Times should be in HH:MM format (24-hour)
- All coordinates are in decimal degrees (latitude, longitude)
- Budget amounts are in USD
- Durations (for activities) are in minutes
