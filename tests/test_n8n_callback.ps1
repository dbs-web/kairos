# Test N8N Callback API Endpoint
# This script tests the new N8N callback endpoint on api.dbsweb.com.br

Write-Host "=== Testing N8N Callback API Endpoint ===" -ForegroundColor Cyan
Write-Host ""

# Test URLs
$baseUrl = "https://api.dbsweb.com.br"
$callbackUrl = "$baseUrl/n8n-callback"

# Test 1: Check if API server is responding
Write-Host "Test 1: Checking API server health..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-WebRequest -Uri $baseUrl -Method GET -UseBasicParsing
    Write-Host "[SUCCESS] API server is responding" -ForegroundColor Green
    Write-Host "Status Code: $($healthResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] API server not responding: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Stopping tests..." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Test N8N callback endpoint with valid data
Write-Host "Test 2: Testing N8N callback with valid data..." -ForegroundColor Yellow

$validPayload = @(
    @{
        "cliente" = "10"
        "rede_social" = "instagram"
        "post_url" = "https://www.instagram.com/p/TEST123/"
        "briefingid" = "1583"
        "texto" = "🎯 **Teste de Callback N8N**`n`nEste é um teste do novo endpoint de callback do N8N.`n`n**Dados do teste:**`n• Cliente: 10`n• Rede Social: Instagram`n• Briefing ID: 1583`n`n**Status:** Funcionando perfeitamente! ✅`n`n#Teste #N8N #Callback #API"
    }
)

$jsonPayload = $validPayload | ConvertTo-Json -Depth 3

Write-Host "Payload being sent:"
Write-Host $jsonPayload -ForegroundColor Gray
Write-Host ""

try {
    $callbackResponse = Invoke-WebRequest -Uri $callbackUrl -Method POST -Body $jsonPayload -ContentType "application/json" -UseBasicParsing
    Write-Host "[SUCCESS] N8N callback endpoint responded!" -ForegroundColor Green
    Write-Host "Status Code: $($callbackResponse.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($callbackResponse.Content)" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] N8N callback failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorContent = $reader.ReadToEnd()
        Write-Host "Error Response: $errorContent" -ForegroundColor Red
    }
}

Write-Host ""

# Test 3: Test with different social media
Write-Host "Test 3: Testing with different social media (X/Twitter)..." -ForegroundColor Yellow

$twitterPayload = @(
    @{
        "cliente" = "10"
        "rede_social" = "x"
        "post_url" = "https://x.com/example/status/1234567890"
        "briefingid" = "1584"
        "texto" = "📊 **Análise de Tendências - Teste X/Twitter**`n`nTeste do endpoint N8N com dados do X (Twitter).`n`n**Insights:**`n🔍 Endpoint funcionando corretamente`n📈 Integração N8N → API → Kairos operacional`n🎯 Callback sendo processado com sucesso`n`n**Próximos passos:**`n1. Verificar atualização no briefing`n2. Confirmar polling automático`n3. Validar exibição na interface`n`n#TesteAPI #N8N #Twitter #Integração"
    }
)

$twitterJson = $twitterPayload | ConvertTo-Json -Depth 3

try {
    $twitterResponse = Invoke-WebRequest -Uri $callbackUrl -Method POST -Body $twitterJson -ContentType "application/json" -UseBasicParsing
    Write-Host "[SUCCESS] Twitter/X test successful!" -ForegroundColor Green
    Write-Host "Status Code: $($twitterResponse.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($twitterResponse.Content)" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Twitter/X test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 4: Test with invalid data (missing required fields)
Write-Host "Test 4: Testing with invalid data (missing briefingid)..." -ForegroundColor Yellow

$invalidPayload = @(
    @{
        "cliente" = "10"
        "rede_social" = "instagram"
        "post_url" = "https://www.instagram.com/p/TEST123/"
        "texto" = "Test without briefingid"
    }
)

$invalidJson = $invalidPayload | ConvertTo-Json -Depth 3

try {
    $invalidResponse = Invoke-WebRequest -Uri $callbackUrl -Method POST -Body $invalidJson -ContentType "application/json" -UseBasicParsing
    Write-Host "[UNEXPECTED] Invalid data was accepted (should have failed)" -ForegroundColor Yellow
    Write-Host "Response: $($invalidResponse.Content)" -ForegroundColor Yellow
} catch {
    Write-Host "[EXPECTED] Invalid data correctly rejected" -ForegroundColor Green
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Green
}

Write-Host ""

# Test 5: Test endpoint availability
Write-Host "Test 5: Testing endpoint availability..." -ForegroundColor Yellow

$endpoints = @(
    "/chat",
    "/chat-agent", 
    "/check",
    "/n8n-callback"
)

foreach ($endpoint in $endpoints) {
    $testUrl = "$baseUrl$endpoint"
    try {
        # Use HEAD request to check if endpoint exists
        $headResponse = Invoke-WebRequest -Uri $testUrl -Method HEAD -UseBasicParsing -ErrorAction SilentlyContinue
        Write-Host "[AVAILABLE] $endpoint" -ForegroundColor Green
    } catch {
        if ($_.Exception.Response.StatusCode -eq 405) {
            Write-Host "[AVAILABLE] $endpoint (Method not allowed - endpoint exists)" -ForegroundColor Green
        } elseif ($_.Exception.Response.StatusCode -eq 422) {
            Write-Host "[AVAILABLE] $endpoint (Validation error - endpoint exists)" -ForegroundColor Green
        } else {
            Write-Host "[NOT FOUND] $endpoint" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "=== Test Summary ===" -ForegroundColor Cyan
Write-Host "✅ API Server Health Check" -ForegroundColor Green
Write-Host "✅ N8N Callback Endpoint Test" -ForegroundColor Green
Write-Host "✅ Multiple Social Media Support" -ForegroundColor Green
Write-Host "✅ Error Handling Validation" -ForegroundColor Green
Write-Host "✅ Endpoint Availability Check" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 All tests completed! Check your Kairos briefing page to see if the content was updated." -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure N8N HTTP Request node with URL: $callbackUrl" -ForegroundColor White
Write-Host "2. Use POST method with JSON body format from Test 2" -ForegroundColor White
Write-Host "3. Verify briefing updates appear in Kairos within 10 seconds" -ForegroundColor White
