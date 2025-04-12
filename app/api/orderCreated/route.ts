import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase";

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SHOPIFY_WEBHOOK_SECRET!;
    const hmacHeader = req.headers.get("x-shopify-hmac-sha256") || "";
    const body = await req.text();

    // Validate Shopify HMAC
    const hash = crypto
      .createHmac("sha256", secret)
      .update(body, "utf8")
      .digest("base64");

    if (hash !== hmacHeader) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = JSON.parse(body);
    console.log("Shopify Webhook Payload:", JSON.stringify(payload, null, 2));

    // Extract cart attributes
    const cartAttributes = payload.note_attributes || [];

    // Check if the order is from instream video by looking for a custom attribute
    const sourceAttribute = cartAttributes.find(
      (attr: any) => attr.name === "source"
    );
    const orderSource = sourceAttribute ? sourceAttribute.value : null;

    // Proceed if order is from instream video
    const userIdAttribute = cartAttributes.find(
      (attr: any) => attr.name === "userId"
    );
    const infIdAttribute = cartAttributes.find(
      (attr: any) => attr.name === "inf"
    );
    const vendorAttribute = cartAttributes.find(
      (attr: any) => attr.name === "vendor"
    );
    if (orderSource !== "instream_video") {
      console.log("Order is not from instream video. Skipping...");
      return NextResponse.json(
        { message: "Order not from instream video" },
        { status: 200 }
      );
    }

    const userId = userIdAttribute ? userIdAttribute.value : null;
    const infUid = infIdAttribute ? infIdAttribute.value : null;
    const vendor = vendorAttribute ? vendorAttribute.value : null;
    if (!userId) {
      console.error("User ID not found in order attributes");
      return NextResponse.json({ message: "No userId found" }, { status: 400 });
    }

    console.log(`Order placed by user: ${userId}`);

    // Prepare order info from payload (NOT from cartAttributes)
    const orderInfo = {
      orderId: payload.id,
      cartToken: payload.cart_token,
      totalPrice: payload.total_price,
      currency: payload.currency,
      lineItems: payload.line_items.map((item: any) => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        variantId: item.variant_id,
      })),
      productId: `gid://shopify/Product/${payload.line_items[0]?.variant_id}`,
      productTitle: payload.line_items[0]?.title,
      timestamp: new Date(payload.created_at).toISOString(),
      influencerId: infUid || null,
      email:
        payload.email || (payload.customer && payload.customer.email) || null,
    };

    // Save to Firestore
    const userOrderDocRef = doc(db, "order", userId);
    const userDoc = await getDoc(userOrderDocRef);

    if (userDoc.exists()) {
      await updateDoc(userOrderDocRef, {
        orders: arrayUnion(orderInfo),
      });
    } else {
      await setDoc(userOrderDocRef, {
        orders: [orderInfo],
      });
    }

    // If there's an influencer ID, update their earnings
    if (infUid) {
      const influencerDocRef = doc(db, "influencers", infUid);
      const influencerDoc = await getDoc(influencerDocRef);

      if (!vendor) {
        console.error("Vendor is missing in the order attributes.");
        return NextResponse.json(
          { message: "No vendor found" },
          { status: 400 }
        );
      }
      console.log(vendor, "vendor");
      console.log(infUid, "infUid");

      const percentageLogsRef = collection(db, "percentage_logs");
      const q = query(
        percentageLogsRef,
        where("vendorId", "==", vendor),
        where("influencerId", "==", infUid)
      );
      let percentage = 5;
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const percentageDoc = querySnapshot.docs[0];
        percentage = percentageDoc.data().percentage;
      }
      console.log("percentage ", percentage);
      // Assuming there's only one matching document, we can take the first document

      if (!percentage) {
        console.error(
          "Percentage field is missing in percentage_logs document."
        );
        return NextResponse.json(
          { message: "Missing percentage in percentage_logs" },
          { status: 400 }
        );
      }

      // Step 2: Calculate earnings based on the percentage and the total price
      const totalShopifyOrderCost = parseFloat(payload.total_price);
      const influencerEarnings = (percentage / 100) * totalShopifyOrderCost;
      const vendorOrdersRef = doc(db, "vendorAnalytics", vendor);

      // Check if document exists
      const vendorDoc = await getDoc(vendorOrdersRef);
      if (!vendorDoc.exists()) {
        // If not, create it
        await setDoc(vendorOrdersRef, {
          orders: [
            {
              orderId: payload.id,
              totalPrice: payload.total_price,
              influencerCommission: influencerEarnings,
              userId,
              influencerId: infUid,
              createdAt: payload.created_at,
            },
          ],
          totalOrders: 1,
          totalRevenue: Number(payload.total_price) - influencerEarnings,
        });
      } else {
        // If exists, update it
        await updateDoc(vendorOrdersRef, {
          orders: arrayUnion({
            orderId: payload.id,
            totalPrice: payload.total_price,
            influencerCommission: influencerEarnings,
            userId,
            influencerId: infUid,
            createdAt: payload.created_at,
            vendor,
          }),
          totalOrders: vendorDoc.data().totalOrders + 1,
          totalRevenue:
            vendorDoc.data().totalRevenue +
            (Number(payload.total_price) - influencerEarnings),
        });
      }

      if (influencerDoc.exists()) {
        const currentEarnings = influencerDoc.data()?.earnings || 0;
        const newEarnings = currentEarnings + influencerEarnings;

        // Update the earnings
        await updateDoc(influencerDocRef, {
          earnings: newEarnings,
          ordersThroughStreams: arrayUnion({
            orderId: payload.id,
            totalPrice: payload.total_price,
            influencerCommission: influencerEarnings,
            userId,
            influencerId: infUid,
            createdAt: payload.created_at,
            vendor,
          }),
        });
      } else {
        console.error("Influencer document not found");
        return NextResponse.json(
          { message: "Influencer document not found" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { message: "Order processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook handling error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
