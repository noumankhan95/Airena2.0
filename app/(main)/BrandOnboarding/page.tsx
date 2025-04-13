"use client";

import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { CloudUpload, Storefront, Business } from "@mui/icons-material";
import { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, storage } from "@/firebase";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
export default function SellerRegistration() {
  const [formData, setFormData] = useState<any>({
    businessName: "",
    businessAddress: "",
    gtinNumber: "",
    storeName: "",
    brandDescription: "",
    legalDocument: null,
    brandLogo: null,
  });

  const [uploading, setUploading] = useState(false);

  //@ts-ignore
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [selectedFiles, setSelectedFiles] = useState({
    legalDocument: "",
    brandLogo: "",
  });

  // Updated handleFileUpload function
  //@ts-ignore
  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, [field]: file });
      setSelectedFiles({ ...selectedFiles, [field]: file.name }); // Store file name
    }
  };

  const handleSubmit = async () => {
    if (!formData.businessName) {
      toast.error("Please fill out the business name");
      return;
    }

    setUploading(true);
    try {
      const generatedId = uuidv4(); // Generate a unique ID
      const sellerRef = doc(db, "sellersRegistration", generatedId);

      let legalDocumentURL = "";
      let brandLogoURL = "";

      // Upload Legal Document
      if (formData.legalDocument) {
        const docRef = ref(
          storage,
          `sellers/${generatedId}/documents/${formData.legalDocument.name}`
        );
        await uploadBytes(docRef, formData.legalDocument);
        legalDocumentURL = await getDownloadURL(docRef);
      }

      // Upload Brand Logo
      if (formData.brandLogo) {
        const logoRef = ref(
          storage,
          `sellers/${generatedId}/logos/${formData.brandLogo.name}`
        );
        await uploadBytes(logoRef, formData.brandLogo);
        brandLogoURL = await getDownloadURL(logoRef);
      }
      const { legalDocument, brandLogo, ...filteredData } = formData;
      // Save data to Firestore
      await setDoc(sellerRef, {
        ...filteredData,
        legalDocumentURL,
        brandLogoURL,
        sellerId: generatedId,
        createdAt: serverTimestamp(),
      });

      toast.success("Submitted successfully!");
    } catch (error) {
      console.error("Error uploading:", error);
      toast.error("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center  p-6">
      <Typography variant="h4" className="!text-white font-bold mb-6">
        <span className="text-green-400">Seller Registration</span><span className="text-white"> & Verification</span>
      </Typography>
      <Typography className="text-gray-300 !mb-8">
        Complete your business verification to start streaming
      </Typography>
      <div className="grid md:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Legal Documents Upload */}
        <Card className="bg-black/80 text-white">
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <CloudUpload className="text-green-400" />
              <Typography variant="h6">Legal Documents</Typography>
            </div>
            <div
              className="border border-dashed border-gray-500 p-6 text-center rounded-lg cursor-pointer"
              onClick={() => document.getElementById("legalUpload")?.click()}
            >
              <Typography className="text-gray-400">
                Drag and drop your documents here
              </Typography>
              <Button variant="contained" className="mt-3 bg-green-500">
                Upload Files
              </Button>
              {selectedFiles.legalDocument && (
                <Typography className="text-green-400 mt-2">
                  Selected: {selectedFiles.legalDocument}
                </Typography>
              )}
              <input
                type="file"
                id="legalUpload"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "legalDocument")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Setup */}
        <Card className="bg-black/80 text-white">
          <CardContent className="!space-y-5">
            <div className="flex items-center space-x-2 mb-4">
              <Business className="text-green-400" />
              <Typography variant="h6">Business Setup</Typography>
            </div>
            <TextField
              fullWidth
              label="Business Name"
              name="businessName"
              onChange={handleInputChange}
              className="mb-4"
            />
            <TextField
              fullWidth
              label="Business Address"
              name="businessAddress"
              onChange={handleInputChange}
              className="mb-4"
            />
            <TextField
              fullWidth
              label="GSTIN Number"
              name="gtinNumber"
              onChange={handleInputChange}
            />
          </CardContent>
        </Card>

        {/* Profile Creation */}
        <Card className="bg-black/80 text-white">
          <CardContent className="!space-y-5">
            <div className="flex items-center space-x-2 mb-4">
              <Storefront className="text-green-400" />
              <Typography variant="h6">Profile Creation</Typography>
            </div>
            <TextField
              fullWidth
              label="Store Name"
              name="storeName"
              onChange={handleInputChange}
              className="mb-4"
            />
            <TextField
              fullWidth
              label="Brand Description"
              name="brandDescription"
              onChange={handleInputChange}
              multiline
              rows={3}
              className="mb-4"
            />
            <div
              className="border border-dashed border-gray-500 p-6 text-center rounded-lg cursor-pointer"
              onClick={() => document.getElementById("brandUpload")?.click()}
            >
              <Typography className="text-gray-400">
                Drag & Drop Brand Logo
              </Typography>
              <Button variant="contained" className="mt-3 bg-green-500">
                Upload Brand Logo
              </Button>
              <input
                type="file"
                id="brandUpload"
                className="hidden"
                onChange={(e) => handleFileUpload(e, "brandLogo")}
              />
              {selectedFiles.brandLogo && (
                <Typography className="text-green-400 mt-2">
                  Selected: {selectedFiles.brandLogo}
                </Typography>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Button
        variant="contained"
        className="!mt-6 bg-green-500 px-8 py-2 text-lg"
        onClick={handleSubmit}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Submit for Verification"}
      </Button>
      <Typography className="text-gray-400 !mt-3">
        Verification process typically takes 1-2 business days
      </Typography>
    </div>
  );
}
