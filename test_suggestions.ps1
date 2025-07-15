$headers = @{
    'Content-Type' = 'application/json'
    'x-api-key' = '6Kh8bBoBilUCUypzKD3Lftj15oQJOaFIBHLTFImAKDA1y2YBQdlFK43raubOfKDp'
}

$bodyObject = @{
    data = @(
        @{
            post_url = "https://instagram.com/p/ABC123"
            user_photo = "https://example.com/user.jpg"
            post_image = "https://example.com/post.jpg"
            name_profile = "@testuser"
            post_text = "This is a test social media post content"
            socialmedia_name = "instagram"
            userId = 10
            date = "2024-01-15T00:00:00.000Z"
        }
    )
}

$body = $bodyObject | ConvertTo-Json -Depth 3

try {
    $response = Invoke-RestMethod -Uri 'http://localhost:3000/api/sugestoes' -Method POST -Headers $headers -Body $body -Verbose
    Write-Host "Success: $($response.message)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Response: $($_.Exception.Response)"
}


