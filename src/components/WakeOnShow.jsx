import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

// Inside a <Canvas> whose frameloop goes 'never' while it's off screen: once
// it's back to 'always', ask for a frame, since the render loop stopped while
// nothing was rendering and doesn't start again by itself.
export default function WakeOnShow({ live }) {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    if (live) invalidate()
  }, [live, invalidate])
  return null
}
