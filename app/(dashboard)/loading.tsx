import { Loader } from "lucide-react";

const DashboardLoading = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader className="text-muted-foreground size-6 animate-spin" />
    </div>
  );
};

export default DashboardLoading;
