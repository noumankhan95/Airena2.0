export async function shopifyFetch(query, variables = {}) {
    const res = await fetch(
        `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN,
            },
            body: JSON.stringify({ query, variables }),
        }
    );

    if (!res.ok) {
        throw new Error(`Shopify API error! Status: ${res.status}`);
    }

    const json = await res.json();
    if (json.errors) {
        console.error("Shopify API errors:", json.errors);
        throw new Error("Failed to fetch Shopify data");
    }
    return json.data;
}
