import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Activity } from "lucide-react";
import { api } from "~/utils/api";

export default function Analytics() {
    // TODO: implementar
    const { data, error, isLoading} = api.analytics.getTotalAccessSite.useQuery();
    
    if (error) return <div>Error: {error.message}</div>
    if (isLoading) return <div></div>
    return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                Visitas no site hoje
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                Campo desabilitado 
                </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                Visitas no site hoje
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                Campo desabilitado 
                </p>
            </CardContent>
        </Card>
    </div>;
}