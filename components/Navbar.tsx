import { UserButton } from "@clerk/nextjs";

const Navbar = () => {
  return (
    <nav className=" flex items-center justify-between bg-muted py-4 sm:px-16 lg:px-24 px-4">
      <div className=" text-xl lg:text-2xl font-semibold">Admin Dashboard</div>
      <div className="">
        <UserButton afterSignOutUrl="/login" />
      </div>
    </nav>
  );
};

export default Navbar;
