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
                <TableCell>
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
