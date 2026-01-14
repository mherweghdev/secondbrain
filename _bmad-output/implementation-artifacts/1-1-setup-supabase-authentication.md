# Story 1.1: Setup Supabase Authentication

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to authenticate with email and password using Supabase Auth,
so that my notes are secure and accessible only to me.

## Acceptance Criteria

1. **Given** Supabase project is created and credentials are configured
2. **When** I visit the application for the first time
3. **Then** I am redirected to a login/signup page
4. **And** I can sign up with email and password (bcrypt hashing)
5. **And** I can log in with valid credentials and receive a session token
6. **And** Session persists across page refreshes (via Cookies)
7. **And** Session expires after 30 days of inactivity (NFR-S3)
8. **And** I can log out and session is cleared from browser storage

## Technical Requirements

- **Authentication Provider**: Supabase Auth (Email/Password)
- **Session Management**: Secure HttpOnly Cookies (handled by `@supabase/ssr`)
- **Protected Routes**: Middleware (`src/middleware.ts`) must protect all `/app/*` routes
- **Redirects**:
  - Unauthenticated users trying to access `/app` -> redirect to `/login`
  - Authenticated users trying to access `/login` or `/signup` -> redirect to `/app`
- **UI Components**:
  - Login Page: `src/app/(auth)/login/page.tsx`
  - Signup Page: `src/app/(auth)/signup/page.tsx`
  - Feedback: Show loading states and error messages (invalid credentials, rate limited)
- **Validation**: Use Zod for email/password validation on client/server actions

## Architecture Compliance

- **Framework**: Next.js 15 App Router
- **Library**: **CRITICAL UPDATE**: Use `@supabase/ssr` instead of the deprecated `@supabase/auth-helpers-nextjs` defined in architecture.
- **Styling**: Tailwind CSS
- **State Management**:
  - Server: Cookies for session
  - Client: Optional Zustand store for user profile if needed, or simple React Context/Hook provided by Supabase
- **Directory Structure**:
  - `src/middleware.ts`: Auth protection logic
  - `src/lib/supabase/`: Clients (server, client, middleware)
  - `src/app/(auth)/`: Auth route group

## Tasks / Subtasks

- [x] Configure Environment Variables
  - [x] Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` to `.env.local`
- [x] Install Dependencies
  - [x] `npm install @supabase/ssr @supabase/supabase-js`
- [x] Implement Supabase Clients
  - [x] `src/lib/supabase/client.ts` (Browser Client)
  - [x] `src/lib/supabase/server.ts` (Server Client - Cookie handling)
  - [x] `src/lib/supabase/middleware.ts` (Middleware Client - Token refresh)
- [x] Create Middleware
  - [x] Implement `src/middleware.ts` to refresh session and protect routes
- [x] Build Auth Pages
  - [x] Create `src/app/(auth)/layout.tsx` (Simple centered layout)
  - [x] Create `src/app/(auth)/login/page.tsx` with Form
  - [x] Create `src/app/(auth)/signup/page.tsx` with Form
  - [x] Implement Server Actions for Login/Signup (Next.js 15 pattern)
- [x] Add Navigation Header (Logout button)
  - [x] Create `src/components/ui/LogoutButton.tsx` (using Server Action)
- [x] Verify functionality
  - [x] Test Sign Up flow
  - [x] Test Login flow
  - [x] Test Middleware protection (try accessing `/app` incognito)

## Dev Context

### Latest Tech Information (@supabase/ssr)

**CRITICAL ARCHITECTURE OVERRIDE**: The `core-architectural-decisions.md` specifies `@supabase/auth-helpers-nextjs`. This is DEPRECATED.
You MUST use `@supabase/ssr` which is the new standard for Next.js 15.

**Key patterns for `@supabase/ssr`:**

1. **Creating a Server Client** (for Server Components/Actions):

   ```typescript
   import { createServerClient, type CookieOptions } from "@supabase/ssr";
   import { cookies } from "next/headers";

   export function createClient() {
     const cookieStore = cookies();
     return createServerClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
       {
         cookies: {
           get(name: string) {
             return cookieStore.get(name)?.value;
           },
           set(name: string, value: string, options: CookieOptions) {
             try {
               cookieStore.set({ name, value, ...options });
             } catch (error) {
               // Handle cookie set error in server component (usually ignored)
             }
           },
           remove(name: string, options: CookieOptions) {
             try {
               cookieStore.set({ name, value: "", ...options });
             } catch (error) {
               // Handle cookie remove error
             }
           },
         },
       },
     );
   }
   ```

2. **Middleware Pattern**:
   The middleware must create a client to refresh the session.

   ```typescript
   import { createServerClient, type CookieOptions } from "@supabase/ssr";
   import { NextResponse, type NextRequest } from "next/server";

   export async function updateSession(request: NextRequest) {
     let response = NextResponse.next({
       request: {
         headers: request.headers,
       },
     });

     const supabase = createServerClient(
       process.env.NEXT_PUBLIC_SUPABASE_URL!,
       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
       {
         cookies: {
           get(name: string) {
             return request.cookies.get(name)?.value;
           },
           set(name: string, value: string, options: CookieOptions) {
             request.cookies.set({ name, value, ...options });
             response = NextResponse.next({
               request: {
                 headers: request.headers,
               },
             });
             response.cookies.set({ name, value, ...options });
           },
           remove(name: string, options: CookieOptions) {
             request.cookies.set({ name, value: "", ...options });
             response = NextResponse.next({
               request: {
                 headers: request.headers,
               },
             });
             response.cookies.set({ name, value: "", ...options });
           },
         },
       },
     );

     await supabase.auth.getUser();
     return response;
   }
   ```

## References

- [Epic 1 Specification](../planning-artifacts/epics/epic-1-note-capture-basic-storage.md)
- [Architecture Decisions](../planning-artifacts/architecture/core-architectural-decisions.md)
- [Supabase SSR Docs](https://supabase.com/docs/guides/auth/server-side/nextjs)

## Dev Agent Record

### Agent Model Used

BMad Custom Agent (sm/create-story)

### Debug Log References

- Verified deprecated status of `@supabase/auth-helpers-nextjs`
- Forced override to `@supabase/ssr`

### Completion Notes List

- Implemented full Supabase Auth with email/password using `@supabase/ssr`.
- **Next.js 16 Migration**: Successfully migrated `middleware.ts` to `proxy.ts` convention to fix redirection issues and follow latest standards.
- Integrated `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` as per the latest Supabase project format.
- Protected `/app/*` and `/` routes with automatic redirection to `/login`.
- Created unified server actions for auth operations with Zod validation.
- **Review Fixes**:
  - Fixed async `searchParams` access for Next.js 16.
  - Added premium aesthetics (vibrant gradients, glassmorphism) to auth pages.
  - Improved Zod error extraction and user feedback.
  - Handled signup email confirmation flow with clear UI feedback.
  - Fixed lint errors and unit tests for the proxy.

### Technical Debt / Future Stories

- **Signup UX**: Add clear visual feedback after signup indicating that a validation email has been sent.
- **Error Handling UX**: Implement more granular and user-friendly error messages for specific auth failures (e.g., "Account not confirmed", "Invalid password format").
