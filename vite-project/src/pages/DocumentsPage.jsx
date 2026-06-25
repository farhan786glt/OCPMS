import { useEffect, useState } from 'react'
import { apiGet } from '../api.js'

function DocumentsPage() {
  const [documents, setDocuments] = useState([])

  useEffect(() => {
    let cancelled = false

    apiGet('/documents')
      .then((response) => {
        if (cancelled) return
        setDocuments(response.documents || [])
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="view">
      <h1>Document Vault</h1>
      <div className="panel">
        <div className="doc-list">
          {(documents.length
            ? documents
            : [
                { id: 1, title: 'Daily Reports', updated_at: 'Updated today' },
                { id: 2, title: 'Contract Variations', updated_at: 'Updated today' },
                { id: 3, title: 'Safety Audits', updated_at: 'Updated today' },
                { id: 4, title: 'Vendor Invoices', updated_at: 'Updated today' },
              ]
          ).map((item) => (
            <div key={item.id} className="doc-row reveal">
              <span className="icon-folder" aria-hidden="true" />
              <div>
                <p>{item.title}</p>
                <span className="muted">{item.updated_at}</span>
              </div>
              <button className="ghost-button" type="button">
                Open
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DocumentsPage
