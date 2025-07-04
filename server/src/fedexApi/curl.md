```
curl -X POST "https://apis-sandbox.fedex.com/oauth/token" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "grant_type=client_credentials&client_id=l7272cb0395ecb4c91b4921aebe9307f40&client_secret=a6066af08157473982159edaa355385f"
```

```
curl -X POST "https://apis-sandbox.fedex.com/rate/v1/rates/quotes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJDWFMtVFAiXSwiUGF5bG9hZCI6eyJjbGllbnRJZGVudGl0eSI6eyJjbGllbnRLZXkiOiJsNzI3MmNiMDM5NWVjYjRjOTFiNDkyMWFlYmU5MzA3ZjQwIn0sImF1dGhlbnRpY2F0aW9uUmVhbG0iOiJDTUFDIiwiYWRkaXRpb25hbElkZW50aXR5Ijp7InRpbWVTdGFtcCI6IjIyLUp1bi0yMDI1IDIzOjUxOjU2IEVTVCIsImdyYW50X3R5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJhcGltb2RlIjoiU2FuZGJveCIsImN4c0lzcyI6Imh0dHBzOi8vY3hzYXV0aHNlcnZlci1zdGFnaW5nLmFwcC5wYWFzLmZlZGV4LmNvbS90b2tlbi9vYXV0aDIifSwicGVyc29uYVR5cGUiOiJEaXJlY3RJbnRlZ3JhdG9yX0IyQiJ9LCJleHAiOjE3NTA2NTc5MTYsImp0aSI6Ijk5ZmMzOWQ4LTg1OWMtNGVlYS1iZGVkLWI0OWRmYmQ5MjZlNSJ9.v9SgSjC3xWw5mDOyNY33k8EdFwvMZcEBP19qOSkMvNDyAROOzd9pqnEXfTclrgW5BFEH1ibhb9e5PmlW0GgjiJ1NKpgQBJY85DXRLGMwNtH0ph0PrFe6RjsUTKxJsC9Ga1Xighm_ytrLm2FVN-M-V2D9pLzLHr3xaOeBJqrF6R2obf4dzPfiOkw74NvQkRViL8aNVhtNqNsSQmKhVmQg5ISczdziP1-qJnBO43QepLF9Bzh-MRJeGKZEG2g87Qd25BxHJK0Djq2dJtzYnDmoqID8xHny3qbJEfnRcC1PrFAIY9PvaBAGMBZZ-Sf_KnuyfW-g4yo4VGc7xFHFqNt1m_yAsF1CDTNkh6ahOlT5hQdQKOscnRwCANPqLrGNB2EIimA5Axy09O_LacT86XkRq8kusMnXJWFLvMwncYOjO9gKRl0Q8CyOX0x6nty0QmEyWdAwXvdQedCphI9toZSvX7e5p_EkyyJ_h5KmBlPLShe5GfANSGeuAlmqd6F93PgG4sS-L5KnpHJycvnYu9uLz4BqppvZi64BuNwJaqUIsVMJQd5FoZHZxeQieW-wzPtqVKEx3iO9Ve5tIiMWx7-ikC3bJF1p85PYg6FlJDllUGzIOSyP2WCGzAVXSrYoi6X7bj3JzT3JAuKoDiqE4KafF-YDA0x8V3Xl5blaPhsJh3s" \
  -d '{
    "accountNumber": { "value": "YOUR_ACCOUNT_NUMBER" },
    "requestedShipment": {
      "shipper": {
        "address": {
          "postalCode": "38017",
          "countryCode": "US"
        }
      },
      "recipient": {
        "address": {
          "postalCode": "00501",
          "countryCode": "US"
        }
      },
      "pickupType": "DROPOFF_AT_FEDEX_LOCATION",
      "rateRequestType": ["PREFERRED"],
      "requestedPackageLineItems": [
        {
          "weight": {
            "units": "LB",
            "value": 10
          }
        }
      ]
    }
  }'

```