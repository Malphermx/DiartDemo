"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useDataStore } from "@/lib/store"
import {
  PRODUCT_CATEGORY_LABELS,
  TEMPERATURE_LABELS,
  STATUS_LABELS,
} from "@/lib/types"
import type { LeadTemperature, ProductCategory, LeadStatus } from "@/lib/types"
import { LeadTemperatureBadge } from "@/components/lead-temperature-badge"
import { DecisionTreeProgress } from "@/components/decision-tree-progress"
import { LeadCard } from "@/components/lead-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, LayoutList, Columns3, Snowflake, Sun, Flame } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export default function LeadsPage() {
  const { leads } = useDataStore()
  const [search, setSearch] = useState("")
  const [tempFilter, setTempFilter] = useState<string>("all")
  const [productFilter, setProductFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        search === "" ||
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.phone.includes(search) ||
        (lead.company?.toLowerCase().includes(search.toLowerCase()) ?? false)

      const matchesTemp = tempFilter === "all" || lead.temperature === tempFilter
      const matchesProduct = productFilter === "all" || lead.productCategory === productFilter
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter

      return matchesSearch && matchesTemp && matchesProduct && matchesStatus
    })
  }, [leads, search, tempFilter, productFilter, statusFilter])

  const coldLeads = filteredLeads.filter((l) => l.temperature === "cold")
  const warmLeads = filteredLeads.filter((l) => l.temperature === "warm")
  const hotLeads = filteredLeads.filter((l) => l.temperature === "hot")

  const clearFilters = () => {
    setSearch("")
    setTempFilter("all")
    setProductFilter("all")
    setStatusFilter("all")
  }

  const hasActiveFilters = search || tempFilter !== "all" || productFilter !== "all" || statusFilter !== "all"

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Pipeline de Leads</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {leads.length} leads totales - {filteredLeads.length} mostrados
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, telefono o empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={tempFilter} onValueChange={setTempFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Temperatura" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {(Object.entries(TEMPERATURE_LABELS) as [LeadTemperature, string][]).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={productFilter} onValueChange={setProductFilter}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Producto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {(Object.entries(PRODUCT_CATEGORY_LABELS) as [ProductCategory, string][]).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {(Object.entries(STATUS_LABELS) as [LeadStatus, string][]).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      {/* View tabs */}
      <Tabs defaultValue="table" className="w-full">
        <TabsList>
          <TabsTrigger value="table" className="gap-1.5">
            <LayoutList className="h-4 w-4" />
            Tabla
          </TabsTrigger>
          <TabsTrigger value="kanban" className="gap-1.5">
            <Columns3 className="h-4 w-4" />
            Kanban
          </TabsTrigger>
        </TabsList>

        {/* Table view */}
        <TabsContent value="table" className="mt-4">
          <div className="rounded-lg border border-border/60 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-semibold">Nombre</TableHead>
                  <TableHead className="font-semibold">Telefono</TableHead>
                  <TableHead className="font-semibold">Temperatura</TableHead>
                  <TableHead className="font-semibold">Producto</TableHead>
                  <TableHead className="font-semibold">Progreso</TableHead>
                  <TableHead className="font-semibold">Estado</TableHead>
                  <TableHead className="font-semibold">Ultimo contacto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No se encontraron leads con los filtros aplicados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                      <TableCell>
                        <Link href={`/dashboard/leads/${lead.id}`} className="flex flex-col">
                          <span className="font-medium text-foreground">{lead.name}</span>
                          {lead.company && (
                            <span className="text-xs text-muted-foreground">{lead.company}</span>
                          )}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{lead.phone}</TableCell>
                      <TableCell>
                        <LeadTemperatureBadge temperature={lead.temperature} size="sm" />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {PRODUCT_CATEGORY_LABELS[lead.productCategory]}
                      </TableCell>
                      <TableCell>
                        <DecisionTreeProgress
                          currentStep={lead.decisionTreeStep}
                          totalSteps={lead.totalSteps}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-medium px-2 py-1 rounded-md bg-muted text-muted-foreground">
                          {STATUS_LABELS[lead.status]}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(lead.lastInteraction), { addSuffix: true, locale: es })}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Kanban view */}
        <TabsContent value="kanban" className="mt-4">
          <div className="grid gap-4 md:grid-cols-3">
            {/* Cold column */}
            <KanbanColumn
              title="Frio"
              icon={<Snowflake className="h-4 w-4 text-blue-600" />}
              leads={coldLeads}
              headerClassName="bg-blue-50 border-blue-200 text-blue-800"
              count={coldLeads.length}
            />
            {/* Warm column */}
            <KanbanColumn
              title="Tibio"
              icon={<Sun className="h-4 w-4 text-amber-600" />}
              leads={warmLeads}
              headerClassName="bg-amber-50 border-amber-200 text-amber-800"
              count={warmLeads.length}
            />
            {/* Hot column */}
            <KanbanColumn
              title="Caliente"
              icon={<Flame className="h-4 w-4 text-red-600" />}
              leads={hotLeads}
              headerClassName="bg-red-50 border-red-200 text-red-800"
              count={hotLeads.length}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function KanbanColumn({
  title,
  icon,
  leads,
  headerClassName,
  count,
}: {
  title: string
  icon: React.ReactNode
  leads: ReturnType<typeof useDataStore>["leads"]
  headerClassName: string
  count: number
}) {
  return (
    <div className="flex flex-col rounded-lg border border-border/60 bg-muted/20 overflow-hidden">
      <div className={`flex items-center gap-2 px-4 py-3 border-b font-semibold text-sm ${headerClassName}`}>
        {icon}
        <span>{title}</span>
        <span className="ml-auto text-xs font-bold opacity-80">{count}</span>
      </div>
      <ScrollArea className="h-[calc(100vh-380px)] min-h-[300px]">
        <div className="flex flex-col gap-2 p-3">
          {leads.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">
              Sin leads en esta categoria
            </p>
          ) : (
            leads.map((lead) => <LeadCard key={lead.id} lead={lead} />)
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
