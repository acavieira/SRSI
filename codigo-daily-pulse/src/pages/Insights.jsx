
import React, { useState, useEffect } from "react";
import { DailyEntry } from "@/api/entities";
import { User } from "@/api/entities";
import { format, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Droplet, Moon, Dumbbell } from "lucide-react";

import SparklineChart from "../components/insights/SparklineChart";
import RadialGauge from "../components/insights/RadialGauge";
import StackedBarChart from "../components/insights/StackedBarChart";
import HighlightsCard from "../components/insights/HighlightsCard";

export default function InsightsPage() {
  const [entries, setEntries] = useState([]);
  const [user, setUser] = useState(null);
  const [timeRange, setTimeRange] = useState("7");
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadUser();
    loadEntries();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      await User.loginWithRedirect(window.location.pathname);
    }
  };

  const loadEntries = async () => {
    const data = await DailyEntry.list("-date", 100);
    setEntries(data);
  };

  const getFilteredEntries = () => {
    const days = parseInt(timeRange);
    const cutoffDate = subDays(new Date(), days);
    // Ensure chronological order for sparkline and stacked charts, but bestDay needs original order check
    return entries.filter(e => new Date(e.date) >= cutoffDate);
  };

  const getSparklineData = (metric) => {
    return getFilteredEntries().sort((a, b) => new Date(a.date) - new Date(b.date)).map(e => ({
      date: e.date,
      value: e[metric] || 0
    }));
  };

  const getStackedData = () => {
    // For stacked data, we want the *last* 7 days within the filtered range, sorted chronologically
    return getFilteredEntries()
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7) // Take the most recent 7 days if available
      .map(e => ({
        label: format(new Date(e.date), "EEE"),
        study: e.study || 0,
        leisure: e.leisure || 0,
        exercise: e.exercise || 0
      }));
  };

  const getHighlights = () => {
    const filtered = getFilteredEntries();
    
    if (filtered.length === 0) {
      return {
        bestDay: null,
        weeklyAvgSteps: 0,
        currentStreak: 0,
        goalsMetThisWeek: 0
      };
    }

    const bestDay = filtered.reduce((max, e) => 
      (e.steps || 0) > (max?.steps || 0) ? e : max, filtered[0]);

    const weeklyAvgSteps = filtered.reduce((sum, e) => sum + (e.steps || 0), 0) / filtered.length;

    let currentStreak = 0;
    // Streak needs to look at ALL entries, not just filtered by timeRange
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    for (const entry of sortedEntries) {
      if (entry.sleep >= (user?.sleep_goal || 8)) {
        currentStreak++;
      } else {
        break;
      }
    }

    const goalsMetThisWeek = filtered.filter(e => {
      const metGoals = [
        e.sleep >= (user?.sleep_goal || 8),
        e.water >= (user?.water_goal || 8),
        e.steps >= (user?.steps_goal || 10000),
        e.exercise >= (user?.exercise_goal || 30)
      ].filter(Boolean).length;
      return metGoals >= 2;
    }).length;

    return {
      bestDay: bestDay?.date ? { steps: bestDay.steps, date: format(new Date(bestDay.date), "MMM d") } : null,
      weeklyAvgSteps,
      currentStreak,
      goalsMetThisWeek
    };
  };

  const getCurrentWeekAverages = () => {
    const filtered = getFilteredEntries();
    if (filtered.length === 0) {
      return { sleep: 0, water: 0, exercise: 0 };
    }
    return {
      sleep: filtered.reduce((sum, e) => sum + (e.sleep || 0), 0) / filtered.length,
      water: filtered.reduce((sum, e) => sum + (e.water || 0), 0) / filtered.length,
      exercise: filtered.reduce((sum, e) => sum + (e.exercise || 0), 0) / filtered.length
    };
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    const filtered = getFilteredEntries();
    const csvContent = [
      ["Date", "Sleep (h)", "Water (glasses)", "Steps", "Study (m)", "Leisure (m)", "Exercise (m)", "Note"].join(","),
      ...filtered.map(e => [
        e.date,
        e.sleep || 0,
        e.water || 0,
        e.steps || 0,
        e.study || 0,
        e.leisure || 0,
        e.exercise || 0,
        `"${(e.note || "").replace(/"/g, '""')}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daily-pulse-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    setIsExporting(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  const averages = getCurrentWeekAverages();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Insights & Trends</h1>
          <p className="text-gray-600">Visualize your wellness journey</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList>
              <TabsTrigger value="7">7 Days</TabsTrigger>
              <TabsTrigger value="14">14 Days</TabsTrigger>
              <TabsTrigger value="30">30 Days</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            variant="outline"
            onClick={handleExportCSV}
            disabled={isExporting}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <RadialGauge
          value={averages.sleep}
          max={user?.sleep_goal || 8}
          label="Sleep Goal"
          color="#4F86F7"
          icon={Moon}
        />
        <RadialGauge
          value={averages.water}
          max={user?.water_goal || 8}
          label="Water Goal"
          color="#06B6D4"
          icon={Droplet}
        />
        <RadialGauge
          value={averages.exercise}
          max={user?.exercise_goal || 30}
          label="Exercise Goal"
          color="#FF6B6B"
          icon={Dumbbell}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <SparklineChart
          data={getSparklineData("sleep")}
          label="Sleep"
          color="#4F86F7"
          unit="h"
        />
        <SparklineChart
          data={getSparklineData("water")}
          label="Water"
          color="#06B6D4"
          unit=" glasses"
        />
        <SparklineChart
          data={getSparklineData("steps")}
          label="Steps"
          color="#10B981"
          unit=""
        />
        <SparklineChart
          data={getSparklineData("exercise")}
          label="Exercise"
          color="#FF6B6B"
          unit="m"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StackedBarChart
            data={getStackedData()}
            title="Weekly Active Minutes Breakdown"
          />
        </div>
        <HighlightsCard highlights={getHighlights()} />
      </div>
    </div>
  );
}
