import CaseStudyPage from '../components/CaseStudyPage'
import HopscotchSpinner from '../components/HopscotchSpinner'

// Each clip comes from the recording pipeline (scripts/clips). A section
// stays off the page until its clip is rendered: flip `ready` when it lands.
const sections = [
  {
    src: '/hopscotch-usage.mp4',
    lead: 'One dashboard for every model a team calls. Spend, speed and failures across every request, at a glance.',
    body: 'Designed end to end from the first concept, as the founding designer.',
  },
  {
    src: '/hopscotch-routing.mp4',
    lead: 'Fallbacks you set once. When a model fails, the next one in line takes the request.',
    body: 'Routing used to be a diagram plus a list. Now it is one chain you read top to bottom.',
  },
  {
    src: '/hopscotch-guardrails.mp4',
    lead: 'Spend controls for every key and every teammate, so an agent looping overnight never becomes a surprise bill.',
    body: 'Owners, admins and developers each see what their role needs, and nothing more.',
  },
  {
    src: '/hopscotch-playground.mp4',
    lead: 'A playground for trying a prompt on up to three models side by side.',
    body: 'The fastest way to pick a model is to watch them answer the same question.',
  },
  {
    src: '/hopscotch-onboarding.mp4',
    lead: 'Onboarding that gets a developer to a first working call in minutes.',
    body: 'A short welcome, a guided tour and a free first call, with every sign-in error designed for.',
  },
  {
    src: '/hopscotch-site.mp4',
    lead: 'The marketing site, designed and built end to end. The hero plays the product itself.',
    body: 'Every page, the voice and the copy, shipped in React with a page for every model and live benchmarks.',
  },
  {
    src: '/hopscotch-cms.mp4', ready: false,
    lead: 'A design system wired to a headless CMS, so anyone on the team can publish a landing page.',
    body: 'Marketing builds and ships ad pages on their own, from the same parts the site is made of.',
  },
  {
    lead: 'Platform, site and brand, held together by one design language.',
    body: 'Designed in production code with Claude Code, so engineering builds from real components, not mockups.',
  },
]

export default function CaseStudyHopscotch() {
  return (
    <CaseStudyPage
      title="Hopscotch Design"
      subtitle="An LLM gateway and router, designed end to end."
      Spinner={HopscotchSpinner}
      sections={sections}
    />
  )
}
