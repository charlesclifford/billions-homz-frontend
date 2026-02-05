"use client";

import { motion } from "framer-motion";

const ContactMap = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full h-[350px] lg:h-[450px] rounded-[30px] overflow-hidden"
    >
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15902.469641653235!2d6.991649055970549!3d4.835574243261091!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1069ce6cbd09f00d%3A0xd94a034509a02e99!2sRevelation%20Mall!5e0!3m2!1sen!2sng!4v1752871557149!5m2!1sen!2sng"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </motion.div>
  );
};

export default ContactMap;
