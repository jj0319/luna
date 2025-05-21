import EnvSettings from "@/components/env-settings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">설정</h1>

      <Tabs defaultValue="api" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="api">API 설정</TabsTrigger>
          <TabsTrigger value="appearance">화면 설정</TabsTrigger>
          <TabsTrigger value="advanced">고급 설정</TabsTrigger>
        </TabsList>

        <TabsContent value="api" className="mt-6">
          <EnvSettings />
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>화면 설정</CardTitle>
              <CardDescription>테마와 언어 등 화면 관련 설정을 변경합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                현재 기본 설정이 적용되어 있습니다. 추후 업데이트에서 더 많은 옵션이 제공될 예정입니다.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>고급 설정</CardTitle>
              <CardDescription>고급 사용자를 위한 추가 설정입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                현재 기본 설정이 적용되어 있습니다. 추후 업데이트에서 더 많은 옵션이 제공될 예정입니다.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
