import urllib.request
import urllib.parse
import json
import os
import sys

API_BASE = "http://143.110.181.184/api"
LOG_FILE = "d:/adidevproperties/py_seed_run_log.txt"

def log(msg):
    print(msg)
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(str(msg) + "\n")
    except Exception as e:
        pass

def delete_properties():
    log("1. Fetching current properties...")
    try:
        req = urllib.request.Request(f"{API_BASE}/properties", method="GET")
        with urllib.request.urlopen(req) as response:
            properties = json.loads(response.read().decode())
            log(f"Found {len(properties)} properties.")
            for p in properties:
                pid = p['id']
                log(f"Deleting property {pid}...")
                del_req = urllib.request.Request(f"{API_BASE}/properties/{pid}", method="DELETE")
                urllib.request.urlopen(del_req)
            log("Delete completed.")
    except Exception as e:
        log(f"Error during delete: {e}")

def create_property():
    log("2. Creating new property...")
    payload = {
        "title": "1BHK Flat in Tharwani Majestic",
        "description": "1BHK flat available for sale in Tharwani Majestic. Location: Godrej Hills, Khadakpada, Kalyan West, near Jhulelal Chowk. It is situated in a co-operative housing society. Area: 725 sqft built-up.",
        "price": 4700000,
        "location": "Godrej Hills, Khadakpada, Kalyan West",
        "propertyType": "APARTMENT",
        "status": "FOR_SALE",
        "area": 725,
        "bedrooms": 1,
        "bathrooms": 1,
        "parkingAvailable": True,
        "featured": True
    }
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(
        f"{API_BASE}/properties",
        data=data,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST"
    )
    with urllib.request.urlopen(req) as response:
        res = json.loads(response.read().decode())
        pid = res['id']
        log(f"Created successfully! ID: {pid}")
        return pid

def upload_image(property_id, file_path):
    log(f"Uploading {file_path}...")
    if not os.path.exists(file_path):
        log(f"File not found: {file_path}")
        return
    
    filename = os.path.basename(file_path)
    boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
    
    with open(file_path, 'rb') as f:
        file_data = f.read()
        
    parts = []
    parts.append(f'--{boundary}'.encode('utf-8'))
    parts.append(f'Content-Disposition: form-data; name="file"; filename="{filename}"'.encode('utf-8'))
    parts.append('Content-Type: image/jpeg'.encode('utf-8'))
    parts.append(b'')
    parts.append(file_data)
    parts.append(f'--{boundary}--'.encode('utf-8'))
    parts.append(b'')
    
    body = b'\r\n'.join(parts)
    
    req = urllib.request.Request(
        f"{API_BASE}/images/property/{property_id}",
        data=body,
        headers={'Content-Type': f'multipart/form-data; boundary={boundary}'},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as response:
            log(f"Uploaded successfully: {response.read().decode()}")
    except Exception as e:
        log(f"Upload failed: {e}")

if __name__ == "__main__":
    if os.path.exists(LOG_FILE):
        try:
            os.remove(LOG_FILE)
        except:
            pass
            
    log("Starting Seeding Script...")
    try:
        delete_properties()
        pid = create_property()
        
        photo_files = [
            r"C:\Users\Lenovo\.gemini\antigravity\brain\fcf38954-f3ce-4a27-a935-930ddbb69733\media__1782233491585.jpg",
            r"C:\Users\Lenovo\.gemini\antigravity\brain\fcf38954-f3ce-4a27-a935-930ddbb69733\media__1782233491590.jpg",
            r"C:\Users\Lenovo\.gemini\antigravity\brain\fcf38954-f3ce-4a27-a935-930ddbb69733\media__1782233491598.jpg",
            r"C:\Users\Lenovo\.gemini\antigravity\brain\fcf38954-f3ce-4a27-a935-930ddbb69733\media__1782233491605.jpg",
            r"C:\Users\Lenovo\.gemini\antigravity\brain\fcf38954-f3ce-4a27-a935-930ddbb69733\media__1782233491609.jpg"
        ]
        
        for f in photo_files:
            upload_image(pid, f)
            
        log("Seeding Script Finished successfully!")
    except Exception as e:
        log(f"Fatal error: {e}")
