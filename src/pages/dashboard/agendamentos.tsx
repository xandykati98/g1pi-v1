import Layout from './layout'
import { Metadata, type NextPage } from "next";
import { Button } from "components/ui/button"

import { Activity, Check, ChevronsUpDown, CreditCard, DollarSign, Download, Loader2, Plus, Search as SearchIcon } from "lucide-react"

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
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { DataTable } from 'components/clientes/data-table/data-table-component';
import { columns } from 'components/clientes/data-table/columns-agendamentos';
import { Input } from 'components/ui/input';
import { User } from '@prisma/client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "components/ui/dialog"
import { Label } from "components/ui/label"
import { faker } from '@faker-js/faker';
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "~/lib/utils"
import { Calendar } from "components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "components/ui/popover"
 
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "components/ui/select"
import { Textarea } from 'components/ui/textarea';
import { Checkbox } from 'components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from 'components/ui/command';
import { ptBR } from 'date-fns/locale';

const Dates = Array.from<number>({length: 48}).map((_, i) => {
    const minutes = i % 2 === 0 ? '00' : '30';
    const hours = Math.floor(i / 2);
    return `${hours}:${minutes}`
})

const DEFAULTS = {
    date: undefined,
    descricao: '',
    preco: '',
    confirmado: false,
    horario: '12:00',
    clienteId: '',
    funcionarioId: ''
}
export default function Page() {
    const { data: agendamentos, error, isLoading, refetch } = api.agendamento.getAgendamentos.useQuery()
    const mutationToggleStatus = api.agendamento.toggleConfirmado.useMutation();
    const mutationDelete = api.agendamento.deleteAgendamentos.useMutation();
    const mutationCreate = api.agendamento.createAgendamento.useMutation();
    const [nameFilter, setNameFilter] = useState('')

    const [open, setOpen] = useState(false)

    const [date, setDate] = useState<Date|undefined>(DEFAULTS.date)
    const [descricao, setDescricao] = useState(DEFAULTS.descricao)
    const [preco, setPreco] = useState(DEFAULTS.preco)
    const [confirmado, setConfirmado] = useState(DEFAULTS.confirmado)
    const [horario, setHorario] = useState(DEFAULTS.horario)
    const [clienteId, setClienteId] = useState<string>(DEFAULTS.clienteId)
    const [funcionarioId, setFuncionarioId] = useState<string>(DEFAULTS.funcionarioId)

    const [loadingCreate, setLoadingCreate] = useState(false)

    const minHour = 8;
    const maxHour = 18;
    const horarios = Dates.filter(date => {
        const split = date.split(':') as [string, string]
        const hour = parseInt(split[0])
        return hour >= minHour && hour <= maxHour
    })

    const createAgendamento = async () => {
        try {
            if (!date) return alert('Selecione uma data')
            if (!preco) return alert('Preço não pode ser vazio')
            if (!clienteId) return alert('Selecione um cliente')
            if (!funcionarioId) return alert('Selecione um funcionário')

            setLoadingCreate(true)
            const [hour, minute] = horario.split(':') as [string, string]
            const dataFim = date || new Date() 
            dataFim.setHours(parseInt(hour))
            dataFim.setMinutes(parseInt(minute))
            await mutationCreate.mutateAsync({
                data: dataFim?.toString(),
                descricao,
                preco: parseFloat(preco),
                confirmado,
                clienteId,
                funcionarioId
            })
            setOpen(false)
            await refetch()
            setDate(DEFAULTS.date)
            setDescricao(DEFAULTS.descricao)
            setPreco(DEFAULTS.preco)
            setConfirmado(DEFAULTS.confirmado)
            setHorario(DEFAULTS.horario)
            setClienteId(DEFAULTS.clienteId)
            setFuncionarioId(DEFAULTS.funcionarioId)

        } catch (error) {
            alert('Algum erro ocorreu ao criar o agendamento')
        }
        setLoadingCreate(false)
    }
    const mutateExcluir = async (ids: string[]) => {
        await mutationDelete.mutateAsync({ids})
        await refetch()
        return { ok: true }
    }
    const mutateToggleStatus = async (id: string, new_val: boolean) => {
        await mutationToggleStatus.mutateAsync({id, new_val})
        await refetch()
        return { ok: true }
    }

    if (isLoading) return <div></div>
    if (error) return <div>Erro: {error.message}</div>

    const filteredAgendamentos = agendamentos.filter(agendamento => agendamento.cliente.nome.toLowerCase().includes(nameFilter.toLowerCase()))

    return <div className="flex-1 space-y-4 p-8 pt-6">
    <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Agendamentos</h2>
        <div className="flex items-center space-x-2">
        
            <Input
                type="search"
                placeholder="Busque por nome de cliente"
                className="h-9 md:w-[100px] lg:w-[300px]"
                onChange={e => setNameFilter(e.target.value)}
                value={nameFilter}
            />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button onClick={() => setOpen(true)} size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Agendamento
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Cadastro de novo funcionário</DialogTitle>
                        <DialogDescription>
                            Crie um novo usuário para ter acesso ao sistema.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                            Dia<span className="text-[red]">*</span>
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[280px] justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                    >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Escolha um dia</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                    mode="single"
                                    locale={ptBR}
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                            Horário<span className="text-[red]">*</span>
                            </Label>
                            <div>
                                <Select value={horario} onValueChange={setHorario}>
                                    <SelectTrigger className='w-[280px]'>
                                        <SelectValue placeholder="Selecione um horário" />
                                    </SelectTrigger>
                                    <SelectContent className="h-72">
                                        <SelectGroup>
                                            {
                                                horarios.map(horario => <SelectItem key={horario} value={horario}>{horario}</SelectItem>)
                                            }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="descricao" className="text-right">
                            Descrição
                            </Label>
                            <Textarea id="descricao" onBlur={e => setDescricao(e.target.value)} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="preco" className="text-right">
                            Preço<span className="text-[red]">*</span>
                            </Label>
                            <Input placeholder='R$ 10' onChange={e => setPreco(e.target.value)} value={preco} id="preco" type="number" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="confirmado" className="text-right">
                            Confirmado?
                            </Label>
                            <div className="flex items-center space-x-2 w-[280px]">
                                <Checkbox onCheckedChange={e => setConfirmado(!confirmado)} checked={confirmado} id="confirmado" />
                                <label
                                    htmlFor="confirmado"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Agendamentos confirmados são contabilizados de maneira diferente na dashboard.
                                </label>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="cliente" className="text-right">
                                Cliente<span className="text-[red]">*</span>
                            </Label>
                            <div>
                                <ListarClientes setClienteId={setClienteId}/>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="funcionario" className="text-right">
                            Funcionário<span className="text-[red]">*</span>
                            </Label>
                            <div>
                                <ListarFuncionarios setFuncionarioId={setFuncionarioId}/>
                            </div>
                        </div>

                    </div>
                    <DialogFooter>
                        <Button disabled={loadingCreate} onClick={() => void createAgendamento()} type="submit">
                            {
                                loadingCreate && <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            }
                            Criar agendamento
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    </div>
    <DataTable columns={columns} deleteMutate={mutateExcluir} refetch={refetch} data={filteredAgendamentos
    .map(agendamento => ({
        ...agendamento, 
        mutateExcluir: () => mutateExcluir([agendamento.id]),
        mutateToggleStatus: () => mutateToggleStatus(agendamento.id, !agendamento.confirmado ),
    })).sort((a, b) => new Date(b.data).getTime()-new Date(a.data).getTime())
    } />
    </div>
}
export function ListarClientes({setClienteId}: {setClienteId: (id: string) => void}) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const [searchText, setSearchText] = useState('')
    const { data } = api.cliente.getClientesByName.useQuery({ nome: searchText })
    const clientes = data || []
    const [cacheValue, setCacheValue] = useState<null|User>(null)
    useEffect(() => {
        setClienteId(value)
        if (value) {
            setCacheValue(clientes.find((cliente:User) => cliente.id === value) as User)
        }
    }, [value]);
    return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[280px] justify-between"
            >
              {value
                ? ([...clientes, cacheValue].filter(cliente => cliente !== null) as User[]).find((cliente) => cliente.id === value)?.nome
                : "Busque por cliente..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0">
            <Command shouldFilter={false}>
              <div className="flex items-center border-b px-3" cmdk-input-wrapper="">    
                  <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <input value={searchText} onChange={(e:ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)} 
                  className={"placeholder:text-foreground-muted flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"}
                  placeholder="Busque por cliente..."
                  />
              </div>
              <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
              {
                  <CommandGroup>
                      {
                          value && <CommandItem    
                          value={''}
                          onSelect={() => {
                              setValue('')
                              setOpen(false)
                          }}
                      >
                          <Check
                          className={cn(
                              "mr-2 h-4 w-4",
                              "opacity-0"
                          )}/>
                          <span className='font-bold cursor-pointer'>Remover cliente</span>
                      </CommandItem>
                      }
                      {clientes.filter(cliente => cliente.nome.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())).map((funcionario) => (
                      <CommandItem    
                          value={funcionario.id}
                          key={funcionario.id}
                          onSelect={(currentValue) => {
                              setValue(currentValue === value ? "" : currentValue)
                              setOpen(false)
                          }}
                          className='cursor-pointer'
                      >
                          <Check
                          className={cn(
                              "mr-2 h-4 w-4",
                              value === funcionario.id ? "opacity-100" : "opacity-0"
                          )}
                          />
                          {funcionario.nome}
                      </CommandItem>
                      ))}
                  </CommandGroup>
              }
              
            </Command>
          </PopoverContent>
        </Popover>
    )
}
export function ListarFuncionarios({setFuncionarioId}:{setFuncionarioId: (id: string) => void}) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    const [searchText, setSearchText] = useState('')
    const { data } = api.funcionario.getFuncionarios.useQuery()
    const funcionarios = data || []
    useEffect(() => {
        setFuncionarioId(value)
    }, [value]);
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[280px] justify-between"
          >
            {value
              ? funcionarios.find((funcionario) => funcionario.id === value)?.nome
              : "Busque por funcionário..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0">
          <Command shouldFilter={false}>
            <div className="flex items-center border-b px-3" cmdk-input-wrapper="">    
                <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <input value={searchText} onChange={(e:ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)} 
                className={"placeholder:text-foreground-muted flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"}
                placeholder="Busque por funcionário..."
                />
            </div>
            <CommandEmpty>Nenhum funcionário encontrado.</CommandEmpty>
            {
                <CommandGroup>
                    {
                        value && <CommandItem    
                        value={''}
                        onSelect={() => {
                            setValue('')
                            setOpen(false)
                        }}
                    >
                        <Check
                        className={cn(
                            "mr-2 h-4 w-4",
                            "opacity-0"
                        )}/>
                        <span className='font-bold cursor-pointer'>Remover funcionário</span>
                    </CommandItem>
                    }
                    {funcionarios.filter(funcionario => funcionario.nome.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())).map((funcionario) => (
                    <CommandItem    
                        value={funcionario.id}
                        key={funcionario.id}
                        onSelect={(currentValue) => {
                            setValue(currentValue === value ? "" : currentValue)
                            setOpen(false)
                        }}
                        className='cursor-pointer'
                    >
                        <Check
                        className={cn(
                            "mr-2 h-4 w-4",
                            value === funcionario.id ? "opacity-100" : "opacity-0"
                        )}
                        />
                        {funcionario.nome}
                    </CommandItem>
                    ))}
                </CommandGroup>
            }
            
          </Command>
        </PopoverContent>
      </Popover>
    )
}

Page.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}