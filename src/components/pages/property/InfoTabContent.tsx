import { IProperty } from "@/interfaces/property.interface";
import { formatCurrency } from "@/utils/helpers";
import {
  ArrowUpRight,
  Bath,
  Bed,
  Home,
  MapPin,
  Ruler,
  Shield,
} from "lucide-react";

const InfoTabContent = ({
  property,
  onTabChange,
  onViewMapClick,
  onViewVirtualTourClick,
}: {
  property: IProperty;
  onTabChange: (tabName: string) => void;
  onViewMapClick: () => void;
  onViewVirtualTourClick: () => void;
}) => {
  const handleViewOnMapClick = () => {
    // Switch to the location tab when the button is clicked
    onTabChange("location");

    // Scroll to the tabs after a short delay to ensure the tab change has taken effect
    setTimeout(() => {
      onViewMapClick();
    }, 100);
  };

  const handleLaunchVirtualTourClick = () => {
    // Switch to the virtual tour tab when the button is clicked
    onTabChange("virtualTour");

    // Scroll to the tabs after a short delay to ensure the tab change has taken effect
    setTimeout(() => {
      onViewVirtualTourClick();
    }, 100);
  };

  // WhatsApp contact functions
  const handleContactAgent = () => {
    const phoneNumber = "+2348123456789"; // Replace with actual agent number
    const propertyTitle = property.title;
    const message = `Hello, I'm interested in the property: ${propertyTitle}. Please provide more information.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank"
    );
  };

  const handleBookInspection = () => {
    const phoneNumber = "+2348149996145";
    const propertyTitle = property.title;
    const message = `Hello, I would like to book an inspection for the property: ${propertyTitle}.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedMessage}`,
      "_blank"
    );
  };

  return (
    <div className="pt-5 grid lg:grid-cols-[70%_calc(30%-32px)] gap-8">
      {/* Left Column */}
      <div>
        {/* About Section */}
        <div className="flex items-center justify-between pb-3 pt-5 mb-4">
          <h2 className="text-4xl font-bold leading-tight tracking-[-0.015em]">
            Description
          </h2>
        </div>

        <div className="">
          <p className="leading-relaxed">{property.description}</p>
        </div>

        {/* Features Section */}
        {property.features && property.features.length > 0 && (
          <>
            <div className="flex items-center justify-between pb-3 pt-5 mb-4 mt-8">
              <h2 className="text-4xl font-bold leading-tight tracking-[-0.015em]">
                Features
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {property.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full"
                >
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium capitalize">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Property Details Grid */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-muted/40 p-4 px-6 rounded-[30px]">
            <div className="flex items-center gap-2 mb-2">
              <Bed className="h-4 w-4 text-primary" />
              <p className="text-sm text-muted-foreground font-medium">
                Bedrooms
              </p>
            </div>
            <p className="text-lg font-semibold">{property.bedrooms || 0}</p>
          </div>
          <div className="bg-muted/40 p-4 px-6 rounded-[30px]">
            <div className="flex items-center gap-2 mb-2">
              <Bath className="h-4 w-4 text-primary" />
              <p className="text-sm text-muted-foreground font-medium">
                Bathrooms
              </p>
            </div>
            <span className="text-lg font-semibold">
              {property.bathrooms || 0}
            </span>
          </div>
          <div className="bg-muted/40 p-4 px-6 rounded-[30px]">
            <div className="flex items-center gap-2 mb-2">
              <Ruler className="h-4 w-4 text-primary" />
              <p className="text-sm text-muted-foreground font-medium">Area</p>
            </div>
            <span className="text-lg font-semibold">
              {property.dimensions} sq ft
            </span>
          </div>
          <div className="bg-muted/40 p-4 px-6 rounded-[30px]">
            <div className="flex items-center gap-2 mb-2">
              <Home className="h-4 w-4 text-primary" />
              <p className="text-sm text-muted-foreground font-medium">Price</p>
            </div>
            <p className="text-lg font-semibold">
              {formatCurrency(property.price)}
            </p>
          </div>
        </div>

        {/* Virtual Tour */}
        {property.virtualTour && (
          <div className="mt-8">
            <div className="flex items-center justify-between pb-3 pt-5 mb-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-4xl font-bold leading-tight tracking-[-0.015em]">
                  Take a Virtual Tour of the Property
                </h2>
                <p className="text-muted-foreground text-sm">
                  Explore the rooms and get a feel of the space before visiting.
                </p>
              </div>
            </div>
            <div className="">
              <button
                type="button"
                className="p-[5px] pl-[30px] border rounded-[30px] text-sm font-bold capitalize inline-grid relative group h-full cursor-pointer dark:bg-white"
                onClick={handleLaunchVirtualTourClick}
              >
                <span className="flex gap-2.5 items-center flex-row-reverse justify-center">
                  <span className="w-[50px] h-[50px] rounded-full flex items-center justify-center bg-primary text-white">
                    <span className="flex items-center justify-center w-[18px] h-[18px] overflow-hidden relative">
                      {/* Top icon – animates out along 45deg */}
                      <span className="flex absolute items-center justify-center  transition-all duration-500 transform-3d transform-[translate3d(0px,0px,0px)_scale3d(1,1,1)] opacity-100 group-hover:transform-[translate3d(17px,-17px,0px)_scale3d(0.2,0.2,1)] group-hover:opacity-0">
                        <ArrowUpRight />
                      </span>

                      {/* Bottom icon – animates in along 45deg */}
                      <span className="flex absolute items-center justify-center  transition-all duration-500 transform-[translate3d(-17px,17px,0px)_scale3d(0.2,0.2,1)_rotate(-45deg)] opacity-0 group-hover:transform-[translate3d(0px,0px,0px)_scale3d(1,1,1)] group-hover:opacity-100">
                        <ArrowUpRight />
                      </span>
                    </span>
                  </span>
                  <span className="inline-block text-black">
                    Launch Virtual Tour
                  </span>
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Property Summary Card */}
        <div className="p-6 rounded-[30px] border">
          <h3 className="text-lg font-semibold mb-4">Property Summary</h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type</span>
              <span className="font-medium capitalize">{property.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Listing Type</span>
              <span className="font-medium capitalize">
                {property.listingType}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium capitalize">{property.status}</span>
            </div>
          </div>
        </div>

        {/* Location Card */}
        <div className="p-6 rounded-[30px] border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> Location
          </h3>

          <div className="space-y-2">
            <p className="font-medium">{property?.location?.address}</p>
            <p className="text-muted-foreground">
              {property?.location?.city}, {property?.location?.state}
            </p>
            <p className="text-muted-foreground">
              {property?.location?.country}
            </p>
          </div>

          <button
            className="w-full mt-4 bg-primary text-primary-foreground py-2  font-medium hover:bg-primary/90 transition-colors rounded-[30px] cursor-pointer"
            onClick={handleViewOnMapClick}
          >
            View on Map
          </button>
        </div>

        {/* Contact Action Card */}
        <div className="bg-primary/5 border border-primary/20 p-6 rounded-[30px] text-center">
          <h3 className="text-lg font-semibold mb-4">
            Interested in this property?
          </h3>

          <button
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-[30px] font-medium hover:bg-primary/90 transition-colors mb-3 cursor-pointer"
            onClick={handleContactAgent}
          >
            Contact an agent
          </button>
          <button
            className="w-full border border-primary text-primary py-2 rounded-[30px] font-medium hover:bg-primary/10 transition-colors cursor-pointer"
            onClick={handleBookInspection}
          >
            Book Inspection
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoTabContent;
