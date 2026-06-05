'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

interface Patient {
  id: string;
  name: string;
  email?: string;
  phone: string;
  createdAt: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/patients`)
      .then((res) => res.json())
      .then((data) => {
        setPatients(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const fetchPatients = () => {
    fetch(`${API_URL}/patients`)
      .then((res) => res.json())
      .then((data) => setPatients(Array.isArray(data) ? data : []));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !phone) {
      setError('Nome e telefone são obrigatórios');
      return;
    }

    setSaving(true);
    await fetch(`${API_URL}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email }),
    });

    setName('');
    setPhone('');
    setEmail('');
    setShowForm(false);
    setSaving(false);
    fetchPatients();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este paciente?')) return;
    await fetch(`${API_URL}/patients/${id}`, { method: 'DELETE' });
    fetchPatients();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Pacientes</h2>
          <p className="text-slate-500 text-sm mt-1">Gerencie os pacientes da clínica</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Novo Paciente
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <h3 className="font-semibold text-slate-800 mb-4">Cadastrar Novo Paciente</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome completo *</label>
              <input
                type="text"
                placeholder="Ex: João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Telefone *</label>
              <input
                type="text"
                placeholder="Ex: 11999999999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
              <input
                type="email"
                placeholder="Ex: joao@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && <p className="text-red-500 text-sm col-span-3">{error}</p>}

            <div className="col-span-3 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Salvar Paciente'}
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

      <div className="bg-white rounded-lg border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <p className="text-sm text-slate-500">
            {loading ? 'Carregando...' : `${patients.length} paciente(s) cadastrado(s)`}
          </p>
        </div>

        {loading ? (
          <div className="p-6 text-center text-slate-500 text-sm">Carregando pacientes...</div>
        ) : patients.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-sm">Nenhum paciente cadastrado ainda.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
                <th className="px-6 py-3 font-medium">Nome</th>
                <th className="px-6 py-3 font-medium">Telefone</th>
                <th className="px-6 py-3 font-medium">E-mail</th>
                <th className="px-6 py-3 font-medium">Cadastrado em</th>
                <th className="px-6 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{patient.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{patient.phone}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{patient.email || '—'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(patient.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDelete(patient.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}