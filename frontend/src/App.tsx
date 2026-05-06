import { useState, useEffect } from 'react'
import { Shield, Users, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, Loader } from 'lucide-react'
import { Sidebar } from './components/shared/Sidebar'
import { Header } from './components/shared/Header'
import Notification from './components/shared/Notification'
import { AdminAnalyticsDashboard } from './components/admin/AdminAnalyticsDashboard'
import { AdminRegistrationPage } from './components/admin/AdminRegistrationPage'
import { AdminManageRecordsPage } from './components/admin/AdminManageRecordsPage'
import { WorkerAnalyticsDashboard } from './components/worker/WorkerAnalyticsDashboard'
import { WorkerRegistrationPage } from './components/worker/WorkerRegistrationPage'
import { WorkerViewRecordsPage } from './components/worker/WorkerViewRecordsPage'
import { SuperAdminRegister } from './components/auth/SuperAdminRegister'
import { loginUser, logoutUser, watchAuthState } from './services/authService'
import type { AuthUser } from './services/authService'

type Page = 'analytics' | 'registration' | 'records' | 'view-records'
type UserRole = 'administrator' | 'worker' | 'super-admin'
type SidebarUserRole = 'administrator' | 'worker'
type AuthScreen = 'role-selection' | 'login' | 'super-admin-register'

interface Credentials {
  email: string
  password: string
}

function App() {
  const [activePage, setActivePage] = useState<Page>('analytics')
  const [collapsed, setCollapsed] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authScreen, setAuthScreen] = useState<AuthScreen>('role-selection')
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [credentials, setCredentials] = useState<Credentials>({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const sidebarWidth = collapsed ? 'ml-20' : 'ml-64'
  const isAdmin = selectedRole === 'administrator'

  // Check Firebase auth state on mount
  useEffect(() => {
    try {
      const unsubscribe = watchAuthState((user) => {
        try {
          if (user && user.userRole) {
            // User is logged in
            setCurrentUser(user)
            setIsAuthenticated(true)
            setSelectedRole(user.userRole.role === 'super-admin' ? 'administrator' : (user.userRole.role as UserRole))
            setActivePage('analytics')
          } else {
            // User is logged out
            setCurrentUser(null)
            setIsAuthenticated(false)
            setAuthScreen('role-selection')
            setSelectedRole(null)
          }
        } catch (err) {
          console.error('Error in auth state callback:', err)
        }
        setIsCheckingAuth(false)
      })

      return () => {
        try {
          unsubscribe()
        } catch (err) {
          console.error('Error unsubscribing:', err)
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      setIsCheckingAuth(false)
    }
  }, [])

  const handleRoleSelect = (role: UserRole) => {
    if (role === 'super-admin') {
      setAuthScreen('super-admin-register')
    } else {
      setSelectedRole(role)
      setAuthScreen('login')
      setCredentials({ email: '', password: '' })
      setShowPassword(false)
      setError('')
    }
  }

  const handleBackToRoleSelection = () => {
    setAuthScreen('role-selection')
    setSelectedRole(null)
    setCredentials({ email: '', password: '' })
    setShowPassword(false)
    setError('')
  }

  const getFriendlyAuthErrorMessage = (err: any) => {
    const raw = String(err?.message || '').toLowerCase()

    if (raw.includes('auth/invalid-credential') || raw.includes('invalid email or password')) {
      return 'Invalid email or password. Please check your credentials and try again.'
    }
    if (raw.includes('auth/invalid-email')) {
      return 'Invalid email format. Please enter a valid email address.'
    }
    if (raw.includes('auth/user-not-found')) {
      return 'No account found for this email.'
    }
    if (raw.includes('auth/wrong-password')) {
      return 'Incorrect password. Please try again.'
    }
    if (raw.includes('auth/too-many-requests')) {
      return 'Too many failed attempts. Please wait a moment before trying again.'
    }
    if (raw.includes('auth/network-request-failed')) {
      return 'Network error. Please check your internet connection and try again.'
    }
    if (raw.includes('not an administrator account')) {
      return 'Role mismatch: this account is not registered as Administrator.'
    }
    if (raw.includes('not a social welfare worker account')) {
      return 'Role mismatch: this account is not registered as Social Welfare Worker.'
    }
    if (raw.includes('user role not found')) {
      return 'Account role is missing. Please contact the system administrator.'
    }
    if (raw.includes('auth/api-key-not-valid')) {
      return 'Firebase configuration error (invalid API key). Please contact support.'
    }

    return err?.message || 'Login failed. Please try again.'
  }

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedRole) return

    setIsLoading(true)
    setError('')

    try {
      const user = await loginUser(credentials.email, credentials.password)

      if (!user.userRole) {
        throw new Error('User role not found. Please contact administrator.')
      }

      const actualRole = user.userRole.role
      const expectedRole = selectedRole === 'administrator' ? 'administrator' : 'worker'

      if (actualRole !== expectedRole) {
        const mismatchMessage =
          selectedRole === 'administrator'
            ? 'This account is not an Administrator account. Please use the Social Welfare Worker login form.'
            : 'This account is not a Social Welfare Worker account. Please use the Administrator login form.'
        await logoutUser()
        window.alert(mismatchMessage)
        throw new Error(mismatchMessage)
      }

      setSelectedRole(actualRole as UserRole)
      setCurrentUser(user)
      setIsAuthenticated(true)
      setActivePage('analytics')
    } catch (err: any) {
      const errorMessage = getFriendlyAuthErrorMessage(err)
      console.error('Login error:', err)
      setError(errorMessage)
      setNotification({ message: errorMessage, type: 'error' })
      setCredentials({ email: '', password: '' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
      setCurrentUser(null)
      setIsAuthenticated(false)
      setAuthScreen('role-selection')
      setSelectedRole(null)
      setCredentials({ email: '', password: '' })
      setShowPassword(false)
      setCollapsed(false)
      setActivePage('analytics')
      setError('')
    } catch (err: any) {
      const msg = err.message || 'Logout failed. Please try again.'
      setError(msg)
      setNotification({ message: msg, type: 'error' })
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-xl font-semibold text-slate-700">Loading authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    if (authScreen === 'super-admin-register') {
      return (
        <SuperAdminRegister
          onSuccess={handleBackToRoleSelection}
          onCancel={handleBackToRoleSelection}
        />
      )
    }

    if (authScreen === 'role-selection') {
      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl border border-slate-200">
            <div className="bg-gradient-to-r from-blue-800 to-blue-600 px-8 py-10 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white">
                <Shield className="h-10 w-10 text-blue-700" />
              </div>
              <h1 className="text-4xl font-bold text-white">LGU Dasmariñas</h1>
              <p className="mt-2 text-lg text-blue-100">PWD Assistance &amp; Profiling System</p>
            </div>

            <div className="px-7 py-8">
              <h2 className="text-center text-3xl font-bold text-slate-900">Secure Login Portal</h2>
              <p className="mt-2 text-center text-xl text-slate-500">Select your role to continue</p>

              <div className="mt-8 space-y-4">
                <button
                  onClick={() => handleRoleSelect('administrator')}
                  className="w-full rounded-xl border border-blue-200 bg-blue-50 p-4 text-left transition hover:border-blue-400 hover:shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-700 text-white">
                      <Shield className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-semibold text-slate-900">Administrator</h3>
                      <p className="text-xl text-slate-600">Full system access &amp; management</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect('worker')}
                  className="w-full rounded-xl border border-sky-200 bg-sky-50 p-4 text-left transition hover:border-sky-400 hover:shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sky-500 text-white">
                      <Users className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-semibold text-slate-900">Social Welfare Worker</h3>
                      <p className="text-xl text-slate-600">Registration &amp; view records</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect('super-admin')}
                  className="w-full rounded-xl border border-purple-200 bg-purple-50 p-4 text-left transition hover:border-purple-400 hover:shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-700 text-white">
                      <Shield className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-semibold text-slate-900">Super Admin</h3>
                      <p className="text-xl text-slate-600">Create user accounts</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="mt-8 border-t border-slate-200 pt-5 text-center text-lg text-slate-600">
                <span className="font-semibold text-blue-700">Firebase Auth</span>
                <span className="mx-2">•</span>
                <span>Secure Access Only</span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl border border-slate-200">
          <div className={`px-8 py-6 text-white ${isAdmin ? 'bg-indigo-700' : 'bg-sky-500'}`}>
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-3 ${isAdmin ? 'bg-indigo-600' : 'bg-sky-400'}`}>
                {isAdmin ? <Shield className="h-7 w-7" /> : <Users className="h-7 w-7" />}
              </div>
              <div>
                <h2 className="text-3xl font-bold">
                  {isAdmin ? 'Administrator Login' : 'Social Welfare Worker Login'}
                </h2>
                <p className="text-lg text-blue-100">Enter your credentials to continue</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="px-7 py-8">
            {error && (
              <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3">
                <p className="text-sm font-semibold text-red-800">{error}</p>
              </div>
            )}

            <label className="mb-2 block text-xl font-semibold text-slate-800">Email Address</label>
            <div className="mb-5 flex items-center rounded-xl border-2 border-blue-700 bg-white px-3">
              <Mail className="h-5 w-5 text-slate-400" />
              <input
                type="email"
                required
                value={credentials.email}
                onChange={(event) => setCredentials((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="your.email@dasmarinas.gov.ph"
                className="w-full bg-transparent px-3 py-3 text-lg outline-none"
              />
            </div>

            <label className="mb-2 block text-xl font-semibold text-slate-800">Password</label>
            <div className="flex items-center rounded-xl border border-slate-300 bg-white px-3">
              <Lock className="h-5 w-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={credentials.password}
                onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="Enter your password"
                className="w-full bg-transparent px-3 py-3 text-lg outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="mb-6 mt-2 text-right">
              <button type="button" className="text-lg font-semibold text-blue-600 hover:text-blue-700">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full rounded-xl py-3 text-2xl font-bold text-white transition disabled:opacity-70 disabled:cursor-not-allowed ${isAdmin ? 'bg-indigo-700 hover:bg-indigo-800' : 'bg-sky-500 hover:bg-sky-600'
                }`}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={handleBackToRoleSelection}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 py-3 text-2xl font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Role Selection
            </button>

            <div className="mt-6 border-t border-slate-200 pt-5 text-center text-lg text-slate-600">
              <span className="font-semibold text-blue-700">Firebase Auth</span>
              <span className="mx-2">•</span>
              <span>Secure Authentication</span>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="flex min-h-screen">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          activePage={activePage}
          setActivePage={setActivePage}
          userName={currentUser?.userRole?.displayName || (isAdmin ? 'Administrator' : 'Social Worker')}
          userRole={(selectedRole === 'administrator' ? 'administrator' : 'worker') as SidebarUserRole}
          onLogout={handleLogout}
        />

        <div
          className={`flex min-w-0 flex-1 flex-col transition-all duration-300 ${sidebarWidth}`}
        >
          <Header />
          <main className="flex-1 p-6">
            {isAdmin ? (
              // Administrator Pages
              activePage === 'analytics' ? (
                <AdminAnalyticsDashboard />
              ) : activePage === 'registration' ? (
                <AdminRegistrationPage />
              ) : (
                <AdminManageRecordsPage />
              )
            ) : (
              // Social Worker Pages
              activePage === 'analytics' ? (
                <WorkerAnalyticsDashboard setActivePage={setActivePage} />
              ) : activePage === 'registration' ? (
                <WorkerRegistrationPage />
              ) : activePage === 'view-records' ? (
                <WorkerViewRecordsPage />
              ) : (
                <section className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-sky-100">
                    <CheckCircle2 className="h-7 w-7 text-sky-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800">Welcome, Social Welfare Worker</h2>
                  <p className="mt-2 text-xl">Select "New Registration" to register a new citizen or "View Records" to search existing records.</p>
                </section>
              )
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
