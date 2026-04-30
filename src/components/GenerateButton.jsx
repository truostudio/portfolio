import { Heatmap } from '@paper-design/shaders-react'

export default function GenerateButton() {
  return (
    <div style={{ alignItems: 'center', backgroundImage: 'linear-gradient(in oklch 180deg, oklch(19.1% 0 0) 1.04%, 44.27%, oklch(21.1% 0 0) 101.04%)', backgroundOrigin: 'border-box', borderColor: '#DD0772', borderRadius: '9px', borderStyle: 'solid', borderWidth: '1px', boxSizing: 'border-box', display: 'flex', fontSize: '12px', fontSynthesis: 'none', gap: '4px', justifyContent: 'center', lineHeight: '16px', MozOsxFontSmoothing: 'grayscale', overflow: 'clip', paddingBottom: 0, paddingLeft: '12px', paddingRight: '16px', paddingTop: 0, position: 'relative', WebkitFontSmoothing: 'antialiased', width: '108px', height: '36px' }}>
      <Heatmap speed={0.5} contour={0.5} angle={0} noise={0} innerGlow={0.72} outerGlow={0.85} scale={0.75} frame={4663719.985964392} colors={['#3F001C', '#720038', '#B6045D', '#DD0772', '#DD0772', '#DD0772', '#DD0772']} colorBack="#00000000" image="https://shaders.paper.design/images/logos/diamond.svg" style={{ bottom: 0, height: '219.75690043515038px', left: '50%', position: 'absolute', rotate: '359.74deg', transformOrigin: '0% 0%', translate: 'calc(-50% - 0.808px) 14px', width: '592.4046606711897px' }} />
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" style={{ rotate: '270deg', position: 'relative', flexShrink: '0', transformOrigin: '50% 50%' }}>
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
        <path d="M20 3v4" />
        <path d="M22 5h-4" />
        <path d="M4 17v2" />
        <path d="M5 18H3" />
      </svg>
      <div style={{ boxSizing: 'border-box', color: '#FFFFFF', display: 'inline-block', flexShrink: '0', fontFamily: '"SFProDisplay-Semibold", "SF Pro Display", system-ui, sans-serif', fontSize: '14px', fontWeight: 600, lineHeight: '20px', position: 'relative', textAlign: 'right', width: 'fit-content' }}>
        Generate
      </div>
    </div>
  )
}
