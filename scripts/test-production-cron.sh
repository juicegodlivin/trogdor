#!/bin/bash
# Quick test of production cron endpoint

CRON_SECRET="D3Vs7SmIxXVaJtjAwcZfHUlO1KZu/zmxHsfdxvEDcXI="
PROD_URL="https://trogdor-9avhhhsq5-juices-project.vercel.app"

echo "🔥 Testing Production Cron Endpoint"
echo "======================================"
echo ""

echo "1️⃣ Testing WITHOUT auth (should fail with 401)..."
curl -s -w "\n   Status: %{http_code}\n" "$PROD_URL/api/cron/fetch-mentions"
echo ""

echo "2️⃣ Testing WITH auth (should succeed with 200)..."
curl -s -H "Authorization: Bearer $CRON_SECRET" "$PROD_URL/api/cron/fetch-mentions" | jq '.'
echo ""

echo "✅ Test complete!"

