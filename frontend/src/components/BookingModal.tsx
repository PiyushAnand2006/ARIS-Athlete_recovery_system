import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { ClinicalPartner } from '../types';

interface BookingModalProps {
  clinic: ClinicalPartner | null;
  onClose: () => void;
  onConfirm: (clinicId: string, date: string, time: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  clinic,
  onClose,
  onConfirm,
}) => {
  const [date, setDate] = useState('2023-10-25');
  const [time, setTime] = useState('16:00');
  const [submitted, setSubmitted] = useState(false);

  if (!clinic) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(clinic.id, date, time);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#13151A] border border-[#232733] rounded-2xl p-6 w-full max-w-md relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-[#D2FF00] mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-white">Booking Confirmed!</h3>
            <p className="text-sm text-gray-400">
              Your session at <span className="text-[#D2FF00]">{clinic.name}</span> has been synced with your ARIS profile.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="text-[10px] font-bold text-[#D2FF00] uppercase tracking-wider mb-1">
                CLINICAL RESERVATION
              </div>
              <h3 className="text-xl font-bold text-white">{clinic.name}</h3>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#D2FF00]" /> {clinic.distance} • {clinic.type}
              </p>
            </div>

            <div className="p-3 bg-[#1A1D24] rounded-xl text-xs text-gray-300 border border-[#282D3B]">
              {clinic.description}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#D2FF00]" /> Select Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#181B22] border border-[#2A2E3B] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D2FF00]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#D2FF00]" /> Preferred Time
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-[#181B22] border border-[#2A2E3B] rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#D2FF00]"
                >
                  <option value="09:00">09:00 AM - Morning Slot</option>
                  <option value="12:00">12:00 PM - Midday Session</option>
                  <option value="16:00">04:00 PM - Post-Training Slot</option>
                  <option value="18:30">06:30 PM - Evening Recovery</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#D2FF00] hover:bg-[#c2ef00] text-[#0B0C0E] font-extrabold uppercase rounded-xl transition-all shadow-[0_0_20px_rgba(210,255,0,0.3)] hover:scale-[1.01]"
            >
              CONFIRM BOOKING →
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
