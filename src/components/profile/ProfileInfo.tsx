"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppSelector } from "@/store/hooks";
import {
  Clock,
  Edit,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Settings,
  Trash2,
} from "lucide-react";
import Link from "next/link";

const ProfileInfo = () => {
  const { user } = useAppSelector((state) => state.auth);

  const getEditProfileLink = (role?: string) => {
    switch (role) {
      case "admin":
      case "super_admin":
        return "/admin/settings";
      case "realtor":
        return "/realtor/settings";
      case "user":
      default:
        return "/profile/edit";
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <Avatar className="size-28 ring-4 ring-primary/10">
                <AvatarImage
                  src={user?.avatar?.imageUrl}
                  alt={user?.firstName}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-3xl font-semibold">
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="w-full md:w-auto"
              >
                <Link href={getEditProfileLink(user?.role)}>
                  <Edit className="size-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  {user?.isVerified && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary"
                    >
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground capitalize">
                  {user?.role} Account
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="size-4" />
                  <span>{user?.email}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="size-4" />
                    <span>{user?.phone}</span>
                  </div>
                )}
                {user?.address && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="size-4" />
                    <span>{user?.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              asChild
              variant="outline"
              className="justify-start h-auto py-4"
            >
              <Link href="/properties">
                <MapPin className="size-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Browse Properties</div>
                  <div className="text-xs text-muted-foreground">
                    Find your dream home
                  </div>
                </div>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="justify-start h-auto py-4"
            >
              <Link href="/profile/inspections/book">
                <Clock className="size-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Book Inspection</div>
                  <div className="text-xs text-muted-foreground">
                    Schedule a site visit
                  </div>
                </div>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="justify-start h-auto py-4"
            >
              <Link href="/contact">
                <MessageSquare className="size-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Contact Support</div>
                  <div className="text-xs text-muted-foreground">
                    We&apos;re here to help
                  </div>
                </div>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="justify-start h-auto py-4"
            >
              <Link href="/profile/settings">
                <Settings className="size-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Account Settings</div>
                  <div className="text-xs text-muted-foreground">
                    Manage preferences
                  </div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50 border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="size-5 text-destructive" />
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </div>
          <CardDescription>
            Irreversible actions that affect your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="size-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove all your data from our servers
                  including:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Your profile information</li>
                    <li>Saved properties</li>
                    <li>Inspection history</li>
                  </ul>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                  Yes, Delete My Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileInfo;
