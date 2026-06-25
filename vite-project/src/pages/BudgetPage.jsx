import { useEffect, useState } from 'react'
import { apiGet } from '../api.js'

function BudgetPage({ budget }) {
  const [summary, setSummary] = useState(budget)

  useEffect(() => {
    let cancelled = false

    apiGet('/budget')
      .then((response) => {
        if (cancelled) return
        setSummary(response.budget || budget)
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [budget])

  return (
    <section className="view">
      <h1>Budget Monitor</h1>
      <div className="panel">
        <div className="budget-grid">
          <div className="budget-card reveal">
            <p>Committed</p>
            <strong>{summary?.committed || 'PKR 18.4 Cr'}</strong>
            <span className="muted">68% of total</span>
          </div>
          <div className="budget-card reveal delay-1">
            <p>Variance</p>
            <strong className="accent-good">{summary?.variance || '-4%'}</strong>
            <span className="muted">Savings locked</span>
          </div>
          <div className="budget-card reveal delay-2">
            <p>Unassigned</p>
            <strong>{summary?.unassigned || 'PKR 2.1 Cr'}</strong>
            <span className="muted">Held for change orders</span>
          </div>
        </div>
        <div className="chart">
          <div className="chart-bar" style={{ width: '68%' }} />
        </div>
        <p className="muted">Overall budget: {summary?.overall || '27 Cr'}</p>
      </div>
    </section>
  )
}

export default BudgetPage
