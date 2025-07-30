# Instagram API Test Script
# Run this in PowerShell to test your Instagram API integration

$baseUrl = "https://api.dbsweb.com.br"

Write-Host "🧪 Testing Instagram API Integration" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Gray

# Test 1: API Configuration
Write-Host "`n1. Testing API configuration..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/instagram/test" -Method GET
    Write-Host "✅ Instagram API is working!" -ForegroundColor Green
    Write-Host "   App ID: $($response.app_id)" -ForegroundColor Gray
    Write-Host "   Redirect URI: $($response.redirect_uri)" -ForegroundColor Gray
    Write-Host "   Webhook configured: $($response.webhook_configured)" -ForegroundColor Gray
} catch {
    Write-Host "❌ API test failed!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Authorization URL
Write-Host "`n2. Testing authorization URL generation..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/instagram/auth/url?state=test123" -Method GET
    Write-Host "✅ Authorization URL generated!" -ForegroundColor Green
    Write-Host "   URL: $($response.auth_url)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Authorization URL test failed!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Webhook Verification
Write-Host "`n3. Testing webhook verification..." -ForegroundColor Yellow

try {
    $params = @{
        'hub.mode' = 'subscribe'
        'hub.challenge' = 'test_challenge_12345'
        'hub.verify_token' = 'your_webhook_verify_token'  # Should match your .env
    }
    
    $queryString = ($params.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" }) -join '&'
    $response = Invoke-RestMethod -Uri "$baseUrl/instagram/webhook?$queryString" -Method GET
    
    if ($response -eq 'test_challenge_12345') {
        Write-Host "✅ Webhook verification working!" -ForegroundColor Green
    } else {
        Write-Host "❌ Webhook verification failed!" -ForegroundColor Red
    }
} catch {
    Write-Host "⚠️  Webhook verification failed - check your INSTAGRAM_WEBHOOK_VERIFY_TOKEN" -ForegroundColor Yellow
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Webhook Data Processing
Write-Host "`n4. Testing webhook data processing..." -ForegroundColor Yellow

try {
    $webhookData = @{
        object = "instagram"
        entry = @(
            @{
                id = "test_user_123"
                changes = @(
                    @{
                        field = "media"
                        value = @{
                            media_id = "test_media_456"
                            time = 1640995200
                        }
                    }
                )
            }
        )
    }
    
    $headers = @{
        'Content-Type' = 'application/json'
    }
    
    $response = Invoke-RestMethod -Uri "$baseUrl/instagram/webhook" -Method POST -Body ($webhookData | ConvertTo-Json -Depth 5) -Headers $headers
    Write-Host "✅ Webhook data processing working!" -ForegroundColor Green
} catch {
    Write-Host "❌ Webhook processing failed!" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n" + "=" * 50 -ForegroundColor Gray
Write-Host "🏁 Instagram API tests completed!" -ForegroundColor Cyan

Write-Host "`n📋 Next Steps:" -ForegroundColor White
Write-Host "1. ✅ API is deployed and working" -ForegroundColor Green
Write-Host "2. 🔧 Configure your Instagram app in Meta Developer Dashboard:" -ForegroundColor Yellow
Write-Host "   - Webhook URL: $baseUrl/instagram/webhook" -ForegroundColor Gray
Write-Host "   - Redirect URI: $baseUrl/instagram/auth/callback" -ForegroundColor Gray
Write-Host "3. 🔑 Set up environment variables on your server" -ForegroundColor Yellow
Write-Host "4. 🧪 Test real Instagram OAuth flow" -ForegroundColor Yellow

# Optional: Test OAuth flow
Write-Host "`n🔐 Want to test OAuth flow? (y/n): " -ForegroundColor Cyan -NoNewline
$testOAuth = Read-Host

if ($testOAuth -eq 'y' -or $testOAuth -eq 'Y') {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/instagram/auth/url?state=manual_test" -Method GET
        $authUrl = $response.auth_url
        
        Write-Host "`n1. Open this URL in your browser:" -ForegroundColor Yellow
        Write-Host "   $authUrl" -ForegroundColor Gray
        Write-Host "`n2. Authorize the app" -ForegroundColor Yellow
        Write-Host "3. Copy the 'code' parameter from the redirect URL" -ForegroundColor Yellow
        
        $code = Read-Host "`n4. Paste the authorization code here (or press Enter to skip)"
        
        if ($code) {
            $callbackData = @{
                code = $code
                state = "manual_test"
            }
            
            Write-Host "`n5. Testing callback..." -ForegroundColor Yellow
            $response = Invoke-RestMethod -Uri "$baseUrl/instagram/auth/callback" -Method POST -Body ($callbackData | ConvertTo-Json) -ContentType "application/json"
            
            Write-Host "✅ OAuth flow successful!" -ForegroundColor Green
            Write-Host "   Access token received: $($response.access_token.Substring(0, 20))..." -ForegroundColor Gray
            Write-Host "   User: $($response.user_profile.username)" -ForegroundColor Gray
        }
    } catch {
        Write-Host "❌ OAuth test failed!" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}
