const fs = require('fs');
const http = require('http');
const path = require('path');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body ? JSON.parse(body) : null);
        } else {
          reject(new Error(`Status: ${res.statusCode}, Body: ${body}`));
        }
      });
    });
    
    req.on('error', reject);
    
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

function uploadImage(propertyId, filePath) {
  return new Promise((resolve, reject) => {
    const filename = path.basename(filePath);
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: `/api/images/property/${propertyId}`,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`
      }
    };
    
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`Status: ${res.statusCode}, Body: ${body}`));
        }
      });
    });
    
    req.on('error', reject);
    
    // Write multipart body
    req.write(`--${boundary}\r\n`);
    req.write(`Content-Disposition: form-data; name="file"; filename="${filename}"\r\n`);
    req.write(`Content-Type: image/jpeg\r\n\r\n`);
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.on('data', chunk => req.write(chunk));
    fileStream.on('end', () => {
      req.write(`\r\n--${boundary}--\r\n`);
      req.end();
    });
  });
}

async function run() {
  try {
    console.log('1. Fetching current properties...');
    const properties = await makeRequest({
      hostname: 'localhost',
      port: 8080,
      path: '/api/properties',
      method: 'GET'
    });
    
    console.log(`Found ${properties.length} existing properties.`);
    
    console.log('2. Deleting existing properties...');
    for (const prop of properties) {
      console.log(`Deleting property ID: ${prop.id} - ${prop.title}`);
      await makeRequest({
        hostname: 'localhost',
        port: 8080,
        path: `/api/properties/${prop.id}`,
        method: 'DELETE'
      });
    }
    console.log('All dummy properties deleted successfully.');
    
    console.log('3. Inserting new real property...');
    const realPropertyPayload = {
      title: '1BHK Flat in Tharwani Majestic',
      description: '1BHK flat available for sale in Tharwani Majestic. Location: Godrej Hills, Khadakpada, Kalyan West, near Jhulelal Chowk. It is situated in a co-operative housing society. Area: 725 sqft built-up.',
      price: 4700000,
      location: 'Godrej Hills, Khadakpada, Kalyan West',
      propertyType: 'APARTMENT',
      status: 'FOR_SALE',
      area: 725,
      bedrooms: 1,
      bathrooms: 1,
      parkingAvailable: true,
      featured: true
    };
    
    const newProperty = await makeRequest({
      hostname: 'localhost',
      port: 8080,
      path: '/api/properties',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, realPropertyPayload);
    
    console.log(`Created property successfully! New ID: ${newProperty.id}`);
    
    console.log('4. Uploading 5 property photos...');
    const photoFiles = [
      'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\fcf38954-f3ce-4a27-a935-930ddbb69733\\media__1782233491585.jpg',
      'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\fcf38954-f3ce-4a27-a935-930ddbb69733\\media__1782233491590.jpg',
      'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\fcf38954-f3ce-4a27-a935-930ddbb69733\\media__1782233491598.jpg',
      'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\fcf38954-f3ce-4a27-a935-930ddbb69733\\media__1782233491605.jpg',
      'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\fcf38954-f3ce-4a27-a935-930ddbb69733\\media__1782233491609.jpg'
    ];
    
    for (const file of photoFiles) {
      console.log(`Uploading: ${file}`);
      const uploadRes = await uploadImage(newProperty.id, file);
      console.log(`Uploaded successfully: image ID ${uploadRes.id}`);
    }
    
    console.log('All property seeding operations completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error.message);
  }
}

run();
