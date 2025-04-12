// "use client";

// import { useEffect, useState } from "react";

// const CashfreeCheckout = () => {
//   const [paymentSessionId, setPaymentSessionId] = useState(null);

//   useEffect(() => {
//     const fetchSessionId = async () => {
//       const res = await fetch("/api/cashfree-session", {
//         method: "POST",
//         body: JSON.stringify({
//           orderId: (Math.random() * 10000).toString(),
//           orderAmount: "2000",
//           customerEmail: "noumansajid95@gmail.com",
//           customerPhone: "0342910005",
//         }),
//         headers: { "Content-Type": "application/json" },
//       });

//       const data = await res.json();
//       console.log("data", data);
//       setPaymentSessionId(data.paymentSessionId);
//     };

//     fetchSessionId();
//   }, []);

//   useEffect(() => {
//     //@ts-ignore
//     if (!paymentSessionId || !window.Cashfree) return;
//     //@ts-ignore
//     const cashfree = new window.Cashfree();
//     console.log(cashfree);
//     cashfree.checkout({
//       mode: "SEAMLESS",
//       paymentSessionId,
//       container: "#cashfree-container",
//       //@ts-ignore
//       onSuccess: (data) => {
//         console.log("Payment Success:", data);
//         // createShopifyOrder(data);
//       },
//       //@ts-ignore
//       onFailure: (error) => console.error("Payment Failed:", error),
//     });
//   }, [paymentSessionId]);

//   const createShopifyOrder = async (paymentData: any) => {
//     const res = await fetch("/api/create-order", {
//       method: "POST",
//       body: JSON.stringify({
//         paymentData,
//         //@ts-ignore
//         customerEmail,
//       }),
//       headers: { "Content-Type": "application/json" },
//     });

//     const order = await res.json();
//     console.log("Shopify Order Created:", order);
//   };

//   return (
//     <div
//       id="cashfree-container"
//       style={{ width: "100%", height: "auto" }}
//     ></div>
//   );
// };

// export default CashfreeCheckout;

"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function CheckoutPage() {
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCheckout() {
      try {
        const response = await fetch("/api/checkout", { method: "POST" });
        const data = await response.json();

        if (data.checkoutUrl) {
          setCheckoutUrl(data.checkoutUrl);
        } else {
          console.error("Error fetching checkout URL:", data.errors);
        }
      } catch (error) {
        console.error("Checkout request failed:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCheckout();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-xl font-semibold mb-4">Scan to Checkout</h2>

      {loading ? (
        <p>Loading checkout...</p>
      ) : checkoutUrl ? (
        <>
          <QRCodeSVG value={checkoutUrl} size={200} level="Q" />
          <p className="mt-2 text-sm text-gray-600">
            Scan the QR code to proceed to checkout
          </p>
        </>
      ) : (
        <p className="text-red-500">Failed to generate checkout link</p>
      )}
    </div>
  );
}
