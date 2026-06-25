import { useEffect, useState } from 'react'
import { apiGet } from '../api.js'

function SupervisorsPage({ supervisors }) {
  const [items, setItems] = useState(supervisors)

  useEffect(() => {
    let cancelled = false

    apiGet('/supervisors')
      .then((response) => {
        if (cancelled) return
        setItems(response.supervisors || supervisors)
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [supervisors])

  return (
    <section className="view">
      <h1>Supervisors</h1>
      <div className="panel">
        <div className="supervisor-grid">
          {(items || []).map((supervisor) => (
            <div key={supervisor.id} className="client-card reveal">
              <p>{supervisor.role}</p>
              <strong>{supervisor.name}</strong>
              <span className="muted">{supervisor.location}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SupervisorsPage
