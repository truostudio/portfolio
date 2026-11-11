import { forwardRef } from 'react'
import TileSpinner from './TileSpinner'

// Hoppy, the plain mascot, as Hoppy's own share image draws it
const HoppySpinner = forwardRef(function HoppySpinner(props, ref) {
  return <TileSpinner ref={ref} src="/hoppy-mark.png" logoSize={0.66} {...props} />
})

export default HoppySpinner
