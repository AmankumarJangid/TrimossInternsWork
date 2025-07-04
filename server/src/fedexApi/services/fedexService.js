
import FedExAuth from './fedexAuth.js'
const fedexAuth = FedExAuth

class FedExService {
  constructor () {
    this.baseURL = process.env.FEDEX_BASE_URL
    this.accountNumber = process.env.FEDEX_ACCOUNT_NUMBER
    // Meter number not required for REST API
  }

  // Get shipping rates for international delivery
  async getRates (shipmentData) {
    try {
      const payload = {
        accountNumber: {
          value: this.accountNumber
        },
        requestedShipment: {
          shipper: {
            address: {
              streetLines: shipmentData.origin.streetLines,
              stateOrProvinceCode: shipmentData.origin.state,
              city: shipmentData.origin.city,
              postalCode: shipmentData.origin.postalCode,
              countryCode: shipmentData.origin.countryCode,
              residential: false
            }
          },
          recipient: {
            address: {
              streetLines: shipmentData.destination.streetLines,
              stateOrProvinceCode: shipmentData.destination.state,
              city: shipmentData.destination.city,
              postalCode: shipmentData.destination.postalCode,
              countryCode: shipmentData.destination.countryCode,
              residential: shipmentData.destination.residential || false
            }
          },
          pickupType: 'USE_SCHEDULED_PICKUP',
          serviceType: shipmentData.serviceType || 'INTERNATIONAL_PRIORITY',
          packagingType: 'YOUR_PACKAGING',
          rateRequestType: [
            //this has been the problem all along
            'ACCOUNT',
            'LIST'
          ],
          requestedPackageLineItems: shipmentData.packages || [
            {
              weight: {
                units: 'LB',
                value: 5
              },
              dimensions: {
                length: 10,
                width: 10,
                height: 10,
                units: 'IN'
              }
            }
          ]
        }
      }

      const response = await fedexAuth.makeAuthenticatedRequest({
        method: 'POST',
        url: `${this.baseURL}/rate/v1/rates/quotes`,
        data: payload
      })

      // return this.formatRateResponse(response.data);
      return response.data
    } catch (error) {
      throw new Error(
        `Rate calculation failed: ${
          error.response?.data?.message || error.message
        }`
      )
    }
  }

  // Create international shipment
  async createShipment (shipmentData) {
    try {
      const payload = {
        labelResponseOptions: 'URL_ONLY',
        requestedShipment: {
          shipper: {
            contact: {
              personName: shipmentData.shipper.name,
              phoneNumber: shipmentData.shipper.phone,
              companyName: shipmentData.shipper.company
            },

            address: {
              streetLines: shipmentData.shipper.address.streetLines,
              city: shipmentData.shipper.address.city,
              stateOrProvinceCode: shipmentData.shipper.address.state,
              postalCode: shipmentData.shipper.address.postalCode,
              countryCode: shipmentData.shipper.address.countryCode,
              residential: shipmentData.shipper.address.residential || false
            }
          },
          recipients: [
            {
              contact: {
                personName: shipmentData.recipient.name,
                phoneNumber: shipmentData.recipient.phone,
                companyName: shipmentData.recipient.company
              },
              address: {
                streetLines: shipmentData.recipient.address.streetLines,
                city: shipmentData.recipient.address.city,
                stateOrProvinceCode: shipmentData.recipient.address.state,
                postalCode: shipmentData.recipient.address.postalCode,
                countryCode: shipmentData.recipient.address.countryCode,
                residential: shipmentData.recipient.address.residential || false
              }
            }
          ],
          shipDatestamp: new Date().toISOString().split('T')[0],
          serviceType: shipmentData.serviceType || 'INTERNATIONAL_PRIORITY',
          packagingType: 'YOUR_PACKAGING',
          pickupType: 'USE_SCHEDULED_PICKUP',
          blockInsightVisibility: false,
          shippingChargesPayment: {
            paymentType: 'SENDER'
          },
          labelSpecification: {
            labelStockType: 'PAPER_4X8',
            imageType: 'PDF'
          },
          customsClearanceDetail: {
            commercialInvoice: {
              shipmentPurpose: 'REPAIR_AND_RETURN'
            },
            dutiesPayment: {
              paymentType: 'SENDER'
            },
            documentContent: 'NON_DOCUMENTS',
            customsValue: {
              currency: shipmentData.customsValue.currency,
              amount: shipmentData.customsValue.amount
            },
            commodities: shipmentData.commodities.map(item => ({
              description: item.description,
              countryOfManufacture: item.countryOfManufacture,
              quantity: item.quantity,
              quantityUnits: item.quantityUnits || 'PCS',
              unitPrice: {
                currency: item.unitPrice.currency,
                amount: item.unitPrice.amount
              },
              customsValue: {
                currency: item.customsValue.currency,
                amount: item.customsValue.amount
              },
              weight: {
                units: 'LB',
                value: item.weight
              }
            }))
          },
          requestedPackageLineItems: shipmentData.packages.map(
            (pkg, index) => ({
              sequenceNumber: index + 1,
              weight: {
                units: 'LB',
                value: pkg.weight
              },
              dimensions: {
                length: pkg.dimensions.length,
                width: pkg.dimensions.width,
                height: pkg.dimensions.height,
                units: 'IN'
              }
            })
          )
        },
        accountNumber: {
          value: this.accountNumber
        }
      }

      console.log('FedEx Shipment Payload:', JSON.stringify(payload, null, 2))

      const response = await fedexAuth.makeAuthenticatedRequest({
        method: 'POST',
        url: `${this.baseURL}/ship/v1/shipments`,
        data: payload
      })

      // return this.formatShipmentResponse(response.data)
      console.log(response.data);
      return response.data;

    } catch (error) {
      throw new Error(
        `Shipment creation failed: ${
          error.response?.data?.errors?.[0]?.message ||
          error.response?.data?.message ||
          error.message
        }`
      )
    }
  }

  // Track shipment
  async trackShipment (trackingNumber) {
    try {
      const payload = {
        includeDetailedScans: true,
        trackingInfo: [
          {
            trackingNumberInfo: {
              trackingNumber: trackingNumber
            }
          }
        ]
      }

      const response = await fedexAuth.makeAuthenticatedRequestForTracking({
        method: 'POST',
        url: `${this.baseURL}/track/v1/trackingnumbers`,
        data: payload
      })

      return this.formatTrackingResponse(response.data)
    } catch (error) {
      throw new Error(
        `Tracking failed: ${error.response?.data?.message || error.message}`
      )
    }
  }

  // Validate international address
  async validateAddress (address) {
    try {
      const payload = {
        addressesToValidate: [
          {
            address: {
              streetLines: [address.street],
              city: address.city,
              stateOrProvinceCode: address.state,
              postalCode: address.postalCode,
              countryCode: address.countryCode
            }
          }
        ]
      }

      const response = await fedexAuth.makeAuthenticatedRequest({
        method: 'POST',
        url: `${this.baseURL}/address/v1/addresses/resolve`,
        data: payload
      })

      return response.data
    } catch (error) {
      throw new Error(
        `Address validation failed: ${
          error.response?.data?.message || error.message
        }`
      )
    }
  }

  formatRateResponse (data) {
    if (!data.output || !data.output.rateReplyDetails) {
      return { rates: [] }
    }

    return {
      rates: data.output.rateReplyDetails.map(rate => ({
        serviceType: rate.serviceType,
        serviceName: rate.serviceName,
        totalNetCharge: rate.ratedShipmentDetails[0].totalNetCharge,
        currency: rate.ratedShipmentDetails[0].currency,
        transitTime: rate.operationalDetail?.transitTime,
        deliveryTimestamp: rate.operationalDetail?.deliveryDay
      }))
    }
  }

  formatShipmentResponse (data) {
    const shipment = data.output.transactionShipments[0]
    return {
      trackingNumber: shipment.pieceResponses[0].trackingNumber,
      labelUrl: shipment.pieceResponses[0].packageDocuments[0].url,
      totalCharges:
        shipment.shipmentAdvisoryDetails.regulatoryAdvisory.prohibitions,
      shipmentId: shipment.masterTrackingId.formId
    }
  }

  formatTrackingResponse (data) {
    const trackingInfo =
      data.output.completeTrackingResults[0].trackingResults[0]
    return {
      trackingNumber: trackingInfo.trackingNumberInfo.trackingNumber,
      status: trackingInfo.latestStatusDetail.description,
      statusCode: trackingInfo.latestStatusDetail.code,
      location: trackingInfo.latestStatusDetail.scanLocation,
      estimatedDelivery: trackingInfo.estimatedDeliveryTimeWindow?.window?.ends,
      events:
        trackingInfo.scanEvents?.map(event => ({
          timestamp: event.date,
          status: event.eventDescription,
          location: event.scanLocation
        })) || []
    }
  }
}

export default new FedExService()
