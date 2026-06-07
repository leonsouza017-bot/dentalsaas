'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

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

const STATUS_LABEL: Record<string, string> = {
  SCHEDULED: 'Agendado',
  CONFIRMED: 'Confirmado',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
};

const STATUS_COLOR: Record<string, string> = {
  SCHEDULED: 'bg-blue-100 text-blue-700 border-blue-200',
  CONFIRMED: 'bg-green-100 text-green-700 border-green-200',
  COMPLETED: 'bg-slate-100 text-slate-600 border-slate-200',
  CANCELLED: 'bg-red-100 text-red-600 border-red-200',
};

const STATUS_DOT: Record<string, string> = {
  SCHEDULED: 'bg-blue-500',
  CONFIRMED: 'bg-green-500',
  COMPLETED: 'bg-slate-400',
  CANCELLED: 'bg-red-400',
};

const HOURS = Array.from({ length: 20 }, (_, i) => {
  const h = Math.floor(i / 2) + 8;
  const m = i % 2 === 0 ? '00' : '30';
  return `${String(h).padStart(2, '0')}:${m}`;
});

const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState<'month' | 'day'>('month');

  const [title, setTitle] = useState('');
  const [patientId, setPatientId] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [price, setPrice] = useState('');

  const fetchAll = () => {
    Promise.all([apiFetch('/appointments'), apiFetch('/patients')]).then(([a, p]) => {
      setAppointments(Array.isArray(a) ? a : []);
      setPatients(Array.isArray(p) ? p : []);
      setLoading(false);
    });
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title || !patientId || !startAt || !endAt) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }
    setSaving(true);
    await apiFetch('/appointments', {
      method: 'POST',
      body: JSON.stringify({
        title, patientId,
        startAt: new Date(startAt).toISOString(),
        endAt: new Date(endAt).toISOString(),
        price: price ? parseFloat(price) : null,
      }),
    });
    setTitle(''); setPatientId(''); setStartAt(''); setEndAt(''); setPrice('');
    setShowForm(false);
    setSaving(false);
    fetchAll();
  };

  // Dias do mês atual
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const days = getDaysInMonth(currentMonth);

  const getAppointmentsForDay = (date: Date) =>
    appointments.filter((a) => {
      const d = new Date(a.startAt);
      return d.toDateString() === date.toDateString();
    });

  const selectedDayAppointments = getAppointmentsForDay(selectedDate);

  const isToday = (date: Date) => date.toDateString() === new Date().toDateString();
  const isSelected = (date: Date) => date.toDateString() === selectedDate.toDateString();

  const prevMonth = () => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() - 1);
    setCurrentMonth(d);
  };

  const nextMonth = () => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() + 1);
    setCurrentMonth(d);
  };

  const getAppointmentForHour = (hour: string) => {
    return selectedDayAppointments.find((a) => {
      const h = new Date(a.startAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      return h === hour;
    });
  };

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Agenda</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setView('month')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${view === 'month' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Mês
            </button>
            <button
              onClick={() => setView('day')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${view === 'day' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Dia
            </button>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-md shadow-blue-500/20"
          >
            + Nova Consulta
          </button>
        </div>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-5">Agendar Nova Consulta</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Título *</label>
              <input type="text" placeholder="Ex: Limpeza, Extração..." value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Paciente *</label>
              <select value={patientId} onChange={(e) => setPatientId(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Selecione um paciente</option>
                {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Valor (R$)</label>
              <input type="number" placeholder="Ex: 150.00" value={price} onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Início *</label>
              <input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Fim *</label>
              <input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            {error && <p className="text-red-500 text-sm col-span-full">{error}</p>}

            <div className="col-span-full flex gap-3">
              <button type="submit" disabled={saving}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50">
                {saving ? 'Salvando...' : 'Salvar Consulta'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Calendário */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">

          {/* Navegação do mês */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-800 text-base">
              {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors">
                ←
              </button>
              <button onClick={() => { setCurrentMonth(new Date()); setSelectedDate(new Date()); }} className="px-3 h-8 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                Hoje
              </button>
              <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors">
                →
              </button>
            </div>
          </div>

          {/* Dias da semana */}
          <div className="grid grid-cols-7 mb-2">
            {WEEKDAYS.map((w) => (
              <div key={w} className="text-center text-xs font-semibold text-slate-400 py-2">{w}</div>
            ))}
          </div>

          {/* Grid de dias */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              if (!day) return <div key={i} />;
              const dayApts = getAppointmentsForDay(day);
              return (
                <button
                  key={i}
                  onClick={() => { setSelectedDate(day); setView('day'); }}
                  className={`
                    relative aspect-square flex flex-col items-center justify-start pt-1.5 rounded-xl text-sm font-medium transition-all hover:bg-slate-50
                    ${isSelected(day) ? 'bg-blue-600 text-white hover:bg-blue-600 shadow-md shadow-blue-500/30' : ''}
                    ${isToday(day) && !isSelected(day) ? 'border-2 border-blue-500 text-blue-600' : ''}
                    ${!isSelected(day) && !isToday(day) ? 'text-slate-700' : ''}
                  `}
                >
                  {day.getDate()}
                  {dayApts.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dayApts.slice(0, 3).map((a, j) => (
                        <div key={j} className={`w-1 h-1 rounded-full ${isSelected(day) ? 'bg-white' : STATUS_DOT[a.status] || 'bg-blue-500'}`} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legenda */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
            {Object.entries(STATUS_LABEL).map(([key, label]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${STATUS_DOT[key]}`} />
                <span className="text-xs text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Painel do dia */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-800 text-sm">
              {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' })}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedDayAppointments.length} consulta(s)
            </p>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
            {loading ? (
              <div className="p-6 text-center text-slate-400 text-sm">Carregando...</div>
            ) : (
              <div className="divide-y divide-slate-50">
                {HOURS.map((hour) => {
                  const apt = getAppointmentForHour(hour);
                  return (
                    <div key={hour} className={`flex gap-3 px-4 py-2.5 ${apt ? 'bg-blue-50/50' : 'hover:bg-slate-50'} transition-colors`}>
                      <span className="text-xs text-slate-400 w-10 flex-shrink-0 mt-0.5 font-mono">{hour}</span>
                      {apt ? (
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                            <p className="text-sm font-semibold text-slate-800 truncate">{apt.patient?.name}</p>
                          </div>
                          <p className="text-xs text-slate-500 ml-3.5 truncate">{apt.title}</p>
                          <span className={`inline-flex mt-1 ml-3.5 text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLOR[apt.status]}`}>
                            {STATUS_LABEL[apt.status]}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300 flex-1">Disponível</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lista completa */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">Todas as Consultas</h3>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">{appointments.length} total</span>
        </div>

        {loading ? (
          <div className="p-6 text-center text-slate-400 text-sm">Carregando...</div>
        ) : appointments.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">Nenhuma consulta agendada ainda.</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {appointments.map((apt) => (
              <div key={apt.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {apt.patient?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{apt.patient?.name || '—'}</p>
                    <p className="text-xs text-slate-400">{apt.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-medium text-slate-600">
                      {new Date(apt.startAt).toLocaleDateString('pt-BR')}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(apt.startAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {apt.price && (
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full hidden md:block">
                      R$ {Number(apt.price).toFixed(2)}
                    </span>
                  )}
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${STATUS_COLOR[apt.status] || 'bg-slate-100 text-slate-600'}`}>
                    {STATUS_LABEL[apt.status] || apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}