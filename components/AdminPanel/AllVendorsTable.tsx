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
} from "@mui/material";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase";
import useVendorStore from "@/store/adminPanel/vendorStore";
function AllVendorsTable() {
  const { fetchVendor, Vendors } = useVendorStore();

  useEffect(() => {
    fetchVendor();
  }, []);
  const router = useRouter();
  return (
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
          {Vendors?.map((vendor: Vendor) => (
            <TableRow key={vendor.id}>
              <TableCell>{vendor.name}</TableCell>
              <TableCell>{vendor.email}</TableCell>
              <TableCell>{vendor.contactDetails}</TableCell>
              <TableCell>
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => {
                    router.push(`/adminPanel/manage_vendors/${vendor.id}`);
                  }}
                >
                  View
                </Button>

                {/* <Button
                  variant="text"
                  color="error"
                  disabled
                  onClick={async () => {
                    const id = toast.loading("Creating Account");

                    try {
                      const token = await auth?.currentUser?.getIdToken();

                      const res = await fetch("/api/deleteVendor", {
                        body: JSON.stringify({
                          isAdmin: true,
                          uid: vendor.id,
                        }),
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`, // Include token in Authorization header
                        },
                      });
                      if (!res.ok) throw await res.json();
                      const body = await res.json();

                      toast.update(id, {
                        render: "Created Admin Successfully",
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
                      // setisloading(false);
                    }
                  }}
                >
                  Delete
                </Button> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AllVendorsTable;
