import React from "react";
import { Trophy, TrendingUp, Calendar, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function HighlightsCard({ highlights }) {
  const items = [
    {
      icon: Trophy,
      label: "Best Day",
      value: highlights.bestDay?.steps || 0,
      unit: " steps",
      date: highlights.bestDay?.date,
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: TrendingUp,
      label: "Weekly Avg Steps",
      value: Math.round(highlights.weeklyAvgSteps || 0),
      unit: "",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: Calendar,
      label: "Current Streak",
      value: highlights.currentStreak || 0,
      unit: " days",
      color: "from-green-400 to-green-600"
    },
    {
      icon: Award,
      label: "Goals Met",
      value: highlights.goalsMetThisWeek || 0,
      unit: " times",
      color: "from-purple-400 to-purple-600"
    }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Award className="w-5 h-5 text-blue-500" />
        Your Highlights
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {items.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100"
          >
            <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center mb-3 shadow-md`}>
              <item.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm text-gray-600 mb-1">{item.label}</p>
            <p className="text-2xl font-bold text-gray-900">
              {item.value}<span className="text-sm font-normal text-gray-600">{item.unit}</span>
            </p>
            {item.date && (
              <p className="text-xs text-gray-500 mt-1">{item.date}</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}