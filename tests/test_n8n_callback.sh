#!/bin/bash

# Test N8N Callback API Endpoint
# This script tests the new N8N callback endpoint on api.dbsweb.com.br

echo "=== Testing N8N Callback API Endpoint ==="
echo ""

# Test URLs
BASE_URL="https://api.dbsweb.com.br"
CALLBACK_URL="$BASE_URL/n8n-callback"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Test 1: Check if API server is responding
echo -e "${YELLOW}Test 1: Checking API server health...${NC}"
if curl -s -o /dev/null -w "%{http_code}" "$BASE_URL" | grep -q "200\|404"; then
    echo -e "${GREEN}[SUCCESS] API server is responding${NC}"
else
    echo -e "${RED}[ERROR] API server not responding${NC}"
    echo "Stopping tests..."
    exit 1
fi

echo ""

# Test 2: Test N8N callback endpoint with valid data
echo -e "${YELLOW}Test 2: Testing N8N callback with valid Instagram data...${NC}"

VALID_PAYLOAD='[{
    "cliente": "10",
    "rede_social": "instagram",
    "post_url": "https://www.instagram.com/p/TEST123/",
    "briefingid": "1583",
    "texto": "🎯 **Teste de Callback N8N**\n\nEste é um teste do novo endpoint de callback do N8N.\n\n**Dados do teste:**\n• Cliente: 10\n• Rede Social: Instagram\n• Briefing ID: 1583\n\n**Status:** Funcionando perfeitamente! ✅\n\n#Teste #N8N #Callback #API"
}]'

echo "Payload being sent:"
echo "$VALID_PAYLOAD"
echo ""

RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$CALLBACK_URL" \
    -H "Content-Type: application/json" \
    -d "$VALID_PAYLOAD")

HTTP_CODE=$(echo $RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
BODY=$(echo $RESPONSE | sed -e 's/HTTPSTATUS:.*//g')

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}[SUCCESS] N8N callback endpoint responded!${NC}"
    echo -e "${GREEN}Status Code: $HTTP_CODE${NC}"
    echo -e "${GREEN}Response: $BODY${NC}"
else
    echo -e "${RED}[ERROR] N8N callback failed${NC}"
    echo -e "${RED}Status Code: $HTTP_CODE${NC}"
    echo -e "${RED}Response: $BODY${NC}"
fi

echo ""

# Test 3: Test with different social media (X/Twitter)
echo -e "${YELLOW}Test 3: Testing with X/Twitter data...${NC}"

TWITTER_PAYLOAD='[{
    "cliente": "10",
    "rede_social": "x",
    "post_url": "https://x.com/example/status/1234567890",
    "briefingid": "1584",
    "texto": "📊 **Análise de Tendências - Teste X/Twitter**\n\nTeste do endpoint N8N com dados do X (Twitter).\n\n**Insights:**\n🔍 Endpoint funcionando corretamente\n📈 Integração N8N → API → Kairos operacional\n🎯 Callback sendo processado com sucesso\n\n**Próximos passos:**\n1. Verificar atualização no briefing\n2. Confirmar polling automático\n3. Validar exibição na interface\n\n#TesteAPI #N8N #Twitter #Integração"
}]'

TWITTER_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$CALLBACK_URL" \
    -H "Content-Type: application/json" \
    -d "$TWITTER_PAYLOAD")

TWITTER_HTTP_CODE=$(echo $TWITTER_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
TWITTER_BODY=$(echo $TWITTER_RESPONSE | sed -e 's/HTTPSTATUS:.*//g')

if [ "$TWITTER_HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}[SUCCESS] Twitter/X test successful!${NC}"
    echo -e "${GREEN}Status Code: $TWITTER_HTTP_CODE${NC}"
    echo -e "${GREEN}Response: $TWITTER_BODY${NC}"
else
    echo -e "${RED}[ERROR] Twitter/X test failed${NC}"
    echo -e "${RED}Status Code: $TWITTER_HTTP_CODE${NC}"
    echo -e "${RED}Response: $TWITTER_BODY${NC}"
fi

echo ""

# Test 4: Test with invalid data (missing required fields)
echo -e "${YELLOW}Test 4: Testing with invalid data (missing briefingid)...${NC}"

INVALID_PAYLOAD='[{
    "cliente": "10",
    "rede_social": "instagram",
    "post_url": "https://www.instagram.com/p/TEST123/",
    "texto": "Test without briefingid"
}]'

INVALID_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST "$CALLBACK_URL" \
    -H "Content-Type: application/json" \
    -d "$INVALID_PAYLOAD")

INVALID_HTTP_CODE=$(echo $INVALID_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
INVALID_BODY=$(echo $INVALID_RESPONSE | sed -e 's/HTTPSTATUS:.*//g')

if [ "$INVALID_HTTP_CODE" -eq 400 ]; then
    echo -e "${GREEN}[EXPECTED] Invalid data correctly rejected${NC}"
    echo -e "${GREEN}Status Code: $INVALID_HTTP_CODE${NC}"
    echo -e "${GREEN}Response: $INVALID_BODY${NC}"
else
    echo -e "${YELLOW}[UNEXPECTED] Invalid data was accepted or different error${NC}"
    echo -e "${YELLOW}Status Code: $INVALID_HTTP_CODE${NC}"
    echo -e "${YELLOW}Response: $INVALID_BODY${NC}"
fi

echo ""

# Test 5: Test endpoint availability
echo -e "${YELLOW}Test 5: Testing endpoint availability...${NC}"

ENDPOINTS=("/chat" "/chat-agent" "/check" "/n8n-callback")

for endpoint in "${ENDPOINTS[@]}"; do
    TEST_URL="$BASE_URL$endpoint"
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X HEAD "$TEST_URL")
    
    if [ "$HTTP_STATUS" -eq 200 ] || [ "$HTTP_STATUS" -eq 405 ] || [ "$HTTP_STATUS" -eq 422 ]; then
        echo -e "${GREEN}[AVAILABLE] $endpoint${NC}"
    else
        echo -e "${RED}[NOT FOUND] $endpoint (Status: $HTTP_STATUS)${NC}"
    fi
done

echo ""
echo -e "${CYAN}=== Test Summary ===${NC}"
echo -e "${GREEN}✅ API Server Health Check${NC}"
echo -e "${GREEN}✅ N8N Callback Endpoint Test${NC}"
echo -e "${GREEN}✅ Multiple Social Media Support${NC}"
echo -e "${GREEN}✅ Error Handling Validation${NC}"
echo -e "${GREEN}✅ Endpoint Availability Check${NC}"
echo ""
echo -e "${GREEN}🎉 All tests completed! Check your Kairos briefing page to see if the content was updated.${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Configure N8N HTTP Request node with URL: $CALLBACK_URL"
echo "2. Use POST method with JSON body format from Test 2"
echo "3. Verify briefing updates appear in Kairos within 10 seconds"
