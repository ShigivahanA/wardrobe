import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import PairingCard from './PairingCard'

/* ======================================================
   Layout constants (responsive via CSS variables)
====================================================== */

const CARD_WIDTH = 'clamp(160px, 55vw, 220px)'
const GAP = 'clamp(12px, 4vw, 24px)'

/* ======================================================
   PairingRow
====================================================== */

const PairingRow = ({ title, items = [], onChange }) => {
  /* ------------------------------
     Core state
  ------------------------------ */
  const [index, setIndex] = useState(0)

  /* ------------------------------
     Drag / swipe state
  ------------------------------ */
  const [isDragging, setIsDragging] = useState(false)
  const [dragX, setDragX] = useState(0)

  const startXRef = useRef(0)
  const lastXRef = useRef(0)

  /* ------------------------------
     Config
  ------------------------------ */
  const SWIPE_THRESHOLD = 60 // px required to change card

  /* ======================================================
     Initial random centering
  ====================================================== */
  useEffect(() => {
    if (!items.length) return

    const start =
      items.length > 2
        ? Math.floor(Math.random() * items.length)
        : 0

    setIndex(start)
  }, [items])

  /* ======================================================
     Notify parent on change
  ====================================================== */
  useEffect(() => {
    if (!items.length) return
    onChange?.(items[index])
  }, [index, items, onChange])

  /* ======================================================
     Navigation helpers
  ====================================================== */
  const prev = () => {
    setIndex((i) => (i === 0 ? items.length - 1 : i - 1))
  }

  const next = () => {
    setIndex((i) => (i === items.length - 1 ? 0 : i + 1))
  }

  /* ======================================================
     Pointer (touch + mouse) handlers
  ====================================================== */
  const onPointerDown = (e) => {
    e.preventDefault()
    setIsDragging(true)
    startXRef.current = e.clientX
    lastXRef.current = e.clientX
  }

  const onPointerMove = (e) => {
    if (!isDragging) return
    const currentX = e.clientX
    const delta = currentX - startXRef.current
    lastXRef.current = currentX
    setDragX(delta)
  }

  const onPointerUp = () => {
    if (!isDragging) return

    if (dragX > SWIPE_THRESHOLD) {
      prev()
    } else if (dragX < -SWIPE_THRESHOLD) {
      next()
    }

    setDragX(0)
    setIsDragging(false)
  }

  /* ======================================================
     Empty state
  ====================================================== */
  if (!items.length) {
    return (
      <div className="text-center text-sm text-neutral-500">
        No {title.toLowerCase()} items
      </div>
    )
  }

  /* ======================================================
     Render
  ====================================================== */
  return (
    <section className="space-y-5">

      {/* Title */}
      <p className="text-sm uppercase tracking-widest text-neutral-500 text-center">
        {title}
      </p>

      {/* Viewport */}
      <div
        className="relative overflow-hidden"
        style={{
          '--card-width': CARD_WIDTH,
          '--card-gap': GAP
        }}
      >
        {/* Track */}
        <div
          className={`
            flex items-center
            will-change-transform
            ${isDragging
              ? 'transition-none'
              : 'transition-transform duration-500 ease-[cubic-bezier(.22,.61,.36,1)]'}
          `}
          style={{
            transform: `
  translateX(
    calc(
      50% -
      (${index} * (var(--card-width) + var(--card-gap))) -
      (var(--card-width) / 2) +
      ${dragX}px
    )
  )
`

          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {items.map((item, i) => (
            <div
              key={item._id}
              className="shrink-0"
              style={{
                width: CARD_WIDTH,
                marginRight: i === items.length - 1 ? 0 : GAP
              }}
            >
              <PairingCard
                item={item}
                active={i === index}
                offset={i - index}
              />
            </div>
          ))}
        </div>

        {/* Prev button (desktop only) */}
        <button
          onClick={prev}
          className="
            absolute left-2 top-1/2 -translate-y-1/2
            z-10
            hidden sm:block
            rounded-full p-2
            bg-white/80 backdrop-blur
            border border-neutral-200
            dark:border-neutral-700 dark:bg-neutral-500
            transition hover:scale-105
          "
        >
          <ChevronLeft size={18} />
        </button>

        {/* Next button (desktop only) */}
        <button
          onClick={next}
          className="
            absolute right-2 top-1/2 -translate-y-1/2
            z-10
            hidden sm:block
            rounded-full p-2
            bg-white/80 backdrop-blur
            border border-neutral-200
            dark:border-neutral-700 dark:bg-neutral-500
            transition hover:scale-105
          "
        >
          <ChevronRight size={18} />
        </button>

      </div>
    </section>
  )
}

export default PairingRow
