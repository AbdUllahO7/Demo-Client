"use client"

import { motion, AnimatePresence as FramerAnimatePresence, type MotionProps } from "framer-motion"

export { motion }
export { FramerAnimatePresence as AnimatePresence }

export type MotionComponentProps = MotionProps

export const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}


