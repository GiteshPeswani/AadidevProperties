# Seeding script for real property (Production)

# 0. Fetch and delete current inquiries
Write-Host "Fetching current inquiries..."
$inquiries = Invoke-RestMethod -Uri "http://143.110.181.184/api/inquiries" -Method Get
Write-Host "Found $($inquiries.Count) inquiries."
foreach ($inq in $inquiries) {
    Write-Host "Deleting inquiry $($inq.id) by $($inq.name)..."
    Invoke-RestMethod -Uri "http://143.110.181.184/api/inquiries/$($inq.id)" -Method Delete
}
Write-Host "All inquiries deleted successfully."

# 1. Fetch current properties
Write-Host "Fetching current properties..."
$properties = Invoke-RestMethod -Uri "http://143.110.181.184/api/properties" -Method Get
Write-Host "Found $($properties.Count) properties."

# 2. Delete current properties
foreach ($prop in $properties) {
    Write-Host "Deleting property $($prop.id): $($prop.title)..."
    Invoke-RestMethod -Uri "http://143.110.181.184/api/properties/$($prop.id)" -Method Delete
}
Write-Host "All dummy properties deleted successfully."

# 3. Create real property
$body = @{
    title = "1BHK Flat in Tharwani Majestic"
    description = "1BHK flat available for sale in Tharwani Majestic. Location: Godrej Hills, Khadakpada, Kalyan West, near Jhulelal Chowk. It is situated in a co-operative housing society. Area: 725 sqft built-up."
    price = 4700000
    location = "Godrej Hills, Khadakpada, Kalyan West"
    propertyType = "APARTMENT"
    status = "FOR_SALE"
    area = 725
    bedrooms = 1
    bathrooms = 1
    parkingAvailable = $true
    featured = $true
} | ConvertTo-Json -Depth 5

Write-Host "Creating new property..."
$newProperty = Invoke-RestMethod -Uri "http://143.110.181.184/api/properties" -Method Post -Body $body -ContentType "application/json; charset=utf-8"
$newId = $newProperty.id
Write-Host "Created property successfully! New ID: $newId"

# Load assembly for System.Net.Http
[void][System.Reflection.Assembly]::LoadWithPartialName("System.Net.Http")

# 4. Upload images
$photoFiles = @(
    "C:\Users\Lenovo\.gemini\antigravity\brain\fcf38954-f3ce-4a27-a935-930ddbb69733\media__1782233491585.jpg",
    "C:\Users\Lenovo\.gemini\antigravity\brain\fcf38954-f3ce-4a27-a935-930ddbb69733\media__1782233491590.jpg",
    "C:\Users\Lenovo\.gemini\antigravity\brain\fcf38954-f3ce-4a27-a935-930ddbb69733\media__1782233491598.jpg",
    "C:\Users\Lenovo\.gemini\antigravity\brain\fcf38954-f3ce-4a27-a935-930ddbb69733\media__1782233491605.jpg",
    "C:\Users\Lenovo\.gemini\antigravity\brain\fcf38954-f3ce-4a27-a935-930ddbb69733\media__1782233491609.jpg"
)

foreach ($filePath in $photoFiles) {
    if (Test-Path $filePath) {
        Write-Host "Uploading image: $filePath..."
        
        $httpClient = New-Object System.Net.Http.HttpClient
        $content = New-Object System.Net.Http.MultipartFormDataContent
        
        $fileStream = [System.IO.File]::OpenRead($filePath)
        $fileName = [System.IO.Path]::GetFileName($filePath)
        $fileContent = New-Object System.Net.Http.StreamContent($fileStream)
        $fileContent.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse("image/jpeg")
        
        $content.Add($fileContent, "file", $fileName)
        
        $uri = "http://143.110.181.184/api/images/property/$newId"
        $response = $httpClient.PostAsync($uri, $content).Result
        $responseBody = $response.Content.ReadAsStringAsync().Result
        
        $fileStream.Close()
        $httpClient.Dispose()
        
        Write-Host "Uploaded successfully! Response: $responseBody"
    } else {
        Write-Warning "File not found: $filePath"
    }
}

Write-Host "Database seeding completed successfully!"
