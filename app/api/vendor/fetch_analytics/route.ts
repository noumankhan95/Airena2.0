import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const vendor = searchParams.get("vendor"); // Get vendor from query params
    console.log(vendor);

    const productsResponse = await fetch(
      `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2023-10/products.json?vendor=Nouman`,
      {
        method: "GET",
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN!,
          "Content-Type": "application/json",
        },
      }
    );

    if (!productsResponse.ok) {
      throw new Error("Failed to fetch products");
    }

    const productsData = await productsResponse.json();
    const products = productsData.products;
    const productIds = products?.map((p: any) => p.id);

    if (productIds.length === 0) {
      return NextResponse.json(
        {
          message: "No products found for this vendor",
          products: false,
        },
        { status: 504 }
      );
    }
    const ordersResponse = await fetch(
      `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2023-10/orders.json`,
      {
        method: "GET",
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN!,
          "Content-Type": "application/json",
        },
      }
    );

    if (!ordersResponse.ok) {
      throw new Error("Failed to fetch orders");
    }

    const ordersData = await ordersResponse.json();
    const orders = ordersData?.orders;

    // 2️⃣ Filter Orders by Vendor
    let totalRevenue = 0;
    let totalProductsSold = 0;
    const productSales = {};

    orders?.forEach((order: any) => {
      order.line_items.forEach((item: any) => {
        if (item.vendor === vendor) {
          totalRevenue += item.price * item.quantity;
          totalProductsSold += item.quantity;
          //@ts-ignore
          if (!productSales[item.title]) {
            //@ts-ignore

            productSales[item.title] = 0;
          }
          //@ts-ignore

          productSales[item.title] += item.quantity;
        }
      });
    });

    // 3️⃣ Sort Best-Selling Products
    const bestSellingProducts = Object.entries(productSales)
      .map(([name, sales]) => ({ name, sales }))
      //@ts-ignore

      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5); // Top 5 products

    // 4️⃣ Return Analytics Data

    return NextResponse.json(
      {
        vendor,
        totalRevenue,
        totalProductsSold,
        bestSellingProducts,
        products: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
