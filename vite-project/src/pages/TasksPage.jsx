import { useEffect, useState } from 'react'
import { apiGet } from '../api.js'

function TasksPage({ tasksByStatus }) {
  const [taskGroups, setTaskGroups] = useState(tasksByStatus)

  useEffect(() => {
    let cancelled = false

    apiGet('/tasks')
      .then((response) => {
        if (cancelled) return
        const groups = (response.tasks || []).reduce((accumulator, task) => {
          if (!accumulator[task.status]) accumulator[task.status] = []
          accumulator[task.status].push(task)
          return accumulator
        }, {})
        setTaskGroups(groups)
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [tasksByStatus])

  return (
    <section className="view">
      <h1>Task Manager</h1>
      <div className="panel">
        <div className="panel-grid">
          {['Backlog', 'In Progress', 'Review', 'Done'].map((col) => (
            <div key={col} className="panel-col reveal">
              <h3>{col}</h3>
              {(taskGroups[col] || []).map((task) => (
                <div
                  key={task.id}
                  className={`ticket ${task.priority === 'high' ? 'accent' : ''}`}
                >
                  <p>{task.title}</p>
                  <span className="ticket-meta">
                    {task.owner} · Due {task.due}
                  </span>
                </div>
              ))}
              {(taskGroups[col] || []).length === 0 && (
                <div className="ticket muted">No tasks match search</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TasksPage
