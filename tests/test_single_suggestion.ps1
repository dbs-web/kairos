# Test for localhost
$headers = @{
    'Content-Type' = 'application/json; charset=utf-8'
    'x-api-key' = '6Kh8bBoBilUCUypzKD3Lftj15oQJOaFIBHLTFImAKDA1y2YBQdlFK43raubOfKDp'
}

$bodyObject = @{
    data = @(
        @{
            post_url = "https://www.instagram.com/p/DMXrCoix4Ec/"
            user_photo = "https://kairosimgs.blob.core.windows.net/images/17865860787349386_profile.jpg"
            post_image = "https://kairosimgs.blob.core.windows.net/images/17865860787349386_media.jpg"
            name_profile = "bolsonarosp"
            post_text = "O mundo esta vendo. Voces ai no Brasil e nos aqui de fora, se todos remarmos na mesma nos venceremos!"
            socialmedia_name = "instagram"
            userId = 10
            date = "2025-07-21T15:53:02.000Z"
        }
    )
    userId = 10
}

$body = $bodyObject | ConvertTo-Json -Depth 3
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

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
