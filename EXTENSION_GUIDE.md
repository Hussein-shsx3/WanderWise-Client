# 🛠️ WanderWise Frontend - Extension Guide

This guide explains how to add new features while maintaining the architecture.

## Adding a New Feature: Step-by-Step

### Example: Add User Profile Page

#### Step 1: Create Type Definitions
**File**: `src/types/profile.ts`
```typescript
export interface UserProfile extends User {
  bio?: string;
  avatar?: string;
  preferences?: string[];
  favoriteDestinations?: string[];
}
```

#### Step 2: Create API Service
**File**: `src/services/profileService.ts`
```typescript
import axiosInstance from "@/lib/axios";
import { UserProfile } from "@/types";

export const profileService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await axiosInstance.get("/users/profile");
    return response.data.data;
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await axiosInstance.put("/users/profile", data);
    return response.data.data;
  },
};
```

#### Step 3: Create React Query Hooks
**File**: `src/hooks/useProfileQuery.ts`
```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/profileService";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => profileService.getProfile(),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UserProfile>) =>
      profileService.updateProfile(data),
    onSuccess: (newProfile) => {
      queryClient.setQueryData(["profile"], newProfile);
      // Also update Redux auth state
      dispatch(setUser(newProfile));
    },
  });
};
```

#### Step 4: Create Components
**File**: `src/components/pages/ProfileForm.tsx`
```typescript
"use client";

import { Input } from "@/components/ui/forms/Input";
import { Button } from "@/components/ui/buttons/Button";
import { useUpdateProfile } from "@/hooks/useProfileQuery";

export default function ProfileForm({ profile }) {
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [formData, setFormData] = useState(profile);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Bio"
        value={formData.bio}
        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
      />
      <Button type="submit" disabled={isPending}>
        Update Profile
      </Button>
    </form>
  );
}
```

#### Step 5: Create Page
**File**: `src/app/profile/page.tsx`
```typescript
"use client";

import { Container } from "@/components/Container";
import { useProfile } from "@/hooks/useProfileQuery";
import { Spinner } from "@/components/ui/feedback/Spinner";
import ProfileForm from "@/components/pages/ProfileForm";

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();

  if (isLoading) return <Spinner />;

  return (
    <Container maxWidth="md" className="py-12">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <ProfileForm profile={profile} />
    </Container>
  );
}
```

#### Step 6: Update Navigation
**File**: `src/components/layout/Header.tsx` - Add link to profile page

---

## Adding a New Redux Slice

### Example: Add Preferences Slice

**File**: `src/redux/slices/preferencesSlice.ts`
```typescript
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Preference {
  id: string;
  name: string;
  selected: boolean;
}

interface PreferencesState {
  preferences: Preference[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PreferencesState = {
  preferences: [],
  isLoading: false,
  error: null,
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setPreferences: (state, action: PayloadAction<Preference[]>) => {
      state.preferences = action.payload;
    },
    togglePreference: (state, action: PayloadAction<string>) => {
      const pref = state.preferences.find((p) => p.id === action.payload);
      if (pref) pref.selected = !pref.selected;
    },
  },
});

export default preferencesSlice.reducer;
export const { setPreferences, togglePreference } = preferencesSlice.actions;
```

**Update**: `src/redux/store.ts`
```typescript
import preferencesReducer from "./slices/preferencesSlice";

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    itinerary: itineraryReducer,
    preferences: preferencesReducer, // Add this
  },
  // ...
});
```

---

## Adding a New UI Component

### Example: Badge Component

**File**: `src/components/ui/display/Badge.tsx`
```typescript
"use client";

import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "danger" | "warning";
  size?: "sm" | "md" | "lg";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-blue-100 text-blue-800",
      secondary: "bg-gray-100 text-gray-800",
      success: "bg-green-100 text-green-800",
      danger: "bg-red-100 text-red-800",
      warning: "bg-yellow-100 text-yellow-800",
    };

    const sizes = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1.5 text-sm",
      lg: "px-4 py-2 text-base",
    };

    return (
      <span
        ref={ref}
        className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
export { Badge };
```

---

## Adding API Error Handling

### Custom Error Handler Hook

**File**: `src/hooks/useErrorHandler.ts`
```typescript
import { useCallback } from "react";
import axios from "axios";

export const useErrorHandler = () => {
  return useCallback((error: unknown) => {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      const statusCode = error.response?.status;

      switch (statusCode) {
        case 400:
          return { type: "validation", message };
        case 401:
          return { type: "unauthorized", message };
        case 403:
          return { type: "forbidden", message };
        case 404:
          return { type: "notfound", message };
        case 500:
          return { type: "server", message };
        default:
          return { type: "error", message };
      }
    }

    return { type: "error", message: "An unknown error occurred" };
  }, []);
};
```

**Usage**:
```typescript
const handleError = useErrorHandler();

catch ((error) => {
  const { type, message } = handleError(error);
  showToast(message, type === "error" ? "error" : "info");
});
```

---

## Adding Form Validation Utilities

**File**: `src/lib/validators.ts`
```typescript
export const validators = {
  email: (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) ? null : "Invalid email format";
  },

  password: (password: string) => {
    if (password.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(password)) return "Must contain uppercase letter";
    if (!/[0-9]/.test(password)) return "Must contain number";
    return null;
  },

  required: (value: string) => {
    return value.trim() ? null : "This field is required";
  },

  minLength: (value: string, min: number) => {
    return value.length >= min ? null : `Must be at least ${min} characters`;
  },

  url: (url: string) => {
    try {
      new URL(url);
      return null;
    } catch {
      return "Invalid URL format";
    }
  },
};
```

**Usage**:
```typescript
const validateEmail = (email: string) => {
  return validators.email(email);
};
```

---

## Adding Testing

### Example: Component Test

**File**: `src/components/ui/buttons/__tests__/Button.test.tsx`
```typescript
import { render, screen } from "@testing-library/react";
import { Button } from "../Button";

describe("Button", () => {
  it("renders button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("applies correct variant styles", () => {
    const { container } = render(<Button variant="primary">Primary</Button>);
    expect(container.querySelector(".bg-blue-600")).toBeInTheDocument();
  });

  it("disables button when loading", () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

---

## Adding Environment-Specific Logic

### Feature Flags

**File**: `src/lib/featureFlags.ts`
```typescript
export const featureFlags = {
  enableAIGeneration: process.env.NEXT_PUBLIC_ENABLE_AI_GENERATION === "true",
  enableMapView: process.env.NEXT_PUBLIC_ENABLE_MAP_VIEW === "true",
  enableSocialSharing: process.env.NEXT_PUBLIC_ENABLE_SOCIAL === "true",
};
```

**Usage**:
```typescript
{featureFlags.enableAIGeneration && (
  <Button onClick={generateWithAI}>Generate with AI</Button>
)}
```

---

## Adding Third-Party Integrations

### Example: Add Leaflet Maps

```bash
npm install leaflet react-leaflet
npm install --save-dev @types/leaflet
```

**File**: `src/components/ui/display/Map.tsx`
```typescript
"use client";

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./MapClient"), {
  loading: () => <div className="bg-gray-200 h-full rounded" />,
  ssr: false, // Disable SSR for Leaflet
});

export { MapComponent as Map };
```

**File**: `src/components/ui/display/MapClient.tsx`
```typescript
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function MapClient() {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[51.505, -0.09]}>
        <Popup>Your destination</Popup>
      </Marker>
    </MapContainer>
  );
}
```

---

## Best Practices Summary

✅ **Always use services layer** for API calls
✅ **Create hooks** for reusable logic
✅ **Keep components small and focused** - one responsibility
✅ **Use TypeScript** - define interfaces for all data
✅ **Handle errors gracefully** - show user feedback
✅ **Test critical paths** - especially business logic
✅ **Document complex logic** - add comments
✅ **Keep Redux minimal** - only global state
✅ **Use React Query** - for server state
✅ **Reuse components** - don't duplicate UI

---

## Folder Organization Tips

When adding new features:

1. Create feature folder in `src/components/pages/FeatureName/`
2. Create service in `src/services/featureService.ts`
3. Create hooks in `src/hooks/useFeatureQuery.ts`
4. Create types in `src/types/feature.ts`
5. Create page in `src/app/feature/` or `src/app/feature/pages/`
6. Create Redux slice if needed in `src/redux/slices/featureSlice.ts`

This keeps related code organized and easy to find.

---

## Common Patterns Recap

### API Call Pattern
```
Component → Hook → Redux/React Query → Service → Axios → API
                          ↓
                   State Update
                          ↓
                   Component Re-render
```

### Form Pattern
```
Form State (useState)
    ↓
User Input → handleChange
    ↓
Form Submit → Validation
    ↓
Hook Mutation → Service API Call
    ↓
onSuccess: Update Redux/RQ cache
onError: Show Toast
```

---

## Troubleshooting Extension

**Issue**: New API call returns 401
- Check token is in cookies/Redux
- Verify axios interceptor is adding Authorization header
- Test with Postman to confirm endpoint works

**Issue**: State not persisting
- Check Redux Persist configuration in store.ts
- Verify whitelist includes your slice
- Clear localStorage if testing

**Issue**: Component not updating
- Check React Query cache invalidation
- Verify Redux state is updated
- Use React DevTools to debug state

---

Enjoy building! 🚀
