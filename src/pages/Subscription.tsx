import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/custom-components/PageHeader';
import {
  PLANS,
  mockCurrentSubscription,
  mockInvoices,
  mockPaymentMethod,
} from '@/features/account/account.constants';
import { useChatStats } from '@/features/account/hooks/useChatStats';
import { formatCurrency, formatShortDate } from '@/features/account/format';
import type { BillingCycle, PlanId } from '@/features/account/types';
import { cn } from '@/lib/utils';
import { Check, CreditCard, Download, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

const FAQ = [
  {
    q: 'Posso trocar de plano a qualquer momento?',
    a: 'Sim. Upgrades começam imediatamente e Downgrades entram em vigor no próximo ciclo de cobrança.',
  },
  {
    q: 'Como funciona o cancelamento?',
    a: 'Você pode cancelar quando quiser. Seu plano segue ativo até o fim do ciclo já pago, sem novas cobranças.',
  },
  {
    q: 'Vocês oferecem reembolso?',
    a: 'Reembolso integral em até 7 dias após a primeira cobrança de cada plano pago, conforme o CDC.',
  },
];

const STATUS_VARIANT: Record<
  (typeof mockInvoices)[number]['status'],
  { label: string; className: string }
> = {
  paid: { label: 'Pago', className: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30' },
  pending: { label: 'Pendente', className: 'bg-amber-500/15 text-amber-600 border-amber-500/30' },
  failed: { label: 'Falhou', className: 'bg-red-500/15 text-red-600 border-red-500/30' },
};

export default function Subscription() {
  const stats = useChatStats();
  const [cycle, setCycle] = useState<BillingCycle>(mockCurrentSubscription.cycle);

  const currentPlan = useMemo(
    () => PLANS.find((p) => p.id === mockCurrentSubscription.planId) ?? PLANS[0],
    [],
  );

  const usagePercent = currentPlan.monthlyRoundsLimit
    ? Math.min(100, Math.round((stats.roundsThisMonth / currentPlan.monthlyRoundsLimit) * 100))
    : 0;

  const handleSelectPlan = (planId: PlanId) => {
    if (planId === currentPlan.id) return;
    // TODO(backend): redirecionar para checkout (Stripe/Pagar.me).
    toast.success(`Solicitação para o plano ${planId} enviada.`, {
      description: 'Integração de pagamento ainda não implementada.',
    });
  };

  const handleCancel = () => {
    // TODO(backend): chamar POST /billing/cancel
    toast('Assinatura cancelada ao fim do ciclo (mock).');
  };

  const handleUpdatePayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO(backend): tokenizar via Stripe Elements e atualizar.
    toast.success('Método de pagamento atualizado (mock).');
  };

  return (
    <section className="flex w-full flex-col items-center p-4 sm:p-6 md:p-10">
      <PageHeader
        title="Minha assinatura"
        description="Gerencie seu plano, métodos de pagamento e veja seu uso atual."
      />

      <div className="grid w-full gap-5 sm:gap-6 lg:w-[80%] 2xl:w-[60%] 2xl:max-w-300">
        <Card className="border-primary/40">
          <CardHeader className="flex flex-col items-start justify-between gap-4 px-4 sm:flex-row sm:px-6">
            <div className="min-w-0">
              <CardDescription>Plano atual</CardDescription>
              <CardTitle className="mt-1 flex flex-wrap items-center gap-2 text-2xl sm:text-3xl">
                {currentPlan.name}
                <Badge variant="secondary">
                  {mockCurrentSubscription.cycle === 'yearly' ? 'Anual' : 'Mensal'}
                </Badge>
              </CardTitle>
            </div>
            <div className="w-full text-left sm:w-auto sm:text-right">
              <p className="text-xl font-bold sm:text-2xl">
                {formatCurrency(
                  currentPlan.pricing[mockCurrentSubscription.cycle],
                )}
              </p>
              <p className="text-muted-foreground text-xs">
                Renova em {formatShortDate(mockCurrentSubscription.renewsAt)}
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 px-4 sm:px-6">
            <div>
              <div className="mb-1 flex flex-col gap-1 text-sm sm:flex-row sm:justify-between">
                <span className="text-muted-foreground">Uso mensal</span>
                <span className="font-medium">
                  {stats.roundsThisMonth}
                  {currentPlan.monthlyRoundsLimit
                    ? ` / ${currentPlan.monthlyRoundsLimit}`
                    : ' / ∞'}{' '}
                  rodadas
                </span>
              </div>
              <Progress value={currentPlan.monthlyRoundsLimit ? usagePercent : 100} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 px-4 sm:flex-row sm:flex-wrap sm:px-6">
            <Button variant="outline" className="w-full sm:w-auto">Gerenciar plano</Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="w-full text-destructive hover:text-destructive sm:w-auto">
                  Cancelar assinatura
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancelar assinatura?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Você manterá acesso até{' '}
                    {formatShortDate(mockCurrentSubscription.renewsAt)} e não será
                    cobrado novamente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Voltar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancel}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Sim, cancelar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>

        <section className="min-w-0">
          <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div className="min-w-0">
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Compare os planos</h2>
              <p className="text-muted-foreground text-sm">
                Escolha o plano que combina com seu uso.
              </p>
            </div>
            <Tabs value={cycle} onValueChange={(v) => setCycle(v as BillingCycle)} className="w-full sm:w-auto">
              <TabsList className="grid w-full grid-cols-2 sm:w-auto">
                <TabsTrigger value="monthly" className="w-full">Mensal</TabsTrigger>
                <TabsTrigger value="yearly" className="w-full">
                  Anual{' '}
                  <Badge variant="secondary" className="ml-1 sm:ml-2">
                    -17%
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {PLANS.map((plan) => {
              const isCurrent = plan.id === currentPlan.id;
              const price = plan.pricing[cycle];
              return (
                <Card
                  key={plan.id}
                  className={cn(
                    'relative flex flex-col',
                    plan.highlight && 'border-primary shadow-md',
                  )}
                >
                  {plan.highlight ? (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Sparkles className="mr-1 h-3 w-3" />
                      Mais popular
                    </Badge>
                  ) : null}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="pt-2">
                      <span className="text-2xl font-bold sm:text-3xl">
                        {price === 0 ? 'Grátis' : formatCurrency(price)}
                      </span>
                      {price > 0 ? (
                        <span className="text-muted-foreground text-sm">
                          /{cycle === 'yearly' ? 'ano' : 'mês'}
                        </span>
                      ) : null}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-2 text-sm">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={isCurrent ? 'outline' : plan.highlight ? 'default' : 'secondary'}
                      disabled={isCurrent}
                      onClick={() => handleSelectPlan(plan.id)}
                    >
                      {isCurrent ? 'Plano atual' : plan.cta}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </section>

        <Card>
          <CardHeader className="flex flex-col items-start justify-between gap-3 px-4 sm:flex-row sm:gap-2 sm:px-6">
            <div className="min-w-0">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" /> Método de pagamento
              </CardTitle>
              <CardDescription>
                O cartão usado para cobranças automáticas.
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">Atualizar</Button>
              </DialogTrigger>
              <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-4 sm:p-6">
                <DialogHeader>
                  <DialogTitle>Atualizar cartão</DialogTitle>
                  <DialogDescription>
                    Suas informações são processadas com segurança pelo nosso
                    provedor de pagamentos.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdatePayment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-holder">Nome impresso no cartão</Label>
                    <Input id="card-holder" placeholder="Como está no cartão" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Número do cartão</Label>
                    <Input
                      id="card-number"
                      placeholder="0000 0000 0000 0000"
                      inputMode="numeric"
                      required
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="card-exp">Validade</Label>
                      <Input id="card-exp" placeholder="MM/AA" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-cvc">CVC</Label>
                      <Input id="card-cvc" placeholder="123" inputMode="numeric" required />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full sm:w-auto">Salvar cartão</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3 rounded-lg border p-3 sm:gap-4 sm:p-4">
              <div className="bg-muted flex h-10 w-14 shrink-0 items-center justify-center rounded font-bold uppercase">
                {mockPaymentMethod.brand}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  •••• •••• •••• {mockPaymentMethod.last4}
                </p>
                <p className="text-muted-foreground wrap-break-word text-xs">
                  {mockPaymentMethod.holder} · expira em{' '}
                  {String(mockPaymentMethod.expMonth).padStart(2, '0')}/
                  {mockPaymentMethod.expYear}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-4 sm:px-6">
            <CardTitle>Histórico de faturas</CardTitle>
            <CardDescription>
              Baixe seus recibos para fins fiscais ou de reembolso.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="grid gap-3 md:hidden">
              {mockInvoices.map((invoice) => {
                const status = STATUS_VARIANT[invoice.status];
                return (
                  <div key={invoice.id} className="rounded-lg border p-3">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-mono text-xs font-medium">{invoice.id}</p>
                        <p className="text-muted-foreground text-xs">
                          {formatShortDate(invoice.date)}
                        </p>
                      </div>
                      <Badge variant="outline" className={cn('shrink-0', status.className)}>
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-sm">{invoice.description}</p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold">
                        {formatCurrency(invoice.amount, invoice.currency)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        aria-label="Baixar fatura"
                        onClick={() =>
                          // TODO(backend): baixar PDF real da fatura.
                          toast(`Baixando ${invoice.id} (mock).`)
                        }
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Baixar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="hidden md:block">
            <Table className="min-w-180">
              <TableHeader>
                <TableRow>
                  <TableHead>Fatura</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInvoices.map((invoice) => {
                  const status = STATUS_VARIANT[invoice.status];
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono text-xs">{invoice.id}</TableCell>
                      <TableCell>{formatShortDate(invoice.date)}</TableCell>
                      <TableCell>{invoice.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={status.className}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(invoice.amount, invoice.currency)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Baixar fatura"
                          onClick={() =>
                            // TODO(backend): baixar PDF real da fatura.
                            toast(`Baixando ${invoice.id} (mock).`)
                          }
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-4 sm:px-6">
            <CardTitle>Perguntas frequentes</CardTitle>
            <CardDescription>
              Tire suas dúvidas sobre planos e cobrança.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <Accordion type="single" collapsible className="w-full">
              {FAQ.map((item, idx) => (
                <AccordionItem key={item.q} value={`faq-${idx}`}>
                  <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

