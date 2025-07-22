# Test using the same structure as the working webhook
Write-Host "Testing with Working Webhook Structure" -ForegroundColor Cyan

$suggestionWebhookUrl = "https://n8n.dbsweb.com.br/webhook/b30d3d2d-4848-49cc-83fc-a47e4ffa79fe"
$workingWebhookUrl = "https://n8n.dbsweb.com.br/webhook/ef485eb2-4640-4569-b4f4-6a03297fff62"

# Test 1: Verify working webhook still works
Write-Host "`n1. Testing working webhook for comparison..." -ForegroundColor Yellow
$workingPayload = @(
    @{
        CLIENTE = "Cliente"
        TEMA = "Test tema"
        FORMATO = "Kairos"
        "INSTRUÇÕES" = "Test instructions"
        BRIEFINGID = ""
    }
)

try {
    $response = Invoke-WebRequest -Uri $workingWebhookUrl -Method POST -Body ($workingPayload | ConvertTo-Json -Depth 3) -ContentType "application/json" -UseBasicParsing
    Write-Host "[SUCCESS] Working webhook still works! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Working webhook failed: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

# Test 2: Try suggestion webhook with similar structure
Write-Host "`n2. Testing suggestion webhook with similar structure..." -ForegroundColor Yellow
$suggestionPayload = @(
    @{
        CLIENTE = "Cliente"
        REDE_SOCIAL = "instagram"
        POST_URL = "https://www.instagram.com/p/TEST123/"
        BRIEFINGID = "test-123"
        INSTRUCOES = "test approach"
        BUTTON = "apoiar"
    }
)

try {
    $response = Invoke-WebRequest -Uri $suggestionWebhookUrl -Method POST -Body ($suggestionPayload | ConvertTo-Json -Depth 3) -ContentType "application/json" -UseBasicParsing
    Write-Host "[SUCCESS] Suggestion webhook works! Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "[ERROR] Suggestion webhook failed: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

# Test 3: Try with just one simple field
Write-Host "`n3. Testing with minimal data..." -ForegroundColor Yellow
$minimalPayload = @(
    @{
        test = "hello"
    }
)

try {
    $response = Invoke-WebRequest -Uri $suggestionWebhookUrl -Method POST -Body ($minimalPayload | ConvertTo-Json -Depth 3) -ContentType "application/json" -UseBasicParsing
    Write-Host "[SUCCESS] Minimal payload works! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Minimal payload failed: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

Write-Host "`nTest completed." -ForegroundColor Cyan
