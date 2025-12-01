import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function QuickFillPrompt({ yesterdayData, onAccept, onDismiss }) {
  if (!yesterdayData) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <Copy className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-1">Quick Fill Available</p>
                  <p className="text-sm text-gray-600 mb-3">Copy yesterday's data to get started faster</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                      onClick={onAccept}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Yesterday
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={onDismiss}
                    >
                      Start Fresh
                    </Button>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full flex-shrink-0"
                onClick={onDismiss}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}