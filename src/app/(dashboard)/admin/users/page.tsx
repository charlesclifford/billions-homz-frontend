import UsersFilter from "@/components/admin/users/UsersFilter";
import UsersTable from "@/components/admin/users/UsersTable";
import { Users2Icon } from "lucide-react";

const UsersPage = () => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="border border-primary p-3 rounded-full shrink-0">
          <Users2Icon />
        </div>
        <h1 className="text-primary text-3xl">Users</h1>
      </div>

      <div className="space-y-8">
        <UsersFilter />

        <div className="w-full">
          <UsersTable />
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
