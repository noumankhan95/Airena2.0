"use client";
import React, { useEffect, useState } from "react";
import {
  TableContainer,
  TableRow,
  TableCell,
  Button,
  Table,
  TableHead,
  TableBody,
  Paper,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import useVendorStore from "@/store/adminPanel/vendorStore";
import { toast } from "react-toastify";
import { auth } from "@/firebase";

function AllVendorsTable() {
  const { fetchVendor, Vendors } = useVendorStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVendors, setFilteredVendors] = useState(Vendors);

  useEffect(() => {
    fetchVendor();
  }, []);

  useEffect(() => {
    setFilteredVendors(
      Vendors?.filter((vendor) => {
        const query = searchQuery.toLowerCase();
        return (
          vendor.name?.toLowerCase().includes(query) ||
          vendor.email?.toLowerCase().includes(query) ||
          vendor.contactDetails?.toLowerCase().includes(query)
        );
      })
    );
  }, [searchQuery, Vendors]);

  const router = useRouter();
  const [isLoading, setisloading] = useState<boolean>(false);
  // Form submit handler

  const handleSubmit = async (influencerId: string) => {
    setisloading(true);
    const id = toast.loading("Deleting Account");

    try {
      const token = await auth?.currentUser?.getIdToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/DeleteVendor`,

        {
          body: JSON.stringify({ influencerId }),
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        }
      );
      if (!res.ok) throw await res.json();
      const body = await res.json();

      toast.update(id, {
        render: "Deleted,Refresh To See Changes",
        isLoading: false,
        closeButton: true,
        autoClose: 5000,
        type: "success",
      });
    } catch (e: any) {
      console.log("Error", e);
      toast.update(id, {
        render: e.message,
        isLoading: false,
        closeButton: true,
        autoClose: 5000,
        type: "error",
      });
    } finally {
      setisloading(false);
    }
  };
  return (
    <>
      <TextField
        label="Search by Name, Email or Contact"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: "16px" }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVendors?.map((vendor: Vendor) => (
              <TableRow key={vendor.id}>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell>{vendor.contactDetails}</TableCell>
                <TableCell className="!space-x-3">
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => {
                      router.push(`/adminPanel/manageBrands/${vendor.id}`);
                    }}
                  >
                    View
                  </Button>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => {
                      handleSubmit(vendor.id);
                    }}
                    disabled={isLoading}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default AllVendorsTable;
