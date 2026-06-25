import { useState } from 'react'
import './App.css'
import { apiPost } from './api.js'
import LoginPage from './pages/LoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import TasksPage from './pages/TasksPage.jsx'
import BudgetPage from './pages/BudgetPage.jsx'
import UpdatesPage from './pages/UpdatesPage.jsx'
import DocumentsPage from './pages/DocumentsPage.jsx'
import ReportsPage from './pages/ReportsPage.jsx'
import ClientsPage from './pages/ClientsPage.jsx'
import SupervisorsPage from './pages/SupervisorsPage.jsx'
import ProposalPage from './pages/ProposalPage.jsx'
import ProjectTrackerPage from './pages/ProjectTrackerPage.jsx'
import NotificationsPage from './pages/NotificationsPage.jsx'

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [showNewModal, setShowNewModal] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [authMode, setAuthMode] = useState('login')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPin, setLoginPin] = useState('')
  const [signupName, setSignupName] = useState('')
  const [signupIdentifier, setSignupIdentifier] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupDeliveryMethod, setSignupDeliveryMethod] = useState('email')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [loginError, setLoginError] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const [projectName, setProjectName] = useState('')
  const [projectDesc, setProjectDesc] = useState('')
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Gilgit Riverside Promenade',
      progress: 68,
      status: 'On Track',
      budget: '2.7 Cr',
      location: 'Gilgit, PK',
      deadline: 'Dec 15, 2026',
      contractor: 'Gilgit Contractors',
    },
    {
      id: 2,
      name: 'New academic block KIU',
      progress: 100,
      status: 'Completed',
      budget: '4 Cr',
      location: 'KIU, Gilgit, PK',
      deadline: 'Mar 08, 2022',
      contractor: 'A&SCC',
    },
    {
      id: 3,
      name: "Ansar Madni House",
      progress: 100,
      status: 'completed',
      budget: '2 Cr',
      location: 'Nomal, Gilgit, PK',
      deadline: 'Dec 15, 2022',
      contractor: 'A&SCC',
    },
    {
      id: 4,
      name: "Link road to Amjad Advocate's House",
      progress: 55,
      status: 'In Progress',
      budget: '5.3 Cr',
      location: 'Amphary, Gilgit, PK',
      deadline: 'April 10, 2027',
      contractor: 'A&SCC',
    },
    // {
    //   id: 5,
    //   name: 'Gilgit Civic Hospital Upgrade',
    //   progress: 22,
    //   status: 'Mobilization',
    //   budget: '14 Cr',
    //   location: 'Gilgit, PK',
    //   deadline: 'Apr 10, 2027',
    //   contractor: 'Gilgit Contractors',
    // },
  ])

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
    { id: 'projects', label: 'Projects', icon: 'tower' },
    { id: 'tracker', label: 'Project Tracker', icon: 'timeline' },
    { id: 'tasks', label: 'Tasks', icon: 'check' },
    { id: 'budget', label: 'Budget Monitor', icon: 'wallet' },
    { id: 'updates', label: 'Daily Updates', icon: 'note' },
    { id: 'documents', label: 'Document Vault', icon: 'folder' },
    { id: 'reports', label: 'Site Reports', icon: 'camera' },
    { id: 'clients', label: 'Client Portal', icon: 'users' },
    { id: 'notifications', label: 'Notifications', icon: 'bell' },
    { id: 'supervisors', label: 'Supervisors', icon: 'users' },
    { id: 'proposal', label: 'Proposal', icon: 'note' },
  ]

  const kpi = {
    activeProjects: projects.length,
    tasksDue: 28,
    budgetVariance: '-4%',
    sitePhotos: 184,
  }

  const tasks = [
    {
      id: 1,
      title: 'MEP inspection and compliance',
      owner: 'Eng. Qasim',
      due: 'May 22',
      priority: 'high',
      status: 'Backlog',
    },
    {
      id: 2,
      title: 'Concrete pour approval',
      owner: 'Sana Malik',
      due: 'May 18',
      priority: 'medium',
      status: 'In Progress',
    },
    {
      id: 3,
      title: 'Facade mockup sign-off',
      owner: 'Faizan Rahim',
      due: 'May 16',
      priority: 'high',
      status: 'Review',
    },
    {
      id: 4,
      title: 'Steel delivery schedule update',
      owner: 'Procurement',
      due: 'May 19',
      priority: 'low',
      status: 'Backlog',
    },
    {
      id: 5,
      title: 'Basement waterproofing QA',
      owner: 'QA Team',
      due: 'May 27',
      priority: 'medium',
      status: 'In Progress',
    },
    {
      id: 6,
      title: 'Client walkthrough prep',
      owner: 'PMO',
      due: 'May 25',
      priority: 'medium',
      status: 'Done',
    },
  ]

  const users = [
    {
      id: 1,
      name: 'Faizan Rahim',
      email: 'faizan@gmail.com',
      pin: '12345',
      role: 'Site Supervisor',
      type: 'supervisor',
      location: 'Gilgit, PK',
    },
    {
      id: 2,
      name: 'Farhan Ali',
      email: 'farhan@gmail.com',
      pin: '2345',
      role: 'Field Supervisor',
      type: 'supervisor',
      location: 'Gilgit, PK',
    },
    {
      id: 3,
      name: 'Eng. Qasim',
      email: 'qasim@gmail.com',
      pin: '3456',
      role: 'QA Supervisor',
      type: 'supervisor',
      location: 'Gilgit, PK',
    },
    {
      id: 4,
      name: 'Gilgit Contractors',
      email: 'contractor@gmail.com',
      pin: '9999',
      role: 'Main Contractor',
      type: 'contractor',
      location: 'Gilgit, PK',
    },
    {
      id: 5,
      name: 'Adeel Hussain',
      email: 'engineer@gmail.com',
      pin: '4567',
      role: 'Project Engineer',
      type: 'engineer',
      location: 'Gilgit, PK',
    },
    {
      id: 6,
      name: 'Nadia Shah',
      email: 'client@gmail.com',
      pin: '8888',
      role: 'Client Representative',
      type: 'client',
      location: 'Islamabad, PK',
    },
    {
      id: 7,
      name: 'Stakeholder Group',
      email: 'stakeholder@gmail.com',
      pin: '7777',
      role: 'Stakeholder',
      type: 'stakeholder',
      location: 'Karachi, PK',
    },
  ]

  const roleOptions = [
    {
      label: 'Engineer',
      helper: 'Project Engineer access',
      email: 'engineer@gmail.com',
      pin: '4567',
    },
    {
      label: 'Supervisor',
      helper: 'Site supervision access',
      email: 'faizan@gmail.com',
      pin: '1234',
    },
    {
      label: 'Client Portal',
      helper: 'Client status access',
      email: 'client@gmail.com',
      pin: '8888',
    },
    {
      label: 'Stakeholders',
      helper: 'Investor updates',
      email: 'stakeholder@gmail.com',
      pin: '7777',
    },
  ]

  const resetAuthFeedback = () => {
    setLoginError('')
    setAuthMessage('')
  }

  const [updates, setUpdates] = useState([
    {
      id: 1,
      project: 'Gilgit Riverside Promenade',
      supervisor: 'Faizan Rahim',
      date: 'May 14, 2026',
      summary: 'Retaining wall reinforcement completed for Zone B; drainage testing started.',
      risks: 'Pending aggregate delivery could delay footpath pour by 1 day.',
      contractor: 'Gilgit Contractors',
    },
    {
      id: 2,
      project: 'Gilgit Civic Hospital Upgrade',
      supervisor: 'Sana Malik',
      date: 'May 14, 2026',
      summary: 'MEP routing approved for Level 2; duct installation in progress.',
      risks: 'Awaiting client sign-off for fire panel relocation.',
      contractor: 'Gilgit Contractors',
    },
  ])

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const filteredProjects = projects.filter((project) => {
    if (!normalizedSearch) return true
    return [
      project.name,
      project.status,
      project.location,
      project.budget,
      project.deadline,
      project.description,
      project.contractor,
    ]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(normalizedSearch))
  })

  const filteredTasks = tasks.filter((task) => {
    if (!normalizedSearch) return true
    return [task.title, task.owner, task.status, task.priority, task.due]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(normalizedSearch))
  })

  const tasksByStatus = filteredTasks.reduce((groups, task) => {
    const key = task.status
    if (!groups[key]) groups[key] = []
    groups[key].push(task)
    return groups
  }, {})

  const supervisors = users.filter((user) => user.type === 'supervisor')
  const contractor = users.find((user) => user.type === 'contractor')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const response = await apiPost('/auth/login', {
        identifier: loginEmail,
        password: loginPin,
      })
      setCurrentUser(response.user)
      setLoginEmail('')
      setLoginPin('')
      setLoginError('')
      setAuthMessage('')
    } catch (error) {
      setLoginError(error.message || 'Invalid email/mobile or password. Try a demo account.')
      return
    }
  }

  const handleCreateAccount = async (event) => {
    event.preventDefault()
    try {
      const response = await apiPost('/auth/register', {
        name: signupName,
        identifier: signupIdentifier,
        email: signupEmail,
        deliveryMethod: signupDeliveryMethod,
        password: signupPassword,
        confirmPassword: signupConfirmPassword,
      })
      setAuthMode('verify')
      setOtpCode(response.dev_otp || '')
      setLoginError('')
      setAuthMessage(
        response.warning ||
          response.message ||
          'Check your OTP delivery channel.'
      )
      if (response.dev_otp) {
        setAuthMessage(
          `${response.warning || 'SMTP/Twilio is not configured for this environment.'} Dev OTP: ${response.dev_otp}`
        )
      }
    } catch (error) {
      setLoginError(error.message || 'Could not create account.')
    }
  }

  const handleVerifyOtp = async (event) => {
    event.preventDefault()
    try {
      const response = await apiPost('/auth/verify-otp', {
        identifier: signupIdentifier || loginEmail,
        otp: otpCode,
      })
      setCurrentUser(response.user)
      setAuthMessage(response.message || 'Account verified successfully.')
      setLoginError('')
      setOtpCode('')
      setSignupPassword('')
      setSignupConfirmPassword('')
    } catch (error) {
      setLoginError(error.message || 'Invalid or expired OTP.')
    }
  }

  const handleResendOtp = async () => {
    try {
      const response = await apiPost('/auth/resend-otp', {
        identifier: signupIdentifier || loginEmail,
        deliveryMethod: signupDeliveryMethod,
      })
      setOtpCode(response.dev_otp || '')
      setLoginError('')
      setAuthMessage(
        response.dev_otp
          ? `${response.warning || 'OTP re-sent in demo mode.'} Dev OTP: ${response.dev_otp}`
          : response.message || 'A new OTP has been sent.'
      )
    } catch (error) {
      setLoginError(error.message || 'Could not resend OTP.')
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setSearchTerm('')
    setActiveView('dashboard')
  }

  const handleCreateProject = async () => {
    const name = projectName.trim() || 'New Mixed-Use Complex'
    const response = await apiPost('/projects', {
      name,
      progress: 18,
      status: 'Kickoff',
      budget: '19 Cr',
      location: 'Lahore, PK',
      deadline: 'Jun 20, 2027',
      contractor: 'Local Contractor',
      description: projectDesc.trim() || 'Scope alignment and mobilization in progress.',
    })
    setProjects((prev) => [response.project, ...prev])
    setShowNewModal(false)
    setProjectName('')
    setProjectDesc('')
    setActiveView('projects')
  }

  const handleAddUpdate = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const project = form.project.value
    const summary = form.summary.value.trim()
    const risks = form.risks.value.trim() || 'No blockers reported.'
    if (!project || !summary) return
    const response = await apiPost('/updates', {
      project,
      supervisor: currentUser?.name || 'Supervisor',
      summary,
      risks,
      contractor: contractor?.name || 'Main Contractor',
    })
    setUpdates((prev) => [response.update, ...prev])
    form.reset()
  }

  if (!currentUser) {
    return (
      <LoginPage
        authMode={authMode}
        loginEmail={loginEmail}
        loginPin={loginPin}
        loginError={loginError}
        authMessage={authMessage}
        roleOptions={roleOptions}
        onEmailChange={(event) => setLoginEmail(event.target.value)}
        onPinChange={(event) => setLoginPin(event.target.value)}
        onLogin={handleLogin}
        signupName={signupName}
        signupIdentifier={signupIdentifier}
        signupEmail={signupEmail}
        signupDeliveryMethod={signupDeliveryMethod}
        signupPassword={signupPassword}
        signupConfirmPassword={signupConfirmPassword}
        otpCode={otpCode}
        onSignupNameChange={(event) => setSignupName(event.target.value)}
        onSignupIdentifierChange={(event) => setSignupIdentifier(event.target.value)}
        onSignupEmailChange={(event) => setSignupEmail(event.target.value)}
        onSignupDeliveryMethodChange={(event) => {
          const nextMethod = event.target.value
          setSignupDeliveryMethod(nextMethod)
          if (nextMethod !== 'email') {
            setSignupEmail('')
          }
        }}
        onSignupPasswordChange={(event) => setSignupPassword(event.target.value)}
        onSignupConfirmPasswordChange={(event) => setSignupConfirmPassword(event.target.value)}
        onOtpCodeChange={(event) => setOtpCode(event.target.value)}
        onCreateAccount={handleCreateAccount}
        onVerifyOtp={handleVerifyOtp}
        onResendOtp={handleResendOtp}
        onModeChange={(mode) => {
          setAuthMode(mode)
          resetAuthFeedback()
        }}
        onSelectRole={(option) => {
          setLoginEmail(option.email)
          setLoginPin(option.pin)
          resetAuthFeedback()
          setAuthMode('login')
        }}
      />
    )
  }

  return (
    <div className={`ocpms ${isSidebarOpen ? '' : 'sidebar-collapsed'}`}>
      <aside className="sidebar">
        <div className="sidebar__brand">
          <div className="brand-mark">OC</div>
          <div>
            <p className="brand-title">OCPMS</p>
            <p className="brand-subtitle">Construction Intelligence</p>
          </div>
          <button
            className="icon-button sidebar-toggle"
            type="button"
            aria-label="Collapse sidebar"
            onClick={() => setIsSidebarOpen(false)}
          >
            <span className="icon-close" aria-hidden="true" />
          </button>
        </div>

        <div className="sidebar__user">
          <div className="avatar">
            {currentUser.name
              .split(' ')
              .map((part) => part[0])
              .join('')
              .slice(0, 2)}
          </div>
          <div>
            <p className="user-name">{currentUser.name}</p>
            <p className="user-role">{currentUser.role}</p>
          </div>
        </div>

        <nav className="sidebar__nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
            >
              <span className={`nav-icon icon-${item.icon}`} aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="current-project">
            <div>
              <p className="label">Current Project</p>
              <p className="value">Gilgit Riverside Promenade</p>
            </div>
            <span className="pill">Phase 3</span>
          </div>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="topbar__left">
            <button
              className="icon-button sidebar-toggle"
              type="button"
              aria-label="Toggle sidebar"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
            >
              <span className="icon-menu" aria-hidden="true" />
            </button>
            <div className="search">
              <span className="search__icon" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search projects, tasks, vendors"
                aria-label="Search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="project-chip">
              <span className="chip-label">Active Program</span>
              <strong>Gilgit Riverside Promenade</strong>
            </div>
          </div>

          <div className="topbar__right">
            <button className="icon-button" type="button" aria-label="Notifications">
              <span className="icon-bell" aria-hidden="true" />
              <span className="badge">7</span>
            </button>
            <button className="icon-button" type="button" aria-label="Messages">
              <span className="icon-mail" aria-hidden="true" />
            </button>
            <button
              className="primary-button"
              type="button"
              onClick={() => setShowNewModal(true)}
            >
              <span className="icon-plus" aria-hidden="true" />
              New Project
            </button>
            <div className="user-chip">
              <div>
                <p className="user-chip__name">{currentUser.name}</p>
                <p className="user-chip__role">{currentUser.role}</p>
              </div>
              <div className="avatar small">
                {currentUser.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)}
              </div>
            </div>
            <button className="ghost-button" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className="content">
          {activeView === 'dashboard' && (
            <DashboardPage
              kpi={kpi}
              filteredProjects={filteredProjects}
              onViewAllProjects={() => setActiveView('projects')}
            />
          )}
          {activeView === 'projects' && (
            <ProjectsPage
              filteredProjects={filteredProjects}
              onAddProject={() => setShowNewModal(true)}
            />
          )}
          {activeView === 'tracker' && <ProjectTrackerPage />}
          {activeView === 'tasks' && <TasksPage tasksByStatus={tasksByStatus} />}
          {activeView === 'budget' && <BudgetPage />}
          {activeView === 'updates' && (
            <UpdatesPage
              currentUser={currentUser}
              contractor={contractor}
              projects={projects}
              updates={updates}
              onAddUpdate={handleAddUpdate}
            />
          )}
          {activeView === 'documents' && <DocumentsPage />}
          {activeView === 'reports' && <ReportsPage />}
          {activeView === 'clients' && <ClientsPage />}
          {activeView === 'notifications' && <NotificationsPage />}
          {activeView === 'supervisors' && <SupervisorsPage supervisors={supervisors} />}
          {activeView === 'proposal' && <ProposalPage />}
        </main>
      </div>

      {showNewModal && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal__card">
            <div className="modal__header">
              <h2>Create New Project</h2>
              <button className="icon-button" type="button" onClick={() => setShowNewModal(false)}>
                <span className="icon-close" aria-hidden="true" />
              </button>
            </div>
            <label className="field">
              Project Name
              <input
                type="text"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                placeholder="Eighteen Mall Expansion"
              />
            </label>
            <label className="field">
              Project Description
              <textarea
                rows="4"
                value={projectDesc}
                onChange={(event) => setProjectDesc(event.target.value)}
                placeholder="Scope, goals, or primary constraints"
              />
            </label>
            <div className="modal__actions">
              <button className="ghost-button" type="button" onClick={() => setShowNewModal(false)}>
                Cancel
              </button>
              <button className="primary-button" type="button" onClick={handleCreateProject}>
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
