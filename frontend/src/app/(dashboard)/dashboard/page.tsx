"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface Patient {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  dueDate: string;
}

interface Appointment {
  id: string;
  title: string;
  startAt: string;
  status: string;
  patient: { name: string };
}

export default function DashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    Promise.all([
      apiFetch("/patients"),
      apiFetch("/financial"),
      apiFetch("/appointments"),
    ]).then(([p, t, a]) => {
      setPatients(Array.isArray(p) ? p : []);
      setTransactions(Array.isArray(t) ? t : []);
      setAppointments(Array.isArray(a) ? a : []);
      setLoading(false);
    });
  }, []);

  const handleSubscribe = async () => {
    setSubscribing(true);
    try {
      const data = await apiFetch("/payments/checkout", { method: "POST" });
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Erro ao iniciar pagamento.");
    }
    setSubscribing(false);
  };

  // Dados para o gráfico de receita dos últimos 6 meses
  const revenueData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const month = date.toLocaleString("pt-BR", { month: "short" });
    const year = date.getFullYear();
    const monthTransactions = transactions.filter((t) => {
      const d = new Date(t.dueDate);
      return (
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === year &&
        t.type === "INCOME"
      );
    });
    const total = monthTransactions.reduce(
      (acc, t) => acc + Number(t.amount),
      0,
    );
    return {
      month: month.charAt(0).toUpperCase() + month.slice(1),
      receita: total,
    };
  });

  // Dados para gráfico de pacientes por mês
  const patientsData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const month = date.toLocaleString("pt-BR", { month: "short" });
    const count = patients.filter((p) => {
      const d = new Date(p.createdAt);
      return (
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
      );
    }).length;
    return {
      month: month.charAt(0).toUpperCase() + month.slice(1),
      pacientes: count,
    };
  });

  const totalRevenue = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const todayAppointments = appointments.filter((a) => {
    const today = new Date().toDateString();
    return new Date(a.startAt).toDateString() === today;
  });

  const upcomingAppointments = appointments
    .filter(
      (a) => new Date(a.startAt) >= new Date() && a.status === "SCHEDULED",
    )
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Banner assinatura */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-2xl p-5 flex items-center justify-between shadow-lg shadow-blue-500/20">
        <div>
          <p className="text-white font-bold text-base">
            ⚡ Denty Pro — R$ 197/mês
          </p>
          <p className="text-blue-100 text-sm mt-0.5">
            Pacientes ilimitados · WhatsApp automático · Suporte prioritário
          </p>
        </div>
        <button
          onClick={handleSubscribe}
          disabled={subscribing}
          className="bg-white text-blue-600 px-5 py-2 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors disabled:opacity-50 flex-shrink-0 shadow-md"
        >
          {subscribing ? "Aguarde..." : "Assinar agora →"}
        </button>
      </div>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500 text-sm mt-0.5">
          Visão geral da sua clínica
        </p>
      </div>

      {/* Cards KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Pacientes
            </p>
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-lg">
              👥
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800">
            {loading ? "—" : patients.length}
          </p>
          <p className="text-xs text-green-500 mt-1 font-medium">
            ↑ Total cadastrados
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Hoje
            </p>
            <div className="w-9 h-9 bg-cyan-50 rounded-xl flex items-center justify-center text-lg">
              📅
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800">
            {loading ? "—" : todayAppointments.length}
          </p>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Consultas hoje
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Receita
            </p>
            <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center text-lg">
              💰
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {loading
              ? "—"
              : `R$${totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`}
          </p>
          <p className="text-xs text-green-500 mt-1 font-medium">
            ↑ Total recebido
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Saldo
            </p>
            <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center text-lg">
              📈
            </div>
          </div>
          <p
            className={`text-3xl font-bold ${totalRevenue - totalExpense >= 0 ? "text-slate-800" : "text-red-500"}`}
          >
            {loading
              ? "—"
              : `R$${(totalRevenue - totalExpense).toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`}
          </p>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Receita - Despesas
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gráfico de receita */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                Receita Mensal
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Últimos 6 meses</p>
            </div>
            <span className="text-xs bg-green-50 text-green-600 font-semibold px-2.5 py-1 rounded-full">
              R$ {totalRevenue.toLocaleString("pt-BR")}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
              formatter={(value: unknown) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Receita']}
              />
              <Area
                type="monotone"
                dataKey="receita"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#colorReceita)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de pacientes */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                Novos Pacientes
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Últimos 6 meses</p>
            </div>
            <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-2.5 py-1 rounded-full">
              {patients.length} total
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={patientsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
                formatter={(value: unknown) => [Number(value), 'Pacientes']}
              />
              <Bar dataKey="pacientes" fill="#06b6d4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Próximas consultas + Últimos pacientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Próximas consultas */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">
              Próximas Consultas
            </h3>
            <a
              href="/appointments"
              className="text-xs text-blue-600 font-medium hover:underline"
            >
              Ver agenda →
            </a>
          </div>
          {loading ? (
            <div className="p-6 text-center text-slate-400 text-sm">
              Carregando...
            </div>
          ) : upcomingAppointments.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm">
              Nenhuma consulta agendada.
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">
                      {apt.patient?.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {apt.patient?.name || "—"}
                      </p>
                      <p className="text-xs text-slate-400">{apt.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-600">
                      {new Date(apt.startAt).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(apt.startAt).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Últimos pacientes */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">
              Últimos Pacientes
            </h3>
            <a
              href="/patients"
              className="text-xs text-blue-600 font-medium hover:underline"
            >
              Ver todos →
            </a>
          </div>
          {loading ? (
            <div className="p-6 text-center text-slate-400 text-sm">
              Carregando...
            </div>
          ) : patients.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm">
              Nenhum paciente cadastrado.
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {patients.slice(0, 5).map((patient) => (
                <div
                  key={patient.id}
                  className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {patient.name}
                      </p>
                      <p className="text-xs text-slate-400">{patient.phone}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">
                    {new Date(patient.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
