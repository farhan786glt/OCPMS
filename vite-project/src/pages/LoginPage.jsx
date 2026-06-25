function LoginPage({
  authMode,
  loginEmail,
  loginPin,
  loginError,
  authMessage,
  roleOptions,
  onEmailChange,
  onPinChange,
  onLogin,
  signupName,
  signupIdentifier,
  signupEmail,
  signupDeliveryMethod,
  signupPassword,
  signupConfirmPassword,
  otpCode,
  onSignupNameChange,
  onSignupIdentifierChange,
  onSignupEmailChange,
  onSignupDeliveryMethodChange,
  onSignupPasswordChange,
  onSignupConfirmPasswordChange,
  onOtpCodeChange,
  onCreateAccount,
  onVerifyOtp,
  onResendOtp,
  onModeChange,
  onSelectRole,
}) {
  const normalizedEmail = loginEmail.trim().toLowerCase()
  const selectedRole = roleOptions.find((option) => option.email.toLowerCase() === normalizedEmail)
  const deliveryLabel =
    signupDeliveryMethod === 'sms'
      ? 'SMS'
      : signupDeliveryMethod === 'whatsapp'
        ? 'WhatsApp'
        : 'email'

  return (
    <div className="login">
      <div className="login-card">
        <div className="login__header">
          <div className="brand-mark brand-mark--lg">OC</div>
          <div>
            <p className="eyebrow">OCPMS | Gilgit Projects</p>
            <h1>{authMode === 'register' ? 'Create Account' : authMode === 'verify' ? 'Verify OTP' : 'User Login'}</h1>
            <p className="muted">
              {authMode === 'register'
                ? `Create an account with email or mobile number. OTP will be sent via ${deliveryLabel}.`
                : authMode === 'verify'
                  ? 'Enter the OTP sent to your chosen delivery channel to activate your account.'
                  : 'Select a role for quick access or sign in with your account.'}
            </p>
          </div>
        </div>

        <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            className={`auth-tab ${authMode === 'login' ? 'is-active' : ''}`}
            onClick={() => onModeChange('login')}
            aria-pressed={authMode === 'login'}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-tab ${authMode === 'register' ? 'is-active' : ''}`}
            onClick={() => onModeChange('register')}
            aria-pressed={authMode === 'register'}
          >
            Create Account
          </button>
          <button
            type="button"
            className={`auth-tab ${authMode === 'verify' ? 'is-active' : ''}`}
            onClick={() => onModeChange('verify')}
            aria-pressed={authMode === 'verify'}
          >
            Verify OTP
          </button>
        </div>

        {authMode === 'login' && (
          <>
            <div className="login-options">
              {roleOptions.map((option) => (
                <button
                  key={option.label}
                  className={`login-option ${selectedRole?.label === option.label ? 'is-active' : ''}`}
                  type="button"
                  onClick={() => onSelectRole(option)}
                  aria-pressed={selectedRole?.label === option.label}
                >
                  <span>{option.label}</span>
                  <small>{option.helper}</small>
                </button>
              ))}
            </div>

            <form className="login-form" onSubmit={onLogin}>
              <label className="field">
                Email or mobile number
                <input
                  type="text"
                  value={loginEmail}
                  onChange={onEmailChange}
                  placeholder="faizan@gmail.com or 03xxxxxxxxx"
                  required
                />
              </label>
              <label className="field">
                Password
                <input
                  type="password"
                  value={loginPin}
                  onChange={onPinChange}
                  placeholder="Your password"
                  required
                />
              </label>
              {selectedRole && (
                <p className="login-meta">
                  Selected role: <strong>{selectedRole.label}</strong>
                </p>
              )}
              {loginError && <p className="login-error">{loginError}</p>}
              {authMessage && <p className="login-success">{authMessage}</p>}
              <button className="primary-button" type="submit">
                Sign in to dashboard
              </button>
            </form>
          </>
        )}

        {authMode === 'register' && (
          <form className="login-form" onSubmit={onCreateAccount}>
            <label className="field">
              Full name
              <input
                type="text"
                value={signupName}
                onChange={onSignupNameChange}
                placeholder="Your full name"
                required
              />
            </label>
            <label className="field">
              Email or mobile number
              <input
                type="text"
                value={signupIdentifier}
                onChange={onSignupIdentifierChange}
                placeholder="name@example.com or 03xxxxxxxxx"
                required
              />
            </label>
            <label className="field">
              OTP delivery method
              <select value={signupDeliveryMethod} onChange={onSignupDeliveryMethodChange}>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </label>
            {signupDeliveryMethod === 'email' && (
              <label className="field">
                Email for OTP
                <input
                  type="email"
                  value={signupEmail}
                  onChange={onSignupEmailChange}
                  placeholder="name@example.com"
                  required
                />
              </label>
            )}
            {signupDeliveryMethod !== 'email' && (
              <p className="login-meta">
                OTP will be sent to the mobile number through {signupDeliveryMethod === 'sms' ? 'SMS' : 'WhatsApp'}.
              </p>
            )}
            <label className="field">
              Password
              <input
                type="password"
                value={signupPassword}
                onChange={onSignupPasswordChange}
                placeholder="Create a password"
                required
              />
            </label>
            <label className="field">
              Confirm password
              <input
                type="password"
                value={signupConfirmPassword}
                onChange={onSignupConfirmPasswordChange}
                placeholder="Repeat password"
                required
              />
            </label>
            {loginError && <p className="login-error">{loginError}</p>}
            {authMessage && <p className="login-success">{authMessage}</p>}
            <button className="primary-button" type="submit">
              Create account
            </button>
          </form>
        )}

        {authMode === 'verify' && (
          <form className="login-form" onSubmit={onVerifyOtp}>
            <label className="field">
              OTP code
              <input
                type="text"
                inputMode="numeric"
                value={otpCode}
                onChange={onOtpCodeChange}
                placeholder="123456"
                required
              />
            </label>
            {loginError && <p className="login-error">{loginError}</p>}
            {authMessage && <p className="login-success">{authMessage}</p>}
            <div className="auth-actions">
              <button className="ghost-button" type="button" onClick={onResendOtp}>
                Resend OTP
              </button>
              <button className="primary-button" type="submit">
                Verify and continue
              </button>
            </div>
          </form>
        )}

        <div className="login-hint">
          <p>Demo accounts:</p>
          <ul>
            <li>engineer@gmail.com / 4567</li>
            <li>farhan@gmail.com / 2468</li>
            <li>amjad@gmail.com / 3456</li>
            <li>faizan@gmail.com / 12345</li>
            <li>client@gmail.com / 8888</li>
            <li>stakeholder@gmail.com / 7777</li>
            <li>contractor@gmail.com / 9999</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
