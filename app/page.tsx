"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import QRCode from "react-qr-code";
import { useEffect, useRef, useState, type CSSProperties } from "react";

type Phase = "ask" | "accepted" | "final";

type ModelViewerElement = HTMLElement & { activateAR: () => void };

type ModelViewerAttrs = {
  ref?: React.Ref<ModelViewerElement>;
  src?: string;
  "ios-src"?: string;
  ar?: boolean;
  "ar-modes"?: string;
  "camera-controls"?: boolean;
  "auto-rotate"?: boolean;
  "shadow-intensity"?: string;
  exposure?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
};

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerAttrs;
    }
  }
}

export default function Home() {
  const [phase, setPhase] = useState<Phase>("ask");
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [device, setDevice] = useState<"desktop" | "mobile" | null>(null);
  const [url] = useState(() =>
    typeof window !== "undefined" ? window.location.href : ""
  );
  const modelViewerRef = useRef<ModelViewerElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setDevice(mq.matches ? "mobile" : "desktop");
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (device !== "mobile") return;
    import("@google/model-viewer");
  }, [device]);

  useEffect(() => {
    if (phase !== "accepted") return;
    const id = setTimeout(() => setPhase("final"), 5000);
    return () => clearTimeout(id);
  }, [phase]);

  const openAR = () => {
    modelViewerRef.current?.activateAR();
  };

  const dodge = () => {
    if (typeof window === "undefined") return;
    const maxX = window.innerWidth * 0.35;
    const maxY = window.innerHeight * 0.35;
    const x = (Math.random() * 2 - 1) * maxX;
    const y = (Math.random() * 2 - 1) * maxY;
    setNoPos({ x, y });
  };

  if (device === null) {
    return <div className="fixed inset-0 bg-black" />;
  }

  if (device === "desktop") {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-8 bg-linear-to-br from-rose-100 via-pink-100 to-fuchsia-100 px-6 text-center">
        {/* <h1 className="max-w-md bg-linear-to-r from-rose-500 via-pink-500 to-fuchsia-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
          Bu deneyim telefonda yaşanır 💖
        </h1> */}
        <div className="rounded-3xl bg-white p-6 shadow-[0_0_50px_rgba(236,72,153,0.35)] ring-4 ring-white/60">
          {url && (
            <QRCode
              value={url}
              size={256}
              fgColor="#000000"
              bgColor="#ffffff"
              level="M"
            />
          )}
        </div>
        <p className="max-w-xl text-base text-rose-900/70 sm:text-lg">
          Telefonunun kamerasıyla bu QR'ı tara, devamı seni orada bekliyor 🌸
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      <AnimatePresence initial={false}>
        {phase === "ask" && (
          <motion.div
            key="ask"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            <Image
              src="/1.jpg"
              alt=""
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] flex items-center justify-center gap-4 px-4 sm:bottom-10 sm:gap-6">
              <motion.button
                type="button"
                onClick={() => setPhase("accepted")}
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.15, rotate: -2 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-linear-to-r from-pink-500 via-fuchsia-500 to-rose-500 px-8 py-4 text-xl font-extrabold tracking-wide text-white shadow-[0_0_30px_rgba(236,72,153,0.8)] ring-4 ring-white/60 sm:px-12 sm:py-5 sm:text-2xl"
              >
                Evet 💖
              </motion.button>
              <motion.button
                type="button"
                onMouseEnter={dodge}
                onTouchStart={dodge}
                onClick={dodge}
                animate={{ x: noPos.x, y: noPos.y }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ fontFamily: "Comic Sans MS, Chalkboard, cursive" }}
                className="rounded-sm border-2 border-dashed border-yellow-900 bg-[#7a6b3a] px-2 py-1 text-[10px] italic text-[#3a2f12] shadow-inner line-through decoration-red-800 decoration-2 sm:px-3 sm:text-xs"
              >
                hayır
              </motion.button>
            </div>
          </motion.div>
        )}

        {phase === "accepted" && (
          <motion.div
            key="accepted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            <Image
              src="/2.jpg"
              alt=""
              fill
              priority
              className="object-cover"
            />
          </motion.div>
        )}

        {phase === "final" && (
          <motion.div
            key="final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            <Image
              src="/3.jpg"
              alt=""
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] flex items-center justify-center px-4 sm:bottom-10">
              <motion.button
                type="button"
                onClick={openAR}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, scale: [1, 1.05, 1] }}
                transition={{
                  opacity: { duration: 0.8, delay: 0.6 },
                  y: { duration: 0.8, delay: 0.6 },
                  scale: { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 1.4 },
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-linear-to-r from-rose-400 via-pink-500 to-fuchsia-500 px-8 py-4 text-xl font-extrabold tracking-wide text-white shadow-[0_0_30px_rgba(244,114,182,0.8)] ring-4 ring-white/60 sm:px-12 sm:py-5 sm:text-2xl"
              >
                Çiçeğini al 🌸
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <model-viewer
        ref={modelViewerRef}
        src="/flower.glb"
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
