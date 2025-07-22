# Test both URL formats
Write-Host "Testing Both URL Formats" -ForegroundColor Cyan

$testUrl = "https://n8n.dbsweb.com.br/webhook-test/b30d3d2d-4848-49cc-83fc-a47e4ffa79fe"
$prodUrl = "https://n8n.dbsweb.com.br/webhook/b30d3d2d-4848-49cc-83fc-a47e4ffa79fe"

Write-Host "1. Testing Test URL with GET: $testUrl" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $testUrl -Method GET -UseBasicParsing
    Write-Host "[SUCCESS] Test URL works!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Test URL failed: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

Write-Host "`n2. Testing Production URL with GET: $prodUrl" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $prodUrl -Method GET -UseBasicParsing
    Write-Host "[SUCCESS] Production URL works!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Production URL failed: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

Write-Host "`n3. Testing Production URL with POST: $prodUrl" -ForegroundColor Yellow
$payload = @(@{ cliente = "Cliente"; button = "apoiar" }) | ConvertTo-Json -Depth 3
try {
    $response = Invoke-WebRequest -Uri $prodUrl -Method POST -Body $payload -ContentType "application/json" -UseBasicParsing
    Write-Host "[SUCCESS] Production URL with POST works!" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Production URL with POST failed: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

Write-Host "`nTest completed. Check which URL/method combination works." -ForegroundColor Cyan
