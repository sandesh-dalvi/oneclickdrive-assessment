import prisma from "@/utils/db";
import { getAuth } from "@clerk/nextjs/server";
import { Action, Status } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.query;
    const { status } = req.body;

    if (!id || typeof id != "string") {
      return res.status(400).json({ message: "Invalid Listing ID" });
    }

    if (!status || !Object.values(Status).includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // checking if listing exists
    const listingExists = await prisma.listing.findUnique({ where: { id } });

    if (!listingExists) {
      return res.status(404).json({ message: "Listing Not Found" });
    }

    const updatedListing = await prisma.listing.update({
      where: { id },
      data: { status },
    });

    // create a log in audit log table

    const auditAction =
      status === Status.APPROVED ? Action.APPROVED : Action.REJECTED;

    await prisma.auditLog.create({
      data: {
        action: auditAction,
        clerkUserId: userId,
        listingId: id,
      },
    });

    res.status(200).json({
      message: "Listing updated successfully",
      listing: updatedListing,
    });
  } catch (error) {
    console.log("Error : ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
