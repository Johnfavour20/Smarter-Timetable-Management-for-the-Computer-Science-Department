import React, { useState } from 'react';
import { Course, Lecturer, Venue, ScheduleItem } from '../types';
import { Sparkles, CheckCircle2, AlertCircle, Loader2, ArrowRight, RefreshCw, X, ShieldCheck, Cpu, Database, Check } from 'lucide-react';
import { runConstraintSolver } from '../services/solverEngine';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  lecturers: Lecturer[];
  venues: Venue[];
  onApplySchedule: (newSchedule: ScheduleItem[]) => void;
}

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({
  isOpen,
  onClose,
  courses,
  lecturers,
  venues,
  onApplySchedule,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [progressPct, setProgressPct] = useState(0);
  const [result, setResult] = useState<{
    efficiencyScore: number;
    conflictsCount: number;
    optimizationInsights: string[];
    schedule: ScheduleItem[];
    generationTimeMs?: number;
  } | null>(null);

  // Preference switches
  const [prioritizeMorningLabs, setPrioritizeMorningLabs] = useState(true);
  const [avoidBackToBack, setAvoidBackToBack] = useState(true);

  if (!isOpen) return null;

  const handleRunGenerator = () => {
    setIsGenerating(true);
    setResult(null);
    setGenerationStep(1);
    setProgressPct(15);

    // Step 1: Loading
    setTimeout(() => {
      setGenerationStep(2);
      setProgressPct(45);
    }, 700);

    // Step 2: Solver execution
    setTimeout(() => {
      setGenerationStep(3);
      setProgressPct(75);
    }, 1500);

    // Step 3: Finalizing
    setTimeout(() => {
      setGenerationStep(4);
      setProgressPct(100);

      const solverOutput = runConstraintSolver(courses, lecturers, venues, {
        prioritizeMorningLabs,
        avoidBackToBack,
      });

      setResult({
        efficiencyScore: solverOutput.efficiencyScore,
        conflictsCount: solverOutput.conflictsCount,
        optimizationInsights: solverOutput.optimizationInsights,
        schedule: solverOutput.schedule,
        generationTimeMs: solverOutput.generationTimeMs,
      });

      setIsGenerating(false);
    }, 2300);
  };

  const handleApply = () => {
    if (result) {
      onApplySchedule(result.schedule);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-6 animate-fadeIn">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl shadow-2xs">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                Chronos AI Constraint Solver
                <span className="text-[10px] font-bold bg-blue-50 text-[#004384] px-2 py-0.5 rounded-full border border-blue-200">
                  Gemini 2.5 Active
                </span>
              </h2>
              <p className="text-xs text-slate-500">Automated multi-variable constraint satisfaction engine for CS Department.</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Parameters Overview */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#004384]" /> Dataset Context:
            </span>
            <span className="text-slate-500 font-normal">
              {courses.length} Courses • {lecturers.length} Lecturers • {venues.length} Venues
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-white border border-slate-200 hover:border-[#004384] transition-colors">
              <input
                type="checkbox"
                checked={prioritizeMorningLabs}
                onChange={(e) => setPrioritizeMorningLabs(e.target.checked)}
                className="rounded text-[#004384] focus:ring-[#004384] cursor-pointer"
              />
              <span className="font-medium text-slate-800 text-[11px]">Prioritize Morning Labs</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-white border border-slate-200 hover:border-[#004384] transition-colors">
              <input
                type="checkbox"
                checked={avoidBackToBack}
                onChange={(e) => setAvoidBackToBack(e.target.checked)}
                className="rounded text-[#004384] focus:ring-[#004384] cursor-pointer"
              />
              <span className="font-medium text-slate-800 text-[11px]">Avoid Lecturer Back-to-Back</span>
            </label>
          </div>
        </div>

        {/* Generating Progress State */}
        {isGenerating && (
          <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50/60 rounded-2xl border border-blue-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Loader2 className="w-5 h-5 text-[#004384] animate-spin" />
                <span className="text-xs font-black text-slate-900">
                  {generationStep === 1 && "Step 1/4: Querying database constraints..."}
                  {generationStep === 2 && "Step 2/4: Computing capacity & availability matrix..."}
                  {generationStep === 3 && "Step 3/4: Resolving 0-hard-collision boundaries..."}
                  {generationStep === 4 && "Step 4/4: Finalizing master timetable grid..."}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-[#004384]">{progressPct}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-[#004384] h-full transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-600 font-medium italic">
              Evaluating hard constraints: Lecturer availability, hall capacity ratios, and cohort non-overlap limits...
            </p>
          </div>
        )}

        {/* Optimization Results */}
        {result && !isGenerating && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Solver Efficiency</span>
                <span className="text-xl font-black text-emerald-700">{result.efficiencyScore}%</span>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
                <span className="text-[10px] font-bold text-blue-800 uppercase block">Hard Collisions</span>
                <span className="text-xl font-black text-[#004384]">{result.conflictsCount} Overlaps</span>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-center">
                <span className="text-[10px] font-bold text-purple-800 uppercase block">Execution Time</span>
                <span className="text-xl font-black text-purple-700">{(result.generationTimeMs || 1240) / 1000}s</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Key Optimization Insights:
              </span>
              <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                {result.optimizationInsights.map((insight, idx) => (
                  <li key={idx} className="leading-tight">{insight}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>

          {!result ? (
            <button
              type="button"
              onClick={handleRunGenerator}
              disabled={isGenerating}
              className="px-5 py-2.5 bg-[#004384] hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
              Run Chronos AI Solver
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRunGenerator}
                className="px-3.5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-solve
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" /> Apply Schedule ({result.schedule.length} Slots)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
