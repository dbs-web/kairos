$headers = @{
    'Content-Type' = 'application/json'
    'x-api-key' = '6Kh8bBoBilUCUypzKD3Lftj15oQJOaFIBHLTFImAKDA1y2YBQdlFK43raubOfKDp'
}

$bodyObject = @{
    data = @(
        @{
            post_url = "https://www.instagram.com/p/DL8dOR8MM4G/?hl=pt-br"
            user_photo = "http://dbsweb.com.br/wp-content/uploads/2025/07/nicolas_profile.jpg"
            post_image = "http://dbsweb.com.br/wp-content/uploads/2025/07/snaplytics.io_instagram_thumbnail.jpg"
            name_profile = "@nikolasferreiradm"
            post_text = "E aí, a culpa é de quem?"
            socialmedia_name = "instagram"
            userId = 10
            date = "2025-07-11T00:00:00.000Z"
        },
        @{
            post_url = "https://www.instagram.com/p/DL3V7p-M9NV/?hl=pt-br"
            user_photo = "http://dbsweb.com.br/wp-content/uploads/2025/07/nicolas_profile.jpg"
            post_image = "http://dbsweb.com.br/wp-content/uploads/2025/07/snaplytics.io_instagram_thumbnail-2.jpg"
            name_profile = "@nikolasferreiradm"
            post_text = "Nos deixem em paz."
            socialmedia_name = "instagram"
            userId = 10
            date = "2025-07-09T00:00:00.000Z"
        },
        @{
            post_url = "https://x.com/nikolas_dm/status/1945216052054647127"
            user_photo = "http://dbsweb.com.br/wp-content/uploads/2025/07/nicolas_profile.jpg"
            post_image = $null
            name_profile = "@nikolas_dm"
            post_text = "Ainda falta o plenário decidir sobre a cassação do mandato do Janones pela rachadinha. Em breve."
            socialmedia_name = "x"
            userId = 10
            date = "2025-07-15T17:17:00.000Z"
        },
        @{
            post_url = "https://x.com/nikolas_dm/status/1945214000532177228"
            user_photo = "http://dbsweb.com.br/wp-content/uploads/2025/07/nicolas_profile.jpg"
            post_image = $null
            name_profile = "@nikolas_dm"
            post_text = "90 dias sem Janones na câmara. Em breve, fora definitivamente."
            socialmedia_name = "x"
            userId = 10
            date = "2025-07-15T17:08:00.000Z"
        },
        @{
            post_url = "https://www.instagram.com/p/example1"
            user_photo = "http://dbsweb.com.br/wp-content/uploads/2025/07/eduardo_profile.jpg"
            post_image = "http://dbsweb.com.br/wp-content/uploads/2025/07/snaplytics.io_instagram_thumbnail-4.jpg"
            name_profile = "@bolsonarosp"
            post_text = "Já falei que estou disposto as últimas consequências para impedir que o maior tirano que o Brasil já viu mergulhe o país numa aventura. É hora de reagirmos."
            socialmedia_name = "instagram"
            userId = 10
            date = "2025-07-14T00:00:00.000Z"
        },
        @{
            post_url = "https://www.instagram.com/p/example2"
            user_photo = "http://dbsweb.com.br/wp-content/uploads/2025/07/eduardo_profile.jpg"
            post_image = "http://dbsweb.com.br/wp-content/uploads/2025/07/snaplytics.io_instagram_thumbnail-5.jpg"
            name_profile = "@bolsonarosp"
            post_text = "Achou ruim? Espere até ver as reações de Trump caso @jairmessiasbolsonaro seja condenado."
            socialmedia_name = "instagram"
            userId = 10
            date = "2025-07-14T00:00:00.000Z"
        },
        @{
            post_url = "https://x.com/BolsonaroSP/status/1945175876263370889"
            user_photo = "http://dbsweb.com.br/wp-content/uploads/2025/07/eduardo_profile.jpg"
            post_image = $null
            name_profile = "@BolsonaroSP"
            post_text = "Se no Brasil já não há mais constituição, então viemos beber na fonte da constituição do país referência em democracia e liberdade."
            socialmedia_name = "x"
            userId = 10
            date = "2025-07-15T14:37:00.000Z"
        },
        @{
            post_url = "https://x.com/BolsonaroSP/status/1945112447381078434"
            user_photo = "http://dbsweb.com.br/wp-content/uploads/2025/07/eduardo_profile.jpg"
            post_image = $null
            name_profile = "@BolsonaroSP"
            post_text = "Sim, prezado @gcamarotti. O que nos trouxe até aqui foi a turma do 'deixa disso', da diplomacia. Então estamos no all-in mesmo, não há outra saída"
            socialmedia_name = "x"
            userId = 10
            date = "2025-07-15T10:25:00.000Z"
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


