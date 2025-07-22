# Test the webhook endpoint directly
Write-Host "Testing Webhook Endpoint Directly" -ForegroundColor Cyan

$webhookUrl = "https://n8n.dbsweb.com.br/webhook/b30d3d2d-4848-49cc-83fc-a47e4ffa79fe"

# Test payload matching exactly what the app sends
$testPayload = @(
    @{
        cliente = "Cliente"
        rede_social = "instagram"
        post_url = "https://www.instagram.com/p/TEST123/"
        briefingid = ""
        "instruções específicas" = "test approach text"
        button = "apoiar"
    }
)

Write-Host "Testing URL: $webhookUrl" -ForegroundColor Yellow
Write-Host "Payload:" -ForegroundColor Gray
$testPayload | ConvertTo-Json -Depth 3 | Write-Host -ForegroundColor Gray

Write-Host "`nSending request..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri $webhookUrl -Method POST -Body ($testPayload | ConvertTo-Json -Depth 3) -ContentType "application/json" -UseBasicParsing
    
    Write-Host "[SUCCESS] Webhook responded!" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response Headers:" -ForegroundColor Gray
    $response.Headers | Format-Table | Out-String | Write-Host -ForegroundColor Gray
    Write-Host "Response Body:" -ForegroundColor Gray
    $response.Content | Write-Host -ForegroundColor Gray
    
} catch {
    Write-Host "[ERROR] Webhook failed!" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    Write-Host "Error Message: $($_.Exception.Message)" -ForegroundColor Red
    
    # Try to get response content if available
    if ($_.Exception.Response) {
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response Body: $responseBody" -ForegroundColor Red
        } catch {
            Write-Host "Could not read response body" -ForegroundColor Red
        }
    }
}

Write-Host "`nTest completed." -ForegroundColor Cyan
