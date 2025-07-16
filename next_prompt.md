# Next Session Context - Video URL Conversion & UI Fixes

## Current Project State
We are working on a Next.js application called "Kairos" - a content management system for social media suggestions and briefings with HeyGen video generation.

## CRITICAL ISSUE - Video URL Conversion
**PRIORITY 1**: Fix HeyGen callback URL conversion that's preventing video downloads.

### The Problem
- HeyGen sends AWS temporary URLs in callbacks: `https://files2.heygen.ai/aws_pacific/avatar_tmp/.../[VIDEO_ID].mp4?Expires=...`
- These URLs expire and cause download failures
- Should convert to permanent URLs: `https://resource2.heygen.ai/video/transcode/[VIDEO_ID]/1280x720.mp4`
- Conversion logic exists in callback but **IS NOT WORKING**

### What We Tried (Session 2)
- ✅ Confirmed manual URL conversion works
- ✅ Updated regex pattern in callback route
- ✅ Added debug logging
- ❌ **Conversion still not working** - AWS URLs still being stored

### Files to Debug
- **`src/app/api/heygen/callback/route.ts`** - Main callback handler (conversion logic here)
- **`src/use-cases/VideoUseCases/AddVideoUrlUseCase.ts`** - Database update
- **Database Video table** - Check what URLs are actually being stored

### Debugging Steps Needed
1. **Verify callback is being called** - Check HeyGen webhook configuration
2. **Add more detailed logging** - Log every step of URL conversion
3. **Test regex pattern** - Isolate and test URL matching logic
4. **Check database updates** - Verify `addVideoUrlUseCase` is receiving converted URL

## Secondary Issue - Avatar Selection UI
The avatar selection dialog has styling/layout issues that need attention after the URL issue is resolved.

## Current Working Directory
`C:\Users\Usuário\Documents\kairos`

## Recent Progress (See backlog/backlog2.md)
- Investigated video URL conversion issue
- Confirmed permanent URLs work when manually converted
- Identified callback conversion logic failure
- Added enhanced debugging to callback route

## Key Technical Context

### HeyGen Integration Flow
1. User approves briefing → `/api/briefings/aprovar`
2. HeyGen API called → Video generation starts
3. **HeyGen callback** → `/api/heygen/callback` (THIS IS WHERE THE ISSUE IS)
4. URL should be converted here before database storage
5. Video displayed in "Finalizados" page

### Current Callback Logic (Not Working)
```typescript
// In /api/heygen/callback/route.ts
if (url.includes('files2.heygen.ai/aws_pacific/avatar_tmp/')) {
    const urlWithoutQuery = url.split('?')[0];
    const videoIdMatch = urlWithoutQuery.match(/\/([a-f0-9]{32})\.mp4$/);
    if (videoIdMatch) {
        const extractedVideoId = videoIdMatch[1];
        permanentUrl = `https://resource2.heygen.ai/video/transcode/${extractedVideoId}/1280x720.mp4`;
    }
}
```

### Database Schema
```sql
-- Video table has these URL-related fields:
url VARCHAR(500) -- This should store the permanent URL
heygenVideoId VARCHAR(191) -- HeyGen's video ID
heygenStatus ENUM('PROCESSING', 'SUCCESS', 'FAILED')
```

## Immediate Action Plan
1. **DEBUG CALLBACK EXECUTION**
   - Add comprehensive logging to callback route
   - Verify HeyGen is actually calling our webhook
   - Check if conversion logic is being reached

2. **FIX URL CONVERSION**
   - Test regex pattern in isolation
   - Verify video ID extraction
   - Ensure converted URL is passed to database

3. **TEST WITH NEW VIDEO**
   - Generate test video
   - Monitor callback logs
   - Verify database stores permanent URL

4. **UPDATE EXISTING VIDEOS** (if needed)
   - Create migration script for already generated videos
   - Convert existing AWS URLs to permanent format

## Files to Focus On
- **`src/app/api/heygen/callback/route.ts`** - PRIMARY FOCUS
- **`src/use-cases/VideoUseCases/AddVideoUrlUseCase.ts`** - Verify database update
- **HeyGen webhook configuration** - Ensure callbacks are being sent

## Success Criteria
- ✅ New videos store permanent URLs in database
- ✅ Video downloads work without proxy
- ✅ "Finalizados" page shows working video players
- ✅ Avatar selection UI is clean and functional

## Notes
- Video generation pipeline is otherwise working correctly
- The issue is specifically in the callback URL processing
- Manual URL conversion confirmed working
- This is blocking the download functionality for all videos
