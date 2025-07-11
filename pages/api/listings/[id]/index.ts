import prisma from "@/utils/db";
import { getAuth } from "@clerk/nextjs/server";
import { Action, FuelType, Gearbox } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.query;

  if (!id || typeof id != "string") {
    return res.status(400).json({ message: "Invalid ID" });
  }

  try {
    // GET SINGLE LISTING
    if (req.method === "GET") {
      const listing = await prisma.listing.findUnique({
        where: { id },
      });

      if (!listing) {
        res.status(404).json({ message: "Listing not found." });
      }

      res.status(200).json(listing);
    }

    // PUT- UPDATE LISTING
    else if (req.method === "PUT") {
      const {
        title,
        desc,
        pricePerDay,
        model,
        bodyType,
        fuelType,
        gearbox,
        doors,
        seats,
        features,
      } = req.body;

      //   validating fieds
      if (!title || !desc || !pricePerDay || !model || !bodyType) {
        return res.status(400).json({ message: "Missing fields" });
      }
      if (pricePerDay <= 0 || doors <= 0 || seats <= 0) {
        return res.status(400).json({ message: "Invalid fields" });
      }

      if (fuelType && !Object.values(FuelType).includes(fuelType)) {
        return res.status(400).json({ message: "Invalid Fuel Type" });
      }
      if (gearbox && !Object.values(Gearbox).includes(gearbox)) {
        return res.status(400).json({ message: "Invalid Gearbox Type" });
      }

      //   check if exists
      const listingExists = await prisma.listing.findUnique({
        where: { id },
      });

      if (!listingExists) {
        return res.status(404).json({ message: "Listing not found." });
      }

      // updating listing
      const updatedListing = await prisma.listing.update({
        where: { id },
        data: {
          title,
          desc,
          pricePerDay: parseFloat(pricePerDay),
          model,
          bodyType,
          fuelType,
          gearbox,
          doors: parseInt(doors),
          seats: parseInt(seats),
          features: features || [],
        },
      });

      //   creating log for edit
      await prisma.auditLog.create({
        data: {
          action: Action.EDITED,
          clerkUserId: userId,
          listingId: id,
        },
      });

      res.status(200).json({
        message: "Listing updated successfully",
        listing: updatedListing,
      });
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.log("Error : ", error);
    res.status(500).json({ message: "Internal Server error" });
  }
}
