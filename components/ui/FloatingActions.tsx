import Image from 'next/image'
import { parentLink } from '@/lib/site'
import scultMark from '@/public/tool-icons/logo.png'
import whatsappMark from '@/public/tool-icons/Pink Black Photocentric Neon Tech Talk Podcast Instagram Post.png'

const WHATSAPP_NUMBER = '919250680738'
const WHATSAPP_MESSAGE = "Hi! I found you through Scult Tools and I'd like to know more."

/**
 * Two static launcher buttons, styled after the same fixed-corner pattern
 * scult.in itself uses for its own WhatsApp launcher (56px squircle icon,
 * hover:scale-110, a soft shadow that blooms on hover) — reproduced here
 * rather than reinvented, so a visitor who's seen the parent site recognises
 * the affordance immediately.
 *
 * WhatsApp sits bottom-LEFT, the Scult mark bottom-RIGHT — a mirrored pair
 * at the same `bottom-5` height (the help-bubble FAB that used to occupy
 * this corner was removed at the user's request). Both are plain `<a>`
 * tags — neither needs client-side state.
 */
export function FloatingActions() {
  return (
    <>
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Scult on WhatsApp"
        className="group fixed bottom-5 left-5 z-40 block transition-transform duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:scale-110 motion-reduce:transition-none motion-reduce:hover:scale-100"
      >
        {/* Explicit width/height — the source PNG is a 1890x1890 export;
            without these next/image serves that full intrinsic size instead
            of one sized for a 56px (size-14) display. */}
        <Image
          src={whatsappMark}
          alt=""
          width={56}
          height={56}
          className="size-14 select-none rounded-[22.5%] shadow-card-raised transition-shadow duration-300 group-hover:shadow-[0_10px_25px_rgba(0,0,0,0.4),0_0_18px_rgba(43,184,38,0.45)]"
        />
      </a>

      <a
        href={parentLink('/', 'floating-logo')}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit Scult, the agency behind these tools"
        className="group fixed right-5 bottom-5 z-40 block transition-transform duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:scale-110 motion-reduce:transition-none motion-reduce:hover:scale-100"
      >
        <Image
          src={scultMark}
          alt=""
          width={56}
          height={56}
          className="size-14 select-none rounded-[22.5%] shadow-card-raised transition-shadow duration-300 group-hover:shadow-card-raised"
        />
      </a>
    </>
  )
}
