// app/dashboard/properties/[id]/page.tsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import Link from "next/link";

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch this data from your API
  const property = {
    id: params.id,
    title: "Luxury Villa",
    description: "A beautiful luxury villa with ocean views...",
    type: "villa",
    listingType: "sale",
    status: "available",
    price: 1200000,
    bedrooms: 5,
    bathrooms: 4,
    area: 3500,
    features: ["Swimming Pool", "Garden", "Garage"],
  };

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/properties">Properties</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{property.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{property.title}</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/properties/${property.id}/edit`}>Edit</Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark as Sold</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="capitalize">{property.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Listing Type</p>
                <p className="capitalize">{property.listingType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="capitalize">{property.status}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p>${property.price.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bedrooms</p>
                <p>{property.bedrooms}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bathrooms</p>
                <p>{property.bathrooms}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Area</p>
                <p>{property.area} sq ft</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p>{property.description}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Features</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {property.features.map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>Property images gallery</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {/* Placeholder for images */}
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 rounded-md flex items-center justify-center"
                  >
                    <span className="text-gray-500">Image {i}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Property related documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* Placeholder for documents */}
                {["Deed", "Survey", "Tax Receipt"].map((doc) => (
                  <div
                    key={doc}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <span>{doc}.pdf</span>
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}