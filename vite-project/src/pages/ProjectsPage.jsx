import { useEffect, useState } from 'react'
import { apiGet } from '../api.js'

function ProjectsPage({ filteredProjects, onAddProject }) {
  const [projects, setProjects] = useState(filteredProjects)

  useEffect(() => {
    let cancelled = false

    apiGet('/projects')
      .then((response) => {
        if (cancelled) return
        setProjects(response.projects || filteredProjects)
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [filteredProjects])

  return (
    <section className="view">
      <div className="section__header">
        <div>
          <h1>All Projects</h1>
          <p className="muted">Portfolio overview and risk snapshots</p>
        </div>
        <button className="ghost-button" type="button" onClick={onAddProject}>
          Add Project
        </button>
      </div>
      <div className="projects-grid">
        {projects.map((project) => (
          <article key={project.id} className="project-wide reveal">
            <div className="project-wide__info">
              <div>
                <p className="project-title">{project.name}</p>
                <p className="project-status">{project.status}</p>
                <p className="muted">{project.location}</p>
              </div>
              <div className="project-wide__stats">
                <div>
                  <p>Progress</p>
                  <strong>{project.progress}%</strong>
                </div>
                <div>
                  <p>Deadline</p>
                  <strong>{project.deadline}</strong>
                </div>
                <div>
                  <p>Budget</p>
                  <strong>PKR {project.budget}</strong>
                </div>
                <div>
                  <p>Contractor</p>
                  <strong>{project.contractor}</strong>
                </div>
              </div>
            </div>
            <div className="progress">
              <span style={{ width: `${project.progress}%` }} />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ProjectsPage
