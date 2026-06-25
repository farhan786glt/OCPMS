import { useEffect, useState } from 'react'
import { apiGet } from '../api.js'

function ReportsPage() {
  const [reports, setReports] = useState([])

  useEffect(() => {
    let cancelled = false

    apiGet('/reports')
      .then((response) => {
        if (cancelled) return
        setReports(response.reports || [])
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="view">
      <h1>Site Reports</h1>
      <div className="media-grid">
        {(reports.length
          ? reports
          : [
              { id: 1, zone: 'Zone A', updated_at: '2 hrs ago' },
              { id: 2, zone: 'Zone B', updated_at: '2 hrs ago' },
              { id: 3, zone: 'Podium', updated_at: '2 hrs ago' },
              { id: 4, zone: 'Basement', updated_at: '2 hrs ago' },
            ]
        ).map((item) => (
          <div key={item.id} className="media-card reveal">
            <div className="media-frame">
              <span>{item.zone}</span>
            </div>
            <p className="muted">Updated {item.updated_at}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ReportsPage
