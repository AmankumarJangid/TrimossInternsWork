// services/paypalService.js
import { core } from "@paypal/paypal-server-sdk";


const client = () => {

  const isLive = process.env.PAYPAL_MODE === "live";
  const environment = isLive ?
    new core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
    : new core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);

  return new core.PayPalHttpClient(environment);
}


// const client = new paypal.core.PayPalHttpClient(environment);

export { client };
