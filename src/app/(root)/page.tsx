import { Metadata } from "next";
import Link from "next/link";

const pageTitle = "Home";

export const metadata: Metadata = {
  title: pageTitle,
};

const Homepage = () => {
  return <div className="">
  <Link href={'/admin'}>Go to Dashboard</Link>
  </div>;
};

export default Homepage;
