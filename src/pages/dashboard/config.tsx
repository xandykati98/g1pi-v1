import Layout from './layout'
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
import { MainNav } from "components/dashboard/main-nav2"
import { Overview } from "components/dashboard/overview"
import { RecentSales } from "components/dashboard/recent-sales"
import { Search } from "components/dashboard/search"
import TeamSwitcher from "components/dashboard/team-switcher"
import { UserNav } from "components/dashboard/user-nav"
import { api } from '~/utils/api';
import { dateToDDMMYYYY } from '~/utils/datestuff';
import { useState } from 'react';
import { DataTable } from 'components/clientes/data-table/data-table-component';
import { columns } from 'components/clientes/data-table/columns-clientes';
import { Input } from 'components/ui/input';
import { User } from '@prisma/client';
import { Separator } from '@radix-ui/react-dropdown-menu';

export default function Page() {
    
    return <div className="space-y-6">
        <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
            This is how others will see you on the site.
        </p>
        </div>
        <Separator />
    </div>
}

Page.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}