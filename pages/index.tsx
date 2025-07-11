import { GetServerSideProps } from "next";

import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/utils/db";
import { Listing, Status } from "@prisma/client";

import ListingsTable from "@/components/ListingsTable";

import AuditLogButton from "@/components/AuditLogButton";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Pagination from "@/components/Pagination";

interface AdminDshboardProps {
  listingsData: Listing[];
  currentPage: number;
  totalPages: number;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { userId } = getAuth(context.req);

    if (!userId) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const page = parseInt((context.query.page as string) || "1");
    const limit = 5;
    const skip = (page - 1) * limit;

    const [listings, totalCount] = await Promise.all([
      prisma.listing.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.listing.count(),
    ]);
    const formattedData = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
      updatedAt: listing.updatedAt.toISOString(),
    }));

    return {
      props: {
        listingsData: formattedData,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  } catch (error) {
    console.log("Error", error);
    return {
      props: {
        listingsData: [],
        currentPage: 1,
        totalPages: 1,
      },
    };
  }
};

export default function AdminDashboard({
  listingsData,
  currentPage,
  totalPages,
}: AdminDshboardProps) {
  const [listings, setListings] = useState(listingsData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setListings(listingsData);
  }, [listingsData]);

  const handleStatusUpdate = async (listingId: string, newStatus: Status) => {
    setLoading(true);

    try {
      const res = await axios.patch(`/api/listings/${listingId}/status`, {
        status: newStatus,
      });

      const data = await res.data.listing;

      if (!data) {
        return toast.error("Failed to updated listing status.");
      }

      setListings((prev) =>
        prev.map((listing) =>
          listing.id === listingId ? { ...listing, status: newStatus } : listing
        )
      );

      toast.success(`Listing ${newStatus} successfully`);
    } catch (error) {
      console.log("Error : ", error);
      toast.error("Failed to update listing status.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (listingId: string) => {
    handleStatusUpdate(listingId, Status.APPROVED);
  };
  const handleReject = async (listingId: string) => {
    handleStatusUpdate(listingId, Status.REJECTED);
  };

  return (
    <section className=" p-4">
      <h2 className=" text-gray-600 text-lg mb-6">
        Manage all listings and their status
      </h2>
      <div className=" mb-4">
        <AuditLogButton />
      </div>
      {listings.length === 0 ? (
        <h2 className=" text-gray-900 mb-2">No Listings Found.</h2>
      ) : (
        <>
          <ListingsTable
            listings={listings}
            handleApprove={handleApprove}
            handleReject={handleReject}
            loading={loading}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl="/"
          />
        </>
      )}
    </section>
  );
}
