# Test webhook with different parameter combinations
Write-Host "Testing Webhook with Various Parameters" -ForegroundColor Cyan

$webhookUrl = "https://n8n.dbsweb.com.br/webhook/b30d3d2d-4848-49cc-83fc-a47e4ffa79fe"

# Test 1: Full payload as our app sends
Write-Host "`n=== TEST 1: Full Application Payload ===" -ForegroundColor Yellow
$fullPayload = @(
    @{
        cliente = "Cliente"
        rede_social = "instagram"
        post_url = "https://www.instagram.com/p/DMXrCoix4Ec/"
        briefingid = "briefing-123"
        "instruções específicas" = "total apoio a bolsonaro, o capitão"
        button = "apoiar"
    }
)

Write-Host "Payload:" -ForegroundColor Gray
$fullPayload | ConvertTo-Json -Depth 3 | Write-Host -ForegroundColor Gray

try {
    $response = Invoke-WebRequest -Uri $webhookUrl -Method POST -Body ($fullPayload | ConvertTo-Json -Depth 3) -ContentType "application/json" -UseBasicParsing
    Write-Host "[SUCCESS] Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

# Test 2: Refutar button
Write-Host "`n=== TEST 2: Refutar Button ===" -ForegroundColor Yellow
$refutarPayload = @(
    @{
        cliente = "Cliente"
        rede_social = "twitter"
        post_url = "https://twitter.com/test/status/123"
        briefingid = "briefing-456"
        "instruções específicas" = "refutar completamente esta posição política"
        button = "refutar"
    }
)

try {
    $response = Invoke-WebRequest -Uri $webhookUrl -Method POST -Body ($refutarPayload | ConvertTo-Json -Depth 3) -ContentType "application/json" -UseBasicParsing
    Write-Host "[SUCCESS] Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

# Test 3: Neutro button (no stance)
Write-Host "`n=== TEST 3: Neutro Button ===" -ForegroundColor Yellow
$neutroPayload = @(
    @{
        cliente = "Cliente"
        rede_social = "facebook"
        post_url = "https://facebook.com/post/789"
        briefingid = "briefing-789"
        "instruções específicas" = "abordagem neutra sobre o tema"
        button = "neutro"
    }
)

try {
    $response = Invoke-WebRequest -Uri $webhookUrl -Method POST -Body ($neutroPayload | ConvertTo-Json -Depth 3) -ContentType "application/json" -UseBasicParsing
    Write-Host "[SUCCESS] Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

# Test 4: Empty briefingid (as it would be when first saving approach)
Write-Host "`n=== TEST 4: Empty Briefing ID ===" -ForegroundColor Yellow
$emptyBriefingPayload = @(
    @{
        cliente = "Cliente"
        rede_social = "instagram"
        post_url = "https://www.instagram.com/p/TEST456/"
        briefingid = ""
        "instruções específicas" = "primeira abordagem sem briefing ainda"
        button = "apoiar"
    }
)

try {
    $response = Invoke-WebRequest -Uri $webhookUrl -Method POST -Body ($emptyBriefingPayload | ConvertTo-Json -Depth 3) -ContentType "application/json" -UseBasicParsing
    Write-Host "[SUCCESS] Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

Write-Host "`n=== TESTING COMPLETE ===" -ForegroundColor Cyan
Write-Host "Check your N8N workflow executions to see the received parameters!" -ForegroundColor Yellow
