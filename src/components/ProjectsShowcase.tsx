import { useMemo, useState } from 'react';
import {
  ShoppingCart, CreditCard, BarChart3, Package, Smartphone, ShieldCheck, CheckCircle2,
  Search, Plus, Minus, Layers, Database, ChevronDown, ChevronUp,
} from 'lucide-react';
import {
  products, kpis, revenueBars, paymentSplit, recentOrders, techStack, djangoApps, roles, features, engineering,
} from '../data/projectsData';

type Tab = 'terminal' | 'checkout' | 'reports';
type Method = 'Cash' | 'Card' | 'Mobile Money';

const card = 'rounded-2xl border border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/60';
const money = (n: number) => `GH₵ ${n.toFixed(2)}`;

export function ProjectsShowcase() {
  const [tab, setTab] = useState<Tab>('terminal');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<Record<number, number>>({});
  const [method, setMethod] = useState<Method>('Cash');
  const [tendered, setTendered] = useState('');
  const [settled, setSettled] = useState(false);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(
    () => products.filter((p) => (p.name + p.category).toLowerCase().includes(query.toLowerCase())),
    [query],
  );
  const lowStock = products.filter((p) => p.stock <= p.lowAt);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = products.reduce((s, p) => s + (cart[p.id] || 0) * p.price, 0);
  const paid = parseFloat(tendered) || 0;
  const change = Math.max(0, paid - total);
  const canPay = total > 0 && (method !== 'Cash' || paid >= total);

  const adjust = (id: number, d: number) => {
    setSettled(false);
    setCart((c) => {
      const q = Math.max(0, (c[id] || 0) + d);
      return { ...c, [id]: q };
    });
  };

  const tabs: { id: Tab; label: string; icon: typeof ShoppingCart }[] = [
    { id: 'terminal', label: 'POS Terminal & Cart', icon: ShoppingCart },
    { id: 'checkout', label: 'Checkout', icon: CreditCard },
    { id: 'reports', label: 'KPI & Reports', icon: BarChart3 },
  ];

  const methodIcon = { Cash: Package, Card: CreditCard, 'Mobile Money': Smartphone } as const;

  return (
    <section id="projects" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Featured Project</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">Retail POS Platform</h2>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
          A Django point-of-sale system for retail shops: fast cashier terminal, multi-method checkout, procurement and live business reporting.
        </p>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {/* Overview */}
          <div className={`${card} p-6 lg:col-span-1`}>
            <div className="flex items-center gap-2 text-slate-900 dark:text-white"><Layers className="h-5 w-5 text-indigo-500" /><h3 className="font-semibold">Stack</h3></div>
            <div className="mt-3 flex flex-wrap gap-2">
              {techStack.map((t) => (
                <span key={t} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">{t}</span>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-2 text-slate-900 dark:text-white"><ShieldCheck className="h-5 w-5 text-emerald-500" /><h3 className="font-semibold">Roles</h3></div>
            <div className="mt-3 flex gap-2">
              {roles.map((r) => (
                <span key={r} className="rounded-md border border-slate-200 px-2.5 py-1 text-xs text-slate-700 dark:border-slate-700 dark:text-slate-300">{r}</span>
              ))}
            </div>
            <ul className="mt-5 space-y-2">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />{f}
                </li>
              ))}
            </ul>
          </div>

          {/* Interactive preview */}
          <div className={`${card} overflow-hidden lg:col-span-2`}>
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 p-2 dark:border-slate-800">
              <div role="tablist" className="flex flex-wrap gap-1">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    role="tab"
                    aria-selected={tab === id}
                    onClick={() => setTab(id)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition sm:text-sm ${
                      tab === id
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="h-4 w-4" />{label}
                  </button>
                ))}
              </div>
              <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <ShoppingCart className="h-3.5 w-3.5" />{count}
              </span>
            </div>

            <div className="p-4 sm:p-5">
              {tab === 'terminal' && (
                <div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {filtered.map((p) => {
                      const q = cart[p.id] || 0;
                      const low = p.stock <= p.lowAt;
                      return (
                        <div key={p.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{p.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {money(p.price)} · <span className={low ? 'font-semibold text-amber-600 dark:text-amber-400' : ''}>{p.stock} in stock</span>
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {q > 0 && (
                              <>
                                <button aria-label="Remove one" onClick={() => adjust(p.id, -1)} className="rounded-md bg-slate-100 p-1 dark:bg-slate-800"><Minus className="h-3.5 w-3.5 text-slate-700 dark:text-slate-200" /></button>
                                <span className="w-4 text-center text-sm text-slate-900 dark:text-white">{q}</span>
                              </>
                            )}
                            <button aria-label="Add one" disabled={q >= p.stock} onClick={() => adjust(p.id, 1)} className="rounded-md bg-indigo-600 p-1 text-white disabled:opacity-40"><Plus className="h-3.5 w-3.5" /></button>
                          </div>
                        </div>
                      );
                    })}
                    {filtered.length === 0 && <p className="text-sm text-slate-500">No products match.</p>}
                  </div>
                  <div className="mt-4 rounded-xl border border-amber-300/60 bg-amber-50 p-3 dark:border-amber-500/30 dark:bg-amber-500/10">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300"><Package className="h-4 w-4" />Low-stock tray ({lowStock.length})</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {lowStock.map((p) => (
                        <span key={p.id} className="rounded-full bg-white px-2.5 py-1 text-xs text-amber-800 dark:bg-slate-900 dark:text-amber-200">{p.name} · {p.stock}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-100 p-3 text-sm dark:bg-slate-800">
                    <span className="text-slate-600 dark:text-slate-300">{count} item{count === 1 ? '' : 's'} in cart</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{money(total)}</span>
                  </div>
                </div>
              )}

              {tab === 'checkout' && (
                <div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Cash', 'Card', 'Mobile Money'] as Method[]).map((m) => {
                      const Icon = methodIcon[m];
                      return (
                        <button
                          key={m}
                          onClick={() => { setMethod(m); setSettled(false); }}
                          className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-xs font-medium transition sm:text-sm ${
                            method === m
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300'
                              : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400'
                          }`}
                        >
                          <Icon className="h-5 w-5" />{m}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-slate-600 dark:text-slate-300"><span>Order total ({count} items)</span><span className="font-semibold text-slate-900 dark:text-white">{money(total)}</span></div>
                    {method === 'Cash' && (
                      <>
                        <label className="flex items-center justify-between gap-3 text-slate-600 dark:text-slate-300">
                          Amount tendered
                          <input
                            type="number" min="0" value={tendered}
                            onChange={(e) => { setTendered(e.target.value); setSettled(false); }}
                            className="w-32 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-right text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                          />
                        </label>
                        <div className="flex justify-between text-slate-600 dark:text-slate-300"><span>Change due</span><span className="font-semibold text-emerald-600 dark:text-emerald-400">{money(change)}</span></div>
                      </>
                    )}
                    {method !== 'Cash' && (
                      <p className="rounded-lg bg-slate-100 p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {method === 'Card' ? 'Waiting for card terminal approval…' : 'Prompt sent to customer’s mobile wallet for approval…'}
                      </p>
                    )}
                  </div>
                  <button
                    disabled={!canPay || settled}
                    onClick={() => setSettled(true)}
                    className="mt-4 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
                  >
                    {total === 0 ? 'Add items in the terminal first' : `Confirm ${method} payment`}
                  </button>
                  {settled && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                      <CheckCircle2 className="h-5 w-5" />Settled via {method} · {money(total)} · receipt ready
                    </div>
                  )}
                </div>
              )}

              {tab === 'reports' && (
                <div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {kpis.map((k) => (
                      <div key={k.label} className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                        <p className="text-xs text-slate-500 dark:text-slate-400">{k.label}</p>
                        <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{k.value}</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">{k.delta}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-300">Revenue this week</p>
                      <div className="flex h-28 items-end gap-2">
                        {revenueBars.map((b) => (
                          <div key={b.label} className="flex h-full flex-1 flex-col items-center gap-1">
                            <div className="flex w-full flex-1 items-end">
                              <div className="w-full rounded-t bg-indigo-500" style={{ height: `${b.value}%` }} />
                            </div>
                            <span className="text-[10px] text-slate-500">{b.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-300">Payment methods</p>
                      <div className="space-y-2">
                        {paymentSplit.map((p) => (
                          <div key={p.label}>
                            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400"><span>{p.label}</span><span>{p.value}%</span></div>
                            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${p.value}%` }} /></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-slate-500 dark:text-slate-400">
                        <tr><th className="py-1">Order</th><th>Cashier</th><th>Method</th><th>Total</th><th>Status</th></tr>
                      </thead>
                      <tbody className="text-slate-700 dark:text-slate-300">
                        {recentOrders.map((o) => (
                          <tr key={o.id} className="border-t border-slate-200 dark:border-slate-800">
                            <td className="py-1.5">{o.id}</td><td>{o.cashier}</td><td>{o.method}</td><td>{money(o.total)}</td>
                            <td className={o.status === 'Settled' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>{o.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Architecture */}
        <div className={`${card} mt-4`}>
          <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between p-5 text-left">
            <span className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white"><Database className="h-5 w-5 text-indigo-500" />Architecture & Engineering</span>
            {open ? <ChevronUp className="h-5 w-5 text-slate-500" /> : <ChevronDown className="h-5 w-5 text-slate-500" />}
          </button>
          {open && (
            <div className="grid gap-6 border-t border-slate-200 p-5 md:grid-cols-2 dark:border-slate-800">
              <div>
                <p className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">Django apps</p>
                <ul className="space-y-1.5">
                  {djangoApps.map((a) => (
                    <li key={a.name} className="text-sm text-slate-600 dark:text-slate-400">
                      <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-indigo-700 dark:bg-slate-800 dark:text-indigo-300">{a.name}</code> — {a.desc}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                {engineering.map((e) => (
                  <div key={e.title}>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{e.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{e.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Capability cards */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className={`${card} p-5`}>
            <Smartphone className="h-6 w-6 text-indigo-500" />
            <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">Responsive Design Systems</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Hand-built responsive CSS with a floating mobile liquid-pill navigation, so the terminal works on phones, tablets and counters alike.</p>
          </div>
          <div className={`${card} p-5`}>
            <Package className="h-6 w-6 text-emerald-500" />
            <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">Procurement & SMS Workflows</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Low-stock signals feed the restock flow, while the sms_reminder app sends timely reminders and alerts.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProjectsShowcase;
