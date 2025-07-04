import { StrictMode } from 'react'
import './index.css'
import './App.css'

import { createRoot } from 'react-dom/client'

import App from './App.jsx'
// import { UserContextProvider } from './context/UserContext.jsx'
import { CourseContextProvider } from './context/CourseContext.jsx'
import { UserContextProvider } from './context/UserContext.jsx'

export const server = 'https://new-tm-lms-backend.vercel.app'

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <UserContextProvider >
      <CourseContextProvider>
        <App />
      </CourseContextProvider>
    </UserContextProvider>

  </StrictMode>,
)
