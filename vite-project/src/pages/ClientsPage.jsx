import { useEffect, useState } from 'react'
import { apiGet } from '../api.js'

function ClientsPage() {
  const [clients, setClients] = useState([])

  useEffect(() => {
    let cancelled = false

    apiGet('/clients')
      .then((response) => {
        if (cancelled) return
        setClients(response.clients || [])
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="view">
      <h1>Client Portal</h1>
      <div className="panel">
        <div className="client-grid">
          <div className="client-card reveal">
            <p>Transparency Score</p>
            <strong>94%</strong>
            <span className="muted">{clients.length || 0} clients connected</span>
          </div>
          <div className="client-card reveal delay-1">
            <p>Approvals Pending</p>
            <strong>3</strong>
            <span className="muted">Variation orders</span>
          </div>
          <div className="client-card reveal delay-2">
            <p>Stakeholder Notes</p>
            <strong>12</strong>
            <span className="muted">Last sync today</span>
          </div>
        </div>
        <div className="supervisor-grid">
          {(clients.length
            ? clients
            : [
                { id: 1, name: 'Nadia Shah', company: 'Gilgit Development Authority', role: 'Client Representative' },
                { id: 2, name: 'Stakeholder Group', company: 'Investor Panel', role: 'Stakeholder' },
              ]
          ).map((client) => (
            <div key={client.id} className="client-card reveal">
              <p>{client.role}</p>
              <strong>{client.name}</strong>
              <span className="muted">{client.company || client.email}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ClientsPage
