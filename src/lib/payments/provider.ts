export type CheckoutRequest = {
  paymentId: string;
  amountMinor: number;
  currency: string;
  returnUrl: string;
  cancelUrl: string;
};

export type CheckoutSession = {
  providerReference: string;
  redirectUrl: string;
};

export type VerifiedPaymentEvent = {
  providerReference: string;
  paymentId: string;
  status: "PAID" | "FAILED" | "REFUNDED";
};

export interface PaymentProvider {
  createCheckout(request: CheckoutRequest): Promise<CheckoutSession>;
  verifyWebhook(headers: Headers, rawBody: string): Promise<VerifiedPaymentEvent>;
}