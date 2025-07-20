"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Whatsapp } from "iconsax-reactjs";
import {
  Facebook,
  Linkedin,
  Link as LinkIcon,
  Share2,
  Twitter,
} from "lucide-react";
import { BiLogoFacebook } from "react-icons/bi";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

interface SocialShareButtonsProps {
  url: string;
  title: string;
  propertyName: string;
  className?: string;
  variant?: "dropdown" | "card";
}

const EstateShareButtons = ({
  url,
  title,
  propertyName,
  className = "",
  variant = "card",
}: SocialShareButtonsProps) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  // Base button style for all share buttons
  const baseButtonClass = "rounded-full w-10 h-10 p-0 cursor-pointer hover:text-white";

  if (variant === "dropdown") {
    return (
      <div className={`relative group ${className}`}>
        <Button variant="outline" size="icon" className="rounded-full">
          <Share2 className="w-4 h-4" />
        </Button>
        <div className="absolute right-0 mt-2 w-40 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <div className="p-2 flex gap-2">
            <FacebookShareButton url={url} title={title}>
              <Button
                variant="ghost"
                size="icon"
                className={`${baseButtonClass} bg-blue-600 hover:bg-blue-700 text-white`}
              >
                <Facebook className="w-4 h-4" />
              </Button>
            </FacebookShareButton>

            <TwitterShareButton url={url} title={title}>
              <Button
                variant="ghost"
                size="icon"
                className={`${baseButtonClass} bg-blue-400 hover:bg-blue-500 text-white`}
              >
                <Twitter className="w-4 h-4" />
              </Button>
            </TwitterShareButton>

            <LinkedinShareButton url={url} title={propertyName}>
              <Button
                variant="ghost"
                size="icon"
                className={`${baseButtonClass} bg-blue-700 hover:bg-blue-800 text-white`}
              >
                <Linkedin className="w-4 h-4" />
              </Button>
            </LinkedinShareButton>

            <WhatsappShareButton url={url} title={title}>
              <Button
                variant="ghost"
                size="icon"
                className={`${baseButtonClass} bg-green-500 hover:bg-green-600 text-white`}
              >
                <Whatsapp className="w-4 h-4" />
              </Button>
            </WhatsappShareButton>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopyLink}
              className={`${baseButtonClass} bg-gray-200 hover:bg-gray-300 text-gray-700`}
            >
              <LinkIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="font-medium">Share</h3>
      <div className="flex gap-3">
        <FacebookShareButton url={url} title={title}>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              ` bg-blue-600 hover:bg-blue-700 text-white`,
              baseButtonClass
            )}
          >
            <BiLogoFacebook className="w-4 h-4" />
          </Button>
        </FacebookShareButton>

        <TwitterShareButton url={url} title={title}>
          <Button
            variant="ghost"
            size="icon"
            className={`${baseButtonClass} bg-blue-400 hover:bg-blue-500 text-white`}
          >
            <Twitter className="w-4 h-4" />
          </Button>
        </TwitterShareButton>

        <LinkedinShareButton url={url} title={propertyName}>
          <Button
            variant="ghost"
            size="icon"
            className={`${baseButtonClass} bg-blue-700 hover:bg-blue-800 text-white`}
          >
            <Linkedin className="w-4 h-4" />
          </Button>
        </LinkedinShareButton>

        <WhatsappShareButton url={url} title={title}>
          <Button
            variant="ghost"
            size="icon"
            className={`${baseButtonClass} bg-green-500 hover:bg-green-600 text-white`}
          >
            <Whatsapp className="w-4 h-4" />
          </Button>
        </WhatsappShareButton>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopyLink}
          className={`${baseButtonClass} bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-inherit`}
        >
          <LinkIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default EstateShareButtons;
