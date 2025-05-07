import { Metadata } from "next";
import Link from "next/link";

const pageTitle = "Home";

export const metadata: Metadata = {
  title: pageTitle,
};

const Homepage = () => {
  return <div className="">home page
  <Link href={'/admin'}>Dashboard</Link>
  </div>;
};

export default Homepage;
