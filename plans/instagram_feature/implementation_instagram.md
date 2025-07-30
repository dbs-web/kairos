# Instagram Feature Implementation Plan

## 📋 Project Overview

**Goal**: Implement Instagram social media statistics and insights feature in the Kairos web application.

**Approach**: Direct web app integration (no n8n intermediary) for optimal performance and user experience.

**Timeline**: 8 weeks total development

---

## 🏗️ Architecture Decision

### ✅ Chosen Approach: Direct Web App Integration
- **Flow**: User Login → Instagram OAuth → Store Token → Direct API Calls → Display Analytics
- **Benefits**: Better performance, simpler architecture, real-time updates, better UX

### ❌ Rejected Approach: n8n Integration
- **Reasons**: Token management complexity, performance overhead, additional failure points

---

## 📊 Current Status

### ✅ Completed Infrastructure
- [x] Instagram Business API client with OAuth 2.0
- [x] Complete API endpoints (profile, media, insights, analytics)
- [x] Webhook system for real-time notifications
- [x] Security with HMAC-SHA256 signature verification
- [x] Next.js 15 web application with authentication
- [x] MySQL database with Prisma ORM

### 🎯 Available Instagram API Endpoints
- `/instagram/auth/url` - OAuth authorization URL
- `/instagram/auth/callback` - OAuth callback handler
- `/instagram/user/profile` - User profile data
- `/instagram/user/media` - Posts with engagement metrics
- `/instagram/media/{id}/insights` - Individual post analytics
- `/instagram/account/insights` - Account-level performance
- `/instagram/audience/insights` - Demographic data

---

## 🚀 Implementation Phases

## Phase 1: Foundation & Authentication (Weeks 1-2)

### 1.1 Database Schema Extensions
- [ ] **Task 1.1.1**: Create `user_social_tokens` table
  - Store Instagram access tokens per user
  - Include Instagram Business Account ID
  - Handle token expiration (60 days)
  - Support multiple platforms (Instagram, TikTok, Twitter)

- [ ] **Task 1.1.2**: Create data collection tables (BASE 1 & 2 structure)
  - `instagram_daily_snapshots` - Daily account metrics
  - `instagram_media_snapshots` - Hourly post metrics
  - `instagram_demographics` - Lifetime audience data
  - `instagram_insights_cache` - Performance caching

- [ ] **Task 1.1.3**: Update Prisma schema
  - Add new models to schema.prisma
  - Generate and run migrations
  - Update TypeScript types for new data structures

### 1.2 Instagram Token Management System
- [ ] **Task 1.2.1**: Create `InstagramTokenService`
  - Token encryption/decryption
  - Token validation and refresh logic
  - User-token association methods

- [ ] **Task 1.2.2**: Implement token storage in database
  - Secure token persistence
  - Token expiration handling
  - User privacy controls

- [ ] **Task 1.2.3**: Add token management API routes
  - `/api/instagram/connect` - Initiate OAuth
  - `/api/instagram/disconnect` - Remove user token
  - `/api/instagram/status` - Check connection status

### 1.4 Admin Instagram Management Panel (NEW - Better than n8n)
- [ ] **Task 1.4.1**: Create admin Instagram navigation
  - Add Instagram tab to admin layout
  - Create `/admin/instagram` route structure
  - Implement admin-only Instagram components

- [ ] **Task 1.4.2**: Build rate limit monitoring dashboard
  - Track API usage per user and globally
  - Display real-time rate limit status
  - Alert system for approaching limits
  - Historical usage charts

- [ ] **Task 1.4.3**: Create token management interface
  - List all connected Instagram accounts
  - Monitor token expiration dates
  - Bulk token refresh functionality
  - Manual disconnect capabilities

### 1.5 Data Collection System (Simplified - No n8n needed)
- [ ] **Task 1.5.1**: Create `InstagramDataCollectionService`
  - Implement BASE 1 daily snapshot collection
  - Implement BASE 2 hourly media snapshot collection
  - Handle data storage in new database tables

- [ ] **Task 1.5.2**: Add data collection API endpoints
  - `/api/instagram/collect/daily` - Trigger daily account snapshot
  - `/api/instagram/collect/media` - Trigger media snapshots collection
  - `/api/instagram/data/timeline` - Get time series data
  - `/api/instagram/data/demographics` - Get audience demographics

- [ ] **Task 1.5.3**: Implement admin-controlled scheduling
  - Admin configurable collection frequency
  - Manual collection triggers from admin panel
  - Error handling and retry logic for failed collections

### 1.3 OAuth Integration in Web App
- [ ] **Task 1.3.1**: Create Instagram connection UI
  - Add "Connect Instagram" button to user settings
  - Connection status indicator
  - Disconnect option

- [ ] **Task 1.3.2**: Implement OAuth flow in frontend
  - Handle OAuth redirect
  - Store connection state
  - Error handling for failed connections

- [ ] **Task 1.3.3**: User settings page updates
  - Social media connections section
  - Privacy controls
  - Connection management interface

---

## Phase 2: Core Social Media Dashboard (Weeks 3-4)

### 2.1 Navigation Structure
- [ ] **Task 2.1.1**: Update main navigation
  - Add "Redes Sociais" to panel layout
  - Update navigation icons and routing
  - Implement responsive navigation

- [ ] **Task 2.1.2**: Create social media layout structure
  - Sub-navigation: Monitoramento, Meu Desempenho, Radar de Tendências
  - Platform tabs: Instagram, TikTok, Twitter
  - Responsive layout for mobile/desktop

- [ ] **Task 2.1.3**: Create route structure
  - `/panel/redes-sociais/monitoramento`
  - `/panel/redes-sociais/meu-desempenho`
  - `/panel/redes-sociais/radar-tendencias`

### 2.2 Instagram Dashboard Layout
- [ ] **Task 2.2.1**: Create `SocialMediaLayout` component
  - Tab navigation between platforms
  - Sub-navigation between features
  - Consistent styling with existing app

- [ ] **Task 2.2.2**: Create `InstagramDashboard` component
  - Main dashboard container
  - Loading states and error handling
  - Connection status checks

- [ ] **Task 2.2.3**: Implement platform switching
  - Instagram tab (active)
  - TikTok tab (placeholder)
  - Twitter tab (placeholder)

### 2.3 Basic Metrics Display (KPIs)
- [ ] **Task 2.3.1**: Create `PerformanceMetrics` component
  - KPI cards for key metrics
  - Percentage change indicators
  - Responsive grid layout

- [ ] **Task 2.3.2**: Implement core metrics
  - Média de Curtidas (Average Likes)
  - Média de Comentários (Average Comments)
  - Taxa de Engajamento (Engagement Rate)
  - Novos Seguidores (New Followers)

- [ ] **Task 2.3.3**: Add data fetching logic
  - Connect to new data collection endpoints
  - Display time series data (BASE 1 format)
  - Handle loading and error states
  - Implement data refresh functionality

### 2.4 Time Series and Demographics Display (NEW)
- [ ] **Task 2.4.1**: Create `TimeSeriesChart` component
  - Display daily reach and follower changes
  - Show data in BASE 1 format structure
  - Interactive date range selection

- [ ] **Task 2.4.2**: Create `DemographicsDisplay` component
  - Gender/Age breakdown visualization
  - Geographic distribution (cities)
  - Interactive demographic charts

- [ ] **Task 2.4.3**: Implement real-time data updates
  - Auto-refresh daily snapshots
  - Show latest collection timestamps
  - Handle data synchronization

---

## Phase 3: Advanced Features & Visualizations (Weeks 5-6)

### 3.1 Engagement Charts and Visualizations
- [ ] **Task 3.1.1**: Create `EngagementChart` component
  - Time series chart for engagement evolution
  - Period selection (30 days, 3 months, year)
  - Interactive chart with hover details

- [ ] **Task 3.1.2**: Implement chart library integration
  - Choose chart library (Chart.js, Recharts, or D3)
  - Create reusable chart components
  - Implement responsive charts

- [ ] **Task 3.1.3**: Add data aggregation logic
  - Process Instagram insights data
  - Calculate engagement trends
  - Handle different time periods

### 3.2 Top Posts Analysis
- [ ] **Task 3.2.1**: Create `TopPosts` component
  - Grid layout for best performing posts
  - Post thumbnails and metrics
  - "Replicar Sucesso" (Replicate Success) functionality

- [ ] **Task 3.2.2**: Implement post performance analysis
  - Fetch media insights for all posts
  - Calculate performance scores
  - Sort and filter top performers

- [ ] **Task 3.2.3**: Add post interaction features
  - View post details with BASE 2 metrics
  - Show hourly performance tracking
  - Copy successful post patterns
  - Export post data

### 3.4 Advanced Analytics (NEW - Based on collected data)
- [ ] **Task 3.4.1**: Create performance trend analysis
  - Calculate engagement rate trends over time
  - Identify peak performance periods
  - Compare current vs historical performance

- [ ] **Task 3.4.2**: Implement predictive insights
  - Best posting times based on historical data
  - Content performance predictions
  - Audience growth forecasting

- [ ] **Task 3.4.3**: Add data export functionality
  - Export time series data (BASE 1 format)
  - Export media performance data (BASE 2 format)
  - Generate performance reports

### 3.3 Performance Comparisons
- [ ] **Task 3.3.1**: Add comparison features
  - Period-over-period comparisons
  - Benchmark against previous performance
  - Growth rate calculations

- [ ] **Task 3.3.2**: Implement audience insights
  - Demographics visualization
  - Audience growth tracking
  - Engagement by audience segment

- [ ] **Task 3.3.3**: Create insights summary
  - Key performance indicators
  - Actionable recommendations
  - Performance alerts and notifications

---

## Phase 4: Polish, Testing & Optimization (Weeks 7-8)

### 4.1 Error Handling and Edge Cases
- [ ] **Task 4.1.1**: Implement comprehensive error handling
  - API rate limit handling
  - Token expiration scenarios
  - Network connectivity issues

- [ ] **Task 4.1.2**: Add user feedback mechanisms
  - Loading states for all operations
  - Success/error notifications
  - Retry mechanisms for failed requests

- [ ] **Task 4.1.3**: Handle edge cases
  - New Instagram accounts (no data)
  - Private accounts
  - Suspended or restricted accounts

### 4.2 Performance Optimization
- [ ] **Task 4.2.1**: Implement caching strategy
  - Cache account insights (1 hour)
  - Cache media insights (6 hours)
  - Cache audience demographics (24 hours)

- [ ] **Task 4.2.2**: Optimize API calls
  - Batch requests where possible
  - Implement request queuing
  - Add rate limit monitoring

- [ ] **Task 4.2.3**: Frontend performance
  - Lazy loading for components
  - Image optimization for post thumbnails
  - Efficient data fetching patterns

### 4.3 Admin Panel Completion
- [ ] **Task 4.3.1**: Complete admin monitoring features
  - System health dashboard
  - Error tracking and alerting
  - Performance metrics visualization

- [ ] **Task 4.3.2**: Admin user management
  - Instagram connection overview per user
  - Bulk operations for user accounts
  - Admin-level data export capabilities

- [ ] **Task 4.3.3**: Admin documentation and training
  - Admin panel user guide
  - API management best practices
  - Troubleshooting documentation

### 4.4 User Testing and Feedback
- [ ] **Task 4.4.1**: Internal testing
  - Test with real Instagram accounts
  - Verify all metrics and calculations
  - Cross-browser compatibility testing

- [ ] **Task 4.4.2**: User acceptance testing
  - Gather feedback from target users
  - Identify usability improvements
  - Test mobile responsiveness

- [ ] **Task 4.4.3**: Final polish
  - UI/UX refinements based on feedback
  - Performance optimizations
  - Documentation updates

---

## 📝 Progress Tracking

### Current Phase: **Not Started**
### Next Task: **Task 1.1.1 - Create user_social_tokens table**

### Completed Tasks: 0/41
### Progress: 0%

---

## 🔄 Updated Requirements Based on Colleague's Data Structure

### **New Data Collection Requirements**

**BASE 1 - Daily Account Snapshots:**
- Daily reach and follower change tracking
- Profile views and accounts engaged metrics
- Lifetime demographics (gender/age, geographic distribution)
- Snapshot timestamps for data collection tracking

**BASE 2 - Hourly Media Snapshots:**
- Individual post performance tracking
- Metrics: total_interactions, reach, saved, likes, comments, shares, views
- Hourly collection frequency for real-time insights
- Media ID tracking for historical performance

### **Integration with n8n Workflows**
Your colleague's data structure suggests they want:
1. **Automated daily collection** (BASE 1) - Perfect for n8n scheduled workflows
2. **Automated hourly collection** (BASE 2) - Ideal for n8n time-based triggers
3. **Structured data storage** - Our web app will consume this collected data

### **Hybrid Approach Recommendation**
Based on the data requirements, I now recommend a **hybrid approach**:

- **n8n Workflows**: Handle automated data collection (daily/hourly)
- **Web Application**: Display and analyze the collected data
- **Direct API**: For real-time user interactions and immediate data refresh

This gives you the best of both worlds:
- Reliable automated data collection via n8n
- Fast, responsive user interface via direct integration
- Comprehensive historical data for trend analysis

---

## 🛠️ Technical Implementation Details

### Database Schema

```sql
-- Store Instagram tokens per user
CREATE TABLE user_social_tokens (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  platform ENUM('instagram', 'tiktok', 'twitter'),
  access_token TEXT NOT NULL,
  instagram_account_id VARCHAR(255), -- Store Instagram Business Account ID
  expires_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY unique_user_platform (user_id, platform)
);

-- Store daily account-level snapshots (BASE 1 structure)
CREATE TABLE instagram_daily_snapshots (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  instagram_account_id VARCHAR(255) NOT NULL,
  snapshot_date DATE NOT NULL,
  snapshot_timestamp DATETIME NOT NULL,
  reach INT DEFAULT 0,
  follower_change INT DEFAULT 0,
  profile_views INT DEFAULT 0,
  accounts_engaged INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY unique_daily_snapshot (user_id, instagram_account_id, snapshot_date)
);

-- Store hourly media-level snapshots (BASE 2 structure)
CREATE TABLE instagram_media_snapshots (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  media_id VARCHAR(255) NOT NULL,
  snapshot_timestamp DATETIME NOT NULL,
  total_interactions INT DEFAULT 0,
  reach INT DEFAULT 0,
  saved INT DEFAULT 0,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  shares INT DEFAULT 0,
  views INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_media_snapshots (user_id, media_id, snapshot_timestamp)
);

-- Store lifetime demographics data
CREATE TABLE instagram_demographics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  instagram_account_id VARCHAR(255) NOT NULL,
  gender_age_data JSON NOT NULL, -- Store F_25-34, M_35-44 format
  cities_data JSON NOT NULL, -- Store city distribution
  last_updated DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY unique_demographics (user_id, instagram_account_id)
);

-- Cache Instagram insights for performance (existing)
CREATE TABLE instagram_insights_cache (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  metric_type ENUM('account', 'media', 'audience'),
  data JSON NOT NULL,
  period VARCHAR(20),
  cached_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### API Service Layer Structure

```typescript
// services/InstagramService.ts
class InstagramService {
  // Account-level data collection (BASE 1)
  async collectDailySnapshot(userId: number): Promise<DailySnapshot>
  async getTimeSeriesData(userId: number, days: number): Promise<TimeSeriesData[]>
  async getLatestDailySummary(userId: number): Promise<DailySummary>
  async getLifetimeDemographics(userId: number): Promise<Demographics>

  // Media-level data collection (BASE 2)
  async collectMediaSnapshots(userId: number): Promise<MediaSnapshot[]>
  async getMediaInsights(userId: number, mediaId: string): Promise<MediaInsights>
  async getUserMedia(userId: number, limit: number): Promise<MediaItem[]>

  // Existing methods
  async getAccountInsights(userId: number, period: string)
  async getAudienceInsights(userId: number)
  async getUserProfile(userId: number)
}

// services/InstagramTokenService.ts
class InstagramTokenService {
  async storeToken(userId: number, token: string, accountId: string, expiresAt: Date)
  async getToken(userId: number): Promise<string | null>
  async getAccountId(userId: number): Promise<string | null>
  async refreshToken(userId: number): Promise<string>
  async revokeToken(userId: number): Promise<void>
}

// services/InstagramDataCollectionService.ts
class InstagramDataCollectionService {
  // Automated data collection for n8n workflows
  async scheduleDailyCollection(userId: number): Promise<void>
  async scheduleHourlyCollection(userId: number): Promise<void>
  async storeDailySnapshot(userId: number, data: DailySnapshotData): Promise<void>
  async storeMediaSnapshots(userId: number, data: MediaSnapshotData[]): Promise<void>
}
```

### Component Structure

```
src/components/SocialMedia/
├── SocialMediaLayout.tsx
├── Instagram/
│   ├── InstagramDashboard.tsx
│   ├── PerformanceMetrics.tsx
│   ├── EngagementChart.tsx
│   ├── TopPosts.tsx
│   └── AudienceInsights.tsx
├── TikTok/ (future)
└── Twitter/ (future)

src/components/Admin/Instagram/
├── InstagramAdminDashboard.tsx
├── RateLimitMonitor.tsx
├── TokenManagement.tsx
├── DataCollectionControls.tsx
├── SystemHealthMonitor.tsx
└── UserConnectionsOverview.tsx
```

---

## 📈 Success Metrics

### Technical Metrics
- [ ] API response time < 2 seconds
- [ ] 99.9% uptime for Instagram integration
- [ ] Cache hit rate > 80%
- [ ] Zero token security incidents

### User Experience Metrics
- [ ] User connection success rate > 95%
- [ ] Dashboard load time < 3 seconds
- [ ] User engagement with insights features
- [ ] Positive user feedback scores

### Business Metrics
- [ ] Number of users connecting Instagram accounts
- [ ] Feature adoption rate
- [ ] User retention after feature launch
- [ ] Support ticket reduction for social media questions

---

## 🔒 Security Considerations

### Token Security
- [ ] Encrypt tokens at rest in database
- [ ] Implement token rotation before expiration
- [ ] Validate tokens before API calls
- [ ] Secure token transmission (HTTPS only)

### User Privacy
- [ ] Explicit consent for Instagram data access
- [ ] Data retention policies for cached insights
- [ ] User control to disconnect Instagram account
- [ ] Audit logging for data access

### Rate Limit Management
- [ ] Implement exponential backoff
- [ ] Monitor API usage per user
- [ ] Queue requests during high traffic
- [ ] Graceful degradation when limits reached

---

## 🤝 Team Coordination

### Responsibilities
- **Web App Developer**: Frontend components, user experience, API integration
- **Backend Developer**: Database schema, API services, security implementation
- **n8n Developer**: Future integrations, automated workflows (Phase 2+)

### Communication
- Weekly progress reviews
- Daily standups for active development phases
- Code reviews for all Instagram-related changes
- User testing sessions before each phase completion

---

*Last Updated: 2025-01-30*
*Next Review: Weekly during active development*
