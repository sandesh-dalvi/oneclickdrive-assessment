import { Listing } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import Link from "next/link";
import { formatDate } from "@/utils/format";
import LoadingTableContainer from "./LoadingTableContainer";

import { Badge } from "./ui/badge";

import { Check, Edit, X } from "lucide-react";

interface ListingsProp {
  listings: Listing[];
  handleApprove?: (listingId: string) => void;
  handleReject?: (listingId: string) => void;
  loading?: boolean;
}

const ListingsTable = ({
  listings,
  handleApprove,
  handleReject,
  loading,
}: ListingsProp) => {
  const getStatusBadge = (status: string) => {
    const statusStyles = {
      APPROVED: " bg-green-100 text-green-800 border-green-200",
      PENDING: " bg-yellow-100 text-yellow-800 border-yellow-200",
      REJECTED: " bg-red-100 text-red-800 border-yellow-200",
    };

    const style =
      statusStyles[status as keyof typeof statusStyles] || statusStyles.PENDING;

    return (
      <Badge variant={"outline"} className={`${style} capitalize font-medium`}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="">
        <LoadingTableContainer />
        <LoadingTableContainer />
        <LoadingTableContainer />
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className=" text-center py-8 text-gray-600">No Listings Found</div>
    );
  }

  return (
    <div>
      <Table>
        <TableCaption className=" capitalize">
          total listings : {listings.length}
        </TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Price (per day)</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => {
            const { id, title, model, pricePerDay, createdAt, status } =
              listing;

            return (
              <TableRow
                key={id}
                className=" border-b border-gray-100 hover:bg-gray-50/50"
              >
                <TableCell className=" font-medium">
                  <div className=" max-w-[200px]">{title}</div>
                </TableCell>
                <TableCell>{model}</TableCell>
                <TableCell>${pricePerDay}</TableCell>
                <TableCell>{formatDate(createdAt)}</TableCell>
                <TableCell>{getStatusBadge(status)}</TableCell>

                <TableCell className=" text-right">
                  <div className=" flex items-center justify-end gap-2">
                    {status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          variant={"outline"}
                          className="h-8 border-green-600 text-green-600"
                          disabled={loading}
                          onClick={() => handleApprove?.(id)}
                          title="Approve Listing"
                        >
                          <Check className=" h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={"outline"}
                          className="h-8 border-red-600 text-red-600"
                          disabled={loading}
                          onClick={() => handleReject?.(id)}
                          title="Reject Listing"
                        >
                          <X className=" h-4 w-4" />
                        </Button>
                      </>
                    )}

                    {/* Edit button */}

                    <Button
                      asChild
                      size={"sm"}
                      variant={"outline"}
                      className=" h-8 w-8 p-0"
                    >
                      <Link
                        href={`/listings/edit/${listing.id}`}
                        title="Edit Listtings"
                      >
                        <Edit className=" h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ListingsTable;
