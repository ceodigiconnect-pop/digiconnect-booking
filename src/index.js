import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ChevronRight, Download } from 'lucide-react';

const BookingSystem = () => {
  const [view, setView] = useState('booking');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const GAS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxFc2NIs6GvS-4dihVHRgKf6k0liBkwAIoXjQRCAsBxcOe4UNXYgPBn6Sbgtm67Zt3u/exec';
  
  const timeSlots = [
    { date: 'อังคาร 30 มิ.ย. 2569', dateKey: '2025-06-30', time: '15:00-15:30' },
    { date: 'อังคาร 30 มิ.ย. 2569', dateKey: '2025-06-30', time: '16:00-16:30' },
    { date: 'อังคาร 30 มิ.ย. 2569', dateKey: '2025-06-30', time: '17:00-17:30' },
    { date: 'พุธ 1 ก.ค. 2569', dateKey: '2025-07-01', time: '10:00-10:30' },
    { date: 'พุธ 1 ก.ค. 2569', dateKey: '2025-07-01', time: '11:00-11:30' },
    { date: 'พุธ 1 ก.ค. 2569', dateKey: '2025-07-01', time: '14:00-14:30' },
    { date: 'พุธ 1 ก.ค. 2569', dateKey: '2025-07-01', time: '15:00-15:30' },
    { date: 'พุธ 1 ก.ค. 2569', dateKey: '2025-07-01', time: '16:00-16:30' },
    { date: 'พฤหัส 2 ก.ค. 2569', dateKey: '2025-07-02', time: '10:00-10:30' },
    { date: 'พฤหัส 2 ก.ค. 2569', dateKey: '2025-07-02', time: '11:00-11:30' },
    { date: 'พฤหัส 2 ก.ค. 2569', dateKey: '2025-07-02', time: '14:00-14:30' },
    { date: 'พฤหัส 2 ก.ค. 2569', dateKey: '2025-07-02', time: '15:00-15:30' },
    { date: 'พฤหัส 2 ก.ค. 2569', dateKey: '2025-07-02', time: '16:00-16:30' },
  ];

  useEffect(() => {
    const stored = localStorage.getItem('digiconnect_bookings');
    if (stored) setBookings(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('digiconnect_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const isSlotBooked = (dateKey, time) => {
    return bookings.some(b => b.dateKey === dateKey && b.time === time);
  };

 async function handleBookingSubmit(data) {
  setLoading(true);
  try {
    const response = await fetch(GAS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'data=' + encodeURIComponent(JSON.stringify(data))
    });

    setBookings(prev => [...prev, { ...data, id: Date.now() }]);
    setSuccessMessage('✓ จองสำเร็จ! เราจะติดต่อคุณเร็ว ๆ นี้');
    setTimeout(() => setSuccessMessage(''), 5000);
    setLoading(false);

  } catch (error) {
    console.error('Error:', error);
    setSuccessMessage('✗ เกิดข้อผิดพลาด');
    setLoading(false);
  }
}

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">DigiConnect Consulting</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setView('booking')}
                className={`px-4 py-2 rounded text-sm font-medium transition ${
                  view === 'booking'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Booking
              </button>
              <button
                onClick={() => setView('admin')}
                className={`px-4 py-2 rounded text-sm font-medium transition ${
                  view === 'admin'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            {view === 'booking' ? 'จองเวลาปรึกษาฟรี' : 'จัดการการจอง'}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {view === 'booking' ? (
          <BookingForm
            timeSlots={timeSlots}
            isSlotBooked={isSlotBooked}
            onSubmit={handleBookingSubmit}
            loading={loading}
            successMessage={successMessage}
          />
        ) : (
          <AdminPanel 
  bookings={bookings} 
  timeSlots={timeSlots}
  onDelete={(idx) => setBookings(bookings.filter((_, i) => i !== idx))}
/>
        )}
      </div>
    </div>
  );
};

const BookingForm = ({ timeSlots, isSlotBooked, onSubmit, loading, successMessage }) => {
  const [form, setForm] = useState({
    name: '',
    position: '',
    company: '',
    product: '',
    tiktok: '',
    target: '',
    lineId: '',
    phone: '',
    selectedSlot: null,
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Required';
    if (!form.position.trim()) newErrors.position = 'Required';
    if (!form.company.trim()) newErrors.company = 'Required';
    if (!form.product.trim()) newErrors.product = 'Required';
    if (!form.tiktok.trim()) newErrors.tiktok = 'Required';
    if (!form.target.trim()) newErrors.target = 'Required';
    if (!form.lineId.trim()) newErrors.lineId = 'Required';
    if (!form.phone.trim()) newErrors.phone = 'Required';
    if (!form.selectedSlot) newErrors.selectedSlot = 'Select a time slot';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const [date, time] = form.selectedSlot.split('|');
    const dateKey = timeSlots.find(s => s.date === date && s.time === time)?.dateKey;

    const data = {
      name: form.name,
      position: form.position,
      company: form.company,
      product: form.product,
      tiktok: form.tiktok,
      target: form.target,
      lineId: form.lineId,
      phone: form.phone,
      date,
      time,
      dateKey,
      submittedAt: new Date().toISOString(),
    };

    await onSubmit(data);

    setForm({
      name: '',
      position: '',
      company: '',
      product: '',
      tiktok: '',
      target: '',
      lineId: '',
      phone: '',
      selectedSlot: null,
    });
  };

  const groupedSlots = timeSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-lg p-8 max-w-2xl">
      {successMessage && (
        <div className={`mb-6 p-4 rounded text-sm font-medium ${
          successMessage.startsWith('✓')
            ? 'bg-green-50 text-green-800'
            : 'bg-red-50 text-red-800'
        }`}>
          {successMessage}
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="ชื่อ"
            value={form.name}
            onChange={(v) => setForm({...form, name: v})}
            error={errors.name}
          />
          <InputField
            label="ตำแหน่ง"
            value={form.position}
            onChange={(v) => setForm({...form, position: v})}
            error={errors.position}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="บริษัท"
            value={form.company}
            onChange={(v) => setForm({...form, company: v})}
            error={errors.company}
          />
          <InputField
            label="ผลิตภัณฑ์/บริการ"
            value={form.product}
            onChange={(v) => setForm({...form, product: v})}
            error={errors.product}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="TikTok"
            value={form.tiktok}
            onChange={(v) => setForm({...form, tiktok: v})}
            error={errors.tiktok}
          />
          <InputField
            label="Target Market"
            value={form.target}
            onChange={(v) => setForm({...form, target: v})}
            error={errors.target}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="LINE ID"
            value={form.lineId}
            onChange={(v) => setForm({...form, lineId: v})}
            error={errors.lineId}
          />
          <InputField
            label="เบอร์โทร"
            type="tel"
            value={form.phone}
            onChange={(v) => setForm({...form, phone: v})}
            error={errors.phone}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            เลือกเวลา {errors.selectedSlot && <span className="text-red-600">*</span>}
          </label>
          <div className="space-y-3">
            {Object.entries(groupedSlots).map(([date, slots]) => (
              <div key={date}>
                <div className="text-xs font-semibold text-gray-600 mb-2">{date}</div>
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((slot) => {
                    const booked = isSlotBooked(slot.dateKey, slot.time);
                    const slotKey = `${slot.date}|${slot.time}`;
                    return (
                      <button
                        key={slotKey}
                        type="button"
                        onClick={() => !booked && setForm({...form, selectedSlot: slotKey})}
                        disabled={booked}
                        className={`py-2 px-3 rounded text-sm font-medium transition ${
                          booked
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : form.selectedSlot === slotKey
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gray-900 text-white py-3 rounded font-medium hover:bg-gray-800 disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          {loading ? 'กำลังส่ง...' : 'จองเวลา'}
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

const InputField = ({ label, type = 'text', value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-900 mb-1">
      {label} {error && <span className="text-red-600">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 rounded border text-sm transition ${
        error
          ? 'border-red-300 bg-red-50'
          : 'border-gray-300 bg-white hover:border-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900'
      }`}
    />
  </div>
);

const AdminPanel = ({ bookings, timeSlots }) => {
  const exportCSV = () => {
    const headers = ['ชื่อ', 'ตำแหน่ง', 'บริษัท', 'ผลิตภัณฑ์', 'TikTok', 'Target', 'LINE ID', 'เบอร์โทร', 'วันเวลา', 'เวลาส่ง'];
    const rows = bookings.map(b => [
      b.name,
      b.position,
      b.company,
      b.product,
      b.tiktok,
      b.target,
      b.lineId,
      b.phone,
      `${b.date} ${b.time}`,
      new Date(b.submittedAt).toLocaleString('th-TH'),
    ]);

    const bom = '\uFEFF';
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(cell => {
        const escaped = String(cell).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')),
    ].join('\n');

    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const bookedCount = bookings.length;
  const availableCount = timeSlots.length - bookedCount;

  return (
    <div className="bg-white rounded-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">การจองทั้งหมด</h2>
          <div className="flex gap-6 text-sm">
            <span className="text-gray-600">จอง: <span className="font-semibold text-gray-900">{bookedCount}</span></span>
            <span className="text-gray-600">ว่าง: <span className="font-semibold text-gray-900">{availableCount}</span></span>
          </div>
        </div>
        <button
          onClick={exportCSV}
          className="bg-gray-900 text-white px-4 py-2 rounded font-medium hover:bg-gray-800 transition flex items-center gap-2"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">ยังไม่มีการจองในขณะนี้</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">ชื่อ</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">บริษัท</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">ผลิตภัณฑ์</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">TikTok</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">วันเวลา</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">LINE ID</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{booking.name}</td>
                  <td className="py-3 px-4 text-gray-700">{booking.company}</td>
                  <td className="py-3 px-4 text-gray-700">{booking.product}</td>
                  <td className="py-3 px-4 text-gray-700">{booking.tiktok}</td>
                  <td className="py-3 px-4 text-gray-700">{booking.date} {booking.time}</td>
                  <td className="py-3 px-4 text-gray-700">{booking.lineId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<BookingSystem />);
