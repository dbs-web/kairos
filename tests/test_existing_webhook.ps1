# Test existing webhook to verify base URL works
Write-Host "Testing Existing Webhook" -ForegroundColor Cyan

$existingWebhookUrl = "https://n8n.dbsweb.com.br/webhook/ef485eb2-4640-4569-b4f4-6a03297fff62"
$testPayload = @(
    @{
        CLIENTE = "Cliente"
        TEMA = "Test tema"
        FORMATO = "Kairos"
        "INSTRUÇÕES" = "Test instructions"
        BRIEFINGID = ""
    }
)

Write-Host "Testing existing webhook URL: $existingWebhookUrl" -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri $existingWebhookUrl -Method POST -Body ($testPayload | ConvertTo-Json -Depth 3) -ContentType "application/json"
    Write-Host "[SUCCESS] Existing webhook works!" -ForegroundColor Green
    Write-Host "Response: $response" -ForegroundColor Gray
} catch {
    Write-Host "[ERROR] Existing webhook failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nNow testing the suggestion webhook URL..." -ForegroundColor Yellow
$suggestionWebhookUrl = "https://n8n.dbsweb.com.br/webhook/b30d3d2d-4848-49cc-83fc-a47e4ffa79fe"

$suggestionPayload = @(
    @{
        cliente = "Cliente"
        rede_social = "instagram"
        post_url = "https://www.instagram.com/p/TEST123/"
        briefingid = "test-123"
        "instruções específicas" = "Test approach"
        button = "apoiar"
    }
)

try {
    $response = Invoke-RestMethod -Uri $suggestionWebhookUrl -Method POST -Body ($suggestionPayload | ConvertTo-Json -Depth 3) -ContentType "application/json"
    Write-Host "[SUCCESS] Suggestion webhook works!" -ForegroundColor Green
    Write-Host "Response: $response" -ForegroundColor Gray
} catch {
    Write-Host "[ERROR] Suggestion webhook failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}
