import React, {useEffect, useState} from 'react'
import { RouterProvider as __RouterProvider, createBrowserRouter } from 'react-router-dom'

import { PrivateRoute } from '../PrivateRoute'
import { SignedOutRoute } from '../SignedOutRoute'
import { AdminRoute } from '../AdminRoute'
import {Landing} from '../../views/pages/Landing'
import {Login} from '../../views/pages/Login'
import {Register} from '../../views/pages/Register'
import {ResetPassword} from '../../views/pages/ResetPassword'
import { Dashboard } from '../../views/pages/Dashboard'
import { GeneralSettings } from '../../views/pages/settings/GeneralSettings'
import { AdvancedSettings } from '../../views/pages/settings/AdvancedSettings'
import { Notifications } from '../../views/pages/Notifications'
import { AdminGeneral } from '../../views/pages/admin/AdminGeneral'
import { BugReports } from '../../views/pages/admin/BugReports'
import { AdminTools } from '../../views/pages/admin/Tools'
import { BugReport } from '../../views/pages/BugReport'
import { Support } from '../../views/pages/Support'
import { FAQ } from '../../views/pages/admin/FAQ'
import { IndividualAdminFAQ } from '../../views/pages/IndividualAdminFAQ'
import { IndividualFAQ } from '../../views/pages/IndividualFAQ'
import { ErrorElement } from '../../views/pages/ErrorElement'

import { CreateProject } from '../../views/pages/CreateProject'
import { Terms } from '../../views/pages/Terms'
import { ProjectOverview } from '../../views/pages/project/ProjectOverview'
import { ProjectAdmin } from '../../views/pages/project/ProjectAdmin'
import { ProjectStatus } from '../../views/pages/project/ProjectStatus'
import { ProjectRevisions } from '../../views/pages/project/ProjectRevisions'
import { AccessCode } from '../../views/pages/AccessCode'
import { ContactUs } from '../../views/pages/ContactUs'

const router = createBrowserRouter([
    {
      path: '/',
      element: <SignedOutRoute element={<Landing />} />,
      errorElement: <ErrorElement />
    },
    {
      path: '/login',
      element: <SignedOutRoute element={<Login />} />,
      errorElement: <ErrorElement />
    },
    {
      path: '/register',
      element: <SignedOutRoute element={<Register />} />,
      errorElement: <ErrorElement />
    },
    {
      path: '/reset',
      element: <SignedOutRoute element={<ResetPassword />} />,
      errorElement: <ErrorElement />
    },
    {
      path: '/support',
      element: <Support />,
      errorElement: <ErrorElement />
    },
    {
      path: '/support/faq/:faqID',
      element: <IndividualFAQ />,
      errorElement: <ErrorElement />
    },
    {
      path: '/contact-us',
      element: <ContactUs />,
      errorElement: <ErrorElement />
    },
    // dashboard
    {
      path: '/dashboard',
      element: <PrivateRoute element={<Dashboard />} />,
      errorElement: <ErrorElement />
    },
    
    // settings
    {
      path: '/settings',
      element: <PrivateRoute element={<GeneralSettings />} />,
      errorElement: <ErrorElement />
    },
    {
      path: '/settings/advanced',
      element: <PrivateRoute element={<AdvancedSettings />} />,
      errorElement: <ErrorElement />
    },

    // notifications
    {
      path: '/notifications',
      element: <PrivateRoute element={<Notifications />} />,
      errorElement: <ErrorElement />
    },
    {
      path: '/notifications/:activeNotificationID',
      element: <PrivateRoute element={<Notifications />} />,
      errorElement: <ErrorElement />
    },

    // admin
    {
      path: '/admin',
      element: <AdminRoute element={<AdminGeneral />} />,
      errorElement: <ErrorElement />
    },
    {
      path: '/admin/bugreports',
      element: <AdminRoute element={<BugReports />} />,
      errorElement: <ErrorElement />
    },
    {
      path: '/admin/tools',
      element: <AdminRoute element={<AdminTools />} />,
      errorElement: <ErrorElement />
    },
    {
      path: 'admin/bugreports/:bugReportID',
      element: <AdminRoute element={<BugReport />} />,
      errorElement: <ErrorElement />
    },
    {
      path: '/admin/faq',
      element: <AdminRoute element={<FAQ />} />,
      errorElement: <ErrorElement />
    },
    {
      path: '/admin/faq/:faqID',
      element: <AdminRoute element={<IndividualAdminFAQ />} />,
      errorElement: <ErrorElement />
    },

    // blackbox
    {
      path: '/create',
      element: <CreateProject />,
      errorElement: <ErrorElement />
    },
    {
      path: '/create/:projectType',
      element: <CreateProject />,
      errorElement: <ErrorElement />
    },
    {
      path: '/terms',
      element: <Terms />,
      errorElement: <ErrorElement />
    },

    // project
    {
      path: '/projects/:projectID',
      element: <PrivateRoute element={<ProjectOverview />} />,
      errorElement: <ErrorElement />
    },
    {
      path: '/projects/:projectID/status',
      element: <PrivateRoute element={<ProjectStatus />} />,
      errorElement: <ErrorElement />
    },
    {
      path: '/projects/:projectID/revisions',
      element: <PrivateRoute element={<ProjectRevisions />} />,
      errorElement: <ErrorElement />
    },
    {
      path: '/projects/:projectID/admin',
      element: <AdminRoute element={<ProjectAdmin />} />,
      errorElement: <ErrorElement />
    },
    {
      path: '/accesscodes/:accessCodeID',
      element: <AdminRoute element={<AccessCode />} />,
      errorElement: <ErrorElement />
    }
])

export const RouterProvider = props => {
  return (
      <__RouterProvider
          router={router}
      />
  )
}