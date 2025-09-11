"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ISale } from "@/interfaces/sales.interface";
import { getSalesDetails } from "@/lib/api/sales";
import { config } from "@/utils/config";
import { formatCurrency } from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Eye, Loader2, MapPin, Printer } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const { SITE_NAME: APP_NAME } = config;

const SalesDetails = ({ id }: { id: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const {
    data: sale,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["salesDetails", id],
    queryFn: () => getSalesDetails(id),
    enabled: isOpen,
    select: (data) => data.data as ISale,
  });

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    pageStyle: `
      @page { 
        size: A4;
        margin: 15mm;
      }
      @media print {
        body { 
          -webkit-print-color-adjust: exact;
          background: white;
          color: black;
        }
        .no-print { 
          display: none !important; 
        }
        .print-layout { 
          padding: 0;
          max-width: 100% !important;
        }
        .print-header { 
          margin-bottom: 1.5rem; 
        }
        .print-section { 
          margin-bottom: 1.5rem; 
        }
        .print-divider { 
          border-top: 1px solid #e2e8f0; 
          margin: 1.25rem 0; 
        }
       
      }
    `,
  });

  const paymentMethodMap = {
    cash: "Cash",
    bank_transfer: "Bank Transfer",
    cheque: "Cheque",
    others: "Other",
  };

  const paymentTypeMap = {
    full: "Full Payment",
    installment: "Installment",
  };

  const statusVariantMap: Record<
    string,
    "default" | "destructive" | "outline" | "secondary"
  > = {
    active: "default",
    completed: "secondary",
    defaulted: "destructive",
    cancelled: "outline",
  };

  if (isError) {
    console.error("Error fetching sale details:", error);
    return null;
  }

  return (
    <>
      {/* Main Details Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="cursor-pointer">
            <Eye className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="!max-w-4xl w-full h-[90vh] [&>button]:hidden">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl">Sales Details</DialogTitle>
              {sale && (
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => setShowPrintPreview(true)}
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Invoice</span>
                </Button>
              )}
            </div>
          </DialogHeader>

          <ScrollArea className="h-[calc(90vh-180px)]">
            {isPending ? (
              <div className="flex justify-center items-center h-full py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : sale ? (
              <div className="py-6 space-y-8">
                {/* Property & Transaction Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Property Information */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-500 border-b pb-2">
                      {sale.assetType === "estate"
                        ? "Estate Information"
                        : "Property Information"}
                    </h3>
                    <div className="space-y-2">
                      {sale.assetType === "estate" && sale.estate && (
                        <>
                          <div className="flex items-start">
                            <span className="w-36 font-medium text-neutral-600 shrink-0">
                              Estate:
                            </span>
                            <span className="flex-1 capitalize">
                              {sale.estate.name}
                            </span>
                          </div>

                          {sale.estate.location?.address && (
                            <div className="flex items-start">
                              <span className="w-36 font-medium text-neutral-600 shrink-0">
                                Address:
                              </span>
                              <span className="flex-1">
                                {sale.estate.location.address}
                              </span>
                            </div>
                          )}
                        </>
                      )}

                      {sale.assetType === "property" && sale.property && (
                        <>
                          <div className="flex items-start">
                            <span className="w-36 font-medium text-neutral-600 shrink-0">
                              Property:
                            </span>
                            <span className="flex-1 capitalize">
                              {sale.property.title}
                            </span>
                          </div>

                          {sale.property.location?.address && (
                            <div className="flex items-start">
                              <span className="w-36 font-medium text-neutral-600 shrink-0">
                                Address:
                              </span>
                              <span className="flex-1">
                                {sale.property.location.address}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Transaction Details */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-500 border-b pb-2">
                      Transaction Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="w-36 font-medium text-neutral-600 shrink-0">
                          Status:
                        </span>
                        <Badge
                          variant={statusVariantMap[sale.status]}
                          className="capitalize"
                        >
                          {sale.status}
                        </Badge>
                      </div>
                      <div className="flex items-center">
                        <span className="w-36 font-medium text-neutral-600 shrink-0">
                          Date Created:
                        </span>
                        <span>{format(new Date(sale.createdAt), "PPp")}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-36 font-medium text-neutral-600 shrink-0">
                          Date of Purchase:
                        </span>
                        <span>
                          {sale.dateSold
                            ? format(new Date(sale.dateSold), "PPp")
                            : "Not specified"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-36 font-medium text-neutral-600 shrink-0">
                          Reference:
                        </span>
                        <code className="bg-gray-100 dark:bg-card px-2 py-1 rounded text-sm">
                          {sale.referenceCode}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buyer & Payment Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Buyer Information */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-500 border-b pb-2">
                      Buyer Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="w-36 font-medium text-neutral-600 shrink-0">
                          Name:
                        </span>
                        <span className="">{sale.buyerName}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-36 font-medium text-neutral-600 shrink-0">
                          Phone:
                        </span>
                        <span>{sale.buyerPhone}</span>
                      </div>
                      {sale.buyerEmail && (
                        <div className="flex items-center">
                          <span className="w-36 font-medium text-neutral-600">
                            Email:
                          </span>
                          <span>{sale.buyerEmail}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-500 border-b pb-2">
                      Payment Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="w-36 font-medium text-neutral-600 shrink-0">
                          Amount:
                        </span>
                        <span className="font-medium text-green-600">
                          {formatCurrency(sale.amountPaid)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-36 font-medium text-neutral-600 shrink-0">
                          Type:
                        </span>
                        <span>{paymentTypeMap[sale.paymentType]}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-36 font-medium text-neutral-600 shrink-0">
                          Method:
                        </span>
                        <span>{paymentMethodMap[sale.paymentMethod]}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-36 font-medium text-neutral-600 shrink-0">
                          Units:
                        </span>
                        <span>{sale.units}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Proof */}
                {sale.paymentProof && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-500 border-b pb-2">
                      Proof of Payment
                    </h3>
                    <div
                      className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden cursor-pointer group"
                      onClick={() => setShowImagePreview(true)}
                    >
                      <Image
                        src={sale.paymentProof.imageUrl}
                        alt="Payment proof"
                        fill
                        className="object-cover"
                      />
                      {/* Hover overlay with eye icon */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Eye className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Notes */}
                {sale.notes && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-500 border-b pb-2">
                      Additional Notes
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-neutral-700 whitespace-pre-line">
                        {sale.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="font-medium text-neutral-600">
                  No sale data found
                </p>
              </div>
            )}
          </ScrollArea>

          <DialogFooter className="border-t pt-4">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Preview Dialog */}
      <Dialog open={showPrintPreview} onOpenChange={setShowPrintPreview}>
        <DialogContent className="!max-w-4xl w-full h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl">Invoice Preview</DialogTitle>
            <p className="text-sm text-gray-500">
              Review the invoice before printing
            </p>
          </DialogHeader>

          <ScrollArea className="h-[calc(90vh-180px)] bg-white p-6">
            {sale && (
              <div
                ref={printRef}
                className="print-layout bg-white text-gray-800 p-8 max-w-4xl mx-auto"
              >
                {/* Invoice Header */}
                <div className="print-header mb-8">
                  <div className="flex flex-col items-center mb-6">
                    <div className="mb-8">
                      <div className="h-10">
                        <Image
                          src="/logos/billionz-logo-color.png"
                          alt="logo"
                          width={300}
                          height={150}
                          className="object-contain w-full h-full"
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <h2 className="text-xl text-gray-600 uppercase font-bold underline">
                        Sales Invoice
                      </h2>
                    </div>
                  </div>

                  <div className="flex justify-between items-start mb-6">
                    <div className="text-left">
                      <p className="text-sm text-gray-500">Invoice Date</p>
                      <p>{format(new Date(sale.createdAt), "MMMM dd, yyyy")}</p>
                      {sale.dateSold && (
                        <>
                          <p className="text-sm text-gray-500 mt-2">
                            Purchase Date
                          </p>
                          <p>
                            {format(new Date(sale.dateSold), "MMMM dd, yyyy")}
                          </p>
                        </>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Invoice #</p>
                      <p className="font-medium text-lg">
                        {sale.referenceCode}
                      </p>
                    </div>
                  </div>

                  <div className="border-b-2 border-gray-200 pb-4 mb-4"></div>
                </div>

                {/* From/To Section */}
                <div className="grid grid-cols-2 gap-8 print-section mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 text-sm uppercase mb-2">
                      From
                    </h3>
                    <p className="font-medium">{APP_NAME}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700 text-sm uppercase mb-2">
                      To
                    </h3>
                    <p className="font-medium capitalize">{sale.buyerName}</p>
                    <p className="text-gray-600">{sale.buyerPhone}</p>
                    {sale.buyerEmail && (
                      <p className="text-gray-600">{sale.buyerEmail}</p>
                    )}
                  </div>
                </div>

                {/* Property Details */}
                <div className="print-section mb-6">
                  <h3 className="font-semibold text-gray-700 text-sm uppercase mb-2">
                    Property Details
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium capitalize">
                      {sale.assetType === "estate"
                        ? sale.estate?.name
                        : sale.property?.title}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-gray-500">Units</p>
                        <p>{sale.units}</p>
                      </div>
                    </div>
                    {sale.assetType === "estate" &&
                      sale.estate &&
                      sale.estate.location.address && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="flex items-start gap-1">
                            <MapPin className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                            <span>{sale.estate.location.address}</span>
                          </p>
                        </div>
                      )}

                    {sale.assetType === "property" &&
                      sale.property &&
                      sale.property?.location?.address && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="flex items-start gap-1">
                            <MapPin className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                            <span>{sale.property.location.address}</span>
                          </p>
                        </div>
                      )}
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="print-section mb-6">
                  <h3 className="font-semibold text-gray-700 text-sm uppercase mb-2">
                    Payment Summary
                  </h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                            Description
                          </th>
                          <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-gray-200">
                          <td className="px-4 py-3">
                            <p className="font-medium">Property Purchase</p>
                            <p className="text-sm text-gray-500">
                              {paymentTypeMap[sale.paymentType]} •{" "}
                              {paymentMethodMap[sale.paymentMethod]}
                            </p>
                            {sale.dateSold && (
                              <p className="text-xs text-gray-500 mt-1">
                                Purchased on:{" "}
                                {format(new Date(sale.dateSold), "PPP")}
                              </p>
                            )}
                          </td>
                        </tr>
                        <tr className="bg-gray-50 border-t border-gray-200">
                          <td className="px-4 py-3 font-medium">Total</td>
                          <td className="px-4 py-3 text-right font-bold">
                            {formatCurrency(sale.amountPaid)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Notes */}
                {sale.notes && (
                  <div className="print-section mb-6">
                    <h3 className="font-semibold text-gray-700 text-sm uppercase mb-2">
                      Notes
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-line">
                        {sale.notes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="print-divider mt-8"></div>
                <div className="print-section text-center text-sm text-gray-500">
                  <p>Thank you for your business</p>
                  <p className="mt-1">
                    {APP_NAME} • {window.location.hostname}
                  </p>
                  <p className="mt-4 text-xs">
                    Invoice generated on {format(new Date(), "PPPp")}
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>

          <DialogFooter className="border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setShowPrintPreview(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button onClick={handlePrint} className="cursor-pointer">
              <Printer className="h-4 w-4" />
              Print Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* image preview */}
      <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
        <DialogContent className="!max-w-4xl">
          <div className="relative w-full aspect-video">
            <Image
              src={sale?.paymentProof?.imageUrl || ""}
              alt="Payment proof preview"
              fill
              className="object-contain"
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowImagePreview(false)}
              className="cursor-pointer"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SalesDetails;
