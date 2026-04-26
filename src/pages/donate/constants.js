export const MIN_DONATION = 1;
export const MAX_DONATION = 5000;

export const DONATION_AMOUNTS = [1, 5, 25, 50];

export const PAYMENT_METHODS = [
  { id: "card", label: "Visa / Debit Card", description: "Card payment" },
  { id: "google-pay", label: "Google Pay", description: "Fast checkout" },
  { id: "apple-pay", label: "Apple Pay", description: "Fast checkout" },
  { id: "paypal", label: "PayPal", description: "Pay with your account" },
  { id: "bank", label: "Bank Transfer", description: "Sort code + account" },
  { id: "bitcoin", label: "Bitcoin", description: "Wallet transfer" },
];
