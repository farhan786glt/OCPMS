import { useEffect, useState } from 'react'
import { apiGet } from '../api.js'

function DashboardPage({ kpi, filteredProjects, onViewAllProjects }) {
  const [dashboard, setDashboard] = useState({ kpi, projects: filteredProjects })

  useEffect(() => {
    let cancelled = false

    apiGet('/dashboard')
      .then((response) => {
        if (cancelled) return
        setDashboard({
          kpi: response.kpi || kpi,
          projects: response.recentProjects || filteredProjects,
        })
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [filteredProjects, kpi])

  const visibleProjects = dashboard.projects || filteredProjects
  const visibleKpi = dashboard.kpi || kpi

  return (
    <section className="view">
      <div className="hero reveal">
        <div className="hero__content">
          <p className="eyebrow">Phase 3 | 68% Complete</p>
          <h1>Gilgit Riverside Promenade</h1>
          <p className="hero__summary">
            Track procurement, milestones, and cross-site dependencies in a single live view.
          </p>
          <div className="hero__meta">
            <div>
              <p>Deadline</p>
              <strong>Dec 15, 2026</strong>
            </div>
            <div>
              <p>Budget Used</p>
              <strong>PKR 18.4 Cr / 27 Cr</strong>
            </div>
            <div>
              <p>Weather Risk</p>
              <strong>Low, 6%</strong>
            </div>
          </div>
        </div>
        <div className="hero__card">
          <p className="hero__card-label">Days Left</p>
          <p className="hero__card-value">214</p>
          <div className="hero__card-bar">
            <span style={{ width: '68%' }} />
          </div>
          <p className="hero__card-caption">On-track delivery buffer</p>
        </div>
      </div>

      <div className="stats">
        <div className="stat-card reveal delay-1">
          <div className="stat-card__head">
            <p>Active Projects</p>
            <span className="stat-icon">
              <span className="nav-icon icon-tower" aria-hidden="true" />
            </span>
          </div>
          <strong>{visibleKpi.activeProjects}</strong>
          <div className="stat-bar">
            <span style={{ width: '76%' }} />
          </div>
        </div>
        <div className="stat-card reveal delay-2">
          <div className="stat-card__head">
            <p>Tasks Due</p>
            <span className="stat-icon warn">
              <span className="nav-icon icon-check" aria-hidden="true" />
            </span>
          </div>
          <strong className="accent-warn">{visibleKpi.tasksDue}</strong>
          <span className="stat-note">6 at risk</span>
        </div>
        <div className="stat-card reveal delay-3">
          <div className="stat-card__head">
            <p>Budget Variance</p>
            <span className="stat-icon good">
              <span className="nav-icon icon-wallet" aria-hidden="true" />
            </span>
          </div>
          <strong className="accent-good">{visibleKpi.budgetVariance}</strong>
          <span className="stat-note">Forecast controlled</span>
        </div>
        <div className="stat-card reveal delay-4">
          <div className="stat-card__head">
            <p>Site Photos</p>
            <span className="stat-icon cool">
              <span className="nav-icon icon-camera" aria-hidden="true" />
            </span>
          </div>
          <strong>{visibleKpi.sitePhotos}</strong>
          <span className="stat-note">Updated 2 hrs ago</span>
        </div>
      </div>

      <div className="section">
        <div className="section__header">
          <div>
            <h2>Active Projects</h2>
            <p className="muted">Live status from the last sync</p>
          </div>
          <button className="ghost-button" type="button" onClick={onViewAllProjects}>
            View All
          </button>
        </div>

        <div className="cards">
          {visibleProjects.slice(0, 3).map((project) => (
            <article key={project.id} className="project-card reveal">
              <div className="project-card__head">
                <div>
                  <p className="project-title">{project.name}</p>
                  <p className="project-status">{project.status}</p>
                </div>
                <div className="project-score">{project.progress}%</div>
              </div>
              <div className="progress">
                <span style={{ width: `${project.progress}%` }} />
              </div>
              <div className="project-meta">
                <span>{project.location}</span>
                <span>Budget {project.budget}</span>
                <span>{project.contractor}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DashboardPage
