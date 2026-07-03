#!/bin/bash
# =========================================================
# Aadidev Properties — Server Seeding Script
# Runs directly on the server to insert property & upload local images
# =========================================================

set -e

echo "=========================================="
echo "  Seeding Database on Server..."
echo "=========================================="

# 1. Insert Property via Curl
echo "Creating property..."
PROPERTY_JSON='{
    "title": "1BHK Flat in Tharwani Majestic",
    "description": "1BHK flat available for sale in Tharwani Majestic. Location: Godrej Hills, Khadakpada, Kalyan West, near Jhulelal Chowk. It is situated in a co-operative housing society. Area: 725 sqft built-up.",
    "price": 4700000,
    "location": "Godrej Hills, Khadakpada, Kalyan West",
    "propertyType": "APARTMENT",
    "status": "FOR_SALE",
    "area": 725,
    "bedrooms": 1,
    "bathrooms": 1,
    "parkingAvailable": true,
    "featured": true
}'

# Call localhost API
RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d "$PROPERTY_JSON" http://localhost:8080/api/properties)

# Extract ID using grep/sed (since jq might not be installed)
PROPERTY_ID=$(echo "$RESPONSE" | grep -o '"id":[0-9]*' | cut -d':' -f2)

if [ -z "$PROPERTY_ID" ]; then
    echo "❌ Failed to create property. Response: $RESPONSE"
    exit 1
fi

echo "✅ Created property successfully! ID: $PROPERTY_ID"

# 2. Upload Images
IMAGE_DIR="/var/www/aadidev/office"
IMAGES=("office_1.png" "office_2.png" "office_3.png" "office_4.jpg" "office_5.jpg")

for IMG in "${IMAGES[@]}"; do
    FILE_PATH="$IMAGE_DIR/$IMG"
    if [ -f "$FILE_PATH" ]; then
        echo "Uploading $IMG..."
        UPLOAD_RESPONSE=$(curl -s -X POST \
            -F "file=@$FILE_PATH" \
            http://localhost:8080/api/images/property/$PROPERTY_ID)
        echo "✅ Uploaded $IMG. Response: $UPLOAD_RESPONSE"
    else
        echo "⚠️ Image file not found: $FILE_PATH"
    fi
done

echo "=========================================="
echo "🎉 Seeding Completed Successfully!"
echo "=========================================="
