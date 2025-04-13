import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const vendor = searchParams.get("vendor");
    const limit = 10; // Number of orders per page

    if (!vendor) {
      return NextResponse.json(
        { error: "Vendor is required" },
        { status: 400 }
      );
    }

    const ordersResponse = await fetch(
      `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2023-10/orders.json?status=any&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN!,
          "Content-Type": "application/json",
        },
      }
    );

    if (!ordersResponse.ok) {
      const errorData = await ordersResponse.json();
      console.error("Shopify API error:", errorData); // Log detailed error from Shopify
      throw new Error(
        `Failed to fetch orders: ${errorData?.errors || "Unknown error"}`
      );
    }

    const ordersData = await ordersResponse.json();
    const orders = ordersData?.orders;

    // 📦 Extract relevant data
    const filteredOrders: any[] = [];
    orders?.forEach((order: any) => {
      const { id, created_at, customer, line_items } = order;

      line_items.forEach((item: any) => {
        if (item.vendor === vendor) {
          filteredOrders.push({
            orderId: id,
            createdAt: created_at,
            customerName:
              customer?.first_name + " " + customer?.last_name || "N/A",
            customerEmail: customer?.email || "N/A",
            productTitle: item.title,
            quantity: item.quantity,
            price: parseFloat(item.price),
            total: parseFloat(item.price) * item.quantity,
          });
        }
      });
    });

    // Get pagination links from the "Link" header
    const linkHeader = ordersResponse.headers.get("Link");
    const nextPageUrl = linkHeader?.includes('rel="next"')
      ? linkHeader
          .split(",")
          .find((link) => link.includes('rel="next"'))
          ?.split(";")[0]
          .replace(/<|>/g, "")
      : null;
    const prevPageUrl = linkHeader?.includes('rel="previous"')
      ? linkHeader
          .split(",")
          .find((link) => link.includes('rel="previous"'))
          ?.split(";")[0]
          .replace(/<|>/g, "")
      : null;

    return NextResponse.json(
      {
        vendor,
        orders: filteredOrders,
        nextPageUrl,
        prevPageUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      //@ts-ignore
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
