# Test script for suggestion webhook integration
Write-Host "Testing Suggestion Webhook Integration" -ForegroundColor Cyan

# Test the webhook service directly
Write-Host "`n[WEBHOOK TEST] Testing sendSuggestionToN8nWebhook service..." -ForegroundColor Yellow

# Create a test payload that matches the expected structure
$testPayload = @(
    @{
        cliente = "Cliente"
        rede_social = "instagram"
        post_url = "https://www.instagram.com/p/TEST123/?hl=pt-br"
        briefingid = "test-briefing-123"
        "instruções específicas" = "Esta é uma abordagem de teste para apoiar esta sugestão"
        button = "apoiar"
    }
)

$webhookUrl = "https://n8n.dbsweb.com.br/webhook/b30d3d2d-4848-49cc-83fc-a47e4ffa79fe"

Write-Host "Webhook URL: $webhookUrl" -ForegroundColor Gray
Write-Host "Test Payload:" -ForegroundColor Gray
$testPayload | ConvertTo-Json -Depth 3 | Write-Host

try {
    $response = Invoke-RestMethod -Uri $webhookUrl -Method POST -Body ($testPayload | ConvertTo-Json -Depth 3) -ContentType "application/json"
    Write-Host "[SUCCESS] Webhook test successful!" -ForegroundColor Green
    Write-Host "Response: $response" -ForegroundColor Gray
} catch {
    Write-Host "[ERROR] Webhook test failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n[INTEGRATION TEST] Testing complete suggestion flow..." -ForegroundColor Yellow
Write-Host "1. The webhook should be called when users click 'Apoiar' or 'Refutar'" -ForegroundColor Gray
Write-Host "2. The webhook should be called again when suggestions are sent to production" -ForegroundColor Gray
Write-Host "3. Check browser console for webhook logs when testing in the UI" -ForegroundColor Gray

Write-Host "`nExpected webhook payload structure:" -ForegroundColor Yellow
@"
[{
    "cliente": "Cliente",
    "rede_social": "[rede]",
    "post_url": "[url]",
    "briefingid": "[briefingid]",
    "instruções específicas": "[abordagem do campo de texto]",
    "button": "[apoiar/refutar]"
}]
"@ | Write-Host -ForegroundColor Gray

Write-Host "`nTest completed. Check the webhook endpoint logs to verify data reception." -ForegroundColor Cyan
