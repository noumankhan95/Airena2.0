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
import useInfluencerStore from "@/store/adminPanel/influencersStore";
import { toast } from "react-toastify";
import { auth } from "@/firebase";

function AllInfluencersTable() {
  const { fetchInfluencers, Influencers } = useInfluencerStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredInfluencers, setFilteredInfluencers] = useState(Influencers);

  useEffect(() => {
    fetchInfluencers();
  }, []);

  useEffect(() => {
    // Search by multiple fields: name, email, contactDetails
    setFilteredInfluencers(
      Influencers?.filter((influencer) => {
        const query = searchQuery.toLowerCase();
        return (
          influencer.name?.toLowerCase().includes(query) ||
          influencer.email?.toLowerCase().includes(query) ||
          influencer.contactDetails?.toLowerCase().includes(query)
        );
      })
    );
  }, [searchQuery, Influencers]);

  const router = useRouter();
  const [isLoading, setisloading] = useState<boolean>(false);

  const handleSubmit = async (influencerId: string) => {
    setisloading(true);
    const id = toast.loading("Deleting Account");

    try {
      const token = await auth?.currentUser?.getIdToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/DeleteInfluencer`,
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
            {filteredInfluencers?.map((influencer: Influencer) => (
              <TableRow key={influencer.id}>
                <TableCell>{influencer.name}</TableCell>
                <TableCell>{influencer.email}</TableCell>
                <TableCell>{influencer.contactDetails}</TableCell>
                <TableCell className="!space-x-3">
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => {
                      router.push(
                        `/adminPanel/manageCreators/${influencer.id}`
                      );
                    }}
                  >
                    View
                  </Button>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => {
                      handleSubmit(influencer.id);
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

export default AllInfluencersTable;
