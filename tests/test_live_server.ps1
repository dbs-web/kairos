# Test both News and Suggestions endpoints on live server for duplicated cards
$headers = @{
    'Content-Type' = 'application/json'
    'x-api-key' = '6Kh8bBoBilUCUypzKD3Lftj15oQJOaFIBHLTFImAKDA1y2YBQdlFK43raubOfKDp'
}

$baseUrl = "https://kairos.dbsweb.com.br"

Write-Host "Testing Live Server: $baseUrl" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Gray

# Test 1: News Endpoint
Write-Host "`n[NEWS] Testing NEWS endpoint..." -ForegroundColor Yellow

$newsData = @{
    data = @(
        @{
            title = "Live Server Test - News Article"
            text = "This is a test news article to verify the duplicate detection system is working on the live server."
            url = "https://example.com/live-test-news"
            summary = "Test summary for live server news validation"
            thumbnail = "https://example.com/news-thumb.jpg"
            date = "2025-07-17T21:45:00.000Z"
            status = "EM_ANALISE"
            userId = 10
        }
    )
    userId = 10
}

$newsJson = $newsData | ConvertTo-Json -Depth 3

try {
    Write-Host "Sending to: $baseUrl/api/news" -ForegroundColor Gray
    $newsResponse = Invoke-RestMethod -Uri "$baseUrl/api/news" -Method POST -Headers $headers -Body $newsJson
    Write-Host "[SUCCESS] NEWS SUCCESS!" -ForegroundColor Green
    Write-Host "   Message: $($newsResponse.message)" -ForegroundColor White
    Write-Host "   Created: $($newsResponse.created)" -ForegroundColor White
    Write-Host "   Duplicates Filtered: $($newsResponse.duplicatesFiltered)" -ForegroundColor White
} catch {
    Write-Host "[ERROR] NEWS ERROR: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "   Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

# Test 2: Suggestions Endpoint
Write-Host "`n[SUGGESTIONS] Testing SUGGESTIONS endpoint..." -ForegroundColor Yellow

$suggestionsData = @{
    data = @(
        @{
            post_url = "https://www.instagram.com/p/LIVE_TEST_123/"
            user_photo = "https://example.com/user-live.jpg"
            post_image = "https://example.com/post-live.jpg"
            name_profile = "@live_test_user"
            post_text = "This is a test social media post to verify the duplicate detection system is working on the live server."
            socialmedia_name = "instagram"
            userId = 10
            date = "2025-07-17T21:45:00.000Z"
            status = "EM_ANALISE"
        }
    )
    userId = 10
}

$suggestionsJson = $suggestionsData | ConvertTo-Json -Depth 3

try {
    Write-Host "Sending to: $baseUrl/api/sugestoes" -ForegroundColor Gray
    $suggestionsResponse = Invoke-RestMethod -Uri "$baseUrl/api/sugestoes" -Method POST -Headers $headers -Body $suggestionsJson
    Write-Host "[SUCCESS] SUGGESTIONS SUCCESS!" -ForegroundColor Green
    Write-Host "   Message: $($suggestionsResponse.message)" -ForegroundColor White
    Write-Host "   Created: $($suggestionsResponse.created)" -ForegroundColor White
    Write-Host "   Duplicates Filtered: $($suggestionsResponse.duplicatesFiltered)" -ForegroundColor White
} catch {
    Write-Host "[ERROR] SUGGESTIONS ERROR: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "   Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

# Test 3: Duplicate Detection Test
Write-Host "`n[DUPLICATE] Testing DUPLICATE DETECTION..." -ForegroundColor Yellow
Write-Host "Sending the same news again to test duplicate filtering..." -ForegroundColor Gray

try {
    $duplicateResponse = Invoke-RestMethod -Uri "$baseUrl/api/news" -Method POST -Headers $headers -Body $newsJson
    Write-Host "[SUCCESS] DUPLICATE TEST SUCCESS!" -ForegroundColor Green
    Write-Host "   Message: $($duplicateResponse.message)" -ForegroundColor White
    Write-Host "   Created: $($duplicateResponse.created)" -ForegroundColor White
    Write-Host "   Duplicates Filtered: $($duplicateResponse.duplicatesFiltered)" -ForegroundColor White

    if ($duplicateResponse.created -eq 0 -and $duplicateResponse.duplicatesFiltered -eq 1) {
        Write-Host "[WORKING] DUPLICATE DETECTION WORKING! Duplicate was correctly filtered!" -ForegroundColor Green
    } else {
        Write-Host "[WARNING] Unexpected duplicate detection result" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[ERROR] DUPLICATE TEST ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n" + "=" * 50 -ForegroundColor Gray
Write-Host "Live server testing completed!" -ForegroundColor Cyan
