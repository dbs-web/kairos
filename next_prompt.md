# Next Session Context - Suggestions Interface Development

## Current Project State
We are working on a Next.js application called "Kairos" - a content management system for social media suggestions and briefings.

## What We Just Completed
- Fixed suggestions API to work with new social media post structure
- Successfully tested POST/GET endpoints for suggestions
- Created n8n integration documentation
- See detailed progress in: `backlog/backlog1.md`

## Current Working Directory
`C:\Users\Usuário\Documents\kairos`

## Key Files & Structure

### Database Schema (`prisma/schema.prisma`)
- **Suggestion Model**: Uses social media fields (`post_url`, `user_photo`, `post_image`, `name_profile`, `post_text`, `socialmedia_name`)
- **Status Enum**: `EM_ANALISE`, `EM_PRODUCAO`, `APROVADO`, `ARQUIVADO`
- **Relationships**: Suggestions → User, Suggestions → Briefings

### API Endpoints
- **GET/POST** `/api/sugestoes` - Fully functional
- **POST** `/api/sugestoes/aprovar` - Approves suggestions and creates briefings
- **External validation**: Uses `x-api-key` header with `withExternalRequestValidation` adapter

### Current Frontend Structure
- **Page**: `src/app/panel/estudio/planejamento/page.tsx` - Suggestions page wrapper
- **Main Component**: `src/components/Suggestions/SuggestionsGrid.tsx` - Main grid layout
- **Card Component**: `src/components/Suggestions/SuggestionCard.tsx` - Individual suggestion display
- **Hooks**: `src/hooks/use-suggestions.tsx` - Suggestions state management
- **Context**: Uses React Query for data fetching and state management

### Existing UI Components
- `src/components/ui/` - Reusable UI components (buttons, badges, pagination, etc.)
- **Status Badge**: Shows suggestion status with colors
- **Pagination**: Working pagination component
- **Custom Prompt**: AI content creation form

## Current Interface Status
The suggestions page exists but needs updates to properly display the new social media post format:

### What's Working
- ✅ Data fetching (GET requests)
- ✅ Pagination
- ✅ Selection/approval workflow
- ✅ Status management
- ✅ Basic card layout

### What Needs Updates
- 🔄 **SuggestionCard component** - Update to show social media post data instead of title/briefing
- 🔄 **Display format** - Show post images, profile photos, social media platform
- 🔄 **Post content** - Display `post_text` instead of old briefing text
- 🔄 **Social media indicators** - Show platform (Instagram/X) with icons
- 🔄 **Profile information** - Display `name_profile` and `user_photo`

## Technical Context

### Data Structure (ISuggestion interface)
```typescript
interface ISuggestion {
    id: number;
    post_url: string;
    user_photo: string | null;
    post_image: string | null;
    name_profile: string;
    post_text: string;
    socialmedia_name: string;
    date: Date;
    userId: number;
    status: Status;
}
```

### Current Styling
- Uses Tailwind CSS
- Dark theme with primary blue colors
- Grid layout (responsive)
- Card-based design

## Immediate Next Steps
1. **Update SuggestionCard component** to display social media post format
2. **Add social media platform icons** (Instagram, X/Twitter)
3. **Implement image display** for post images and profile photos
4. **Update card layout** to accommodate new data structure
5. **Test with real data** from the working API

## Important Notes
- The API is fully functional - focus on frontend updates
- Existing hooks and state management work correctly
- Keep the same approval/archive workflow
- Maintain responsive design and accessibility
- Use existing UI components where possible

## Files to Focus On
- `src/components/Suggestions/SuggestionCard.tsx` - Main component to update
- `src/components/Suggestions/SuggestionsGrid.tsx` - May need minor updates
- `src/domain/entities/suggestion.ts` - Reference for data structure
- `src/hooks/use-suggestions.tsx` - Already working correctly

## Testing
- Use existing suggestions data or create test data via API
- Test responsive design on different screen sizes
- Verify approval workflow still works after UI updates