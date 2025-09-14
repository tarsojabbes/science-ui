import * as React from "react"

import { SearchForm } from "@/components/search-form"
import { VersionSwitcher } from "@/components/version-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export type ViewType = 'journals' | 'papers' | 'reviews'

const data = {
  navMain: [
    {
      url: "#",
      items: [
        {
          title: "Journals",
          key: "journals" as ViewType,
        },
        {
          title: "Papers",
          key: "papers" as ViewType,
        },
        {
          title: "Reviews",
          key: "reviews" as ViewType,
        }
      ],
    }
  ],
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  activeView: ViewType
  onViewChange: (view: ViewType) => void
}

export function AppSidebar({ activeView, onViewChange, ...props }: AppSidebarProps) {
  const firstName = window?.localStorage.getItem('@science.username')?.split(" ")[0]

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        Welcome back, {firstName}!
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={""}>
            <SidebarGroupLabel>{""}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((menuItem) => (
                  <SidebarMenuItem key={menuItem.title}>
                    <SidebarMenuButton 
                      isActive={activeView === menuItem.key}
                      onClick={() => onViewChange(menuItem.key)}
                    >
                      {menuItem.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
