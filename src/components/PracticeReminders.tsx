import { useState } from 'react';

interface Reminder {
  id: string;
  time: string;
  days: string[];
  enabled: boolean;
}

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function PracticeReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      time: '16:00',
      days: ['Mon', 'Wed', 'Fri'],
      enabled: true,
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTime, setNewTime] = useState('16:00');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon']);

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const addReminder = () => {
    const newReminder: Reminder = {
      id: Date.now().toString(),
      time: newTime,
      days: selectedDays,
      enabled: true,
    };
    setReminders([...reminders, newReminder]);
    setShowAddForm(false);
    setSelectedDays(['Mon']);
    setNewTime('16:00');
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">⏰ Practice Reminders</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          {showAddForm ? 'Cancel' : '+ Add Reminder'}
        </button>
      </div>

      {/* Add Reminder Form */}
      {showAddForm && (
        <div className="bg-purple-50 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Set Practice Time</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Practice Time
            </label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Repeat On
            </label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedDays.includes(day)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={addReminder}
            className="w-full py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors"
          >
            Save Reminder
          </button>
        </div>
      )}

      {/* Reminders List */}
      <div className="space-y-4">
        {reminders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg mb-2">No reminders set</p>
            <p className="text-sm">Add a reminder to stay on track with your practice!</p>
          </div>
        ) : (
          reminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                reminder.enabled
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                  : 'bg-gray-50 border-gray-300 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">⏰</div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">
                      {formatTime(reminder.time)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {reminder.days.join(', ')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleReminder(reminder.id)}
                    className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                      reminder.enabled
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-700'
                    }`}
                  >
                    {reminder.enabled ? 'On' : 'Off'}
                  </button>
                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <h3 className="font-semibold text-purple-900 mb-2">💡 Practice Tips:</h3>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• Set reminders for the same time each day to build a habit</li>
          <li>• Practice at least 15-20 minutes per session</li>
          <li>• Choose a time when you're least likely to be interrupted</li>
          <li>• Consistency is more important than duration</li>
        </ul>
      </div>

      {/* Streak Info */}
      <div className="mt-6 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-orange-900">🔥 Current Streak</h3>
            <p className="text-sm text-orange-700">Keep practicing to maintain your streak!</p>
          </div>
          <div className="text-4xl font-bold text-orange-600">7 days</div>
        </div>
      </div>
    </div>
  );
}
