"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

import { Magnetic } from "@/components/motion-primitives";
import { Button } from "@/components/ui/button";
import { identity, heroFields } from "@/lib/site";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const heroActions = [
  {
    href: "#work",
    label: "Voir le travail",
    variant: "cobalt",
    external: false,
  },
  {
    href: `mailto:${identity.email}`,
    label: "Écrire",
    variant: "outline",
    external: false,
  },
  {
    href: identity.github,
    label: `github.com/${identity.handle}`,
    variant: "ghost",
    external: true,
  },
] satisfies {
  href: string;
  label: string;
  external: boolean;
  variant: "cobalt" | "outline" | "ghost";
}[];

const OUTLINE_INK = 990;
const OUTLINE_PAD = 23;

const OUTLINE_WORD = "MOHAMED";

export function Hero() {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLElement>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const haloX = useSpring(px, { stiffness: 60, damping: 20, mass: 0.6 });
  const haloY = useSpring(py, { stiffness: 60, damping: 20, mass: 0.6 });

  const { scrollYProgress } = useScroll();
  const solidY = useTransform(scrollYProgress, [0, 0.28], [0, -70]);
  const solidScale = useTransform(scrollYProgress, [0, 0.28], [1, 0.94]);
  const solidOpacity = useTransform(scrollYProgress, [0, 0.24], [1, 0.15]);
  const outlineY = useTransform(scrollYProgress, [0, 0.4], [0, 150]);
  const outlineOpacity = useTransform(scrollYProgress, [0, 0.2], [0.55, 0]);

  const haloShiftX = useTransform(haloX, (v) => `${v * 46}px`);
  const haloShiftY = useTransform(haloY, (v) => `${v * 34}px`);

  const onPointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (reduce || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      px.set((event.clientX - (rect.left + rect.width / 2)) / rect.width);
      py.set((event.clientY - (rect.top + rect.height / 2)) / rect.height);
    },
    [reduce, px, py],
  );

  const nameClass =
    "font-display font-extrabold leading-[0.84] tracking-[-0.01em] wdth-65";
  const nameSize =
    "text-[clamp(2.5rem,18vw,19rem)] lg:text-[clamp(3.5rem,20vw,19rem)]";

  return (
    <section
      id="top"
      ref={ref}
      onPointerMove={onPointerMove}
      className="relative isolate overflow-hidden"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ translateX: haloShiftX, translateY: haloShiftY }}
      >
        <div
          className="ambient-layer -top-40 left-[8%] size-[34rem] bg-primary/16"
          style={{ animation: "ambient-drift 32s ease-in-out infinite" }}
        />
        <div
          className="ambient-layer top-10 right-[4%] size-[28rem] bg-primary/10"
          style={{ animation: "ambient-drift-slow 26s ease-in-out infinite" }}
        />
      </motion.div>

      <div className="mx-auto max-w-[88rem] px-5 pt-14 sm:px-8 sm:pt-20">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[3.4vw] z-0 select-none"
          style={{
            y: reduce ? 0 : outlineY,
            opacity: reduce ? 0.4 : outlineOpacity,
          }}
        >
          <svg
            viewBox={`${-OUTLINE_PAD} 0 ${OUTLINE_INK + OUTLINE_PAD * 2} 380`}
            preserveAspectRatio="xMinYMid meet"
            className="block h-auto w-full"
          >
            <text
              x="0"
              y="340"
              textLength="1000"
              lengthAdjust="spacingAndGlyphs"
              fontSize="430"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              className="font-display font-extrabold wdth-65"
            >
              {OUTLINE_WORD}
            </text>
          </svg>
        </motion.div>

        <motion.h1
          className={`${nameClass} ${nameSize} relative z-10`}
          style={{
            y: reduce ? 0 : solidY,
            scale: reduce ? 1 : solidScale,
            opacity: reduce ? 1 : solidOpacity,
          }}
        >
          <motion.span
            className="block"
            initial={{ y: reduce ? 0 : "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            {identity.firstName.toUpperCase()}
          </motion.span>
          <motion.span
            className="block text-primary"
            initial={{ y: reduce ? 0 : "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.09, ease: [0.22, 1, 0.36, 1] }}
          >
            {identity.lastName.toUpperCase()}
          </motion.span>
        </motion.h1>

        <div className="relative z-10 mt-10 h-px w-full bg-foreground sm:mt-14" />

        <dl className="relative z-10 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          {heroFields.map((field, index) => (
            <motion.div
              key={field.key}
              className="min-w-0 border-t border-border pt-5 md:border-t-0 md:pt-5"
              initial={{ opacity: 0, y: reduce ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.5 + index * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <dt className="text-[0.8125rem] text-muted-foreground">
                {field.key}
              </dt>
              <dd className="mt-1.5 font-display text-lg font-semibold tracking-tight">
                {"signal" in field && field.signal ? (
                  <span className="flex min-w-0 items-start gap-2">
                    <motion.span
                      aria-hidden="true"
                      className="mt-2 size-2 shrink-0 bg-[var(--signal)]"
                      animate={
                        reduce
                          ? undefined
                          : { opacity: [1, 0.35, 1], scaleY: [1, 0.6, 1] }
                      }
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    {field.value}
                  </span>
                ) : (
                  field.value
                )}
              </dd>
            </motion.div>
          ))}
        </dl>

        <div className="relative z-10 mt-12 flex flex-col gap-8 sm:mt-16 lg:flex-row lg:items-end lg:justify-between">
          <motion.p
            className="order-1 max-w-[46ch] text-lg leading-[1.6] lg:order-2"
            initial={{ opacity: 0, y: reduce ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.72,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {identity.roleTagline}
          </motion.p>

          <div className="order-2 flex flex-wrap items-center gap-3 lg:order-1">
            {heroActions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.78 + index * 0.07,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Magnetic>
                  <Button asChild size="lg" variant={action.variant}>
                    <a
                      href={action.href}
                      {...(action.external
                        ? { target: "_blank", rel: "noreferrer noopener" }
                        : {})}
                    >
                      {action.label}
                    </a>
                  </Button>
                </Magnetic>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
