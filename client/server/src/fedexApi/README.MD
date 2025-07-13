# FOLDER STRUCTURE AND IMPLEMENTATION GUIDE

```
fedex-ecommerce-integration/
├── package.json                    # Dependencies and scripts
├── .env.example                    # Environment variables template
├── .env                           # Your actual environment variables (create this)
├── server.js                      # Main Express server entry point
├── services/
│   ├── fedexAuth.js              # 🔐 Authentication & Token Management
│   └── fedexService.js           # 📦 Main FedEx API Service (TRACKING HERE)
├── routes/
│   └── fedex.js                  # 🛣️ API Routes (TRACKING ENDPOINT HERE)
├── middleware/
│   ├── validation.js             # ✅ Request validation schemas
│   └── errorHandler.js           # ❌ Error handling middleware
└── examples/
    └── usage.js                  # 📝 Usage examples (TRACKING EXAMPLE HERE)
```

## 🎯 TRACKING METHOD LOCATIONS:

### 1. TRACKING SERVICE METHOD
**File: `services/fedexService.js`**
- **Method**: `trackShipment(trackingNumber)`
- **Line**: Around line 150-170
- **Purpose**: Core tracking logic, API call to FedEx

### 2. TRACKING API ENDPOINT  
**File: `routes/fedex.js`**
- **Endpoint**: `GET /track/:trackingNumber`
- **Line**: Around line 35-45
- **Purpose**: Express route that calls the tracking service

### 3. TRACKING USAGE EXAMPLE
**File: `examples/usage.js`**
- **Function**: `trackShipment(trackingNumber)`
- **Line**: Around line 80-90
- **Purpose**: Shows how to use the tracking API

## 📂 DETAILED FILE BREAKDOWN:

### ROOT FILES:
- **`server.js`** - Express app setup, middleware, routes mounting
- **`package.json`** - Project dependencies and npm scripts
- **`.env.example`** - Template for environment variables

### SERVICES FOLDER:
- **`fedexAuth.js`** - Handles OAuth authentication with FedEx API
  - `getAccessToken()` - Gets/refreshes access tokens
  - `makeAuthenticatedRequest()` - Makes authenticated API calls

- **`fedexService.js`** - Main FedEx operations (THIS IS WHERE TRACKING IS!)
  - `getRates()` - Calculate shipping rates
  - `createShipment()` - Create international shipments
  - **`trackShipment()` - 🎯 TRACK PACKAGES (LINE ~150)**
  - `validateAddress()` - Validate addresses
  - `formatTrackingResponse()` - Format tracking data

### ROUTES FOLDER:
- **`fedex.js`** - Express routes for FedEx operations
  - `POST /rates` - Get shipping rates
  - `POST /shipments` - Create shipments
  - **`GET /track/:trackingNumber` - 🎯 TRACKING ENDPOINT (LINE ~35)**
  - `POST /address/validate` - Validate addresses

### MIDDLEWARE FOLDER:
- **`validation.js`** - Request validation using Joi schemas
  - `validateRateRequest()` - Validate rate requests
  - `validateShipmentRequest()` - Validate shipment requests
  - `validateTrackingRequest()` - Validate tracking requests

- **`errorHandler.js`** - Centralized error handling
  - Handles authentication errors
  - Formats error responses
  - Development vs production error details

### EXAMPLES FOLDER:
- **`usage.js`** - Complete usage examples
  - `getShippingRates()` - Rate calculation example
  - `createShipment()` - Shipment creation example
  - **`trackShipment()` - 🎯 TRACKING USAGE EXAMPLE (LINE ~80)**

## 🔍 TRACKING METHOD DEEP DIVE:

### In `services/fedexService.js`:
```javascript
// Track shipment method (around line 150)
async trackShipment(trackingNumber) {
  try {
    const payload = {
      includeDetailedScans: true,
      trackingInfo: [{
        trackingNumberInfo: {
          trackingNumber: trackingNumber
        }
      }]
    };

    const response = await fedexAuth.makeAuthenticatedRequest({
      method: 'POST',
      url: `${this.baseURL}/track/v1/trackingnumbers`,
      data: payload
    });

    return this.formatTrackingResponse(response.data);
  } catch (error) {
    throw new Error(`Tracking failed: ${error.response?.data?.message || error.message}`);
  }
}
```

### API Usage:
```javascript
// GET request to your server
GET http://localhost:3000/api/fedex/track/1234567890

// Or using the example function:
await trackShipment('1234567890');
```

## 🚀 QUICK START:

1. **Create project folder**: `mkdir fedex-integration && cd fedex-integration`
2. **Copy all files** from the artifact to respective folders
3. **Install dependencies**: `npm install`
4. **Setup environment**: Copy `.env.example` to `.env` and add your FedEx credentials
5. **Start server**: `npm run dev`
6. **Test tracking**: `GET http://localhost:3000/api/fedex/track/YOUR_TRACKING_NUMBER`