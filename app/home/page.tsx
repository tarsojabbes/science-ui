'use client'
import { AppSidebar, ViewType } from "@/components/app-sidebar"
import JournalListingView from "@/components/journalListingView"
import PapersListingView from "@/components/papersListingView"
import ReviewsListingView from "@/components/reviewsListingView"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import useAuth from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Page() {
  const isAuthenticated = useAuth()
  const router = useRouter()
  const [activeView, setActiveView] = useState<ViewType>('journals')

  if (!isAuthenticated) return null

  const logOut = () => {
    localStorage.clear()
    router.push("/login")
  }

  const handleViewChange = (view: ViewType) => {
    setActiveView(view)
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'journals':
        return <JournalListingView />
      case 'papers':
        return <PapersListingView />
      case 'reviews':
        return <ReviewsListingView />
      default:
        return <JournalListingView />
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar activeView={activeView} onViewChange={handleViewChange} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Button onClick={logOut}>Log out from Science</Button>
        </header>
        {renderActiveView()}
      </SidebarInset>
    </SidebarProvider>
  )
}
