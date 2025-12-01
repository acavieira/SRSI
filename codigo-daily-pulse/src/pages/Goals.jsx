import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Droplet, Footprints, Dumbbell, Save, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function GoalsPage() {
  const [user, setUser] = useState(null);
  const [goals, setGoals] = useState({
    sleep_goal: 8,
    water_goal: 8,
    steps_goal: 10000,
    exercise_goal: 30
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setGoals({
        sleep_goal: userData.sleep_goal || 8,
        water_goal: userData.water_goal || 8,
        steps_goal: userData.steps_goal || 10000,
        exercise_goal: userData.exercise_goal || 30
      });
    } catch (error) {
      await User.loginWithRedirect(window.location.pathname);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await User.updateMyUserData(goals);
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  const goalItems = [
    { key: "sleep_goal", label: "Sleep Goal", icon: Moon, unit: "hours", color: "from-blue-400 to-blue-600" },
    { key: "water_goal", label: "Water Goal", icon: Droplet, unit: "glasses", color: "from-cyan-400 to-blue-500" },
    { key: "steps_goal", label: "Steps Goal", icon: Footprints, unit: "steps", color: "from-green-400 to-green-600" },
    { key: "exercise_goal", label: "Exercise Goal", icon: Dumbbell, unit: "minutes", color: "from-orange-400 to-orange-600" }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Your Goals</h1>
        <p className="text-gray-600">Set your daily wellness targets</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {goalItems.map((item, index) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-gray-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-md`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  {item.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor={item.key}>Daily Target ({item.unit})</Label>
                  <Input
                    id={item.key}
                    type="number"
                    min="0"
                    value={goals[item.key]}
                    onChange={(e) => setGoals({ ...goals, [item.key]: parseFloat(e.target.value) })}
                    className="text-lg font-semibold"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div whileTap={{ scale: 0.98 }}>
        <Button
          onClick={handleSave}
          disabled={isSaving || showSuccess}
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 shadow-lg"
        >
          {showSuccess ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Goals Saved!
            </>
          ) : isSaving ? (
            "Saving..."
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Goals
            </>
          )}
        </Button>
      </motion.div>

      <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-2">💡 Pro Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Set realistic goals based on your current habits</li>
            <li>• Adjust goals as you progress in your wellness journey</li>
            <li>• Meeting 3+ goals daily earns you a green badge on the calendar</li>
            <li>• Achieve 7 consecutive days for streak badges!</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}