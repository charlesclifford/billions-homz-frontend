import LogoVert from "@/components/shared/LogoVert";

const Loading = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="p-6 flex items-center animate-ping">
        <LogoVert />
      </div>
    </div>
  );
};

export default Loading;
