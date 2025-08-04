import  { useEffect, useRef, useState } from "react"
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion"

import { cn } from '../lib/utils.js'

// Utility function
export const wrap = (min, max, v) => {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

export const TextScroll = ({
  text=" Welcome to Glowz Lifestyle!!! ",
  default_velocity = 5,
  className,
  responsive = true
}) => {
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth)
    }

    updateWindowWidth()
    window.addEventListener('resize', updateWindowWidth)
    return () => window.removeEventListener('resize', updateWindowWidth)
  }, [])

  // Responsive velocity based on screen size
  const getResponsiveVelocity = () => {
    if (!responsive) return default_velocity

    if (windowWidth < 640) return default_velocity * 0.6 // Mobile - slower
    if (windowWidth < 768) return default_velocity * 0.75 // Tablet - medium
    if (windowWidth < 1024) return default_velocity * 0.9 // Small desktop
    return default_velocity // Large desktop - normal speed
  }

  const ParallaxText = ({ children, baseVelocity = 100, className }) => {
    const baseX = useMotionValue(0)
    const { scrollY } = useScroll()
    const scrollVelocity = useVelocity(scrollY)
    const smoothVelocity = useSpring(scrollVelocity, {
      damping: 50,
      stiffness: 400,
    })

    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
      clamp: false,
    })

    const [repetitions, setRepetitions] = useState(1)
    const containerRef = useRef(null)
    const textRef = useRef(null)

    useEffect(() => {
      const calculateRepetitions = () => {
        if (containerRef.current && textRef.current) {
          const containerWidth = containerRef.current.offsetWidth
          const textWidth = textRef.current.offsetWidth

          // Ensure minimum repetitions for smooth scrolling
          const minRepetitions = Math.max(3, Math.ceil(containerWidth / textWidth) + 2)
          setRepetitions(minRepetitions)
        }
      }

      // Delay calculation to ensure proper rendering
      const timeoutId = setTimeout(calculateRepetitions, 100)

      const resizeObserver = new ResizeObserver(calculateRepetitions)
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current)
      }

      window.addEventListener("resize", calculateRepetitions)

      return () => {
        clearTimeout(timeoutId)
        resizeObserver.disconnect()
        window.removeEventListener("resize", calculateRepetitions)
      }
    }, [children, windowWidth])

    const x = useTransform(baseX, (v) => `${wrap(-100 / repetitions, 0, v)}%`)

    const directionFactor = useRef(1)
    useAnimationFrame((t, delta) => {
      let moveBy = directionFactor.current * baseVelocity * (delta / 1000)

      if (velocityFactor.get() < 0) {
        directionFactor.current = -1
      } else if (velocityFactor.get() > 0) {
        directionFactor.current = 1
      }

      moveBy += directionFactor.current * moveBy * velocityFactor.get()

      baseX.set(baseX.get() + moveBy)
    })

    return (
      <div
        className="w-full overflow-hidden whitespace-nowrap"
        ref={containerRef}
        style={{
          willChange: 'transform',
          contain: 'layout style paint'
        }}
      >
        <motion.div
          className={cn("inline-block will-change-transform", className)}
          style={{ x }}
        >
          {Array.from({ length: repetitions }).map((_, i) => (
            <span
              key={i}
              ref={i === 0 ? textRef : null}
              className="inline-block"
            >
              {children}{" "}
            </span>
          ))}
        </motion.div>
      </div>
    )
  }

  const responsiveVelocity = getResponsiveVelocity()

  return (
    <section className="relative w-full min-h-0 overflow-hidden">
      {/* First scrolling text */}
      <div className="py-2 sm:py-3 md:py-4">
        <ParallaxText
          baseVelocity={-responsiveVelocity}
          className={cn(
            "text-8xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold",
            "tracking-tight leading-none  text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold text-center my-4",
            className
          )}
        >
          {text}
        </ParallaxText>
      </div>

      {/* Second scrolling text (opposite direction) */}
      <div className="py-2 sm:py-3 md:py-4">
        <ParallaxText
          baseVelocity={responsiveVelocity}
          className={cn(
            "text-8xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold",
            "tracking-tight leading-none  text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold text-center my-4",
            className
          )}
        >
          {text}
        </ParallaxText>
        
      </div>
    </section>
  )
}

export default TextScroll
