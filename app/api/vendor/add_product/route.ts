import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Step 1: Prepare product payload
    const productPayload = {
      product: {
        title: data?.title,
        body_html: data?.body_html,
        vendor: data?.vendor,
        product_type: data?.product_type,
        tags: data?.tags,
        category: data?.category,
        status: "active",
        published_scope: data?.published_scope,
        images: data.variants
          .filter((variant: any) => variant.imageAttachment)
          .map((variant: any) => ({
            attachment: variant.imageAttachment, // base64
          })),
        variants: data?.variants.map((variant: any) => ({
          option1: variant.size || "Default Size",
          option2: variant.color || "Default Color",
          price: variant.price || data?.price,
          sku: variant.sku,
          barcode: variant.barcode,
          inventory_management: variant.inventory_management || "shopify",
          inventory_policy: variant.inventory_policy || "deny",
          requires_shipping: variant.requires_shipping ?? true,
          weight: parseFloat(variant.weight) || 0,
          weight_unit: variant.weight_unit || "kg",
          inventory_quantity: variant.quantity || 0,
        })),
      },
    };

    // Step 2: Create product
    const shopifyResponse = await fetch(
      `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/products.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN!,
        },
        body: JSON.stringify(productPayload),
      }
    );

    if (!shopifyResponse.ok) {
      const errorData = await shopifyResponse.json();
      return NextResponse.json(
        { error: errorData.errors || "Failed to add product" },
        { status: 400 }
      );
    }

    const createdProduct = await shopifyResponse.json();
    const { product } = createdProduct;
    console.log("Created product:", product);

    // Step 3: Map variant IDs to images and update variants
    const updateVariantPromises = product.variants.map(
      async (variant: any, index: number) => {
        const image = product.images[index]; // Assuming the order of images matches variants
        if (!image) return; // Skip if no image

        // Update variant with image ID
        try {
          await fetch(
            `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/variants/${variant.id}.json`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token":
                  process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN!,
              },
              body: JSON.stringify({
                variant: {
                  id: variant.id,
                  image_id: image.id, // Link variant to image
                },
              }),
            }
          );
        } catch (variantError) {
          console.error(
            `Failed to update variant ${variant.id}:`,
            variantError
          );
        }
      }
    );

    const publicationsResponse = await fetch(
      `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN!,
        },
        body: JSON.stringify({
          query: `
            {
              publications(first: 10) {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
            }
          `,
        }),
      }
    );

    const publicationsData = await publicationsResponse.json();
    const publications = publicationsData.data.publications.edges;

    if (!publications.length) {
      return NextResponse.json({ error: "No publications found" });
    }

    // Step 4: Loop over Publications and Publish Product
    const publishPromises = publications.map((pub: any) => {
      const publicationId = pub.node.id;

      return fetch(
        `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token":
              process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN!,
          },
          body: JSON.stringify({
            query: `
              mutation {
                publishablePublish(
                  id: "${product.admin_graphql_api_id}",
                  input: { publicationId: "${publicationId}" }
                ) {
                  publishable {
                    ... on Product {
                      id
                      title
                    }
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
      )
        .then((res) => res.json())
        .then((result) => {
          if (result.errors) {
            console.error("GraphQL error:", result.errors);
            return result.errors;
          }

          // Check if userErrors are returned
          const userErrors = result.data?.publishablePublish?.userErrors;
          if (userErrors && userErrors.length > 0) {
            console.error("User Errors:", userErrors);
            return userErrors;
          }

          console.log(
            "Published successfully:",
            result.data.publishablePublish
          );
          return [];
        });
    });

    // Collect errors from publishing process
    const results = await Promise.all(publishPromises);
    const errors = results.flatMap((result: any) => result);

    if (errors.length > 0) {
      return NextResponse.json({ message: "Some publications failed", errors });
    }

    // Wait for variant updates to finish before sending success response
    await Promise.all(updateVariantPromises);

    return NextResponse.json({ success: true, product }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
