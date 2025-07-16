# Backlog Session 2 - Video URL Conversion Issue

## Date: [Current Date]

## Overview
Investigated and attempted to fix the HeyGen video URL conversion issue where AWS temporary URLs are being stored in the database instead of permanent resource2.heygen.ai URLs, causing download failures.

## Issues Identified

### 1. Video URL Format Problem
- **Problem**: HeyGen callback receives AWS temporary URLs but stores them directly in database
- **Impact**: Video downloads fail because AWS URLs expire
- **Current Behavior**: URLs like `https://files2.heygen.ai/aws_pacific/avatar_tmp/...` are stored
- **Expected Behavior**: Should convert to `https://resource2.heygen.ai/video/transcode/{videoId}/1280x720.mp4`

### 2. Callback Conversion Logic Not Working
- **Problem**: URL conversion logic in `/api/heygen/callback` route exists but isn't functioning
- **Root Cause**: Regex pattern or logic issue preventing proper URL transformation
- **Evidence**: Multiple test videos still show AWS format in database and frontend

### 3. Avatar Selection UI Issues
- **Problem**: Avatar selection dialog has layout/styling problems
- **Current State**: Dialog appears functional but may have visual inconsistencies
- **Impact**: User experience degradation during video creation workflow

## Investigation Results

### Manual URL Testing
- ✅ **Manual conversion works**: `https://resource2.heygen.ai/video/transcode/83912475b0b04b12aa01ceff6cc867b0/1280x720.mp4`
- ✅ **Permanent URLs are accessible**: Direct browser access successful
- ❌ **Automatic conversion failing**: Callback logic not executing properly

### Database Analysis
- **Current URLs**: AWS format with expiration signatures
- **Expected URLs**: Permanent resource2.heygen.ai format
- **Status**: All recent videos show AWS URLs despite conversion code

### Code Analysis
- **File**: `src/app/api/heygen/callback/route.ts`
- **Logic**: URL conversion exists but not working
- **Debugging**: Added console logs but conversion still failing

## Files Investigated
1. `src/app/api/heygen/callback/route.ts` - Main callback handler
2. `src/use-cases/VideoUseCases/AddVideoUrlUseCase.ts` - Database update logic
3. `src/components/Video/VideoCard.tsx` - Frontend video display
4. Database Video table - URL storage verification

## Technical Details

### Current Callback Flow
1. HeyGen sends callback with AWS URL
2. Callback route receives URL
3. **FAILING**: URL conversion logic not executing properly
4. AWS URL stored directly in database
5. Frontend displays expired/temporary URL

### Expected Conversion Pattern
```
FROM: https://files2.heygen.ai/aws_pacific/avatar_tmp/.../[VIDEO_ID].mp4?Expires=...
TO:   https://resource2.heygen.ai/video/transcode/[VIDEO_ID]/1280x720.mp4
```

## Attempted Solutions
1. **Updated regex pattern** - Added query parameter handling
2. **Enhanced logging** - Added debug console logs
3. **URL preprocessing** - Split query parameters before matching
4. **Multiple test videos** - Verified issue persists across new generations

## Current Status
- ❌ URL conversion still not working
- ❌ Videos showing AWS URLs in database
- ❌ Download functionality affected
- ✅ Manual URL conversion confirmed working
- ✅ Video generation pipeline otherwise functional

## Critical Next Steps
1. **DEBUG CALLBACK EXECUTION** - Verify callback route is actually being called
2. **FIX URL CONVERSION** - Identify why regex/logic isn't working
3. **TEST CONVERSION LOGIC** - Create isolated test for URL transformation
4. **UPDATE EXISTING VIDEOS** - Migration script for already generated videos
5. **FIX AVATAR SELECTION UI** - Address styling/layout issues

## Priority Issues
1. **HIGH**: Video URL conversion (blocking downloads)
2. **MEDIUM**: Avatar selection UI improvements
3. **LOW**: Code cleanup and optimization

## Files Requiring Attention
- `src/app/api/heygen/callback/route.ts` - Primary focus for URL conversion
- Avatar selection components - UI fixes needed
- Video download functionality - Dependent on URL fix

## Testing Strategy
- Generate test videos and monitor callback logs
- Verify database URL format after each test
- Test download functionality with corrected URLs
- Validate avatar selection workflow