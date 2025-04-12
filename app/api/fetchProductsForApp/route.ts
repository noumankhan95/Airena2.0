import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const after = searchParams.get("after") || null;

    const res = await fetch(
      `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN!,
        },
        body: JSON.stringify({
          query: `
            query GetProducts($first: Int!, $after: String) {
              products(first: $first, after: $after) {
                edges {
                  cursor
                  node {
                    id
                    title
                    handle
                    descriptionHtml
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                    priceRange {
                      minVariantPrice {
                        amount
                        currencyCode
                      }
                    }
                    variants(first: 10) {
                      edges {
                        node {
                          id
                          title
                          sku
                          price
                          availableForSale
                        }
                      }
                    }
                  }
                }
                pageInfo {
                  hasNextPage
                  endCursor
                }
              }
            }
          `,
          variables: { first: 10, after },
        }),
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 }
      );
    }

    const data = await res.json();

    if (data.errors) {
      return NextResponse.json({ error: data.errors }, { status: 500 });
    }

    return NextResponse.json(data.data.products);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
