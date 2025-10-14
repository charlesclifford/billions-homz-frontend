import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock } from "lucide-react";
import Link from "next/link";

export default function InspectionsPage() {
  const inspections = {
    pending: [
      {
        id: "1",
        property: "Luxury 4 Bedroom Duplex",
        estate: "GRA Phase 2",
        date: "Pending confirmation",
        status: "pending",
        bookedAt: new Date(),
      },
    ],
    confirmed: [],
    cancelled: [],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Inspections</h1>
          <p className="text-muted-foreground mt-1">
            Manage your property inspection appointments
          </p>
        </div>
        <Button asChild>
          <Link href="/profile/inspections/book">
            <Calendar className="size-4 mr-2" />
            Book Inspection
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending ({inspections.pending.length})
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Confirmed ({inspections.confirmed.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({inspections.cancelled.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {inspections.pending.map((inspection) => (
            <Card key={inspection.id} className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">
                        <Clock className="size-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{inspection.property}</h3>
                      <p className="text-muted-foreground">{inspection.estate}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="size-4" />
                      {inspection.date}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Cancel Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Similar for confirmed and cancelled tabs */}
      </Tabs>
    </div>
  );
}