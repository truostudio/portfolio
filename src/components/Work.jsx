const cardBase = {
  backgroundColor: '#fff',
  border: '1px solid #E9E9E9',
  borderRadius: '48px',
  overflow: 'clip',
  position: 'relative',
}

const projects = [
  {
    id: 1,
    title: 'Project One',
    type: 'Mobile App',
    bg: '#F0F4FF',
    accent: '#3B5BDB',
  },
  {
    id: 2,
    title: 'Project Two',
    type: 'Web Platform',
    bg: '#FFF0F6',
    accent: '#C2255C',
  },
  {
    id: 3,
    title: 'Project Three',
    type: 'Design System',
    bg: '#F0FFF4',
    accent: '#2F9E44',
  },
  {
    id: 4,
    title: 'Project Four',
    type: 'Mobile App',
    bg: '#FFF9DB',
    accent: '#E67700',
  },
  {
    id: 5,
    title: 'Project Five',
    type: 'Web App',
    bg: '#F3F0FF',
    accent: '#6741D9',
  },
]

function PhoneFrame({ bg, accent, title, type }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      position: 'relative', backgroundColor: '#fff', borderRadius: '48px',
    }}>
      {/* Project label at top */}
      <div style={{ padding: '32px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#999', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>{type}</div>
          <div style={{ fontSize: '20px', fontWeight: '500', color: '#171717' }}>{title}</div>
        </div>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: accent, opacity: 0.15,
        }} />
      </div>

      {/* Phone mockup */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBlock: '24px' }}>
        <div style={{
          width: '200px',
          aspectRatio: '76.7 / 161.9',
          backgroundColor: '#1D1D1F',
          borderRadius: '32px',
          padding: '5px',
          boxShadow: '0 3px 3px rgba(0,0,0,0.09), 0 8px 5px rgba(0,0,0,0.05), 0 14px 5px rgba(0,0,0,0.01)',
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
    </div>
  )
}

function ProjectCardWide({ bg, accent, title, type }) {
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
        <div style={{ fontSize: '12px', color: '#999', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>{type}</div>
        <div style={{ fontSize: '18px', fontWeight: '500', color: '#171717' }}>{title}</div>
      </div>
    </div>
  )
}

export default function Work() {
  return (
    <section style={{ paddingBlock: '24px' }}>
      <div style={{
        maxWidth: '1554px',
        marginInline: 'auto',
        paddingInline: '48px',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '48px',
          maxWidth: '1496px',
          marginInline: 'auto',
        }}>

          {/* Row 1: Two tall mobile cards */}
          <div style={{ display: 'flex', gap: '48px' }}>
            <div style={{ ...cardBase, flex: 1, aspectRatio: '724 / 840' }}>
              <PhoneFrame {...projects[0]} />
            </div>
            <div style={{ ...cardBase, flex: 1, aspectRatio: '724 / 840' }}>
              <PhoneFrame {...projects[1]} />
            </div>
          </div>

          {/* Row 2: Three equal cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px' }}>
            {[projects[2], projects[3], projects[4]].map((p) => (
              <div key={p.id} style={{ ...cardBase, height: '454px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ padding: '32px', width: '100%' }}>
                  <div style={{
                    width: '100%', aspectRatio: '4/3',
                    background: p.bg,
                    borderRadius: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 3px 3px rgba(0,0,0,0.09), 0 8px 5px rgba(0,0,0,0.05)',
                  }}>
                    <div style={{ width: '50%', height: '50%', borderRadius: '8px', background: p.accent, opacity: 0.15 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Row 3: Two tall mobile cards */}
          <div style={{ display: 'flex', gap: '48px' }}>
            <div style={{ ...cardBase, flex: 1, aspectRatio: '724 / 840' }}>
              <PhoneFrame {...projects[3]} />
            </div>
            <div style={{ ...cardBase, flex: 1, aspectRatio: '724 / 840' }}>
              <PhoneFrame {...projects[4]} />
            </div>
          </div>

          {/* Row 4: Wide 2/3 + square 1/3 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px' }}>
            <div style={{ ...cardBase, gridColumn: 'span 2', aspectRatio: '2.107 / 1' }}>
              <ProjectCardWide {...projects[0]} />
            </div>
            <div style={{ ...cardBase, aspectRatio: '1 / 1' }}>
              <div style={{
                height: '100%',
                background: projects[1].bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: '60%', height: '60%', borderRadius: '16px',
                  background: projects[1].accent, opacity: 0.15,
                }} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
