# Test for localhost
$headers = @{
    'Content-Type' = 'application/json'
    'x-api-key' = '6Kh8bBoBilUCUypzKD3Lftj15oQJOaFIBHLTFImAKDA1y2YBQdlFK43raubOfKDp'
}

$bodyObject = @{
    data = @(
        @{
            post_url = "https://www.tiktok.com/@emmanuelmacron/video/7528164276956040470"
            user_photo = "https://p77-sign-va-lite.tiktokcdn.com/tos-maliva-avt-0068/8a140844b44cf27192e579c5011ec6e3~tplv-tiktokx-cropcenter:100:100.jpeg"
            post_image = "https://p16-pu-sign-no.tiktokcdn-eu.com/tos-no1a-p-0037-no/oQALNMQfA0j3IPcILtADmIQGyAAI8AMFOeeTwd~tplv-tiktokx-origin.image"
            name_profile = "@emmanuelmacron"
            post_text = "teste request"
            socialmedia_name = "tiktok"
            userId = 10
            date = "2025-07-17T18:22:17.000Z"
        }
    )
}

$body = $bodyObject | ConvertTo-Json -Depth 3

Write-Host "Testing localhost..."
try {
    $response = Invoke-RestMethod -Uri 'http://localhost:3000/api/sugestoes' -Method POST -Headers $headers -Body $body -Verbose
    Write-Host "Localhost Success: $($response.message)"
} catch {
    Write-Host "Localhost Error: $($_.Exception.Message)"
}

Write-Host "`nTesting live server..."
try {
    $response = Invoke-RestMethod -Uri 'https://kairos.dbsweb.com.br/api/sugestoes' -Method POST -Headers $headers -Body $body -Verbose
    Write-Host "Live Success: $($response.message)"
} catch {
    Write-Host "Live Error: $($_.Exception.Message)"
}
