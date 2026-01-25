# Google Drive Integration via Picker API

## Overview

Add a "Save to Google Drive" button that lets users save their glossary directly to their Google Drive using the Google Picker API. Google handles the authentication UI, so no server-side OAuth is needed.

## Prerequisites (User Setup Required)

You need a Google Cloud Platform (GCP) project to get API credentials. This is free (no billing required).

### Setup Steps:

1. **Create a Google Cloud Project**
   - Go to https://console.cloud.google.com
   - Click "Select a project" → "New Project"
   - Name it something like "Glossary Builder"
   - Note the **Project Number** (visible on dashboard) - this is your App ID

2. **Enable Required APIs**
   - Go to "APIs & Services" → "Library"
   - Search and enable: **Google Picker API**
   - Search and enable: **Google Drive API**

3. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Choose "External" user type
   - Fill in app name, support email
   - Add scope: `https://www.googleapis.com/auth/drive.file`
   - Can stay in "Testing" mode (add your email as test user)

4. **Create OAuth Client ID**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Type: "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:3000`
     - Your production domain (e.g., `https://your-app.vercel.app`)
   - Copy the **Client ID**

5. **Create API Key**
   - Click "Create Credentials" → "API Key"
   - Copy the key
   - (Optional) Restrict it to Picker API and your domains

## Implementation Plan

### Step 1: Environment Configuration

**File**: `.env` (add new variables)
```
VITE_GOOGLE_API_KEY=your_api_key
VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
VITE_GOOGLE_APP_ID=your_project_number
```

Note: These use `VITE_` prefix since they're needed client-side.

### Step 2: Create Google Drive Utility

**New file**: `src/utils/googleDrive.ts`

Responsibilities:
- Load Google API scripts dynamically (`gapi` and `google.accounts`)
- Handle token acquisition via Google Identity Services
- Convert markdown content to HTML for better Google Docs formatting
- Upload file to Drive using Drive API (as Google Doc)
- Provide `saveToGoogleDrive(content: string, filename: string)` function

Key flow:
1. Load gapi script if not loaded
2. Request access token via `google.accounts.oauth2.initTokenClient`
3. User sees Google sign-in popup (handled by Google)
4. On success, use token to upload file via Drive API v3
5. Return success/failure status

### Step 3: Add Google Drive Button to UI

**File**: `src/App.tsx`

Changes:
- Import the new `saveToGoogleDrive` utility
- Add state for Drive save status: `savingToDrive`, `driveSaveSuccess`
- Create `handleSaveToDrive()` function that:
  - Calls `getFormattedContent()` (reuse existing)
  - Calls `saveToGoogleDrive(content, filename)`
  - Shows success/error feedback
- Add "Save to Drive" button next to existing Copy/Download buttons
- Add button to mobile menu as well

Button placement (desktop): `[Copy] [Download] [Save to Drive] [Start New]`

### Step 4: Add Google Drive Icon

**Option A**: Use inline SVG for Google Drive icon
**Option B**: Use a generic cloud-upload icon from existing icon set

Recommend Option A for brand recognition.

### Step 5: User Feedback States

Add visual feedback for:
- **Saving**: Button shows spinner/loading state
- **Success**: Brief "Saved!" message (similar to Copy button behavior)
- **Error**: Show error message (auth cancelled, upload failed, etc.)

## File Changes Summary

| File | Change |
|------|--------|
| `.env` | Add 3 Google API environment variables |
| `.env.example` | Document the new variables |
| `src/utils/googleDrive.ts` | New file - Google API integration |
| `src/App.tsx` | Add button, state, and handler (~30 lines) |

## Technical Details

### Google API Loading Strategy

Load scripts on-demand (not at page load) to avoid impacting initial load time:

```typescript
// Only load when user clicks "Save to Drive"
const loadGoogleApi = async () => {
  if (window.gapi) return;
  // Dynamically inject script tag
};
```

### Authentication Flow

Using Google Identity Services (GIS) - the modern replacement for the deprecated gapi.auth2:

1. User clicks "Save to Drive"
2. `google.accounts.oauth2.initTokenClient()` creates token client
3. `.requestAccessToken()` opens Google sign-in popup
4. User authorizes (or cancels)
5. Callback receives access token
6. Token used for Drive API upload

### File Upload

Use Drive API v3 multipart upload:
- POST to `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`
- Include metadata with `mimeType: 'application/vnd.google-apps.document'` to convert to Google Doc
- Upload content as HTML (better formatting) or plain text
- Google automatically converts to native Google Doc format
- File appears in user's Drive root, editable like any Google Doc

## Verification

1. Run `vercel dev` locally
2. Generate a glossary
3. Click "Save to Drive" button
4. Google sign-in popup appears
5. Authorize the app
6. Check Google Drive for the saved file
7. Verify file content matches export

## Security Notes

- API keys are exposed client-side (unavoidable for Picker API)
- Keys should be restricted in Google Cloud Console:
  - API Key: Restrict to Picker API + specific domains
  - OAuth Client: Restrict to authorized origins
- No sensitive data stored server-side
- Tokens are short-lived and scoped to Drive only

## Alternative Considerations

**Why Picker API over full OAuth?**
- No server-side token management
- Google handles the entire auth UI
- Simpler implementation
- User trusts Google's sign-in flow

**Limitation**: Each session requires re-authentication (tokens not persisted). Acceptable for occasional save operations.
