# Final test with POST method
Write-Host "Testing Webhook with POST Method (Final)" -ForegroundColor Cyan

$webhookUrl = "https://n8n.dbsweb.com.br/webhook/b30d3d2d-4848-49cc-83fc-a47e4ffa79fe"

# Test payload exactly as our app sends it
$testPayload = @(
    @{
        cliente = "Cliente"
        rede_social = "instagram"
        post_url = "https://www.instagram.com/p/TEST123/"
        briefingid = "test-briefing-123"
        "instruções específicas" = "Esta é uma abordagem de teste para apoiar esta sugestão"
        button = "apoiar"
    }
)

Write-Host "Testing URL: $webhookUrl" -ForegroundColor Yellow
Write-Host "Method: POST" -ForegroundColor Yellow
Write-Host "Payload:" -ForegroundColor Gray
$testPayload | ConvertTo-Json -Depth 3 | Write-Host -ForegroundColor Gray

Write-Host "`nSending POST request..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri $webhookUrl -Method POST -Body ($testPayload | ConvertTo-Json -Depth 3) -ContentType "application/json" -UseBasicParsing
    
    Write-Host "[SUCCESS] Webhook works!" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response Body:" -ForegroundColor Gray
    $response.Content | Write-Host -ForegroundColor Gray
    
} catch {
    Write-Host "[ERROR] Webhook failed!" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    Write-Host "Error Message: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTest completed. If successful, the suggestion webhook integration is ready!" -ForegroundColor Cyan
