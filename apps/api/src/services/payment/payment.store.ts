import { promises as fs, existsSync } from "node:fs";
import path from "node:path";
import Stripe from "stripe";

export interface PaymentLedgerEntry {
  id: string;
  status: Stripe.PaymentIntent.Status;
  amountMinor: number;
  currency: string;
  customerEmail?: string | null;
  metadata: Record<string, string>;
  livemode: boolean;
  createdAt: string;
  updatedAt: string;
  events: Array<{
    type: string;
    status: Stripe.PaymentIntent.Status;
    occurredAt: string;
  }>;
}

const ledgerPath = path.resolve(__dirname, "../../../data/payment-ledger.json");

let ledgerCache: Record<string, PaymentLedgerEntry> | null = null;

const normaliseMetadata = (metadata: Stripe.Metadata | null | undefined) => {
  const entries: Record<string, string> = {};

  if (!metadata) {
    return entries;
  }

  Object.entries(metadata).forEach(([key, value]) => {
    if (typeof value === "string") {
      entries[key] = value;
    }
  });

  return entries;
};

const loadLedger = async () => {
  if (ledgerCache) {
    return ledgerCache;
  }

  if (existsSync(ledgerPath)) {
    try {
      const raw = await fs.readFile(ledgerPath, "utf8");
      ledgerCache = JSON.parse(raw) as Record<string, PaymentLedgerEntry>;
      return ledgerCache;
    } catch (error) {
      ledgerCache = {};
      return ledgerCache;
    }
  }

  ledgerCache = {};
  return ledgerCache;
};

const persistLedger = async () => {
  if (!ledgerCache) {
    return;
  }

  await fs.mkdir(path.dirname(ledgerPath), { recursive: true });
  await fs.writeFile(ledgerPath, JSON.stringify(ledgerCache, null, 2), "utf8");
};

export const recordPaymentIntentEvent = async (
  paymentIntent: Stripe.PaymentIntent,
  eventType: string,
) => {
  const store = await loadLedger();
  const nowIso = new Date().toISOString();
  const createdAtIso = paymentIntent.created
    ? new Date(paymentIntent.created * 1000).toISOString()
    : nowIso;
  const metadata = normaliseMetadata(paymentIntent.metadata);

  const existing = store[paymentIntent.id];

  const entry: PaymentLedgerEntry = existing ?? {
    id: paymentIntent.id,
    status: paymentIntent.status,
    amountMinor: paymentIntent.amount,
    currency: paymentIntent.currency.toUpperCase(),
    customerEmail: paymentIntent.receipt_email ?? null,
    metadata: {},
    livemode: Boolean(paymentIntent.livemode),
    createdAt: createdAtIso,
    updatedAt: nowIso,
    events: [],
  };

  entry.status = paymentIntent.status;
  entry.amountMinor = paymentIntent.amount;
  entry.currency = paymentIntent.currency.toUpperCase();
  entry.customerEmail =
    paymentIntent.receipt_email ?? existing?.customerEmail ?? null;
  entry.metadata = {
    ...(existing?.metadata ?? {}),
    ...metadata,
  };
  entry.livemode = Boolean(paymentIntent.livemode);
  entry.updatedAt = nowIso;
  entry.events = [
    ...(existing?.events ?? []),
    {
      type: eventType,
      status: paymentIntent.status,
      occurredAt: nowIso,
    },
  ];

  store[paymentIntent.id] = entry;
  ledgerCache = store;
  await persistLedger();
};

export const getPaymentLedger = async (): Promise<PaymentLedgerEntry[]> => {
  const store = await loadLedger();
  return Object.values(store).sort((a, b) =>
    a.updatedAt < b.updatedAt ? 1 : -1,
  );
};
