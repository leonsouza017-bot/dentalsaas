'use client';

import { useEffect, useState } from 'react';

interface Patient {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3333/patients')
      .then((res) => res.json())
      .then((data) => {
        setPatients(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Título */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
          <p className="text-slate-500 text-sm mt-1">Resumo da sua clínica</p>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-sm text-slate-500 mb-1">Total de Pacientes</p>
            <p className="text-3xl font-bold text-slate-800">
              {loading ? '...' : patients.length}
            </p>
            <p className="text-xs text-green-600 mt-2">↑ Atualizado agora</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-sm text-slate-500 mb-1">Consultas Hoje</p>
            <p className="text-3xl font-bold text-slate-800">0</p>
            <p className="text-xs text-slate-400 mt-2">Nenhuma consulta hoje</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-sm text-slate-500 mb-1">Receita do Mês</p>
            <p className="text-3xl font-bold text-slate-800">R$ 0</p>
            <p className="text-xs text-slate-400 mt-2">Sem registros este mês</p>
          </div>

        </div>

        {/* Lista de pacientes */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Últimos Pacientes</h3>
            <button className="text-sm text-blue-600 hover:underline">
              Ver todos
            </button>
          </div>

          {loading ? (
            <div className="p-6 text-center text-slate-500 text-sm">
              Carregando pacientes...
            </div>
          ) : patients.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm">
              Nenhum paciente cadastrado ainda.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
                  <th className="px-6 py-3 font-medium">Nome</th>
                  <th className="px-6 py-3 font-medium">Telefone</th>
                  <th className="px-6 py-3 font-medium">Cadastrado em</th>
                </tr>
              </thead>
              <tbody>
                {patients.slice(0, 5).map((patient) => (
                  <tr key={patient.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                      {patient.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {patient.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(patient.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </main>
    </div>
  );
}