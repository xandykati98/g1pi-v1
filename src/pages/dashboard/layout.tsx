import { Metadata, type NextPage } from "next";
import { Button } from "components/ui/button"

import { Activity, CreditCard, DollarSign, Download, Users } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs"
import { CalendarDateRangePicker } from "components/dashboard/date-range-picker"
import { MainNav } from "components/dashboard/main-nav"
import { Overview } from "components/dashboard/overview"
import { RecentSales } from "components/dashboard/recent-sales"
import { Search } from "components/dashboard/search"
import TeamSwitcher from "components/dashboard/team-switcher"
import { UserNav } from "components/dashboard/user-nav"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app using the components.",
}

export default function Layout({ children }: { children: React.ReactNode }) {

    return (
        <>
        <div className="flex-col">
            <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <TeamSwitcher />
                <div className="flex w-full">
                <div>
                    <MainNav />
                </div>
                </div>
                <div className="ml-auto flex items-center space-x-4">
                <Search />
                <UserNav />
                </div>
            </div>
            </div>
            {children}
        </div>
        </>
    );
}