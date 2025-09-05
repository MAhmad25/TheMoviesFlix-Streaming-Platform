import { motion } from "motion/react";

const ImageLoader = () => {
      return (
            <motion.div
                  exit={{
                        opacity: [0, 1, 1],
                        filter: ["brightness(1) blur(20px)", "brightness(2) blur(10px)", "brightness(1) blur(0px)"],
                        y: [0, -8, 0],
                  }}
                  transition={{
                        duration: 0.6,
                        times: [0, 0.1, 1],
                        ease: "easeInOut",
                  }}
                  style={{ willChange: "filter, opacity, transform" }}
                  className="w-full h-full rounded-lg shadow animate-pulse"
            >
                  <div className="flex items-center justify-center w-full h-full bg-[#1B3E3A] rounded">
                        <svg viewBox="0 0 16 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-10 h-10 text-white">
                              <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                              <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                        </svg>
                  </div>
            </motion.div>
      );
};

export default ImageLoader;
