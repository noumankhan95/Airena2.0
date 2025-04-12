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
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import useOwnersStore from "@/store/dealersPanel/OwnersInfo";
import useInfluencerStore from "@/store/adminPanel/influencersStore";
function AllInfluencersTable() {
  const { fetchInfluencers, Influencers } = useInfluencerStore();

  useEffect(() => {
    fetchInfluencers();
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
          {Influencers?.map((influencer: Influencer) => (
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
                      `/adminPanel/manage_influencers/${influencer.id}`
                    );
                  }}
                >
                  View
                </Button>
                {/* <Button variant="text" color="warning" onClick={() => {}}>
                  Edit
                </Button> */}
                {/* <Button variant="text" color="error" disabled>
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

export default AllInfluencersTable;
