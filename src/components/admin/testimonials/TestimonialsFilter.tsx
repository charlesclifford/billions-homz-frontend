"use client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTestimonials } from "@/hooks/useTestimonials";
import {
  initialFilterState
} from "@/store/features/testimonials/testimonial.slice";
import { RefreshCw } from "lucide-react";

const TestimonialsFilter = () => {
  // const dispatch = useAppDispatch();
  // const { filter } = useAppSelector((state) => state.testimonial);
  const { refetch } = useTestimonials(initialFilterState);

  // const handleResetFilters = () => {
  //   dispatch(resetFilter());
  //   refetch();
  // };

  return (
    <div className="space-y-4">
     
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
       
        <div className="relative col-span-1 flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"icon"}
                className="cursor-pointer"
                aria-label="Refresh results"
                onClick={() => refetch()}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsFilter;
