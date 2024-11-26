import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Button } from '@/presentation/components/ui/button'
import { UserNav } from './presentation/components/user-nav'
import { Dashboard } from './presentation/pages/dashboard'
import { Settings } from './presentation/pages/settings'

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col overflow-auto">
        {/* Navigation */}
        <div className="border-b sticky top-0 bg-background z-10">
          <div className="flex h-16 items-center px-4">
            <Link to="/" className="font-semibold">
              Attendance System
            </Link>
            <div className="ml-auto flex items-center space-x-4">
              <UserNav />
              <Link to="/settings">
                <Button variant="outline">Settings</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
