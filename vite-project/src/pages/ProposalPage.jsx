import { useEffect, useState } from 'react'
import { apiGet } from '../api.js'

function ProposalPage() {
  const [proposal, setProposal] = useState(null)

  useEffect(() => {
    let cancelled = false

    apiGet('/proposal')
      .then((response) => {
        if (cancelled) return
        setProposal(response.proposal || null)
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  const title = proposal?.title || 'OCPMS Proposal'
  const summary = proposal?.summary
  const sections = proposal?.sections || []

  return (
    <section className="view">
      <div className="section__header">
        <div>
          <h1>{title}</h1>
          <p className="muted">Why the platform is needed and what it solves.</p>
        </div>
      </div>

      <div className="panel proposal">
        <p>
          {summary ||
            'Construction firms manage multiple projects with diverse stakeholders, tight deadlines, significant budgets, and complex coordination requirements. Handling these through spreadsheets, physical documents, and ad-hoc communication often leads to delays, miscommunication, and cost overruns.'}
        </p>
        <p>
          This proposal presents the development of an Online Construction Project Management
          System (OCPMS) - a centralized, web-based platform designed specifically for a
          construction company that operates multiple concurrent projects.
        </p>
        <h2>Key Problems Addressed</h2>
        <ul>
          {(sections.length
            ? sections
            : [
                'Lack of centralized project visibility across multiple sites and teams.',
                'Difficulty in tracking project milestones, timelines, and budgets in real time.',
                'Poor communication between contractors, site engineers, managers, and clients.',
                'Inability of clients and investors to get timely updates on their projects.',
                'Manual and error-prone document management and reporting processes.',
              ]
          ).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default ProposalPage
