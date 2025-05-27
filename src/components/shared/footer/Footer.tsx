"use client";
import Link from "next/link";
import { AnimatedLink } from "../AnimatedLink";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const Footer = () => {
  const getYear = () => new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="w-full h-full bg-[url(https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/03/footer-bg.jpg)] bg-no-repeat bg-cover bg-center flex flex-col relative before:content-[''] before:absolute before:bg-black/40 before:top-0 before:left-0 before:w-full before:h-full pb-5 lg:pb-0">
        <div className="h-[50px] w-full absolute top-0 left-0">
          <div className="bg-white rounded-b-[50px] h-full w-full"></div>
        </div>

        <div className="w-full container mx-auto flex flex-col items-center relative">
          <div className="max-w-full w-[526px] text-center px-4">
            <div className="mt-[60px] lg:mt-20 mb-3">
              <h2 className="text-[42px] lg:text-[70px] font-bold leading-[1.06em] tracking-[-1px] lg:tracking-[-2px] text-white">
                Your dream home awaits
              </h2>
            </div>
          </div>

          <div className="max-w-full w-[526px] text-center px-4">
            <div>
              <p className="text-lg leading-[28px] text-white">
                Whether you&apos;re exploring our homes or envisioning something
                custom, we&apos;re here to bring your dream to life.
              </p>
            </div>
          </div>

          <div className="lg:px-4">
            <div className="bg-white rounded-[20px] lg:rounded-[40px] flex flex-col  mx-4 px-[15px] lg:px-[30px] pt-[30px] lg:pt-[60px] mt-20 ">
              <div className="w-full max-w-[min(100%,1290px)] mx-auto flex flex-col ">
                <div className="grid grid-cols-1 lg:grid-cols-3 border-b border-b-gray-300 pb-[30px] lg:pb-[60px] gap-[30px] lg:gap-0">
                  <div className="flex flex-col justify-between gap-[30px] pb-0 lg:pb-5 pr-0 lg:pr-10">
                    <div className="mx-auto lg:mx-0 font-bold">
                      <Link
                        href="/"
                        className="text-xl flex items-center gap-1"
                      >
                        <Avatar
                          className={cn(
                            "transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]",
                            "size-10",
                            "group-data-[collapsible=icon]:size-8",
                            "group-data-[collapsible=icon]:mx-auto"
                          )}
                        >
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            BH
                          </AvatarFallback>
                        </Avatar>

                        <span
                          className={cn(
                            "text-lg font-semibold whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]",
                            "group-data-[collapsible=icon]:hidden"
                          )}
                        >
                          Billions Homz
                        </span>
                      </Link>
                    </div>
                    <div className="text-center lg:text-left">
                      <p className="text-lg leading-[28px] text-neutral-500">
                        We are creators of transformative spaces that inspire,
                        innovate, and endure.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between border-t lg:border-t-0 border-b lg:border-b-0 lg:border-l lg:border-l-gray-300 lg:border-r lg:border-r-gray-300 py-[30px] lg:py-0 px-10 pb-5">
                    <div>
                      <ul>
                        <li className="not-last:pb-2.5">
                          <AnimatedLink
                            href={"#"}
                            className="font-semibold !bg-[length:0_1px] hover:!bg-[length:100%_1px]"
                          >
                            <span className="elementor-icon-list-text">
                              About Us
                            </span>
                          </AnimatedLink>
                        </li>
                        <li className="not-last:pb-2.5">
                          <AnimatedLink
                            href={"#"}
                            className="font-semibold !bg-[length:0_1px] hover:!bg-[length:100%_1px]"
                          >
                            <span className="elementor-icon-list-text">
                              Why Choose Us
                            </span>
                          </AnimatedLink>
                        </li>
                        <li className="not-last:pb-2.5">
                          <AnimatedLink
                            href={"#"}
                            className="font-semibold !bg-[length:0_1px] hover:!bg-[length:100%_1px]"
                          >
                            <span className="elementor-icon-list-text">
                              Our Team
                            </span>
                          </AnimatedLink>
                        </li>
                        <li className="not-last:pb-2.5">
                          <AnimatedLink
                            href={"#"}
                            className="font-semibold !bg-[length:0_1px] hover:!bg-[length:100%_1px]"
                          >
                            <span className="elementor-icon-list-text">
                              Solutions
                            </span>
                          </AnimatedLink>
                        </li>
                        <li className="not-last:pb-2.5">
                          <AnimatedLink
                            href={"#"}
                            className="font-semibold !bg-[length:0_1px] hover:!bg-[length:100%_1px]"
                          >
                            <span className="elementor-icon-list-text">
                              Partners
                            </span>
                          </AnimatedLink>
                        </li>
                        <li className="not-last:pb-2.5">
                          <AnimatedLink
                            href={"#"}
                            className="font-semibold !bg-[length:0_1px] hover:!bg-[length:100%_1px]"
                          >
                            <span className="elementor-icon-list-text">
                              Core Values
                            </span>
                          </AnimatedLink>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <ul>
                        <li className="not-last:pb-2.5">
                          <AnimatedLink
                            href={"#"}
                            className="font-semibold !bg-[length:0_1px] hover:!bg-[length:100%_1px]"
                          >
                            <span className="elementor-icon-list-text">
                              Our Projects
                            </span>
                          </AnimatedLink>
                        </li>
                        <li className="not-last:pb-2.5">
                          <AnimatedLink
                            href={"#"}
                            className="font-semibold !bg-[length:0_1px] hover:!bg-[length:100%_1px]"
                          >
                            <span className="elementor-icon-list-text">
                              News &amp; Updates
                            </span>
                          </AnimatedLink>
                        </li>
                        <li className="not-last:pb-2.5">
                          <AnimatedLink
                            href={"#"}
                            className="font-semibold !bg-[length:0_1px] hover:!bg-[length:100%_1px]"
                          >
                            <span className="elementor-icon-list-text">
                              Terms &amp; Conditions
                            </span>
                          </AnimatedLink>
                        </li>
                        <li className="not-last:pb-2.5">
                          <AnimatedLink
                            href={"#"}
                            className="font-semibold !bg-[length:0_1px] hover:!bg-[length:100%_1px]"
                          >
                            <span className="elementor-icon-list-text">
                              Support Center
                            </span>
                          </AnimatedLink>
                        </li>
                        <li className="not-last:pb-2.5">
                          <AnimatedLink
                            href={"#"}
                            className="font-semibold !bg-[length:0_1px] hover:!bg-[length:100%_1px]"
                          >
                            <span className="elementor-icon-list-text">
                              Contact
                            </span>
                          </AnimatedLink>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-center lg:items-start gap-[30px] lg:pb-5 lg:pl-10">
                    <div className="flex flex-col gap-2 lg:gap-[15px] items-center lg:items-start">
                      <div>
                        <a
                          href="tel:+123456789"
                          className="text-[28px] lg:text-4xl font-semibold leading-[1.5em] tracking-[-1px] lg:tracking-[-2px] relative contact-link lowercase"
                        >
                          <span>
                            <span>
                              <span>+(234) 123 - 456 789</span>
                            </span>
                          </span>
                        </a>
                      </div>
                      <div>
                        <a
                          href="mailto:billionshomz@gmail.com"
                          className="text-[28px] lg:text-4xl font-semibold leading-[1.5em] tracking-[-1px] lg:tracking-[-2px] relative contact-link lowercase"
                        >
                          <span>
                            <span>
                              <span>billionshomz@gmail.com</span>
                            </span>
                          </span>
                        </a>
                      </div>
                    </div>

                    <div className="">
                      <ul className="flex flex-wrap">
                        <li className="mx-2 relative social-link">
                          <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="capitalize text-sm font-semibold leading-[20px] text-gray-500 hover:text-black"
                          >
                            <span>facebook</span>
                          </a>
                        </li>
                        <li className="mx-2 relative social-link">
                          <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="capitalize text-sm font-semibold leading-[20px] text-gray-500 hover:text-black "
                          >
                            <span>instagram</span>
                          </a>
                        </li>
                        <li className="mx-2 relative social-link">
                          <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="capitalize text-sm font-semibold leading-[20px] text-gray-500 hover:text-black"
                          >
                            <span>Twitter</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="my-10">
                    <p>
                      &copy; {getYear()} <b>Billions Homz</b>. All Rights
                      Reserved.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* bottom text */}
        <div className="relative hidden lg:flex items-center justify-start py-10 overflow-hidden ">
          <div className="w-full h-full ">
            <div className="relative w-full h-full whitespace-nowrap animate-marquee">
              <h1 className="relative origin-top-left whitespace-nowrap bg-gradient-to-b from-white to-white/0 bg-clip-text text-[5rem] font-extrabold uppercase leading-[1] text-transparent md:scale-[1.7_!important] md:text-[8rem] lg:scale-[1.9_!important] ">
                Billions Homz Billions Homz Billions Homz Billions Homz
              </h1>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
