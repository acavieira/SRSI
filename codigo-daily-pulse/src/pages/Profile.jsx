import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { DailyEntry } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Trophy, Target, Calendar, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadUserAndStats();
  }, []);

  const loadUserAndStats = async () => {
    try {
      const userData = await User.me();
      setUser(userData);

      const entries = await DailyEntry.list("-date", 100);
      const totalDays = entries.length;
      const totalSteps = entries.reduce((sum, e) => sum + (e.steps || 0), 0);
      const avgSleep = entries.reduce((sum, e) => sum + (e.sleep || 0), 0) / (totalDays || 1);

      setStats({
        totalDays,
        totalSteps,
        avgSleep: avgSleep.toFixed(1)
      });
    } catch (error) {
      await User.loginWithRedirect(window.location.pathname);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  const badges = user.badges || [];
  const badgeTypes = {
    "7_day_streak": {
      icon: Trophy,
      label: "7-Day Streak",
      color: "from-yellow-400 to-orange-500"
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Your Profile</h1>
        <p className="text-gray-600">Track your achievements and progress</p>
      </motion.div>

      <Card className="bg-gradient-to-br from-blue-50 to-green-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-white">
                {user.full_name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <a href={`https://pt.linkedin.com/in/${user.id}`} target="_blank" rel="noopener noreferrer">
              <h2 className="text-2xl font-bold text-gray-900">{user.full_name}</h2>
              </a>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-8 h-8 text-blue-500" />
              <p className="text-sm font-medium text-gray-600">Days Tracked</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalDays}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <p className="text-sm font-medium text-gray-600">Total Steps</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalSteps?.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-8 h-8 text-purple-500" />
              <p className="text-sm font-medium text-gray-600">Avg Sleep</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.avgSleep}h</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-6 h-6 text-blue-500" />
            Your Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          {badges.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {badges.map((badge, index) => {
                const badgeInfo = badgeTypes[badge.type];
                if (!badgeInfo) return null;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-14 h-14 bg-gradient-to-br ${badgeInfo.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <badgeInfo.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{badgeInfo.label}</p>
                        <p className="text-sm text-gray-600">
                          Earned {format(new Date(badge.earned_date), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium mb-2">No badges yet</p>
              <p className="text-sm text-gray-500">
                Keep tracking daily and maintain 7-day streaks to earn badges!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}