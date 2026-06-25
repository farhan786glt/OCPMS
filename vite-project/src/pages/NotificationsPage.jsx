import { useEffect, useState } from 'react'
import { apiGet } from '../api.js'

function NotificationsPage() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    let cancelled = false

    apiGet('/notifications')
      .then((response) => {
        if (cancelled) return
        setNotifications(response.notifications || [])
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  const items = notifications.length
    ? notifications
    : [
        { id: 1, title: 'Concrete pour approved for Zone B', meta: 'Today, 09:40 AM', tone: 'good' },
        { id: 2, title: 'Steel delivery delayed by 2 days', meta: 'Today, 08:15 AM', tone: 'warn' },
        { id: 3, title: 'Client walkthrough scheduled', meta: 'Yesterday, 03:10 PM', tone: 'info' },
        { id: 4, title: 'Variation order awaiting approval', meta: 'Yesterday, 11:30 AM', tone: 'warn' },
      ]

  return (
    <section className="view">
      <div className="section__header">
        <div>
          <h1>Notifications</h1>
          <p className="muted">Alerts, reminders, and daily updates.</p>
        </div>
      </div>

      <div className="notifications-list">
        {items.map((item) => (
          <div key={item.id} className={`notification-card ${item.tone || 'info'} reveal`}>
            <div>
              <p className="project-title">{item.title}</p>
              <p className="muted">{item.meta}</p>
            </div>
            <span className="nav-icon icon-bell" aria-hidden="true" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default NotificationsPage
