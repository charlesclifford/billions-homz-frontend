"use client";
import { Heart } from "iconsax-reactjs";
import Link from "next/link";
import { AnimatedLink } from "../AnimatedLink";
import Logo from "../Logo";
import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const slideInUp = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const scaleUp = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const marqueeVariants = {
  animate: {
    x: ["0%", "-100%"],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 20,
        ease: "linear",
      },
    },
  },
};

const Footer = () => {
  const getYear = () => new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="w-full h-full bg-fixed bg-[url(https://demo2.wpopal.com/spaciaz/wp-content/uploads/2025/03/footer-bg.jpg)] bg-no-repeat bg-cover bg-center flex flex-col relative before:content-[''] before:absolute before:bg-black/40 before:top-0 before:left-0 before:w-full before:h-full pb-5 lg:pb-0">
        <div className="h-[50px] w-full absolute top-0 left-0">
          <div className="bg-background rounded-b-[50px] h-full w-full"></div>
        </div>

        <div className="w-full container mx-auto flex flex-col items-center relative">
          <motion.div
            className="max-w-full w-[526px] text-center px-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideInUp}
          >
            <div className="mt-28 mb-3">
              <h2 className="text-[42px] lg:text-[70px] font-bold leading-[1.06em] tracking-[-1px] lg:tracking-[-2px] text-white">
                Your dream home awaits
              </h2>
            </div>
          </motion.div>

          <motion.div
            className="max-w-full w-[526px] text-center px-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideInUp}
            transition={{ delay: 0.2 }}
          >
            <div>
              <p className="text-lg leading-[28px] text-white">
                Whether you&apos;re exploring our homes or envisioning something
                custom, we&apos;re here to bring your dream to life.
              </p>
            </div>
          </motion.div>

          <motion.div
            className=""
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={scaleUp}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-card rounded-[20px] lg:rounded-[40px] flex flex-col mx-0 lg:mx-4 px-[15px] lg:px-[30px] pt-[30px] lg:pt-[60px] mt-20 ">
              <div className="w-full max-w-[min(100%,1290px)] mx-auto flex flex-col ">
                <motion.div
                  className="grid grid-cols-1 lg:grid-cols-3 border-b border-b-border pb-[30px] lg:pb-[60px] gap-[30px] lg:gap-0"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="flex flex-col justify-between gap-[30px] pb-0 lg:pb-5 pr-0 lg:pr-10"
                    variants={itemVariants}
                  >
                    <div className="mx-auto lg:mx-0 font-bold">
                      <Link
                        href="/"
                        className="text-xl flex items-center gap-1"
                      >
                        <Logo className="h-10" />
                      </Link>
                    </div>
                    <div className="text-center lg:text-left">
                      <p className="leading-[28px] ">
                        We are creators of transformative spaces that inspire,
                        innovate, and endure.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex justify-between border-t lg:border-t-0 border-b lg:border-b-0 lg:border-l lg:border-l-border lg:border-r lg:border-r-border py-[30px] lg:py-0 px-10 pb-5"
                    variants={itemVariants}
                  >
                    <div>
                      <ul>
                        {[
                          { href: "/about-us", text: "About Us" },
                          { href: "/about", text: "Why Choose Us" },
                          { href: "/about-us#team", text: "Our Team" },
                          { href: "/about", text: "Core Values" },
                        ].map((item, index) => (
                          <motion.li
                            key={index}
                            className="not-last:pb-2.5"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                            viewport={{ once: true }}
                          >
                            <AnimatedLink
                              href={item.href}
                              className="font-semibold !bg-[length:0_1px] hover:!bg-[length:100%_1px]"
                            >
                              <span>{item.text}</span>
                            </AnimatedLink>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <ul>
                        {[
                          "Our Projects",
                          "News & Updates",
                          "Terms & Conditions",
                          "Support Center",
                          "Contact",
                        ].map((item, index) => (
                          <motion.li
                            key={index}
                            className="not-last:pb-2.5"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.5 }}
                            viewport={{ once: true }}
                          >
                            <AnimatedLink
                              href={"#"}
                              className="font-semibold !bg-[length:0_1px] hover:!bg-[length:100%_1px]"
                            >
                              <span>{item}</span>
                            </AnimatedLink>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex flex-col justify-between items-center lg:items-start gap-[30px] lg:pb-5 lg:pl-10"
                    variants={itemVariants}
                  >
                    <div className="flex flex-col gap-2 lg:gap-[15px] items-center lg:items-start">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        viewport={{ once: true }}
                      >
                        <a
                          href="tel:+2348149996145"
                          className="text-xl lg:text-2xl font-semibold leading-[1.5em] tracking-[-1px] lg:tracking-[-2px] relative contact-link lowercase"
                        >
                          <span>
                            <span>
                              <span>+(234) 814 - 999 6145</span>
                            </span>
                          </span>
                        </a>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        viewport={{ once: true }}
                      >
                        <a
                          href="mailto:billionshomzproperties@gmail.com"
                          className="text-xl lg:text-2xl font-semibold leading-[1.5em] tracking-[-1px] lg:tracking-[-2px] relative contact-link lowercase"
                        >
                          <span>
                            <span>
                              <span>billionshomzproperties@gmail.com</span>
                            </span>
                          </span>
                        </a>
                      </motion.div>
                    </div>

                    <motion.div
                      className=""
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      viewport={{ once: true }}
                    >
                      <ul className="flex flex-wrap">
                        {[
                          {
                            name: "facebook",
                            href: "https://facebook.com/billionshomzproperties",
                          },
                          {
                            name: "instagram",
                            href: "https://instagram.com/billionshomz_",
                          },
                          { name: "Twitter", href: "#" },
                        ].map((social, index) => (
                          <motion.li
                            key={index}
                            className="mx-2 relative social-link"
                            whileHover={{ y: -3 }}
                            transition={{ duration: 0.2 }}
                          >
                            <a
                              href={social.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="capitalize text-sm font-semibold leading-[20px] text-neutral-600 dark:text-neutral-400 hover:text-black transition-colors duration-300"
                            >
                              <span>{social.name}</span>
                            </a>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="text-center"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={slideInUp}
                  transition={{ delay: 0.5 }}
                >
                  <div className="my-10">
                    <p className="text-neutral-600 dark:text-neutral-400">
                      &copy; {getYear()} <b>Billions Homz</b>. All Rights
                      Reserved.
                    </p>
                    <motion.p
                      className="text-sm text-neutral-600 dark:text-neutral-400 inline-flex pt-4"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      viewport={{ once: true }}
                    >
                      Built with
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <Heart
                          size="18"
                          color="red"
                          variant="Bold"
                          className="mx-1"
                        />
                      </motion.span>
                      by
                      <a
                        href="#"
                        className="ml-1 hover:underline hover:underline-offset-2 transition-all duration-300"
                      >
                        24karat
                      </a>
                    </motion.p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* bottom text */}
        <motion.div
          className="relative hidden lg:flex items-center justify-start py-10 overflow-hidden "
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="w-full h-full">
            <motion.div
              className="relative w-full h-full whitespace-nowrap"
              variants={marqueeVariants}
              animate="animate"
            >
              <h1 className="relative origin-top-left whitespace-nowrap bg-gradient-to-b from-white to-white/0 bg-clip-text text-[5rem] font-extrabold uppercase leading-[1] text-transparent md:scale-[1.7_!important] md:text-[8rem] lg:scale-[1.9_!important] ">
                Billions Homz Billions Homz Billions Homz Billions Homz
              </h1>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
