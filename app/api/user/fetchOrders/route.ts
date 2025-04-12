import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("email");

    if (!userEmail) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    console.log("Fetching orders for:", userEmail);

    const res = await fetch(
      `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/orders.json?email=${userEmail}&status=any`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN!,
        },
      }
    );


    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch orders. Status: ${res.status}` },
        { status: 500 }
      );
    }

    const data = await res.json();
    console.log("Shopify API Response:", data);

    if (!data.orders) {
      return NextResponse.json({ error: "No orders found" }, { status: 404 });
    }

    return NextResponse.json({ orders: data.orders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
