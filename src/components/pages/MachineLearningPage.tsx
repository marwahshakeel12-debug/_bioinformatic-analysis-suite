import React, { useState } from 'react';
import { useBio } from '../../context/BioContext';
import { extractDnaFeatures } from '../../utils/mlEngine';
import {
  BrainCircuit,
  Play,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const MachineLearningPage: React.FC = () => {
  const {
    activeSequence,
    mlMetrics,
    mlPrediction,
    trainMl,
    predictSequenceMl,
    setActiveTab,
    showToast,
  } = useBio();

  const [customTestDna, setCustomTestDna] = useState(
    activeSequence?.type === 'DNA' ? activeSequence.sequence : ''
  );
  const [customResult, setCustomResult] = useState(mlPrediction);
  const [isTraining, setIsTraining] = useState(false);

  const handleTrain = () => {
    setIsTraining(true);
    setTimeout(() => {
      trainMl();
      setIsTraining(false);
      showToast('Random Forest trained on genomic regulatory dataset.', 'success');
    }, 400);
  };

  const handlePredictCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTestDna.trim()) {
      showToast('Please provide a DNA sequence to classify.', 'error');
      return;
    }
    const res = predictSequenceMl(customTestDna.trim());
    setCustomResult(res);
    showToast(`Classification: ${res.classification} (${(res.probability * 100).toFixed(1)}% confidence)`, 'success');
  };

  const loadActiveSeqIntoClassifier = () => {
    if (activeSequence && activeSequence.type === 'DNA') {
      setCustomTestDna(activeSequence.sequence);
      const res = predictSequenceMl(activeSequence.sequence);
      setCustomResult(res);
      showToast(`Loaded ${activeSequence.name} into ML classifier.`, 'info');
    } else {
      showToast('Active sequence is not a DNA sequence.', 'error');
    }
  };

  const cm = mlMetrics?.confusionMatrix || { tp: 5, fp: 0, fn: 0, tn: 5 };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#F8E1E7] text-[#49343D] border border-[#E8BFCB]">
              Supervised Classification
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#49343D]">
              Machine Learning: DNA Sequence Classification
            </h2>
          </div>
          <p className="text-xs text-[#49343D]/70 mt-1 max-w-2xl leading-relaxed">
            Random Forest Ensemble classifying regulatory elements (Promoters vs Non-promoters) using k-mers, CpG islands, and motif feature vectors.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleTrain}
            disabled={isTraining}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#D4AF72] hover:bg-[#c49e62] shadow-sm transition disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isTraining ? 'Training Model...' : 'Train Random Forest'}</span>
          </button>
        </div>
      </div>

      {/* Model Performance Evaluation Metrics */}
      {mlMetrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E8BFCB] rounded-2xl p-4 shadow-sm">
            <div className="text-[11px] uppercase font-bold text-[#49343D]/70">Accuracy</div>
            <div className="text-2xl font-bold text-[#49343D] mt-1">
              {(mlMetrics.accuracy * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] text-[#49343D]/60 mt-0.5">Test Split Correctness</div>
          </div>

          <div className="bg-white border border-[#E8BFCB] rounded-2xl p-4 shadow-sm">
            <div className="text-[11px] uppercase font-bold text-[#49343D]/70">Precision</div>
            <div className="text-2xl font-bold text-[#D4AF72] mt-1">
              {(mlMetrics.precision * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] text-[#49343D]/60 mt-0.5">TP / (TP + FP)</div>
          </div>

          <div className="bg-white border border-[#E8BFCB] rounded-2xl p-4 shadow-sm">
            <div className="text-[11px] uppercase font-bold text-[#49343D]/70">Recall</div>
            <div className="text-2xl font-bold text-[#49343D] mt-1">
              {(mlMetrics.recall * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] text-[#49343D]/60 mt-0.5">TP / (TP + FN)</div>
          </div>

          <div className="bg-white border border-[#E8BFCB] rounded-2xl p-4 shadow-sm">
            <div className="text-[11px] uppercase font-bold text-[#49343D]/70">F1-Score</div>
            <div className="text-2xl font-bold text-[#D4AF72] mt-1">
              {(mlMetrics.f1Score * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] text-[#49343D]/60 mt-0.5">Harmonic Mean</div>
          </div>
        </div>
      )}

      {/* Confusion Matrix & Feature Importance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confusion Matrix Card */}
        <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#49343D] uppercase tracking-wider">
              2x2 Confusion Matrix Visualizer
            </h3>
            <span className="text-xs text-[#49343D]/70">Independent Hold-Out Test Set</span>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-center font-mono my-2">
            {/* TP */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="text-xs text-emerald-800 font-bold">True Positive (TP)</div>
              <div className="text-2xl font-bold text-emerald-900 mt-1">{cm.tp}</div>
              <div className="text-[10px] text-emerald-700/80 mt-0.5">Promoter &rarr; Promoter</div>
            </div>

            {/* FP */}
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
              <div className="text-xs text-rose-800 font-bold">False Positive (FP)</div>
              <div className="text-2xl font-bold text-rose-900 mt-1">{cm.fp}</div>
              <div className="text-[10px] text-rose-700/80 mt-0.5">Non-promoter &rarr; Promoter</div>
            </div>

            {/* FN */}
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
              <div className="text-xs text-rose-800 font-bold">False Negative (FN)</div>
              <div className="text-2xl font-bold text-rose-900 mt-1">{cm.fn}</div>
              <div className="text-[10px] text-rose-700/80 mt-0.5">Promoter &rarr; Non-promoter</div>
            </div>

            {/* TN */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="text-xs text-emerald-800 font-bold">True Negative (TN)</div>
              <div className="text-2xl font-bold text-emerald-900 mt-1">{cm.tn}</div>
              <div className="text-[10px] text-emerald-700/80 mt-0.5">Non-promoter &rarr; Non-promoter</div>
            </div>
          </div>
        </div>

        {/* Feature Importance Card */}
        <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#49343D] uppercase tracking-wider">
              Random Forest Feature Importance
            </h3>
            <span className="text-xs text-[#49343D]/70">Gini Impurity Reduction</span>
          </div>

          <div className="space-y-3.5">
            {mlMetrics?.featureImportance.map((feat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs text-[#49343D]">
                  <span className="font-semibold">{feat.feature}</span>
                  <span className="font-mono text-[#D4AF72] font-bold">
                    {(feat.importance * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-[#F8E1E7] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#D4AF72] rounded-full transition-all"
                    style={{ width: `${feat.importance * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Prediction Tester */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#49343D] uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#D4AF72]" />
            Classify Sequence (Prediction Test)
          </h3>
          <button
            onClick={loadActiveSeqIntoClassifier}
            className="text-xs text-[#D4AF72] hover:text-[#c49e62] font-semibold underline"
          >
            Insert Active Sequence
          </button>
        </div>

        <form onSubmit={handlePredictCustom} className="space-y-3">
          <textarea
            rows={3}
            value={customTestDna}
            onChange={e => setCustomTestDna(e.target.value.toUpperCase())}
            placeholder="Paste DNA sequence to classify with Random Forest..."
            className="w-full bg-[#FFF9F7] border border-[#E8BFCB] rounded-xl p-3 font-mono text-xs text-[#49343D] placeholder-[#49343D]/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF72]"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-[#D4AF72] hover:bg-[#c49e62] text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center space-x-1.5"
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Predict Class</span>
            </button>
          </div>
        </form>

        {/* Prediction Output Card */}
        {customResult && (
          <div className="mt-5 p-4 rounded-xl bg-[#FFF9F7] border border-[#E8BFCB] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-[#49343D]/70 font-medium">Classification Result:</div>
              <div className="text-lg font-bold text-[#49343D] mt-0.5 flex items-center gap-2">
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                    customResult.classification === 'Promoter'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-[#F8E1E7] text-[#49343D] border border-[#E8BFCB]'
                  }`}
                >
                  {customResult.classification}
                </span>
                <span className="text-xs text-[#49343D]/70">
                  Confidence: <strong className="text-[#49343D]">{(customResult.probability * 100).toFixed(1)}%</strong>
                </span>
              </div>
              <div className="text-[11px] font-mono text-[#49343D]/70 mt-1">
                Extracted: {customResult.featuresExtracted.kmerSignature}
              </div>
            </div>

            <button
              onClick={() => setActiveTab('visualization')}
              className="px-4 py-2 bg-white hover:bg-[#F8E1E7]/50 text-[#49343D] text-xs font-semibold rounded-xl border border-[#E8BFCB] shrink-0 flex items-center space-x-1.5 transition"
            >
              <span>View in Visualizations</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF72]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
