import { NextResponse } from "next/server";

const SHOPIFY_API_URL = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2023-07/graphql.json`;
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN!;

export async function GET(req: Request) {
  try {
    // Extract 'days' filter from query params
    const url = new URL(req.url);
    const days = Number(url.searchParams.get("days")) || 7; // Default to last 7 days

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const formattedStartDate = startDate.toISOString();

    // Shopify Query with Date Filter
    const ORDERS_QUERY = `
      query {
        orders(first: 50, sortKey: CREATED_AT, reverse: true, query: "created_at:>=${formattedStartDate}") {
          edges {
            node {
              id
              createdAt
              totalPriceSet {
                shopMoney { amount }
              }
              lineItems(first: 10) {
                edges { node { title quantity } }
              }
              paymentGatewayNames
              shippingAddress { country }
            }
          }
        }
      }
    `;

    // Fetch Orders
    const response = await fetch(SHOPIFY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN!,
      },
      body: JSON.stringify({ query: ORDERS_QUERY }),
    });

    if (!response.ok) throw new Error("Failed to fetch Shopify data");

    const { data } = await response.json();
    const orders = data.orders.edges.map((edge: any) => edge.node);

    // Analytics Data
    const totalOrders = orders.length;
    const ordersPerTime: Record<string, number> = {};
    const revenuePerTime: Record<string, number> = {};
    const productSales: Record<string, number> = {};
    const paymentMethods: Record<string, number> = {};
    const countries: Record<string, number> = {};

    orders.forEach((order: any) => {
      const date = new Date(order.createdAt).toISOString().split("T")[0];
      ordersPerTime[date] = (ordersPerTime[date] || 0) + 1;
      revenuePerTime[date] =
        (revenuePerTime[date] || 0) +
        parseFloat(order.totalPriceSet.shopMoney.amount);

      order.lineItems.edges.forEach((item: any) => {
        const product = item.node.title;
        productSales[product] =
          (productSales[product] || 0) + item.node.quantity;
      });

      order.paymentGatewayNames.forEach((method: string) => {
        paymentMethods[method] = (paymentMethods[method] || 0) + 1;
      });

      if (order.shippingAddress?.country) {
        countries[order.shippingAddress.country] =
          (countries[order.shippingAddress.country] || 0) + 1;
      }
    });

    return NextResponse.json({
      totalOrders,
      ordersPerTime: Object.entries(ordersPerTime).map(([date, count]) => ({
        date,
        count,
      })),
      revenuePerTime: Object.entries(revenuePerTime).map(([date, revenue]) => ({
        date,
        revenue,
      })),
      mostSoldItems: Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([title, quantity]) => ({ title, quantity })),
      paymentMethods: Object.entries(paymentMethods).map(([method, count]) => ({
        method,
        count,
      })),
      countries: Object.entries(countries).map(([country, count]) => ({
        country,
        count,
      })),
      analyticsDuration: `Last ${days} days`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
