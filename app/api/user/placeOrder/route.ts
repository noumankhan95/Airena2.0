import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { customerEmail, lineItems } = await req.json();

    if (!customerEmail || !lineItems || lineItems.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const orderData = {
      order: {
        email: customerEmail,
        line_items: lineItems,
        financial_status: "pending", // Mark order as paid (You must handle payment separately)
        fulfillment_status: "unfulfilled",
        send_receipt: true,
        send_fulfillment_receipt: true,
      },
    };

    const response = await fetch(
      `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/orders.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN!,
        },
        body: JSON.stringify(orderData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.errors || "Failed to create order" },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, order: data.order });
  } catch (error) {
    console.error("Shopify Order API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
