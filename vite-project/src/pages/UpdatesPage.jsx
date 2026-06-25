import { useEffect, useState } from 'react'
import { apiGet } from '../api.js'

function UpdatesPage({ currentUser, contractor, projects, updates, onAddUpdate }) {
  const [updateList, setUpdateList] = useState(updates)

  useEffect(() => {
    let cancelled = false

    apiGet('/updates')
      .then((response) => {
        if (cancelled) return
        setUpdateList(response.updates || updates)
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [updates])

  return (
    <section className="view">
      <div className="section__header">
        <div>
          <h1>Daily Updates</h1>
          <p className="muted">Supervisors report daily progress to the main contractor.</p>
        </div>
        <div className="pill">{contractor?.name}</div>
      </div>

      {currentUser.type === 'supervisor' ? (
        <form className="panel update-form" onSubmit={onAddUpdate}>
          <label className="field">
            Project
            <select name="project" defaultValue="">
              <option value="" disabled>
                Select project
              </option>
              {projects.map((project) => (
                <option key={project.id} value={project.name}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Summary
            <textarea name="summary" rows="4" placeholder="Progress achieved today" />
          </label>
          <label className="field">
            Risks / Blockers
            <textarea name="risks" rows="3" placeholder="Any blockers or risks" />
          </label>
          <div className="modal__actions">
            <button className="primary-button" type="submit">
              Submit Update
            </button>
          </div>
        </form>
      ) : (
        <div className="panel">
          <p className="muted">Contractors can view updates from supervisors in real time.</p>
        </div>
      )}

      <div className="updates-list">
        {updateList.map((update) => (
          <article key={update.id} className="update-card reveal">
            <div className="update-card__header">
              <div>
                <p className="project-title">{update.project}</p>
                <p className="muted">
                  {update.supervisor} · {update.date}
                </p>
              </div>
              <span className="pill">{update.contractor}</span>
            </div>
            <p>{update.summary}</p>
            <p className="update-risk">{update.risks}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default UpdatesPage
