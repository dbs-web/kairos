# Test the complete suggestion flow (Option B)
Write-Host "Testing Complete Suggestion Flow - Option B" -ForegroundColor Cyan
Write-Host "Webhook should ONLY be sent when 'Enviar para Produção' is clicked" -ForegroundColor Yellow

Write-Host "`n=== FLOW DESCRIPTION ===" -ForegroundColor Green
Write-Host "1. User clicks 'Apoiar' or 'Refutar' button on suggestion card" -ForegroundColor Gray
Write-Host "   → Opens dialog to enter approach text" -ForegroundColor Gray
Write-Host "   → NO webhook sent at this point" -ForegroundColor Gray

Write-Host "`n2. User enters approach text and clicks 'Salvar'" -ForegroundColor Gray
Write-Host "   → Approach and stance saved locally" -ForegroundColor Gray
Write-Host "   → Suggestion becomes selected" -ForegroundColor Gray
Write-Host "   → NO webhook sent at this point" -ForegroundColor Gray

Write-Host "`n3. User clicks 'Enviar para Produção' button" -ForegroundColor Gray
Write-Host "   → Calls /api/sugestoes/aprovar endpoint" -ForegroundColor Gray
Write-Host "   → Creates briefings" -ForegroundColor Gray
Write-Host "   → WEBHOOK IS SENT HERE with payload:" -ForegroundColor Gray

$expectedPayload = @"
[{
    "cliente": "Cliente",
    "rede_social": "[suggestion.socialmedia_name]",
    "post_url": "[suggestion.post_url]",
    "briefingid": "[created_briefing_id]",
    "instruções específicas": "[user_approach_text]",
    "button": "[apoiar/refutar/neutro]"
}]
"@

Write-Host $expectedPayload -ForegroundColor Cyan

Write-Host "`n=== WEBHOOK ENDPOINT ===" -ForegroundColor Green
Write-Host "URL: https://n8n.dbsweb.com.br/webhook/b30d3d2d-4848-49cc-83fc-a47e4ffa79fe" -ForegroundColor Gray

Write-Host "`n=== BUTTON VALUES ===" -ForegroundColor Green
Write-Host "• 'apoiar' - when user clicked Apoiar button" -ForegroundColor Gray
Write-Host "• 'refutar' - when user clicked Refutar button" -ForegroundColor Gray
Write-Host "• 'neutro' - when user didn't click Apoiar/Refutar (just added approach)" -ForegroundColor Gray

Write-Host "`n=== TO TEST MANUALLY ===" -ForegroundColor Yellow
Write-Host "1. Start the application" -ForegroundColor Gray
Write-Host "2. Go to suggestions page" -ForegroundColor Gray
Write-Host "3. Click 'Apoiar' on a suggestion → Enter approach → Save" -ForegroundColor Gray
Write-Host "4. Click 'Enviar para Produção'" -ForegroundColor Gray
Write-Host "5. Check browser console for webhook logs" -ForegroundColor Gray
Write-Host "6. Check N8N webhook logs for received data" -ForegroundColor Gray

Write-Host "`nFlow test description completed!" -ForegroundColor Cyan
