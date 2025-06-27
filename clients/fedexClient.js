

const API_BASE = 'http://localhost:3000/api/fedex'

// Example 1: Get shipping rates
async function getShippingRates () {
    alert("button clicked");
  try {
    const response = await axios.post(`${API_BASE}/rates`,{
  origin: {
    streetLines : ["123 Main St"],
    city: "Memphis",
    state: "TN",
    postalCode: "38017",
    countryCode: "US",
    residential: false
  },
  destination: {
    streetLines: ["456 Queen St"],
    city: "Toronto",
    state: "ON",
    postalCode: "M5H 2N2",
    countryCode: "CA",
    residential: false
  },
  packages: [
    {
      weight: {
         units : "KG",
         value : 5
      },
      dimensions: {
        length: 12,
        width: 8,
        height: 6,
        units : "IN"
      }
    }
  ],
  serviceType: "INTERNATIONAL_PRIORITY"  // Optional
})
    showOutput('Shipping Rates:\n' + JSON.stringify(response.data, null, 2));
    console.log('Shipping Rates:', response.data)
  } catch (error) {
    console.error('Error getting rates:', error.response?.data || error.message)
    showOutput('Error getting rates: ' + error.message)
  }
}

// Example 2: Create international shipment
async function createShipment () {
    alert("button clicked");
  try {
    const response = await axios.post(`${API_BASE}/shipments`, {
      shipper: { 
        
        name: 'John Doe',
        company: 'Your Company',
        phone: '5551234567',
        address: {
          streetLines : ["123 Main St"],
          city: 'Memphis',
          state: 'TN',
          postalCode: '38017',
          countryCode: 'US',
          residential : false
        }
      },
      recipient: {
        name: 'Jane Smith',
        company: 'Customer Company',
        phone: '5559876543',
        address: {
          streetLines: ['456 Queen St'],
          city: 'Toronto',
          state: 'ON',
          postalCode: 'M5H 2N2',
          countryCode: 'CA',
          residential: false
        }
      },
      packages: [
        {
          weight: 5,
          dimensions: {
            length: 12,
            width: 8,
            height: 6
          }
        }
      ],
      customsValue: {
        currency: 'USD',
        amount: 100.0
      },
      commodities: [
        {
          description: 'Mosaic Glass Product',
          countryOfManufacture: 'US',
          quantity: 1,
          quantityUnits: 'PCS',
          unitPrice: {
            currency: 'USD',
            amount: 100.0
          },
          customsValue: {
            currency: 'USD',
            amount: 100.0
          },
          weight: 5
        }
      ]
    })
    showOutput('Shipment Created:\n' + JSON.stringify(response.data, null, 2))
    console.log('Shipment Created:', response.data)
  } catch (error) {
    console.error(
      'Error creating shipment:',
      error.response?.data || error.message
    )
    showOutput('Error creating shipment: ' + error.message)
  }
}

// Example 3: Track shipment
async function trackShipment (trackingNumber) {
    alert("Buttonclicked");
//   const trackingNumber = document.getElementById('trackingInput').value.trim()
//   if (!trackingNumber) {
//     showOutput('Please enter a tracking number.')
//     return
//   }
  try {
    const response = await axios.get(`${API_BASE}/track/${trackingNumber}`)
    console.log('Tracking Info:', response.data)

    showOutput('Tracking Info:\n' + JSON.stringify(response.data, null, 2))
  } catch (error) {
    showOutput('Error tracking shipment: ' + error.message)
    console.error(
      'Error tracking shipment:',
      error.response?.data || error.message
    )
  }
}

function showOutput (message) {
  document.getElementById('output').textContent = message
}

const getRates = document.getElementById("getRates");
getRates.onclick =() =>{
    getShippingRates();
};

const create = document.getElementById("create");
create.onclick =() =>{
    createShipment();
};

const track = document.getElementById("track");

track.onclick = () =>{
    const trackingNumber = document.getElementById('trackingInput').value.trim(); 
    trackShipment(trackingNumber);
};
// module.exports = {
//   getShippingRates,
//   createShipment,
//   trackShipment
// }
