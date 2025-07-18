# Debug test for suggestions endpoint
$headers = @{
    'Content-Type' = 'application/json'
    'x-api-key' = '6Kh8bBoBilUCUypzKD3Lftj15oQJOaFIBHLTFImAKDA1y2YBQdlFK43raubOfKDp'
}

Write-Host "Debug Test - Suggestions Endpoint" -ForegroundColor Cyan

$testData = @{
    data = @(
        @{
            post_url = "https://www.instagram.com/p/TEST123/?hl=pt-br"
            user_photo = "https://example.com/user.jpg"
            post_image = "https://example.com/post.jpg"
            name_profile = "@testuser"
            post_text = "Test suggestion content for duplicate detection"
            socialmedia_name = "instagram"
            userId = 10
            date = "2025-07-17T18:22:17.000Z"
            status = "EM_ANALISE"
        }
    )
    userId = 10
}

$jsonBody = $testData | ConvertTo-Json -Depth 3
Write-Host "JSON Body being sent:" -ForegroundColor Yellow
Write-Host $jsonBody -ForegroundColor White

Write-Host ""
Write-Host "Sending to suggestions endpoint..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri 'http://localhost:3000/api/sugestoes' -Method POST -Headers $headers -Body $jsonBody -Verbose
    Write-Host "SUCCESS:" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 3) -ForegroundColor White
} catch {
    Write-Host "ERROR:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
}
