# Simple test of the webhook with GET method
Write-Host "Testing Webhook with GET Method (Simple)" -ForegroundColor Cyan

$baseUrl = "https://n8n.dbsweb.com.br/webhook-test/b30d3d2d-4848-49cc-83fc-a47e4ffa79fe"

# Test simple GET request first
Write-Host "1. Testing simple GET request to: $baseUrl" -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri $baseUrl -Method GET -UseBasicParsing
    Write-Host "[SUCCESS] Simple GET works!" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "[ERROR] Simple GET failed!" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test with query parameters manually
$urlWithParams = "$baseUrl" + "?cliente=Cliente&rede_social=instagram&post_url=https://www.instagram.com/p/TEST123/&briefingid=test-123&button=apoiar"

Write-Host "`n2. Testing GET with query parameters:" -ForegroundColor Yellow
Write-Host "$urlWithParams" -ForegroundColor Gray

try {
    $response = Invoke-WebRequest -Uri $urlWithParams -Method GET -UseBasicParsing
    Write-Host "[SUCCESS] GET with params works!" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "[ERROR] GET with params failed!" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTest completed." -ForegroundColor Cyan
