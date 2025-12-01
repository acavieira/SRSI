import React, { useState, useEffect } from "react";
import { DailyEntry } from "@/api/entities";
import { User } from "@/api/entities";
import { format, addMonths, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import CalendarGrid from "../components/calendar/CalendarGrid";
import MetricSlider from "../components/home/MetricSlider";
import { Moon, Droplet, Footprints, BookOpen, Gamepad2, Dumbbell } from "lucide-react";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [entries, setEntries] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedMetrics, setEditedMetrics] = useState({});

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

  const handleDateClick = (date, entry) => {
    setSelectedDate(date);
    setSelectedEntry(entry);
    if (entry) {
      setEditedMetrics({
        sleep: entry.sleep || 0,
        water: entry.water || 0,
        steps: entry.steps || 0,
        study: entry.study || 0,
        leisure: entry.leisure || 0,
        exercise: entry.exercise || 0,
      });
    } else {
      setEditedMetrics({
        sleep: 0,
        water: 0,
        steps: 0,
        study: 0,
        leisure: 0,
        exercise: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    const totalActiveMinutes = editedMetrics.study + editedMetrics.leisure + editedMetrics.exercise;
    const hydrationPercent = user?.water_goal ? (editedMetrics.water / user.water_goal) * 100 : 0;

    const entryData = {
      date: format(selectedDate, "yyyy-MM-dd"),
      ...editedMetrics,
      total_active_minutes: totalActiveMinutes,
      hydration_percent: hydrationPercent
    };

    if (selectedEntry) {
      await DailyEntry.update(selectedEntry.id, entryData);
    } else {
      await DailyEntry.create(entryData);
    }

    setIsDialogOpen(false);
    loadEntries();
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Your Calendar</h1>
        <p className="text-gray-600">View and edit your daily entries</p>
      </motion.div>

      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="rounded-full"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <CalendarGrid
        currentMonth={currentMonth}
        entries={entries}
        onDateClick={handleDateClick}
        userGoals={user}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <MetricSlider
                label="Sleep"
                value={editedMetrics.sleep}
                onChange={(val) => setEditedMetrics({ ...editedMetrics, sleep: val })}
                min={0}
                max={12}
                step={0.5}
                unit="h"
                icon={Moon}
                color="blue"
              />
              <MetricSlider
                label="Water"
                value={editedMetrics.water}
                onChange={(val) => setEditedMetrics({ ...editedMetrics, water: val })}
                min={0}
                max={20}
                step={1}
                unit=" glasses"
                icon={Droplet}
                color="cyan"
              />
              <MetricSlider
                label="Steps"
                value={editedMetrics.steps}
                onChange={(val) => setEditedMetrics({ ...editedMetrics, steps: val })}
                min={0}
                max={30000}
                step={100}
                unit=""
                icon={Footprints}
                color="green"
              />
              <MetricSlider
                label="Study"
                value={editedMetrics.study}
                onChange={(val) => setEditedMetrics({ ...editedMetrics, study: val })}
                min={0}
                max={300}
                step={5}
                unit="m"
                icon={BookOpen}
                color="purple"
              />
              <MetricSlider
                label="Leisure"
                value={editedMetrics.leisure}
                onChange={(val) => setEditedMetrics({ ...editedMetrics, leisure: val })}
                min={0}
                max={300}
                step={5}
                unit="m"
                icon={Gamepad2}
                color="pink"
              />
              <MetricSlider
                label="Exercise"
                value={editedMetrics.exercise}
                onChange={(val) => setEditedMetrics({ ...editedMetrics, exercise: val })}
                min={0}
                max={180}
                step={5}
                unit="m"
                icon={Dumbbell}
                color="orange"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}