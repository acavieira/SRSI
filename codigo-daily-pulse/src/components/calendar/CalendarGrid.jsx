import React from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

export default function CalendarGrid({ currentMonth, entries, onDateClick, userGoals }) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEntryForDate = (date) => {
    return entries.find(e => isSameDay(new Date(e.date), date));
  };

  const getCompletionStatus = (entry) => {
    if (!entry) return "none";
    
    const goals = userGoals || { sleep_goal: 8, water_goal: 8, steps_goal: 10000, exercise_goal: 30 };
    const metGoals = [
      entry.sleep >= goals.sleep_goal,
      entry.water >= goals.water_goal,
      entry.steps >= goals.steps_goal,
      entry.exercise >= goals.exercise_goal
    ].filter(Boolean).length;

    if (metGoals >= 3) return "high";
    if (metGoals >= 2) return "medium";
    if (metGoals >= 1) return "low";
    return "none";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "high": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-orange-500";
      default: return "bg-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "high": return CheckCircle2;
      case "medium": return AlertCircle;
      case "low": return XCircle;
      default: return null;
    }
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const entry = getEntryForDate(day);
          const status = getCompletionStatus(entry);
          const StatusIcon = getStatusIcon(status);
          const isCurrentDay = isToday(day);

          return (
            <motion.button
              key={day.toString()}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              onClick={() => onDateClick(day, entry)}
              className={`aspect-square rounded-xl p-2 transition-all duration-200 hover:scale-105 ${
                isCurrentDay
                  ? "ring-2 ring-blue-500 ring-offset-2"
                  : ""
              } ${
                isSameMonth(day, currentMonth)
                  ? "hover:shadow-lg"
                  : "opacity-40"
              }`}
            >
              <div className={`w-full h-full rounded-lg ${getStatusColor(status)} flex flex-col items-center justify-center relative`}>
                <span className={`text-sm font-semibold ${status === "none" ? "text-gray-600" : "text-white"}`}>
                  {format(day, "d")}
                </span>
                {StatusIcon && (
                  <StatusIcon className="w-3 h-3 text-white mt-1" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500" />
          <span className="text-xs text-gray-600">3+ goals met</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500" />
          <span className="text-xs text-gray-600">2 goals met</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-500" />
          <span className="text-xs text-gray-600">1 goal met</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-200" />
          <span className="text-xs text-gray-600">No data</span>
        </div>
      </div>
    </div>
  );
}