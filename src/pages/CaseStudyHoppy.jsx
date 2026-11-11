import CaseStudyPage from '../components/CaseStudyPage'
import HoppySpinner from '../components/HoppySpinner'

// Each clip comes from the recording pipeline (scripts/clips). A section
// stays off the page until its clip is rendered: flip `ready` when it lands.
const sections = [
  {
    src: '/hoppy-floor.mp4',
    lead: 'Every AI agent you run is a Hoppy you can see. The whole team works on one floor plan.',
    body: 'You never read a list of processes. You look at your Hoppies: who is working, who needs you, and who is done.',
  },
  {
    src: '/hoppy-chat.mp4',
    lead: 'Everything a Hoppy makes lands in its chat, in the form its harness made it.',
    body: 'A web page, a deck, a pull request or a spreadsheet, each drawn as itself and opened big in one tap.',
  },
  {
    src: '/hoppy-create.mp4',
    lead: 'Hiring a Hoppy is picking a role, then building the computer it works on.',
    body: 'Model, harness, CPU, memory and GPU, chosen in plain words, then a short moment while it moves in.',
  },
  {
    src: '/hoppy-mascot.mp4',
    lead: 'A mascot system built in the round. Its color is the model it thinks with.',
    body: 'Drawn flat but placed in 3D, so every hat, scarf and accessory turns with it. Rabbits multiply, and so do Hoppies.',
  },
  {
    lead: 'Product, brand and mascot, designed as one.',
    body: 'Prototyped as the real front end in Next.js with Claude Code, as a component library engineering builds on.',
  },
]

export default function CaseStudyHoppy() {
  return (
    <CaseStudyPage
      title="Hoppy Design"
      subtitle="Hire a team of AI workers, each on its own computer."
      Spinner={HoppySpinner}
      sections={sections}
      rev={3}
    />
  )
}
