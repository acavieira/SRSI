import React from "react";
import { Button } from "@/components/ui/button";
import { Droplet, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";

export default function WaterTracker({ value, onChange, goal = 8 }) {
  const glasses = Array.from({ length: goal }, (_, i) => i);
  
  return (
    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 shadow-sm border border-cyan-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
            <Droplet className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Water Intake</p>
            <p className="text-3xl font-bold text-gray-900">{value} / {goal}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full bg-white"
            onClick={() => onChange(Math.max(0, value - 1))}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg"
            onClick={() => onChange(value + 1)}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-8 gap-2">
        {glasses.map((i) => (
          <motion.button
            key={i}
            initial={{ scale: 0.8 }}
            animate={{ scale: i < value ? 1 : 0.9 }}
            whileTap={{ scale: 0.85 }}
            onClick={() => onChange(i + 1)}
            className={`aspect-square rounded-lg transition-all duration-200 ${
              i < value
                ? "bg-gradient-to-br from-cyan-400 to-blue-500 shadow-md"
                : "bg-white border-2 border-gray-200"
            }`}
          >
            <Droplet className={`w-full h-full p-1.5 ${i < value ? "text-white" : "text-gray-300"}`} />
          </motion.button>
        ))}
      </div>
    </div>
  );
}