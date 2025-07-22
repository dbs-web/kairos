# Test with simpler payload
Write-Host "Testing Webhook with Simple Payload" -ForegroundColor Cyan

$webhookUrl = "https://n8n.dbsweb.com.br/webhook/b30d3d2d-4848-49cc-83fc-a47e4ffa79fe"

# Test 1: Very simple payload
Write-Host "`n1. Testing with minimal payload..." -ForegroundColor Yellow
$simplePayload = @{
    button = "apoiar"
    cliente = "Cliente"
}

try {
    $response = Invoke-WebRequest -Uri $webhookUrl -Method POST -Body ($simplePayload | ConvertTo-Json) -ContentType "application/json" -UseBasicParsing
    Write-Host "[SUCCESS] Simple payload works!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Simple payload failed: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

# Test 2: Without array wrapper
Write-Host "`n2. Testing without array wrapper..." -ForegroundColor Yellow
$objectPayload = @{
    cliente = "Cliente"
    rede_social = "instagram"
    post_url = "https://www.instagram.com/p/TEST123/"
    briefingid = "test-123"
    abordagem = "test approach"
    button = "apoiar"
}

try {
    $response = Invoke-WebRequest -Uri $webhookUrl -Method POST -Body ($objectPayload | ConvertTo-Json) -ContentType "application/json" -UseBasicParsing
    Write-Host "[SUCCESS] Object payload works!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Object payload failed: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

# Test 3: Empty POST
Write-Host "`n3. Testing empty POST..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $webhookUrl -Method POST -UseBasicParsing
    Write-Host "[SUCCESS] Empty POST works!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Empty POST failed: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

Write-Host "`nTest completed." -ForegroundColor Cyan
