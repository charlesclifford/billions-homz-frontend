import React from "react";

const AdminFooter = () => {
  return (
    <footer className="bg-sidebar w-full border-t">
      <div className="mx-auto max-w-screen-2xl px-4 py-2 flex items-center justify-between h-10 text-sm text-muted-foreground">
        <span>&copy; {new Date().getFullYear()} Admin Dashboard</span>
        <span>All rights reserved</span>
      </div>
    </footer>
  );
};

export default AdminFooter;
