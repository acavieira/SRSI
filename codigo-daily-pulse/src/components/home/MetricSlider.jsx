import React from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

export default function MetricSlider({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1,
  unit = "",
  icon: Icon,
  color = "blue"
}) {
  const colorMap = {
    blue: "from-blue-400 to-blue-600",
    green: "from-green-400 to-green-600",
    purple: "from-purple-400 to-purple-600",
    orange: "from-orange-400 to-orange-600",
    pink: "from-pink-400 to-pink-600",
    cyan: "from-cyan-400 to-cyan-600"
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`w-10 h-10 bg-gradient-to-br ${colorMap[color]} rounded-xl flex items-center justify-center shadow-md`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}{unit}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={() => onChange(Math.max(min, value - step))}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={() => onChange(Math.min(max, value + step))}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={(vals) => onChange(vals[0])}
        min={min}
        max={max}
        step={step}
        className="cursor-pointer"
      />
    </div>
  );
}