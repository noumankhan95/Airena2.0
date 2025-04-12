"use client";
import { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  IconButton,
  Input,
} from "@mui/material";
import { toast } from "react-toastify";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { v4 } from "uuid";
import useVendorstore from "@/store/vendorPanel/VendorsInfo";

export default function ProductUploadForm() {
  const {
    info: { name },
  } = useVendorstore();

  const [formData, setFormData] = useState({
    title: "",
    body_html: "",
    vendor: name,
    product_type: "",
    category: "",
    tags: "",
    status: "draft",
    published_scope: "web",
    options: ["Size", "Color"],
    imageAttachment: null, // main product image
    variants: [
      {
        size: "Default Size",
        color: "Default Color",
        price: "",
        sku: `SKU-${Date.now()}`,
        id: v4(),
        quantity: 0,
        barcode: "",
        inventory_management: "shopify",
        inventory_policy: "deny",
        requires_shipping: true,
        weight: "",
        weight_unit: "kg",
        imageAttachment: null, // variant-specific image (optional)
      },
    ],
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (index: number, e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      newVariants[index] = { ...newVariants[index], [name]: value };
      return { ...prev, variants: newVariants };
    });
  };

  const handleVariantFileChange = (index: number, e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      // Remove the data URL prefix if needed for Shopify (only the Base64 string)
      //@ts-ignore
      const base64Data = reader?.result?.split(",")[1];
      setFormData((prev) => {
        const newVariants = [...prev.variants];
        //@ts-ignore
        newVariants[index].imageAttachment = base64Data;
        return { ...prev, variants: newVariants };
      });
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };
    reader.readAsDataURL(file);
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          size: "",
          color: "",
          price: "",
          sku: `SKU-${Date.now()}`,
          id: v4(),
          quantity: 0,
          barcode: "",
          inventory_management: "shopify",
          inventory_policy: "deny",
          requires_shipping: true,
          weight: "",
          weight_unit: "kg",
          imageAttachment: null,
        },
      ],
    }));
  };

  const removeVariant = (index: number) => {
    setFormData((prev) => {
      const newVariants = [...prev.variants];
      if (newVariants.length > 1) {
        newVariants.splice(index, 1);
      } else {
        toast.error("At least one variant is required.");
      }
      return { ...prev, variants: newVariants };
    });
  };

  const handleSubmit = async () => {
    const id = toast.loading("Uploading");
    try {
      const res = await fetch("/api/vendor/add_product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        toast.update(id, {
          render: "Uploaded Successfully",
          type: "success",
          isLoading: false,
          autoClose: 5000,
        });
      } else {
        toast.update(id, {
          render: data.error || "Error adding product",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
      }
    } catch (err) {
      toast.update(id, {
        //@ts-ignore

        render: err.message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };
  console.log("dormData", formData);
  return (
    <Container>
      <Typography variant="h4" className="mb-4">
        Upload Product
      </Typography>
      <Paper className="p-4 mb-4" elevation={4}>
        <Box className="flex flex-col gap-4">
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <TextField
            label="Description"
            name="body_html"
            value={formData.body_html}
            onChange={handleChange}
            multiline
            rows={4}
          />
          <TextField
            label="Product Type"
            name="product_type"
            value={formData.product_type}
            onChange={handleChange}
          />
          <TextField
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
          <TextField
            label="Tags (comma separated)"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
          />
          {/* <Input
            type="file"
            onChange={(e) => {
              //@ts-ignore
              const file = e.target.files?.[0];
              if (file)
                setFormData((prev) => ({ ...prev, imageAttachment: file }));
            }}
          /> */}
        </Box>
      </Paper>

      <Typography variant="h5" className="mb-2">
        Variants
      </Typography>

      {formData.variants.map((variant, index) => (
        <Paper key={variant.id} className="p-4 mb-4" elevation={2}>
          <Box className="flex flex-col gap-2">
            <TextField
              label="Size"
              name="size"
              value={variant.size}
              onChange={(e) => handleVariantChange(index, e)}
            />
            <TextField
              label="Color"
              name="color"
              value={variant.color}
              onChange={(e) => handleVariantChange(index, e)}
            />
            <TextField
              label="Price"
              name="price"
              value={variant.price}
              onChange={(e) => handleVariantChange(index, e)}
            />
            <TextField
              label="SKU"
              name="sku"
              value={variant.sku}
              onChange={(e) => handleVariantChange(index, e)}
            />
            <TextField
              label="Barcode"
              name="barcode"
              value={variant.barcode}
              onChange={(e) => handleVariantChange(index, e)}
            />
            <TextField
              label="Weight"
              name="weight"
              value={variant.weight}
              onChange={(e) => handleVariantChange(index, e)}
            />
            <TextField
              label="Quantity"
              name="quantity"
              value={variant.quantity}
              onChange={(e) => handleVariantChange(index, e)}
            />
            <Input
              type="file"
              onChange={(e) => handleVariantFileChange(index, e)}
            />
            <Box className="flex justify-end">
              <IconButton color="error" onClick={() => removeVariant(index)}>
                <RemoveCircleOutline />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      ))}

      <Button
        variant="outlined"
        startIcon={<AddCircleOutline />}
        onClick={addVariant}
      >
        Add Variant
      </Button>

      <Button variant="contained" className="mt-6 !ml-6" onClick={handleSubmit}>
        Submit Product
      </Button>
    </Container>
  );
}
