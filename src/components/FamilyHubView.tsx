import React, { useState } from 'react';
import { useFamily } from '../context/FamilyContext';
import { 
  Users, 
  Vote, 
  Calendar, 
  ShieldCheck, 
  CheckSquare, 
  Plus, 
  Heart, 
  MapPin, 
  Check, 
  Sparkles, 
  BellRing,
  ShoppingBag,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SharedTodo {
  id: string;
  text: string;
  completed: boolean;
  addedBy: string;
}

export const FamilyHubView: React.FC = () => {
  const { 
    polls, 
    votePoll, 
    createPoll, 
    events, 
    addEvent, 
    checkIns, 
    updateCheckIn, 
    currentUser 
  } = useFamily();

  const [activeSection, setActiveSection] = useState<'polls' | 'checkin' | 'calendar' | 'groceries'>('polls');
  
  // New Poll state
  const [showNewPollModal, setShowNewPollModal] = useState(false);
  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOption1, setNewPollOption1] = useState('');
  const [newPollOption2, setNewPollOption2] = useState('');
  const [newPollOption3, setNewPollOption3] = useState('');

  // New Event state
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');

  // Shared Grocery / List state
  const [groceries, setGroceries] = useState<SharedTodo[]>([
    { id: '1', text: 'Fresh Milk (2 Liters) 🥛', completed: true, addedBy: 'Ammi' },
    { id: '2', text: 'Tea leaves & Green Cardamom ☕', completed: false, addedBy: 'Abu' },
    { id: '3', text: 'Dadi Jan Blood Pressure Medicine 💊', completed: false, addedBy: 'Ammi' },
    { id: '4', text: 'Fresh Mangoes / Fruits for guests 🥭', completed: false, addedBy: 'Muneeb' },
  ]);
  const [newGroceryText, setNewGroceryText] = useState('');

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPollQuestion.trim() || !newPollOption1.trim() || !newPollOption2.trim()) return;

    const options = [newPollOption1, newPollOption2];
    if (newPollOption3.trim()) options.push(newPollOption3.trim());

    createPoll(newPollQuestion.trim(), options);
    confetti({ particleCount: 35, spread: 50 });

    setNewPollQuestion('');
    setNewPollOption1('');
    setNewPollOption2('');
    setNewPollOption3('');
    setShowNewPollModal(false);
  };

  const handleAddGrocery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroceryText.trim()) return;

    const newItem: SharedTodo = {
      id: `todo-${Date.now()}`,
      text: newGroceryText.trim(),
      completed: false,
      addedBy: currentUser.name.split(' ')[0],
    };
    setGroceries(prev => [newItem, ...prev]);
    setNewGroceryText('');
  };

  const toggleGrocery = (id: string) => {
    setGroceries(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteGrocery = (id: string) => {
    setGroceries(prev => prev.filter(item => item.id !== id));
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDate.trim()) return;

    addEvent(eventTitle.trim(), eventDate.trim(), 'celebration');
    confetti({ particleCount: 40, spread: 60 });
    setEventTitle('');
    setEventDate('');
    setShowNewEventModal(false);
  };

  return (
    <div id="family-hub-container" className="flex flex-col h-full bg-neutral-950 overflow-y-auto select-none p-4">
      {/* Header */}
      <div className="pb-3 border-b border-neutral-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-400" />
          Family Hub & Features
        </h2>
        <p className="text-xs text-neutral-400">
          Decisions, safety check-in, birthdays and shared family errands
        </p>
      </div>

      {/* Feature Navigation Tabs */}
      <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'polls', label: 'Family Polls', icon: <Vote className="w-3.5 h-3.5" /> },
          { id: 'checkin', label: 'Safety Check-In', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
          { id: 'calendar', label: 'Important Dates', icon: <Calendar className="w-3.5 h-3.5" /> },
          { id: 'groceries', label: 'Shared Errands', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
        ].map(item => (
          <button
            key={item.id}
            id={`hub-tab-${item.id}`}
            onClick={() => setActiveSection(item.id as any)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeSection === item.id
                ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* SECTION 1: FAMILY POLLS */}
      {activeSection === 'polls' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-400">
              Active Family Polls ({polls.length})
            </span>
            <button
              id="btn-create-poll-open"
              onClick={() => setShowNewPollModal(true)}
              className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              New Poll
            </button>
          </div>

          {polls.map((poll) => {
            const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes.length, 0);

            return (
              <div
                key={poll.id}
                id={`poll-card-${poll.id}`}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-bold text-white leading-snug">
                    {poll.question}
                  </h4>
                  <span className="text-[10px] text-neutral-500 shrink-0 ml-2">
                    {poll.createdAt}
                  </span>
                </div>

                {/* Options List */}
                <div className="space-y-2">
                  {poll.options.map((opt) => {
                    const isMyVote = opt.votes.includes(currentUser.id);
                    const percentage = totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0;

                    return (
                      <button
                        key={opt.id}
                        id={`poll-opt-${opt.id}`}
                        onClick={() => votePoll(poll.id, opt.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all relative overflow-hidden group ${
                          isMyVote
                            ? 'bg-emerald-950/40 border-emerald-500/60'
                            : 'bg-neutral-800/60 border-neutral-700/50 hover:border-neutral-600'
                        }`}
                      >
                        {/* Progress Bar Background */}
                        <div
                          className="absolute inset-y-0 left-0 bg-emerald-500/15 transition-all duration-500 rounded-xl"
                          style={{ width: `${percentage}%` }}
                        />

                        <div className="relative flex items-center justify-between z-10">
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isMyVote ? 'border-emerald-400 bg-emerald-500 text-neutral-950' : 'border-neutral-600'
                            }`}>
                              {isMyVote && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <span className="text-xs font-semibold text-neutral-200">
                              {opt.text}
                            </span>
                          </div>
                          <span className="text-xs font-mono font-bold text-emerald-400">
                            {percentage}% ({opt.votes.length})
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="text-[10px] text-neutral-500 flex items-center justify-between pt-1">
                  <span>{totalVotes} total family votes</span>
                  <span className="text-emerald-400/80">Tap an option to cast vote</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SECTION 2: SAFETY CHECK-IN */}
      {activeSection === 'checkin' && (
        <div className="space-y-4">
          {/* Quick Check-in actions for Current User */}
          <div className="bg-gradient-to-br from-emerald-950/40 to-neutral-900 border border-emerald-500/30 rounded-2xl p-4">
            <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Update Your Family Status
            </h4>
            <p className="text-xs text-neutral-400 mb-3">
              Let Ammi and family know you are safe with one tap!
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-checkin-home"
                onClick={() => {
                  updateCheckIn('Safe at Home 🏡', 'safe');
                  confetti({ particleCount: 20 });
                }}
                className="p-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-bold text-left transition-all active:scale-98"
              >
                🏡 Safe at Home
              </button>
              <button
                id="btn-checkin-reached"
                onClick={() => {
                  updateCheckIn('Reached Destination Safely ✅', 'safe');
                  confetti({ particleCount: 20 });
                }}
                className="p-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-bold text-left transition-all active:scale-98"
              >
                ✅ Reached Safely
              </button>
              <button
                id="btn-checkin-traveling"
                onClick={() => updateCheckIn('On the way / In transit 🚗', 'traveling')}
                className="p-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 rounded-xl text-xs font-bold text-left transition-all active:scale-98"
              >
                🚗 On the Way
              </button>
              <button
                id="btn-checkin-custom"
                onClick={() => updateCheckIn('At University Library 📚', 'safe')}
                className="p-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-xl text-xs font-bold text-left transition-all active:scale-98"
              >
                📚 In Library / Office
              </button>
            </div>
          </div>

          {/* Family Status Feed */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-400 mb-3">
              Latest Family Check-ins
            </h4>
            <div className="space-y-2">
              {checkIns.map((ci, idx) => (
                <div
                  key={idx}
                  className="bg-neutral-900 border border-neutral-800 p-3 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={ci.userAvatar}
                      alt={ci.userName}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-700"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{ci.userName}</p>
                      <p className="text-xs text-emerald-400 font-medium">{ci.statusText}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-500">{ci.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: CALENDAR & BIRTHDAYS */}
      {activeSection === 'calendar' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-neutral-400">
              Upcoming Celebrations
            </span>
            <button
              onClick={() => setShowNewEventModal(true)}
              className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Event
            </button>
          </div>

          <div className="space-y-2.5">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="bg-neutral-900 border border-neutral-800 p-4 rounded-2xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-lg">
                    {ev.type === 'birthday' ? '🎂' : ev.type === 'anniversary' ? '💍' : '🎉'}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{ev.title}</h5>
                    <p className="text-[11px] text-neutral-400">{ev.date}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                    in {ev.daysRemaining} days
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: SHARED GROCERY / ERRANDS */}
      {activeSection === 'groceries' && (
        <div className="space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              Shared Family Errands & Groceries
            </h4>
            <p className="text-xs text-neutral-400 mb-3">
              Add items so whoever goes to the market can buy them!
            </p>

            <form onSubmit={handleAddGrocery} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="e.g. Bread, Eggs, Yogurt..."
                value={newGroceryText}
                onChange={(e) => setNewGroceryText(e.target.value)}
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={!newGroceryText.trim()}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-neutral-950 font-bold rounded-xl text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </form>

            <div className="space-y-2">
              {groceries.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    item.completed
                      ? 'bg-neutral-900/60 border-neutral-800/40 opacity-60'
                      : 'bg-neutral-800/80 border-neutral-700/60'
                  }`}
                >
                  <div
                    onClick={() => toggleGrocery(item.id)}
                    className="flex items-center gap-3 cursor-pointer flex-1"
                  >
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                      item.completed
                        ? 'bg-emerald-500 border-emerald-500 text-neutral-950'
                        : 'border-neutral-600'
                    }`}>
                      {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <p className={`text-xs font-medium text-neutral-200 ${item.completed ? 'line-through text-neutral-500' : ''}`}>
                        {item.text}
                      </p>
                      <span className="text-[10px] text-neutral-500">
                        Added by {item.addedBy}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteGrocery(item.id)}
                    className="text-neutral-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Poll Modal */}
      {showNewPollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-sm p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">Create Family Poll</h3>
            <form onSubmit={handleCreatePoll} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                  Question
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sham ko chai k sath kya khana hai?"
                  value={newPollQuestion}
                  onChange={(e) => setNewPollQuestion(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                  Option 1
                </label>
                <input
                  type="text"
                  placeholder="e.g. Samosay & Pakoray"
                  value={newPollOption1}
                  onChange={(e) => setNewPollOption1(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                  Option 2
                </label>
                <input
                  type="text"
                  placeholder="e.g. Biscuits & Cake"
                  value={newPollOption2}
                  onChange={(e) => setNewPollOption2(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                  Option 3 (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fruit Chaat"
                  value={newPollOption3}
                  onChange={(e) => setNewPollOption3(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPollModal(false)}
                  className="px-3 py-2 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newPollQuestion.trim() || !newPollOption1.trim() || !newPollOption2.trim()}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-neutral-950 font-bold rounded-xl text-xs"
                >
                  Post Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showNewEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-sm p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">Add Family Celebration</h3>
            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                  Event / Birthday
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hamza Graduation Party 🎓"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                  Date
                </label>
                <input
                  type="text"
                  placeholder="e.g. October 15"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewEventModal(false)}
                  className="px-3 py-2 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!eventTitle.trim() || !eventDate.trim()}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-neutral-950 font-bold rounded-xl text-xs"
                >
                  Add Celebration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
