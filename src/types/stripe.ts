export interface StripeConnectState {
  userId: string;
  nonce: string;
  redirectUrl: string;
}

export interface StripeSyncResult {
  chargesProcessed: number;
  subscriptionsProcessed: number;
  errors: string[];
}

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: Record<string, unknown>;
  };
  account?: string;
  created: number;
}
