'use client'
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import useAuth from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export default function Page() {
  const isAuthenticated = useAuth()
  const router = useRouter()

  if (!isAuthenticated) return null

  const logOut = () => {
    localStorage.clear()
    router.push("/login")
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Button onClick={logOut}>Log out from Science</Button>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl">Testing div</div>
            <div className="bg-muted/50 aspect-video rounded-xl">Testing div 2</div>
            <div className="bg-muted/50 aspect-video rounded-xl">Testing div 3</div>
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">Testing div 3</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
