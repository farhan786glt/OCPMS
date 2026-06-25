import { useEffect, useState } from 'react'
import { apiGet } from '../api.js'

function ProjectTrackerPage() {
  const [milestones, setMilestones] = useState([])

  useEffect(() => {
    let cancelled = false

    apiGet('/tracker')
      .then((response) => {
        if (cancelled) return
        setMilestones(response.milestones || [])
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  const items = milestones.length
    ? milestones
    : [
        {
          id: 1,
          title: 'Foundation Completion',
          status: 'Completed',
          progress: 100,
          owner: 'QA Team',
          date: 'Apr 26, 2026',
        },
        {
          id: 2,
          title: 'Structural Frame',
          status: 'In Progress',
          progress: 68,
          owner: 'Site Engineering',
          date: 'Jun 02, 2026',
        },
        {
          id: 3,
          title: 'MEP Rough-In',
          status: 'In Progress',
          progress: 42,
          owner: 'MEP Team',
          date: 'Jul 14, 2026',
        },
        {
          id: 4,
          title: 'Facade Closure',
          status: 'Pending',
          progress: 18,
          owner: 'Facade Vendor',
          date: 'Aug 30, 2026',
        },
      ]

  return (
    <section className="view">
      <div className="section__header">
        <div>
          <h1>Project Tracker</h1>
          <p className="muted">Milestones, timelines, and live status updates.</p>
        </div>
      </div>

      <div className="panel">
        <div className="tracker-grid">
          {items.map((item) => (
            <div key={item.id} className="tracker-card reveal">
              <div className="tracker-card__head">
                <p className="project-title">{item.title}</p>
                <span className="pill">{item.status}</span>
              </div>
              <div className="progress">
                <span style={{ width: `${item.progress}%` }} />
              </div>
              <div className="project-meta">
                <span>{item.owner}</span>
                <span>{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectTrackerPage
