import UsersFilter from "@/components/admin/users/UsersFilter";
import UsersHeader from "@/components/admin/users/UsersHeader";
import UsersTable from "@/components/admin/users/UsersTable";

const UsersPage = () => {
  return (
    <div className="w-full">
      <UsersHeader />

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
