import { load } from "@cashfreepayments/cashfree-js";

const MODE = import.meta.env.VITE_CASHFREE_MODE || "production"; // "production" when live
const API = import.meta.env.VITE_API_URL || "";
// Creates an order on the server, opens Cashfree checkout, then verifies the payment.
// Resolves with the order id once Cashfree reports PAID, otherwise throws.
export async function payForMethods(methods, phone) {
  const r = await fetch(API + "/api/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ methods, phone }),
  });
  const order = await r.json();
  if (!r.ok) throw new Error(order.error || "Could not create the order");

  const cashfree = await load({ mode: MODE });
  const result = await cashfree.checkout({ paymentSessionId: order.payment_session_id, redirectTarget: "_modal" });
  if (result?.error) throw new Error(result.error.message || "Payment failed");

    const v = await (await fetch(API + "/api/verify/" + order.order_id)).json();
  if (v.order_status !== "PAID") throw new Error("Payment was not completed");
  return order.order_id;
}
