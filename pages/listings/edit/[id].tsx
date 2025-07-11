import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FuelType, Gearbox, Listing } from "@prisma/client";
import axios from "axios";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ListingFormData {
  title: string;
  desc: string;
  pricePerDay: string;
  model: string;
  bodyType: string;
  fuelType: FuelType;
  gearbox: Gearbox;
  doors: string;
  seats: string;
  features: string[];
}

const featuresList = [
  "Leather Seats",
  "iDrive",
  "Panoramic Sunroof",
  "Navigation",
  "Rear Sensors",
  "Bluetooth",
  "Autopilot",
  "Fast Charging",
  "AC vents for all rows",
  "ABS",
  "7 seats",
  "Sunroof",
  "Bose Speakers",
  "Rear Camera",
  "4x4 Drive",
  "Touchscreen",
  "Adventure Kit",
  "Apple CarPlay",
  "ADAS",
  "Climate Control",
  "Cruise Control",
  "Airbags",
];

const EditListingPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<ListingFormData>({
    title: "",
    desc: "",
    pricePerDay: "",
    model: "",
    bodyType: "",
    fuelType: FuelType.PETROL,
    gearbox: Gearbox.MANUAL,
    doors: "",
    seats: "",
    features: [],
  });

  useEffect(() => {
    if (!id) return;

    const fetchListing = async () => {
      try {
        const res = await axios.get(`/api/listings/${id}`);
        const listingData = res.data;

        setFormData({
          title: listingData.title || "",
          desc: listingData.desc || "",
          pricePerDay: listingData.pricePerDay || "",
          model: listingData.model || "",
          bodyType: listingData.bodyType || "",
          fuelType: listingData.fuelType || FuelType.PETROL,
          gearbox: listingData.gearbox || Gearbox.MANUAL,
          doors: listingData.doors?.toString() || "",
          seats: listingData.seats?.toString() || "",
          features: listingData.features || [],
        });

        // console.log(listingData);
      } catch (error) {
        console.log("Error : ", error);
        toast.error("Failed to fetch listing data");
        router.push("/");
      }
    };
    fetchListing();
  }, [id, router]);

  const handleInputChange = (
    field: keyof ListingFormData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f != feature)
        : [...prev.features, feature],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      toast.error("Invalid ID");
      return;
    }

    //
    if (
      !formData.title ||
      !formData.desc ||
      !formData.pricePerDay ||
      !formData.model ||
      !formData.bodyType
    ) {
      toast.error("Please fill the required fields");
      return;
    }

    if (parseFloat(formData.pricePerDay) <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    if (parseInt(formData.doors) <= 0 || parseInt(formData.seats) <= 0) {
      toast.error("Doors and seats must be greater than 0");
      return;
    }

    //
    try {
      setSubmitting(true);

      const res = await axios.put(`/api/listings/${id}`, {
        title: formData.title,
        desc: formData.desc,
        pricePerDay: formData.pricePerDay,
        model: formData.model,
        bodyType: formData.bodyType,
        fuelType: formData.fuelType,
        gearbox: formData.gearbox,
        doors: formData.doors,
        seats: formData.seats,
        features: formData.features,
      });

      if (res.data.listing) {
        toast.success("Listing updated successfully");
        router.push("/");
      }
    } catch (error) {
      console.log("Error : ", error);
      toast.error("Failed to update liting");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className=" mx-auto px-4 py-8 container">
      <div className=" mx-auto max-w-2xl">
        <div className=" flex items-center gap-4 mb-6">
          <Button asChild variant={"ghost"} size={"sm"}>
            <Link href={"/"}>
              <ArrowLeft className=" h-4 w-4 mr-2" /> Back
            </Link>
          </Button>

          <h1 className=" text-xl lg:text-2xl">Edit Listing</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Update Listing Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className=" space-y-6">
              {/* Title & Model */}
              <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className=" py-2">
                  <Label htmlFor="title">Title : </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    placeholder="Enter listing Title"
                    required
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>
                <div className=" py-2">
                  <Label htmlFor="model">Model : </Label>
                  <Input
                    id="model"
                    value={formData.model}
                    placeholder="Enter listing Model"
                    required
                    onChange={(e) => handleInputChange("model", e.target.value)}
                  />
                </div>
              </div>
              {/*  */}
              <div className=" py-2">
                <Label htmlFor="desc">Description : </Label>
                <Textarea
                  id="desc"
                  value={formData.desc}
                  onChange={(e) => handleInputChange("desc", e.target.value)}
                  placeholder="Enter Listing Description"
                  rows={4}
                  required
                />
              </div>

              {/*  */}
              <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className=" py-2">
                  <Label htmlFor="pricePerDay">Price per Day ($) : </Label>
                  <Input
                    id="pricePerDay"
                    type="number"
                    value={formData.pricePerDay}
                    placeholder="Enter listing Price Per Day"
                    required
                    onChange={(e) =>
                      handleInputChange("pricePerDay", e.target.value)
                    }
                  />
                </div>
                <div className=" py-2">
                  <Label htmlFor="bodyType">Body Type : </Label>
                  <Input
                    id="bodyType"
                    value={formData.bodyType}
                    placeholder="e.g., Sedan, SUV"
                    required
                    onChange={(e) =>
                      handleInputChange("bodyType", e.target.value)
                    }
                  />
                </div>
              </div>

              {/*  */}
              <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className=" py-2">
                  <Label htmlFor="fuelType">Fuel Type : </Label>
                  <Select
                    value={formData.fuelType}
                    onValueChange={(value) =>
                      handleInputChange("fuelType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={FuelType.PETROL}>PETROL </SelectItem>
                      <SelectItem value={FuelType.DIESEL}>DIESEL </SelectItem>
                      <SelectItem value={FuelType.EV}>EV </SelectItem>
                      <SelectItem value={FuelType.HYBRID}>HYBRID </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className=" py-2">
                  <Label htmlFor="gearbox">Gearbox : </Label>
                  <Select
                    value={formData.gearbox}
                    onValueChange={(value) =>
                      handleInputChange("gearbox", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gearbox" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Gearbox.MANUAL}>MANUAL </SelectItem>
                      <SelectItem value={Gearbox.AUTOMATIC}>
                        AUTOMATIC
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/*  */}
              <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className=" py-2">
                  <Label htmlFor="doors">Number of Doors : </Label>
                  <Input
                    id="doors"
                    type="number"
                    value={formData.doors}
                    placeholder="Enter number of doors"
                    required
                    onChange={(e) => handleInputChange("doors", e.target.value)}
                  />
                </div>
                <div className=" py-2">
                  <Label htmlFor="seats">Number of Seats : </Label>
                  <Input
                    id="seats"
                    value={formData.seats}
                    placeholder="Ente number of seats"
                    required
                    onChange={(e) => handleInputChange("seats", e.target.value)}
                  />
                </div>
              </div>
              {/*  */}
              <div className=" py-4">
                <Label>Features</Label>
                <div className=" grid grid-cols-2 md:grid-cols-3 gap-2">
                  {featuresList.map((feature) => (
                    <div key={feature} className=" flex items-center space-x-2">
                      <Checkbox
                        id={feature}
                        checked={formData.features.includes(feature)}
                        onCheckedChange={() => handleFeatureToggle(feature)}
                      />
                      <div className="">{feature}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/*  */}
              <div className=" flex gap-4 pt-4">
                <Button asChild type="button" variant={"outline"}>
                  <Link href={"/"}>Cancel</Link>
                </Button>

                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className=" h-4 w-4 mr-2 animate-spin" />{" "}
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className=" h-4 w-4 mr-2" /> Update Listing
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default EditListingPage;
