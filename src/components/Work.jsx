import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from '@phosphor-icons/react'
import { useBreakpoint } from '../hooks/useBreakpoint'

const cardBase = {
  backgroundColor: '#fff',
  border: '1px solid #E9E9E9',
  borderRadius: '48px',
  overflow: 'hidden',
  position: 'relative',
}

const labelPill = {
  background: '#ffffff',
  border: '1px solid #ECECEC',
  borderRadius: '999px',
  padding: '10px 20px',
  fontSize: '16px',
  fontWeight: '500',
  letterSpacing: '-1px',
  color: '#171717',
  whiteSpace: 'nowrap',
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
}

const rebrand = {
  id: 'rebrand',
  title: 'Uniblock Design',
  body: 'A full brand overhaul for Uniblock. Shifted the visual identity from a heavy royal blue to a lighter, more accessible sky blue. The mark stayed the same — the color was the transformation.',
}

const projects = [
  {
    id: 1,
    title: 'Vanta Mobile',
    body: 'A mobile banking app redesign focused on reducing cognitive load during transactions. Built for iOS with a strong emphasis on clarity and accessibility.',
    bg: '#F0F4FF',
    accent: '#3B5BDB',
  },
  {
    id: 2,
    title: 'Studio Platform',
    body: 'A collaborative design platform for distributed teams. Streamlines the handoff between design and engineering at scale.',
    bg: '#FFF0F6',
    accent: '#C2255C',
  },
  {
    id: 3,
    title: 'Atlas Design System',
    body: 'A component library built for product teams at scale. Covers tokens, patterns, and living documentation across platforms.',
    bg: '#F0FFF4',
    accent: '#2F9E44',
  },
  {
    id: 4,
    title: 'Orbit Dashboard',
    body: 'An analytics dashboard for ops teams. Surfaces real-time data with a focus on legibility and fast decision-making.',
    bg: '#FFF9DB',
    accent: '#E67700',
  },
  {
    id: 5,
    title: 'Lens App',
    body: 'A photography companion app for managing shoots and editing workflows. Designed around a minimal, distraction-free interface.',
    bg: '#F3F0FF',
    accent: '#6741D9',
  },
  {
    id: 6,
    title: 'ApeChain × Uniblock',
    body: 'ApeChain has a passionate, cult-like community. The goal was to grab their attention first, then bring them into the partnership story. Visually it needed to feel like we were reaching into their world and pulling them in. Applied the dither treatment to keep it on-brand for Uniblock while matching the energy of the audience.',
    image: '/poster-apechain.png',
    bg: '#EEF2FF',
    accent: '#3B5BDB',
  },
  {
    id: 7,
    title: 'Ecosystem Announcement',
    body: 'Used Zora\'s logo as a playful double entendre. "Ecosystem" refers to Uniblock\'s position hosting and controlling endpoints across all blockchains, but their mark reads as a spherical planet, so it lives in space. Applied Uniblock\'s dither design language for consistency across the brand. Also drew on Artemis II themes given its relevancy at the time.',
    image: '/poster-blockchains.webp',
    bg: '#0a0a12',
    accent: '#3B82F6',
  },
  {
    id: 8,
    title: 'Midnight × Uniblock',
    body: 'Placed Midnight\'s logo over a dark horse, a double entendre since the dark horse is shorthand for the underdog. Fitting given Midnight Build Club is geared toward founders and startups. Midnight\'s 3-dot logo, usually nested in a circle, is layered on top of the horse to pull focus to the center of the composition. Ties into the "We Run the Infra" headline, the feeling that we\'re about to take over.',
    image: '/poster-midnight.png',
    bg: '#EEF2FF',
    accent: '#3B5BDB',
  },
]

function HoverLabel({ title, hovered }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: 28,
      left: '50%',
      transform: hovered
        ? 'translateX(-50%) translateY(0)'
        : 'translateX(-50%) translateY(80px)',
      opacity: hovered ? 1 : 0,
      transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease',
      zIndex: 2,
      pointerEvents: 'none',
    }}>
      <div style={labelPill}>{title}</div>
    </div>
  )
}

function PhoneFrame({ bg, accent, title }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{ position: 'relative', height: '100%', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: hovered ? 'scale(1.07)' : 'scale(1)',
        transition: 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <div style={{
          width: '200px',
          aspectRatio: '76.7 / 161.9',
          backgroundColor: '#1D1D1F',
          borderRadius: '32px',
          padding: '5px',
          boxShadow: hovered
            ? '0 12px 32px rgba(0,0,0,0.18), 0 4px 8px rgba(0,0,0,0.10)'
            : '0 3px 3px rgba(0,0,0,0.09), 0 8px 5px rgba(0,0,0,0.05), 0 14px 5px rgba(0,0,0,0.01)',
          transition: 'box-shadow 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
          maxHeight: '460px',
        }}>
          <div style={{
            width: '100%', height: '100%',
            borderRadius: '27px',
            border: '1px solid rgba(0,0,0,0.1)',
            overflow: 'clip',
            background: bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: '60%', height: '60%', borderRadius: '12px', background: accent, opacity: 0.2 }} />
          </div>
        </div>
      </div>

      <HoverLabel title={title} hovered={hovered} />
    </div>
  )
}

function GridCard({ bg, accent, title, image, onClick }) {
  const [hovered, setHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const { isTablet } = useBreakpoint()

  function onMove(e) {
    if (!image) return
    const rect = e.currentTarget.getBoundingClientRect()
    const nx = (e.clientX - rect.left)  / rect.width  - 0.5
    const ny = (e.clientY - rect.top)   / rect.height - 0.5
    setTilt({ x: ny * -14, y: nx * 14 })
  }

  function onLeave() {
    setHovered(false)
    setTilt({ x: 0, y: 0 })
  }

  return (
    <div
      style={{ ...cardBase, height: isTablet ? '300px' : '454px', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
      onClick={onClick}
    >
      {image ? (
        <div style={{
          padding: '52px', width: '100%', height: '100%',
          boxSizing: 'border-box',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          perspective: '900px',
        }}>
          <img
            src={image} alt={title}
            style={{
              maxWidth: '100%', maxHeight: '100%',
              objectFit: 'contain', display: 'block',
              borderRadius: '8px',
              outline: '1px solid rgba(0,0,0,0.06)',
              boxShadow: hovered
                ? '0 12px 24px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)'
                : '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
              transform: hovered
                ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.05)`
                : 'rotateX(0deg) rotateY(0deg) scale(1)',
              transition: hovered
                ? 'transform 0.08s linear, box-shadow 0.2s ease'
                : 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease',
              willChange: 'transform',
            }}
          />
        </div>
      ) : (
        <div style={{
          padding: '32px', width: '100%', height: '100%',
          boxSizing: 'border-box',
          display: 'flex', alignItems: 'center',
        }}>
          <div style={{
            width: '100%', aspectRatio: '4/3',
            background: bg,
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 3px 3px rgba(0,0,0,0.09), 0 8px 5px rgba(0,0,0,0.05)',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}>
            <div style={{ width: '50%', height: '50%', borderRadius: '8px', background: accent, opacity: 0.15 }} />
          </div>
        </div>
      )}

      {!image && <HoverLabel title={title} hovered={hovered} />}
    </div>
  )
}

function ProjectCardWide({ bg, accent, title }) {
  return (
    <div style={{ ...cardBase, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, background: bg, position: 'relative', overflow: 'clip' }}>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: '40%', height: '50%', borderRadius: '16px', background: accent, opacity: 0.12 }} />
        </div>
      </div>
      <div style={{ padding: '24px 32px', borderTop: '1px solid #E9E9E9' }}>
        <div style={{ fontSize: '18px', fontWeight: '500', color: '#171717', letterSpacing: '-1px' }}>{title}</div>
      </div>
    </div>
  )
}

const oldLogoPaths = [
  "M35.6204 67.0001C35.0167 67.0001 34.3123 66.8995 33.8092 66.5976L2.2137 50.1958C0.804982 49.4914 0 48.0826 0 46.6739V12.4615C0 10.2478 1.81121 8.43652 4.02491 8.43652C6.23861 8.43652 8.04982 10.2478 8.04982 12.4615V44.2589L35.6204 58.5476L63.1911 44.2589V12.4615C63.1911 10.2478 65.0023 8.43652 67.216 8.43652C69.4297 8.43652 71.2409 10.2478 71.2409 12.4615V46.6739C71.2409 48.1833 70.4359 49.592 69.0272 50.2964L37.4317 66.5976C36.9285 66.8995 36.2242 67.0001 35.6204 67.0001Z",
  "M20.6796 16.9606L35.0798 8.60879C35.5091 8.39352 35.7284 8.39791 36.1662 8.60875L50.5646 16.9623C51.2689 17.3648 51.2689 18.3693 50.5646 18.7718L36.1663 27.0231C35.7575 27.228 35.4824 27.2243 35.0799 27.0231L20.6796 18.7718C19.9753 18.3694 19.9753 17.3631 20.6796 16.9606Z",
  "M18.5137 37.3684V20.7653C18.5137 19.9603 19.4193 19.4572 20.1237 19.8597L34.5127 28.1109C34.8146 28.3122 35.0159 28.614 35.0159 29.0165V45.6196C35.0159 46.4246 34.1103 46.9277 33.4059 46.5252L19.0168 38.274C18.715 38.0727 18.5137 37.6703 18.5137 37.3684Z",
  "M36.7282 28.1109L51.1173 19.8597C51.8216 19.4572 52.7272 19.9603 52.7272 20.7653V37.3684C52.7272 37.7709 52.526 38.0727 52.2241 38.274L37.8351 46.5252C37.1307 46.9277 36.2251 46.4246 36.2251 45.6196V29.0165C36.2251 28.614 36.4263 28.3122 36.7282 28.1109Z",
  "M137.008 52.8948C137.008 53.6489 136.9 54.2953 136.684 54.8339C136.469 55.4803 136.038 55.9112 135.607 56.3421C135.176 56.773 134.637 57.0962 134.099 57.4194C133.56 57.6349 132.913 57.7426 132.159 57.7426H110.072C108.887 57.7426 107.594 57.6349 106.193 57.3117C104.792 56.9885 103.499 56.5576 102.099 56.0189C100.806 55.3725 99.5129 54.6184 98.22 53.6489C96.9271 52.6793 95.8497 51.602 94.9877 50.2016C94.018 48.9088 93.2638 47.2929 92.7251 45.5692C92.1864 43.8456 91.8632 41.7987 91.8632 39.6442V17.2366H101.668V39.7519C101.668 41.0446 101.883 42.2296 102.314 43.1992C102.745 44.1688 103.392 45.1383 104.146 45.7847C104.9 46.4311 105.762 47.0774 106.84 47.5083C107.809 47.9393 108.994 48.047 110.18 48.047H127.311V17.2366H137.115V52.8948H137.008Z",
  "M191.203 57.8503H181.398V35.2273C181.398 33.9345 181.183 32.7495 180.752 31.78C180.321 30.8104 179.674 29.8408 178.92 29.1945C178.166 28.4404 177.304 27.9017 176.226 27.4708C175.257 27.0399 174.072 26.9322 172.886 26.9322H155.755V57.8503H145.95V22.0844C145.95 21.438 146.058 20.7916 146.274 20.1452C146.489 19.6066 146.92 19.068 147.351 18.637C147.782 18.2061 148.321 17.8829 148.967 17.5598C149.614 17.2366 150.26 17.2366 150.907 17.2366H172.994C174.179 17.2366 175.472 17.3443 176.873 17.6675C178.274 17.9907 179.566 18.4216 180.967 18.9602C182.26 19.6066 183.553 20.3607 184.846 21.3303C186.031 22.2998 187.108 23.3771 188.078 24.7776C189.048 26.0703 189.802 27.6863 190.341 29.4099C190.879 31.1336 191.203 33.1804 191.203 35.335V57.8503Z",
  "M209.735 8.83376H199.93V0H209.735V8.83376ZM209.735 57.8503H199.93V17.2366H209.735V57.8503Z",
  "M263.93 44.1688C263.93 45.1383 263.822 46.1079 263.606 47.0775C263.391 48.1547 263.068 49.1243 262.637 50.0939C262.206 51.0634 261.559 52.033 260.913 53.0025C260.266 53.9721 259.297 54.7262 258.327 55.4803C257.357 56.2344 256.172 56.773 254.771 57.204C253.479 57.6349 251.97 57.8503 250.246 57.8503H232.684C231.714 57.8503 230.745 57.7426 229.775 57.5272C228.698 57.3117 227.728 56.9885 226.758 56.5576C225.788 56.1267 224.819 55.4803 223.849 54.8339C222.879 54.0798 222.125 53.218 221.371 52.2484C220.617 51.2789 220.078 50.0939 219.647 48.6934C219.216 47.4006 219.001 45.8924 219.001 44.1688V0H228.805V44.1688C228.805 45.3538 229.128 46.3234 229.883 47.0775C230.637 47.8316 231.607 48.1547 232.684 48.1547H250.354C251.539 48.1547 252.509 47.8316 253.263 47.0775C253.91 46.3234 254.341 45.3538 254.341 44.1688V30.9182C254.341 29.7331 254.017 28.7636 253.263 28.0095C252.509 27.3631 251.647 26.9322 250.462 26.9322H232.684V17.2366H250.354C251.324 17.2366 252.293 17.3443 253.263 17.5598C254.341 17.7752 255.31 18.0984 256.28 18.5293C257.25 18.9603 258.219 19.6066 259.189 20.253C260.159 21.0071 260.913 21.8689 261.667 22.8385C262.421 23.8081 262.96 24.9931 263.391 26.3935C263.822 27.6863 264.037 29.1945 264.037 30.9182V44.1688H263.93Z",
  "M290.219 57.8503H285.909C284.509 57.8503 283 57.6349 281.384 57.0962C279.768 56.6653 278.26 55.8035 276.967 54.7262C275.674 53.6489 274.489 52.2484 273.519 50.5248C272.657 48.8011 272.118 46.6465 272.118 44.0611V0H281.923V44.1688C281.923 45.3538 282.246 46.3234 283 47.0775C283.754 47.8316 284.724 48.1547 285.802 48.1547H290.111V57.8503H290.219Z",
  "M340.751 44.1688C340.751 45.8924 340.535 47.4006 340.104 48.6934C339.673 49.9861 339.135 51.1711 338.38 52.2484C337.626 53.218 336.872 54.0798 335.902 54.8339C334.933 55.588 333.963 56.1266 332.993 56.5576C332.024 56.9885 330.946 57.3117 329.869 57.5271C328.791 57.7426 327.822 57.8503 326.96 57.8503H309.29C307.889 57.8503 306.488 57.6349 304.872 57.0962C303.256 56.6653 301.748 55.8035 300.455 54.7262C299.162 53.6489 297.977 52.2484 297.007 50.5248C296.145 48.8011 295.606 46.6465 295.606 44.061V30.9181C295.606 28.4404 296.037 26.2858 297.007 24.5621C297.869 22.8385 299.054 21.438 300.455 20.3607C301.855 19.2834 303.256 18.5293 304.872 17.9907C306.488 17.5598 307.997 17.2366 309.29 17.2366H326.96C329.438 17.2366 331.593 17.6675 333.317 18.637C335.04 19.6066 336.441 20.6839 337.518 22.0844C338.596 23.4848 339.35 24.8853 339.889 26.5012C340.428 28.1172 340.643 29.6254 340.643 31.0259V44.1688H340.751ZM330.946 30.9181C330.946 29.5176 330.623 28.5481 329.976 27.9017C329.33 27.2553 328.36 26.9322 327.067 26.9322H309.505C308.212 26.9322 307.243 27.2553 306.488 27.9017C305.842 28.5481 305.519 29.5176 305.519 30.8104V44.1688C305.519 45.4615 305.842 46.4311 306.488 47.0774C307.135 47.7238 308.105 48.047 309.505 48.047H327.067C328.36 48.047 329.438 47.7238 330.084 47.0774C330.731 46.4311 331.054 45.4615 331.054 44.1688V30.9181H330.946Z",
  "M388.373 57.8503H361.869C360.468 57.8503 359.067 57.6349 357.451 57.0962C355.835 56.6653 354.327 55.8035 353.034 54.7262C351.741 53.6489 350.555 52.2484 349.586 50.5248C348.724 48.8011 348.185 46.6465 348.185 44.061V30.9181C348.185 29.9486 348.293 28.979 348.508 28.0094C348.724 26.9322 349.047 25.9626 349.478 24.993C349.909 24.0235 350.555 23.0539 351.202 22.0844C351.956 21.1148 352.818 20.3607 353.788 19.6066C354.757 18.8525 355.943 18.3139 357.343 17.8829C358.636 17.452 360.145 17.2366 361.869 17.2366H388.373V26.9322H361.869C360.576 26.9322 359.606 27.2553 358.959 27.9017C358.313 28.5481 357.99 29.5176 357.99 30.9181V44.1688C357.99 45.4615 358.313 46.4311 358.959 47.0774C359.606 47.7238 360.576 48.047 361.976 48.047H388.373V57.8503Z",
  "M406.367 57.8503H396.562V0H406.367V57.8503ZM444.292 57.8503H430.178L410.461 38.7823C409.383 37.8128 408.845 36.52 408.953 35.0118C408.953 34.2577 409.168 33.6114 409.491 33.0727C409.814 32.4264 410.245 31.8877 410.784 31.5645L428.67 17.1289H444.292L421.235 35.6582L444.292 57.8503Z",
]

const newLogoPaths = [
  "M30 49.323C29.4915 49.323 28.8983 49.2383 28.4746 48.984L1.86441 35.1702C0.677966 34.577 0 33.3905 0 32.204V3.38989C0 1.52545 1.52542 0 3.38983 0C5.25424 0 6.77966 1.52545 6.77966 3.38989V30.1701L30 42.2042L53.2203 30.1701V3.38989C53.2203 1.52545 54.7458 0 56.6102 0C58.4746 0 60 1.52545 60 3.38989V32.204C60 33.4752 59.322 34.6617 58.1356 35.2549L31.5254 48.984C31.1017 49.2383 30.5085 49.323 30 49.323Z",
  "M17.4176 7.17837L29.5456 0.144367C29.9071 -0.0369372 30.0919 -0.0332455 30.4606 0.144334L42.5871 7.17978C43.1803 7.51877 43.1803 8.36479 42.5871 8.70378L30.4606 15.6531C30.1163 15.8257 29.8847 15.8226 29.5457 15.6531L17.4176 8.70383C16.8244 8.36484 16.8244 7.51736 17.4176 7.17837Z",
  "M15.5928 24.3654V10.382C15.5928 9.70406 16.3555 9.28032 16.9487 9.61931L29.0674 16.5686C29.3216 16.7381 29.4911 16.9923 29.4911 17.3313V31.3147C29.4911 31.9926 28.7284 32.4164 28.1351 32.0774L16.0165 25.1281C15.7623 24.9586 15.5928 24.6196 15.5928 24.3654Z",
  "M30.9325 16.5686L43.0512 9.61931C43.6444 9.28032 44.4071 9.70406 44.4071 10.382V24.3654C44.4071 24.7044 44.2376 24.9586 43.9834 25.1281L31.8647 32.0774C31.2715 32.4164 30.5088 31.9926 30.5088 31.3147V17.3313C30.5088 16.9923 30.6783 16.7381 30.9325 16.5686Z",
  "M89.0218 40.7871C86.1911 40.7871 83.7061 40.2446 81.5666 39.1596C79.46 38.0745 77.8307 36.5456 76.6787 34.5728C75.5596 32.5672 75 30.1998 75 27.4708V4.93167H81.4185V27.4708C81.4185 29.9368 82.0768 31.8438 83.3934 33.1919C84.71 34.5399 86.5861 35.214 89.0218 35.214C91.4576 35.214 93.3337 34.5399 94.6503 33.1919C95.9999 31.8438 96.6746 29.9368 96.6746 27.4708V4.93167H103.093V27.4708C103.093 30.1998 102.517 32.5672 101.365 34.5728C100.213 36.5456 98.5837 38.0745 96.4771 39.1596C94.4035 40.2446 91.9184 40.7871 89.0218 40.7871Z",
  "M109.769 39.998V13.6613H115.496L115.743 21.0592L115.003 20.7633C115.266 18.922 115.809 17.4424 116.632 16.3245C117.455 15.2066 118.459 14.3846 119.644 13.8585C120.829 13.3325 122.129 13.0694 123.544 13.0694C125.486 13.0694 127.115 13.4969 128.432 14.3517C129.782 15.2066 130.802 16.3903 131.493 17.9028C132.184 19.3823 132.53 21.1085 132.53 23.0813V39.998H126.21V25.1034C126.21 23.6238 126.062 22.3744 125.766 21.3551C125.47 20.3359 124.976 19.5632 124.285 19.0371C123.626 18.4782 122.738 18.1987 121.619 18.1987C119.94 18.1987 118.59 18.7905 117.57 19.9742C116.583 21.1579 116.089 22.8676 116.089 25.1034V39.998H109.769Z",
  "M138.988 39.998V13.6613H145.308V39.998H138.988ZM138.889 10.1596V4.53711H145.456V10.1596H138.889Z",
  "M165.646 40.5898C163.802 40.5898 162.19 40.1953 160.807 39.4062C159.458 38.617 158.404 37.5156 157.647 36.1017L157.499 39.998H151.476V4.98099H157.795V17.4096C158.519 16.193 159.556 15.1737 160.906 14.3517C162.255 13.4969 163.835 13.0694 165.646 13.0694C167.917 13.0694 169.875 13.6448 171.521 14.7956C173.2 15.9135 174.483 17.5082 175.372 19.5796C176.294 21.6182 176.754 24.0348 176.754 26.8296C176.754 29.6244 176.294 32.0575 175.372 34.1289C174.483 36.1675 173.2 37.7622 171.521 38.913C169.875 40.0309 167.917 40.5898 165.646 40.5898ZM164.214 35.4606C166.024 35.4606 167.472 34.7043 168.559 33.1919C169.645 31.6465 170.188 29.5258 170.188 26.8296C170.188 24.1006 169.645 21.9799 168.559 20.4674C167.505 18.9549 166.074 18.1987 164.263 18.1987C162.914 18.1987 161.745 18.5439 160.758 19.2344C159.803 19.892 159.063 20.8619 158.536 22.1443C158.042 23.4266 157.795 24.9884 157.795 26.8296C157.795 28.6051 158.042 30.1505 158.536 31.4657C159.063 32.748 159.803 33.7344 160.758 34.4249C161.712 35.1153 162.864 35.4606 164.214 35.4606Z",
  "M188.219 39.998C186.31 39.998 184.78 39.5048 183.628 38.5184C182.476 37.532 181.9 35.9538 181.9 33.7837V4.98099H188.219V33.1426C188.219 33.8001 188.384 34.2933 188.713 34.6221C189.075 34.9509 189.569 35.1153 190.194 35.1153H192.12V39.998H188.219Z",
  "M207.626 40.5898C205.026 40.5898 202.738 40.0309 200.763 38.913C198.821 37.7622 197.307 36.1511 196.221 34.0796C195.168 32.0082 194.641 29.5915 194.641 26.8296C194.641 24.0348 195.168 21.6182 196.221 19.5796C197.307 17.5082 198.821 15.9135 200.763 14.7956C202.738 13.6448 205.026 13.0694 207.626 13.0694C210.226 13.0694 212.497 13.6448 214.439 14.7956C216.381 15.9135 217.879 17.5082 218.932 19.5796C220.018 21.6182 220.562 24.0348 220.562 26.8296C220.562 29.5915 220.018 32.0082 218.932 34.0796C217.879 36.1511 216.381 37.7622 214.439 38.913C212.497 40.0309 210.226 40.5898 207.626 40.5898ZM207.626 35.4606C209.667 35.4606 211.23 34.7043 212.316 33.1919C213.435 31.6794 213.995 29.5587 213.995 26.8296C213.995 24.1335 213.435 22.0292 212.316 20.5167C211.23 18.9714 209.667 18.1987 207.626 18.1987C205.585 18.1987 204.005 18.9714 202.886 20.5167C201.767 22.0292 201.207 24.1335 201.207 26.8296C201.207 29.5587 201.767 31.6794 202.886 33.1919C204.005 34.7043 205.585 35.4606 207.626 35.4606Z",
  "M236.893 40.5898C234.26 40.5898 231.972 40.0309 230.03 38.913C228.088 37.7622 226.574 36.1511 225.488 34.0796C224.434 32.0082 223.908 29.5915 223.908 26.8296C223.908 24.0677 224.434 21.6675 225.488 19.6289C226.574 17.5575 228.088 15.9464 230.03 14.7956C231.972 13.6448 234.26 13.0694 236.893 13.0694C239.131 13.0694 241.122 13.464 242.867 14.2531C244.611 15.0422 246.027 16.1766 247.113 17.6562C248.232 19.1029 248.923 20.8784 249.187 22.9827L242.669 23.3279C242.406 21.6511 241.748 20.3852 240.694 19.5303C239.674 18.6426 238.407 18.1987 236.893 18.1987C234.852 18.1987 233.272 18.9714 232.153 20.5167C231.034 22.0292 230.474 24.1335 230.474 26.8296C230.474 29.5587 231.034 31.6794 232.153 33.1919C233.272 34.7043 234.852 35.4606 236.893 35.4606C238.44 35.4606 239.723 35.0167 240.744 34.1289C241.797 33.2412 242.439 31.8602 242.669 29.9861L249.187 30.282C248.923 32.3863 248.248 34.2111 247.162 35.7565C246.076 37.3018 244.661 38.502 242.916 39.3568C241.172 40.1788 239.164 40.5898 236.893 40.5898Z",
  "M253.596 39.998V4.98099H259.916V25.5473L270.729 13.6613H278.529L268.21 24.6102L278.875 39.998H271.765L264.063 28.3585L259.916 32.748V39.998H253.596Z",
]

const BAYER = [
  [ 0,  8,  2, 10],
  [12,  4, 14,  6],
  [ 3, 11,  1,  9],
  [15,  7, 13,  5],
]

function RebrandCard() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const hoveredRef = useRef(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const W = canvas.width
    const H = canvas.height
    const ctx = canvas.getContext('2d')

    const CELL = 16

    // rasterize old logo (viewBox 0 0 445 67) scaled to full canvas width
    const scaleOld = W / 445
    const logoH    = 67 * scaleOld
    const yOld     = (H - logoH) / 2
    const oldMc = document.createElement('canvas')
    oldMc.width = W; oldMc.height = H
    const oldCtx = oldMc.getContext('2d')
    oldCtx.transform(scaleOld, 0, 0, scaleOld, 0, yOld)
    oldLogoPaths.forEach(d => oldCtx.fill(new Path2D(d)))
    const oldRaw = oldCtx.getImageData(0, 0, W, H).data
    const oldAlpha = new Uint8Array(W * H)
    for (let i = 0; i < W * H; i++) oldAlpha[i] = oldRaw[i * 4 + 3]

    // rasterize new logo (viewBox 0 0 279 50) scaled to same visual height, centered
    const scaleNew = logoH / 50
    const xNew     = (W - 279 * scaleNew) / 2
    const yNew     = (H - logoH) / 2
    const newMc = document.createElement('canvas')
    newMc.width = W; newMc.height = H
    const newCtx = newMc.getContext('2d')
    newCtx.transform(scaleNew, 0, 0, scaleNew, xNew, yNew)
    newLogoPaths.forEach(d => newCtx.fill(new Path2D(d)))
    const newRaw = newCtx.getImageData(0, 0, W, H).data
    const newAlpha = new Uint8Array(W * H)
    for (let i = 0; i < W * H; i++) newAlpha[i] = newRaw[i * 4 + 3]

    // precompute per-pixel x and bayer threshold
    const normX = new Float32Array(W * H)
    const bayerThr = new Float32Array(W * H)
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = y * W + x
        normX[i] = x / W
        bayerThr[i] = BAYER[Math.floor(y / CELL) % 4][Math.floor(x / CELL) % 4] / 16
      }
    }

    const img = ctx.createImageData(W, H)
    const px = img.data

    // p moves between 0 (old) and 1 (new) at a fixed speed in both directions
    const SPEED    = 1 / 2.5  // full sweep in 2.5s
    const HOLD_NEW = 0.8      // seconds to hold at new before sweeping back
    const HOLD_OLD = 0.5      // seconds to hold at old before sweeping forward
    let p = 0, dir = 1, holdTimer = 0
    let prevTime = performance.now() / 1000
    let raf

    function frame() {
      const now = performance.now() / 1000
      const dt  = Math.min(now - prevTime, 0.05)
      prevTime  = now

      if (hoveredRef.current) {
        // always move toward 1 from wherever p currently is
        p = Math.min(1, p + SPEED * dt)
        dir = 1
        holdTimer = 0
      } else if (p >= 1 && dir === 1) {
        holdTimer += dt
        if (holdTimer >= HOLD_NEW) { dir = -1; holdTimer = 0 }
      } else if (p <= 0 && dir === -1) {
        holdTimer += dt
        if (holdTimer >= HOLD_OLD) { dir = 1; holdTimer = 0 }
      } else {
        p = Math.max(0, Math.min(1, p + dir * SPEED * dt))
      }

      const g = 2 - 3 * p

      for (let i = 0; i < W * H; i++) {
        const pi = i * 4
        const a_old = oldAlpha[i]
        const a_new = newAlpha[i]
        const swept = normX[i] - bayerThr[i] >= g

        let r, gr, b, af
        if (!swept && a_old > 0) {
          r = 4;  gr = 90;  b = 255; af = a_old / 255
        } else if (swept && a_new > 0) {
          r = 31; gr = 182; b = 255; af = a_new / 255
        } else {
          r = gr = b = 255; af = 1
        }

        px[pi]   = Math.round(r  * af + 255 * (1 - af))
        px[pi+1] = Math.round(gr * af + 255 * (1 - af))
        px[pi+2] = Math.round(b  * af + 255 * (1 - af))
        px[pi+3] = 255
      }

      ctx.putImageData(img, 0, 0)
      raf = requestAnimationFrame(frame)
    }

    frame()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      style={{ ...cardBase, aspectRatio: '724 / 840', flex: 1, cursor: 'pointer' }}
      onMouseEnter={() => { setHovered(true);  hoveredRef.current = true  }}
      onMouseLeave={() => { setHovered(false); hoveredRef.current = false }}
      onClick={() => navigate('/case-study/uniblock-design')}
    >
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <canvas
          ref={canvasRef}
          width={1040}
          height={240}
          style={{ width: '68%', height: 'auto' }}
        />
      </div>
      <HoverLabel title="Uniblock Design" hovered={hovered} />
    </div>
  )
}

function Modal({ project, onClose }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.32)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
        animation: 'modalFadeIn 0.2s ease both',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '48px',
          padding: '52px',
          maxWidth: '560px',
          width: '100%',
          position: 'relative',
          animation: 'modalSlideUp 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '24px', right: '24px',
            width: 40, height: 40,
            background: '#ffffff',
            border: '1px solid #E9E9E9',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <X size={16} weight="bold" color="#171717" />
        </button>

        <h2 style={{
          fontSize: '28px',
          fontWeight: '500',
          color: '#171717',
          letterSpacing: '-1px',
          margin: '0 0 16px',
          lineHeight: 1.2,
        }}>
          {project.title}
        </h2>
        <p style={{
          fontSize: '16px',
          color: 'rgba(0,0,0,0.48)',
          letterSpacing: '-1px',
          fontWeight: '500',
          lineHeight: 1.65,
          margin: 0,
        }}>
          {project.body}
        </p>
      </div>
    </div>
  )
}

export default function Work() {
  const [activeModal, setActiveModal] = useState(null)
  const { isTablet, width } = useBreakpoint()

  const gap = isTablet ? '16px' : '48px'
  const gridCols3 = width < 640 ? '1fr' : width < 1100 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'

  return (
    <section style={{ paddingBlock: '24px' }}>
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>

      <div style={{ maxWidth: '1554px', marginInline: 'auto', paddingInline: isTablet ? '16px' : '48px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap, maxWidth: '1496px', marginInline: 'auto' }}>

          {/* Row 1 — rebrand case study + phone card */}
          <div style={{ display: 'flex', flexDirection: isTablet ? 'column' : 'row', gap }}>
            <RebrandCard />
            <div style={{ ...cardBase, flex: isTablet ? 'none' : 1, width: isTablet ? '100%' : undefined, aspectRatio: '724 / 840' }}>
              <PhoneFrame {...projects[1]} />
            </div>
          </div>

          {/* Row 2 — three grid cards, click → modal */}
          <div style={{ display: 'grid', gridTemplateColumns: gridCols3, gap }}>
            {[projects[2], projects[3], projects[4]].map((p) => (
              <GridCard key={p.id} {...p} onClick={() => setActiveModal(p)} />
            ))}
          </div>

          {/* Row 3 — two more phone cards */}
          <div style={{ display: 'flex', flexDirection: isTablet ? 'column' : 'row', gap }}>
            <div style={{ ...cardBase, flex: isTablet ? 'none' : 1, width: isTablet ? '100%' : undefined, aspectRatio: '724 / 840' }}>
              <PhoneFrame {...projects[3]} />
            </div>
            <div style={{ ...cardBase, flex: isTablet ? 'none' : 1, width: isTablet ? '100%' : undefined, aspectRatio: '724 / 840' }}>
              <PhoneFrame {...projects[4]} />
            </div>
          </div>

          {/* Row 4 — three grid cards, click → modal */}
          <div style={{ display: 'grid', gridTemplateColumns: gridCols3, gap }}>
            {[projects[5], projects[6], projects[7]].map((p) => (
              <GridCard key={p.id} {...p} onClick={() => setActiveModal(p)} />
            ))}
          </div>

        </div>
      </div>

      {activeModal && <Modal project={activeModal} onClose={() => setActiveModal(null)} />}
    </section>
  )
}
