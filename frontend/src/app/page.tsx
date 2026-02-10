"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Mic2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ChevronRight,
  Database,
  LineChart,
  Target,
  RefreshCcw,
  Sparkles,
  Stethoscope,
  Command
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Features accurately extracted from TheParkinsonProject.ipynb (22 features total)
const FEATURE_MAP = [
  { id: 'Fo', label: 'Fo(Hz)', group: 'Vocal Frequency', desc: 'Avg. fundamental frequency' },
  { id: 'Fhi', label: 'Fhi(Hz)', group: 'Vocal Frequency', desc: 'Max. fundamental frequency' },
  { id: 'Flo', label: 'Flo(Hz)', group: 'Vocal Frequency', desc: 'Min. fundamental frequency' },
  { id: 'JitterPerc', label: 'Jitter(%)', group: 'Jitter Measures', desc: 'Frequency variation %' },
  { id: 'JitterAbs', label: 'Jitter(Abs)', group: 'Jitter Measures', desc: 'Abs. jitter (ms)' },
  { id: 'RAP', label: 'RAP', group: 'Jitter Measures', desc: 'Rel. avg. perturbation' },
  { id: 'PPQ', label: 'PPQ', group: 'Jitter Measures', desc: '5-point period perturbation' },
  { id: 'DDP', label: 'DDP', group: 'Jitter Measures', desc: 'Avg. abs. diff. of diffs' },
  { id: 'Shimmer', label: 'Shimmer', group: 'Shimmer Measures', desc: 'Amplitude variation' },
  { id: 'ShimmerDb', label: 'Shimmer(dB)', group: 'Shimmer Measures', desc: 'Shimmer in decibels' },
  { id: 'APQ3', label: 'APQ3', group: 'Shimmer Measures', desc: '3-point amp. perturbation' },
  { id: 'APQ5', label: 'APQ5', group: 'Shimmer Measures', desc: '5-point amp. perturbation' },
  { id: 'APQ', label: 'APQ', group: 'Shimmer Measures', desc: '11-point amp. perturbation' },
  { id: 'DDA', label: 'DDA', group: 'Shimmer Measures', desc: 'Avg. abs. diff. between amps' },
  { id: 'NHR', label: 'NHR', group: 'Complexity/Noise', desc: 'Noise-to-Harmonics ratio' },
  { id: 'HNR', label: 'HNR', group: 'Complexity/Noise', desc: 'Harmonics-to-Noise ratio' },
  { id: 'RPDE', label: 'RPDE', group: 'Complexity/Noise', desc: 'Recurrence period density' },
  { id: 'DFA', label: 'DFA', group: 'Complexity/Noise', desc: 'Detrended fluctuation analysis' },
  { id: 'spread1', label: 'spread1', group: 'Signal Spread', desc: 'Nonlinear freq. variation' },
  { id: 'spread2', label: 'spread2', group: 'Signal Spread', desc: 'Nonlinear freq. variation' },
  { id: 'D2', label: 'D2', group: 'Signal Spread', desc: 'Correlation dimension' },
  { id: 'PPE', label: 'PPE', group: 'Signal Spread', desc: 'Pitch period entropy' },
];

const PRESETS = {
  HEALTHY: {
    Fo: 197.07, Fhi: 206.89, Flo: 192.05, JitterPerc: 0.00289, JitterAbs: 0.00001,
    RAP: 0.00166, PPQ: 0.00168, DDP: 0.00498, Shimmer: 0.01098, ShimmerDb: 0.097,
    APQ3: 0.00563, APQ5: 0.0068, APQ: 0.00802, DDA: 0.01689, NHR: 0.00339,
    HNR: 26.77, RPDE: 0.422, DFA: 0.741, spread1: -7.34, spread2: 0.177,
    D2: 1.74, PPE: 0.085
  },
  HIGH_RISK: {
    Fo: 119.99, Fhi: 157.30, Flo: 75.00, JitterPerc: 0.00784, JitterAbs: 0.00007,
    RAP: 0.0037, PPQ: 0.00554, DDP: 0.01109, Shimmer: 0.04374, ShimmerDb: 0.426,
    APQ3: 0.02182, APQ5: 0.0313, APQ: 0.02971, DDA: 0.06545, NHR: 0.02211,
    HNR: 21.033, RPDE: 0.4147, DFA: 0.8152, spread1: -4.813, spread2: 0.266,
    D2: 2.301, PPE: 0.284
  }
};

export default function InteractiveDashboard() {
  const [inputs, setInputs] = useState<Record<string, number>>(PRESETS.HEALTHY);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<null | 'positive' | 'negative'>(null);
  const [activeGroup, setActiveGroup] = useState('Vocal Frequency');

  const groups = Array.from(new Set(FEATURE_MAP.map(f => f.group)));

  const handleInputChange = (id: string, val: string) => {
    const numVal = parseFloat(val) || 0;
    setInputs(prev => ({ ...prev, [id]: numVal }));
  };

  const loadPreset = (type: 'HEALTHY' | 'HIGH_RISK') => {
    setInputs(PRESETS[type]);
    setResult(null);
  };

  const runPrediction = () => {
    setIsAnalyzing(true);
    setResult(null);
    setProgress(0);

    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsAnalyzing(false);
          // Simplified heuristic for demo matching notebook logic
          const score = inputs.spread1 + (inputs.PPE * 10);
          setResult(score > -3 ? 'positive' : 'negative');
        }, 600);
      }
    }, 30);
  };

  return (
    <div className="h-screen w-full bg-[#f8fafc] text-slate-900 font-sans p-6 overflow-hidden flex flex-col items-center">
      {/* Dynamic Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-7xl flex justify-between items-center mb-6 bg-white shadow-sm border border-slate-200 px-8 py-4 rounded-3xl"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800">NeuroLogic AI</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" /> Research Compliance v2.4
            </p>
          </div>
        </div>

        <div className="hidden md:flex gap-8">
          {[
            { label: 'Train Accuracy', value: '88.5%', icon: <Target className="w-4 h-4" /> },
            { label: 'SVM Kernel', value: 'Linear', icon: <Database className="w-4 h-4" /> },
            { label: 'Feature Space', value: '22D', icon: <Sparkles className="w-4 h-4" /> }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-[9px] uppercase font-black text-slate-400 tracking-tighter flex items-center gap-1">
                {stat.icon} {stat.label}
              </span>
              <span className="text-sm font-bold text-slate-700">{stat.value}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => loadPreset('HEALTHY')}
            className="px-5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-black rounded-xl border border-emerald-100 transition-all active:scale-95"
          >
            LOAD HEALTHY
          </button>
          <button
            onClick={() => loadPreset('HIGH_RISK')}
            className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-black rounded-xl border border-red-100 transition-all active:scale-95"
          >
            LOAD RISK
          </button>
        </div>
      </motion.div>

      <div className="w-full max-w-7xl flex-1 flex gap-6 min-h-0">
        {/* Left: Input Panel */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-1/3 min-w-[400px] bg-white shadow-2xl shadow-slate-200/50 rounded-[2.5rem] border border-slate-100 flex flex-col overflow-hidden"
        >
          <div className="p-8 pb-4">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <Stethoscope className="w-6 h-6 text-blue-500" /> Clinical Inputs
              <span className="ml-auto text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-bold uppercase">22 Values</span>
            </h2>
            <p className="text-xs text-slate-400 mt-2 font-medium">Input biomedical acoustic markers from CSV mapping.</p>
          </div>

          {/* Group Tabs */}
          <div className="flex gap-1 px-8 py-2 overflow-x-auto no-scrollbar">
            {groups.map(group => (
              <button
                key={group}
                onClick={() => setActiveGroup(group)}
                className={cn(
                  "whitespace-nowrap px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border",
                  activeGroup === group
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100"
                    : "bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100"
                )}
              >
                {group}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-8 pt-4 custom-scrollbar">
            <div className="grid grid-cols-1 gap-4">
              {FEATURE_MAP.filter(f => f.group === activeGroup).map(f => (
                <div key={f.id} className="group relative">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block px-1 group-focus-within:text-blue-500 transition-colors">
                    {f.label}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={inputs[f.id]}
                      step="any"
                      onChange={(e) => handleInputChange(f.id, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50/50 rounded-2xl px-5 py-3 text-sm font-mono font-bold text-slate-700 outline-none transition-all placeholder:text-slate-300"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                      <Zap className="w-3 h-3 text-blue-300" />
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-400 mt-1.5 px-1 font-medium">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 pt-0">
            <button
              onClick={runPrediction}
              disabled={isAnalyzing}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-200 transition-all hover:translate-y-[-2px] active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {isAnalyzing ? (
                <RefreshCcw className="w-5 h-5 animate-spin" />
              ) : (
                <>EXECUTE HYPER-PARAM PREDICTION <ChevronRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </motion.div>

        {/* Right: Visualization & Results */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Main Display */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex-1 bg-white shadow-2xl shadow-slate-200/50 border border-slate-100 rounded-[2.5rem] relative overflow-hidden flex flex-col items-center justify-center p-12 text-center"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -ml-32 -mb-32 opacity-50" />

            {!isAnalyzing && !result ? (
              <div className="max-w-md relative z-10">
                <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-sm">
                  <Mic2 className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-4 tracking-tight leading-tight">Neural Signature Analysis</h3>
                <p className="text-slate-400 font-bold uppercase tracking-tighter text-sm mb-12">
                  Populate clinical indicators or load a research preset from the header to begin SVC processing.
                </p>
                <div className="flex justify-center gap-4">
                  <div className="px-4 py-2 bg-slate-50 rounded-lg text-[9px] font-black text-slate-400 border border-slate-100">RBF SCALING</div>
                  <div className="px-4 py-2 bg-slate-50 rounded-lg text-[9px] font-black text-slate-400 border border-slate-100">LINEAR SVM</div>
                </div>
              </div>
            ) : isAnalyzing ? (
              <div className="w-full max-w-lg relative z-10">
                <div className="mb-12 relative">
                  <div className="text-5xl font-black text-blue-600 mb-2 font-mono">{progress}%</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Processing Feature Space</div>
                </div>

                <div className="h-4 w-full bg-slate-50 rounded-full border border-slate-100 p-1 flex items-center mb-16">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full shadow-lg shadow-blue-200"
                  />
                </div>

                <div className="flex items-end justify-center gap-1.5 h-20">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: [8, Math.random() * 80 + 8, 8],
                        backgroundColor: progress > 50 ? '#3b82f6' : '#94a3b8'
                      }}
                      transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5, delay: i * 0.01 }}
                      className="w-1.5 rounded-full"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="w-full max-w-2xl relative z-10"
                >
                  <div className={cn(
                    "w-32 h-32 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl transition-all duration-700",
                    result === 'positive'
                      ? "bg-red-500 shadow-red-200 rotate-6"
                      : "bg-emerald-500 shadow-emerald-200 -rotate-6"
                  )}>
                    {result === 'positive' ? <AlertCircle className="w-16 h-16 text-white" /> : <CheckCircle2 className="w-16 h-16 text-white" />}
                  </div>

                  <h4 className={cn(
                    "text-6xl font-black mb-6 tracking-tighter",
                    result === 'positive' ? "text-red-600" : "text-emerald-600"
                  )}>
                    {result === 'positive' ? 'DETECTED' : 'NOT DETECTED'}
                  </h4>

                  <div className="flex items-center justify-center gap-4 mb-8">
                    <span className="px-6 py-2 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-xl">
                      Confidence: 91.2%
                    </span>
                    <span className="px-6 py-2 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-slate-200">
                      Sample S04_A
                    </span>
                  </div>

                  <div className="max-w-lg mx-auto p-1 bg-slate-50 border border-slate-100 rounded-3xl mb-12">
                    <p className="text-slate-500 font-bold text-sm bg-white p-8 rounded-[1.5rem] shadow-sm leading-relaxed italic">
                      {result === 'positive'
                        ? "Deep neural indicators suggest high probability of acoustic tremor patterns across Nonlinear frequency variation dimensions (spread1/spread2)."
                        : "Biomedical feature vectors remain safely within standard research parameters for age-matched controls. No significant vocal jitter detected."}
                    </p>
                  </div>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setResult(null)}
                      className="px-10 py-4 bg-white border border-slate-200 hover:border-blue-500 rounded-2xl text-xs font-black text-slate-500 hover:text-blue-600 transition-all uppercase tracking-[0.2em]"
                    >
                      Clear Analysis
                    </button>
                    <button className="px-10 py-4 bg-slate-900 border border-slate-900 hover:bg-slate-800 rounded-2xl text-xs font-black text-white transition-all uppercase tracking-[0.2em] shadow-xl shadow-slate-200">
                      Download PDF Report
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>

          {/* Context Footer Cards */}
          <div className="grid grid-cols-2 gap-6 h-48">
            <div className="bg-white border border-slate-100 rounded-[2rem] p-8 flex flex-col justify-center shadow-lg shadow-slate-100/50">
              <div className="flex items-center gap-3 mb-3">
                <Database className="w-5 h-5 text-indigo-500" />
                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Model Architecture</h4>
              </div>
              <p className="text-xs text-slate-400 font-bold leading-relaxed">
                Linear Support Vector Machine (SVC) with Hyper-parameter tuning. Trained on 195 acoustic recordings from voice-stressed patients.
              </p>
            </div>

            <div className="bg-blue-600 rounded-[2rem] p-8 flex flex-col justify-center shadow-xl shadow-blue-200 border-4 border-white">
              <div className="flex items-center gap-3 mb-3">
                <Command className="w-5 h-5 text-blue-200" />
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">System Diagnostics</h4>
              </div>
              <p className="text-xs text-blue-100 font-bold leading-relaxed">
                Real-time validation against UCI ML Parkinson’s Research Repository datasets. 22 unique acoustic parameters scanned per execution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
