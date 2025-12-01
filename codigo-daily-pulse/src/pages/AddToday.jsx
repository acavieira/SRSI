import React, { useState, useEffect } from "react";
import { DailyEntry } from "@/api/entities";
import { User } from "@/api/entities";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, Moon, Droplet, Footprints, BookOpen, Gamepad2, Dumbbell, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import MetricSlider from "../components/home/MetricSlider";
import WaterTracker from "../components/home/WaterTracker";
import QuickFillPrompt from "../components/home/QuickFillPrompt";

export default function AddToday() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [todayEntry, setTodayEntry] = useState(null);
  const [yesterdayEntry, setYesterdayEntry] = useState(null);
  const [showQuickFill, setShowQuickFill] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [metrics, setMetrics] = useState({
    sleep: 0,
    water: 0,
    steps: 0,
    study: 0,
    leisure: 0,
    exercise: 0,
    note: ""
  });

  useEffect(() => {
    loadUser();
    loadTodayEntry();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      await User.loginWithRedirect(window.location.pathname);
    }
  };

  const loadTodayEntry = async () => {
    const today = format(new Date(), "yyyy-MM-dd");
    const yesterday = format(new Date(Date.now() - 86400000), "yyyy-MM-dd");
    
    const allEntries = await DailyEntry.list("-date", 100);
    const todayData = allEntries.find(e => e.date === today);
    const yesterdayData = allEntries.find(e => e.date === yesterday);

    if (todayData) {
      setTodayEntry(todayData);
      setMetrics({
        sleep: todayData.sleep || 0,
        water: todayData.water || 0,
        steps: todayData.steps || 0,
        study: todayData.study || 0,
        leisure: todayData.leisure || 0,
        exercise: todayData.exercise || 0,
        note: todayData.note || ""
      });
    } else if (yesterdayData) {
      setYesterdayEntry(yesterdayData);
      setShowQuickFill(true);
    }
  };

  const handleQuickFill = () => {
    if (yesterdayEntry) {
      setMetrics({
        sleep: yesterdayEntry.sleep || 0,
        water: yesterdayEntry.water || 0,
        steps: yesterdayEntry.steps || 0,
        study: yesterdayEntry.study || 0,
        leisure: yesterdayEntry.leisure || 0,
        exercise: yesterdayEntry.exercise || 0,
        note: ""
      });
    }
    setShowQuickFill(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      const totalActiveMinutes = metrics.study + metrics.leisure + metrics.exercise;
      const hydrationPercent = user?.water_goal ? (metrics.water / user.water_goal) * 100 : 0;

      const entryData = {
        date: today,
        ...metrics,
        total_active_minutes: totalActiveMinutes,
        hydration_percent: hydrationPercent
      };

      if (todayEntry) {
        await DailyEntry.update(todayEntry.id, entryData);
      } else {
        await DailyEntry.create(entryData);
      }

      // Check for 7-day streak and award badge
      await checkAndAwardStreakBadge();

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate(createPageUrl("Insights"));
      }, 2000);
    } catch (error) {
      console.error("Error saving entry:", error);
    }
    setIsSaving(false);
  };

  const checkAndAwardStreakBadge = async () => {
    const entries = await DailyEntry.list("-date", 7);
    if (entries.length >= 7) {
      const existingBadges = user?.badges || [];
      const hasStreakBadge = existingBadges.some(b => b.type === "7_day_streak");
      
      if (!hasStreakBadge) {
        const newBadge = {
          type: "7_day_streak",
          earned_date: format(new Date(), "yyyy-MM-dd"),
          metric: "consistency"
        };
        await User.updateMyUserData({
          badges: [...existingBadges, newBadge]
        });
      }
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Track Today</h1>
        <p className="text-gray-600">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
      </motion.div>

      {showQuickFill && (
        <QuickFillPrompt
          yesterdayData={yesterdayEntry}
          onAccept={handleQuickFill}
          onDismiss={() => setShowQuickFill(false)}
        />
      )}

      <WaterTracker
        value={metrics.water}
        onChange={(val) => setMetrics({ ...metrics, water: val })}
        goal={user?.water_goal || 8}
      />

      <div className="grid md:grid-cols-2 gap-4">
        <MetricSlider
          label="Sleep"
          value={metrics.sleep}
          onChange={(val) => setMetrics({ ...metrics, sleep: val })}
          min={0}
          max={12}
          step={0.5}
          unit="h"
          icon={Moon}
          color="blue"
        />

        <MetricSlider
          label="Steps"
          value={metrics.steps}
          onChange={(val) => setMetrics({ ...metrics, steps: val })}
          min={0}
          max={30000}
          step={100}
          unit=""
          icon={Footprints}
          color="green"
        />

        <MetricSlider
          label="Study"
          value={metrics.study}
          onChange={(val) => setMetrics({ ...metrics, study: val })}
          min={0}
          max={300}
          step={5}
          unit="m"
          icon={BookOpen}
          color="purple"
        />

        <MetricSlider
          label="Leisure"
          value={metrics.leisure}
          onChange={(val) => setMetrics({ ...metrics, leisure: val })}
          min={0}
          max={300}
          step={5}
          unit="m"
          icon={Gamepad2}
          color="pink"
        />

        <MetricSlider
          label="Exercise"
          value={metrics.exercise}
          onChange={(val) => setMetrics({ ...metrics, exercise: val })}
          min={0}
          max={180}
          step={5}
          unit="m"
          icon={Dumbbell}
          color="orange"
        />
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-gray-100">
        <label className="block font-semibold text-gray-900 mb-3">Daily Note (Optional)</label>
        <Textarea
          placeholder="How was your day? Any thoughts or reflections..."
          value={metrics.note}
          onChange={(e) => setMetrics({ ...metrics, note: e.target.value })}
          className="min-h-24 resize-none"
        />
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
              Saved Successfully!
            </>
          ) : isSaving ? (
            "Saving..."
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Save Today's Entry
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}