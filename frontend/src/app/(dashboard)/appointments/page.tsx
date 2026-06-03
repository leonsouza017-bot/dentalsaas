'use client';

import { useEffect, useState } from 'react';

interface Patient {
  id: string;
  name: string;
}

interface Appointment {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  status: string;
  price?: number;
  patient: Patient;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [patientId, setPatientId] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [price, setPrice] = useState('');

  const fetchAppointments = () => {
    fetch('http://localhost:3333/appointments')
      .then((res) => res.json())
      .then((data) => {
        setAppointments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetch('http://localhost:3333/patients')
      .then((res) => res.json())
      .then((data) => setPatients(Array.isArray(data) ? data : []));

    fetchAppointments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !patientId || !startAt || !endAt) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    setSaving(true);
    await fetch('http://localhost:3333/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        patientId,
        startAt: new Date(startAt).toISOString(),
        endAt: new Date(endAt).toISOString(),
        price: price ? parseFloat(price) : null,
      }),
    });

    setTitle('');
    setPatientId('');
    setStartAt('');
    setEndAt('');
    setPrice('');
    setShowForm(false);
    setSaving(false);
    fetchAppointments();
  };

  const statusLabel: Record<string, string> = {
    SCHEDULED: 'Agendado',
    CONFIRMED: 'Confirmado',
    COMPLETED: 'Concluído',
    CANCELLED: 'Cancelado',
  };

  const statusColor: Record<string, string> = {
    SCHEDULED: 'bg-blue-100 text-blue-700',
    CONFIRMED: 'bg-green-100 text-green-700',
    COMPLETED: 'bg-slate-100 text-slate-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-slate-50">

      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Título */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Agenda</h2>
            <p className="text-slate-500 text-sm mt-1">Gerencie as consultas da clínica</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Nova Consulta
          </button>
        </div>

        {/* Formulário */}
        {showForm && (
          <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
            <h3 className="font-semibold text-slate-800 mb-4">Agendar Nova Consulta</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título *</label>
                <input
                  type="text"
                  placeholder="Ex: Limpeza, Extração..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Paciente *</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um paciente</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Início *</label>
                <input
                  type="datetime-local"
                  value={startAt}
                  onChange={(e) => setStartAt(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fim *</label>
                <input
                  type="datetime-local"
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Valor (R$)</label>
                <input
                  type="number"
                  placeholder="Ex: 150.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm col-span-2">{error}</p>
              )}

              <div className="col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Salvar Consulta'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-slate-100 text-slate-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Tabela */}
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-200">
            <p className="text-sm text-slate-500">
              {loading ? 'Carregando...' : `${appointments.length} consulta(s) agendada(s)`}
            </p>
          </div>

          {loading ? (
            <div className="p-6 text-center text-slate-500 text-sm">Carregando consultas...</div>
          ) : appointments.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm">Nenhuma consulta agendada ainda.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
                  <th className="px-6 py-3 font-medium">Título</th>
                  <th className="px-6 py-3 font-medium">Paciente</th>
                  <th className="px-6 py-3 font-medium">Início</th>
                  <th className="px-6 py-3 font-medium">Fim</th>
                  <th className="px-6 py-3 font-medium">Valor</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{apt.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{apt.patient?.name || '—'}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(apt.startAt).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(apt.endAt).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {apt.price ? `R$ ${Number(apt.price).toFixed(2)}` : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[apt.status] || 'bg-slate-100 text-slate-700'}`}>
                        {statusLabel[apt.status] || apt.status}
                      </span>
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