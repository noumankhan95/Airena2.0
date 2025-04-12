import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { VarId, uid, infUid, vendor } = await req.json();
    console.log(VarId);
    console.log(uid);
    console.log(infUid);

    const response = await fetch(
      `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token":
            process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
        },
        body: JSON.stringify({
          query: `
            mutation {
              cartCreate(input: {
            attributes: [
                  { key: "userId", value: "${uid}" },
                  { key: "vendor", value: "${vendor}" },
                  { key: "inf", value: "${infUid}" },
                  { key: "source", value: "instream_video" }
                ],
                lines: [{ merchandiseId: "${VarId}", quantity: 1 }]
              }) {
                cart {
                  id
                  checkoutUrl
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `,
        }),
      }
    );

    const data = await response.json();
    console.log("Shopify API Response:", JSON.stringify(data, null, 2));

    if (data.errors || data.data.cartCreate.userErrors.length > 0) {
      return NextResponse.json(
        { errors: data.errors || data.data.cartCreate.userErrors },
        { status: 400 }
      );
    }

    return NextResponse.json({
      checkoutUrl: data.data.cartCreate.cart.checkoutUrl,
    });
  } catch (e) {
    console.error("Checkout Error:", e);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
