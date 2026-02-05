import TestimonialsContent from "@/components/admin/testimonials/TestimonialsContent";
import TestimonialsFilter from "@/components/admin/testimonials/TestimonialsFilter";
import TestimonialsHeader from "@/components/admin/testimonials/TestimonialsHeader";

const TestimonialsPage = () => {
  return (
    <div>
      <TestimonialsHeader />
      <div className="space-y-8">
        <TestimonialsFilter />
        <TestimonialsContent />
      </div>
    </div>
  );
};

export default TestimonialsPage;
