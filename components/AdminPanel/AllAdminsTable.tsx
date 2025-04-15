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
import { toast } from "react-toastify";
import { auth, db } from "@/firebase"; // Make sure 'db' is your Firestore instance
import { collection, getDocs } from "firebase/firestore";

// Type for each admin (vendor)
type Vendor = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
};

function AllAdminsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [Admins, setAdmins] = useState<Vendor[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Fetch admins directly from Firestore
  const fetchAdmins = async () => {
    try {
      const snapshot = await getDocs(collection(db, "admins"));
      const fetchedAdmins: Vendor[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "",
          email: data.email || "",
          createdAt: data.createdAt?.toDate?.().toLocaleString?.() || "",
        };
      });
      setAdmins(fetchedAdmins);
      setFilteredAdmins(fetchedAdmins);
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("Failed to fetch admins");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    setFilteredAdmins(
      Admins.filter(
        (vendor: any) =>
          vendor.name.toLowerCase().includes(query) ||
          vendor.email.toLowerCase().includes(query)
      )
    );
  }, [searchQuery, Admins]);

  const handleDelete = async (influencerId: string) => {
    setIsLoading(true);
    const toastId = toast.loading("Deleting Account...");

    try {
      const token = await auth?.currentUser?.getIdToken();

      const res = await fetch(`/api/admin/DeleteAdmin`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ adminId: influencerId }),
      });

      if (!res.ok) throw await res.json();

      toast.update(toastId, {
        render: "Deleted. Refreshing...",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      fetchAdmins(); // Refresh list
    } catch (e: any) {
      toast.update(toastId, {
        render: e.message || "Delete failed",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TextField
        label="Search by Name or Email"
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
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAdmins.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell>{vendor.createdAt || "—"}</TableCell>
                <TableCell>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => handleDelete(vendor.id)}
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

export default AllAdminsTable;
