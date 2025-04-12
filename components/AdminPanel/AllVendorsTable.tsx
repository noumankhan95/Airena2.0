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
