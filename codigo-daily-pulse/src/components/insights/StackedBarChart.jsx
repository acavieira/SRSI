import React from "react";
import { motion } from "framer-motion";

export default function StackedBarChart({ data, title }) {
  if (!data || data.length === 0) return null;

  const maxTotal = Math.max(...data.map(d => d.study + d.leisure + d.exercise), 1);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>
      
      <div className="space-y-4">
        {data.map((day, index) => {
          const total = day.study + day.leisure + day.exercise;
          const studyPercent = (day.study / maxTotal) * 100;
          const leisurePercent = (day.leisure / maxTotal) * 100;
          const exercisePercent = (day.exercise / maxTotal) * 100;

          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">{day.label}</p>
                <p className="text-sm font-bold text-gray-900">{total}m</p>
              </div>
              <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-purple-400 to-purple-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${studyPercent}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  title={`Study: ${day.study}m`}
                />
                <motion.div
                  className="bg-gradient-to-r from-pink-400 to-pink-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${leisurePercent}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.1 }}
                  title={`Leisure: ${day.leisure}m`}
                />
                <motion.div
                  className="bg-gradient-to-r from-orange-400 to-orange-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${exercisePercent}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                  title={`Exercise: ${day.exercise}m`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-purple-400 to-purple-600" />
          <span className="text-xs text-gray-600">Study</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-pink-400 to-pink-600" />
          <span className="text-xs text-gray-600">Leisure</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-orange-400 to-orange-600" />
          <span className="text-xs text-gray-600">Exercise</span>
        </div>
      </div>
    </div>
  );
}