# Test the webhook with GET method and query parameters
Write-Host "Testing Webhook with GET Method" -ForegroundColor Cyan

$baseUrl = "https://n8n.dbsweb.com.br/webhook-test/b30d3d2d-4848-49cc-83fc-a47e4ffa79fe"

# Build URL with query parameters
$params = @{
    'cliente' = 'Cliente'
    'rede_social' = 'instagram'
    'post_url' = 'https://www.instagram.com/p/TEST123/'
    'briefingid' = 'test-123'
    'instruções_específicas' = 'test approach text'
    'button' = 'apoiar'
}

$queryString = ($params.GetEnumerator() | ForEach-Object { "$($_.Key)=$([System.Web.HttpUtility]::UrlEncode($_.Value))" }) -join '&'
$fullUrl = "$baseUrl?$queryString"

Write-Host "Testing URL: $fullUrl" -ForegroundColor Yellow
Write-Host "`nSending GET request..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri $fullUrl -Method GET -UseBasicParsing
    
    Write-Host "[SUCCESS] Webhook responded!" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response Body:" -ForegroundColor Gray
    $response.Content | Write-Host -ForegroundColor Gray
    
} catch {
    Write-Host "[ERROR] Webhook failed!" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    Write-Host "Error Message: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nAlso testing the original POST method to compare..." -ForegroundColor Yellow

$testPayload = @(
    @{
        cliente = "Cliente"
        rede_social = "instagram"
        post_url = "https://www.instagram.com/p/TEST123/"
        briefingid = "test-123"
        "instruções específicas" = "test approach text"
        button = "apoiar"
    }
)

try {
    $response = Invoke-WebRequest -Uri $baseUrl -Method POST -Body ($testPayload | ConvertTo-Json -Depth 3) -ContentType "application/json" -UseBasicParsing
    Write-Host "[SUCCESS] POST method also works!" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "[INFO] POST method failed (expected if webhook is GET-only)" -ForegroundColor Yellow
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
}

Write-Host "`nTest completed." -ForegroundColor Cyan
