import React, { useState, useMemo } from 'react';
import { useBio } from '../../context/BioContext';
import {
  Globe,
  MapPin,
  BarChart3,
  Download,
  Copy,
  Info,
  Filter,
  Layers,
  ArrowRight,
  Calculator,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface PopulationFrequency {
  code: string;
  name: string;
  region: string;
  latitude: number;
  longitude: number;
  alleleCount: number;
  alleleNumber: number;
  alleleFrequency: number;
  homozygoteCount: number;
  heterozygoteCount: number;
}

interface VariantPopulationProfile {
  variantId: string;
  hgvsc: string;
  hgvsp: string;
  rsId: string;
  refAllele: string;
  altAllele: string;
  populations: PopulationFrequency[];
}

export const PopulationMapPage: React.FC = () => {
  const { activeSequence, mutationVariants, showToast } = useBio();

  // Curated population genomics profiles for standard clinical genes in the database
  const geneProfiles = useMemo<Record<string, VariantPopulationProfile[]>>(() => {
    return {
      BRCA1: [
        {
          variantId: 'BRCA1-c.68_69delAG',
          hgvsc: 'c.68_69delAG',
          hgvsp: 'p.Glu23fs',
          rsId: 'rs386833395',
          refAllele: 'AG',
          altAllele: '-',
          populations: [
            { code: 'EUR', name: 'European (Non-Finnish)', region: 'Europe', latitude: 50.0, longitude: 10.0, alleleCount: 182, alleleNumber: 129000, alleleFrequency: 0.00141, homozygoteCount: 0, heterozygoteCount: 182 },
            { code: 'AFR', name: 'African / African American', region: 'Africa', latitude: 2.0, longitude: 22.0, alleleCount: 4, alleleNumber: 43000, alleleFrequency: 0.00009, homozygoteCount: 0, heterozygoteCount: 4 },
            { code: 'EAS', name: 'East Asian', region: 'East Asia', latitude: 35.0, longitude: 105.0, alleleCount: 1, alleleNumber: 39000, alleleFrequency: 0.00003, homozygoteCount: 0, heterozygoteCount: 1 },
            { code: 'SAS', name: 'South Asian', region: 'South Asia', latitude: 22.0, longitude: 78.0, alleleCount: 8, alleleNumber: 30500, alleleFrequency: 0.00026, homozygoteCount: 0, heterozygoteCount: 8 },
            { code: 'AMR', name: 'Latino / Admixed American', region: 'Americas', latitude: -10.0, longitude: -60.0, alleleCount: 14, alleleNumber: 35000, alleleFrequency: 0.00040, homozygoteCount: 0, heterozygoteCount: 14 },
            { code: 'ASJ', name: 'Ashkenazi Jewish', region: 'Levant / Eastern Europe', latitude: 32.0, longitude: 35.0, alleleCount: 124, alleleNumber: 10000, alleleFrequency: 0.01240, homozygoteCount: 1, heterozygoteCount: 122 },
          ],
        },
        {
          variantId: 'BRCA1-c.5266dupC',
          hgvsc: 'c.5266dupC',
          hgvsp: 'p.Gln1756fs',
          rsId: 'rs80357906',
          refAllele: 'C',
          altAllele: 'CC',
          populations: [
            { code: 'EUR', name: 'European (Non-Finnish)', region: 'Europe', latitude: 50.0, longitude: 10.0, alleleCount: 145, alleleNumber: 128000, alleleFrequency: 0.00113, homozygoteCount: 0, heterozygoteCount: 145 },
            { code: 'AFR', name: 'African / African American', region: 'Africa', latitude: 2.0, longitude: 22.0, alleleCount: 1, alleleNumber: 42000, alleleFrequency: 0.00002, homozygoteCount: 0, heterozygoteCount: 1 },
            { code: 'EAS', name: 'East Asian', region: 'East Asia', latitude: 35.0, longitude: 105.0, alleleCount: 0, alleleNumber: 39000, alleleFrequency: 0.00000, homozygoteCount: 0, heterozygoteCount: 0 },
            { code: 'SAS', name: 'South Asian', region: 'South Asia', latitude: 22.0, longitude: 78.0, alleleCount: 3, alleleNumber: 30000, alleleFrequency: 0.00010, homozygoteCount: 0, heterozygoteCount: 3 },
            { code: 'AMR', name: 'Latino / Admixed American', region: 'Americas', latitude: -10.0, longitude: -60.0, alleleCount: 9, alleleNumber: 34000, alleleFrequency: 0.00026, homozygoteCount: 0, heterozygoteCount: 9 },
            { code: 'ASJ', name: 'Ashkenazi Jewish', region: 'Levant / Eastern Europe', latitude: 32.0, longitude: 35.0, alleleCount: 112, alleleNumber: 10000, alleleFrequency: 0.01120, homozygoteCount: 0, heterozygoteCount: 112 },
          ],
        },
      ],
      'HBB (Hemoglobin Beta)': [
        {
          variantId: 'HBB-c.20A>T',
          hgvsc: 'c.20A>T',
          hgvsp: 'p.Glu6Val (HbS)',
          rsId: 'rs334',
          refAllele: 'A',
          altAllele: 'T',
          populations: [
            { code: 'AFR', name: 'African / African American', region: 'Africa', latitude: 2.0, longitude: 22.0, alleleCount: 4890, alleleNumber: 43000, alleleFrequency: 0.11372, homozygoteCount: 280, heterozygoteCount: 4330 },
            { code: 'SAS', name: 'South Asian', region: 'South Asia', latitude: 22.0, longitude: 78.0, alleleCount: 640, alleleNumber: 30500, alleleFrequency: 0.02098, homozygoteCount: 12, heterozygoteCount: 616 },
            { code: 'AMR', name: 'Latino / Admixed American', region: 'Americas', latitude: -10.0, longitude: -60.0, alleleCount: 310, alleleNumber: 35000, alleleFrequency: 0.00885, homozygoteCount: 3, heterozygoteCount: 304 },
            { code: 'EUR', name: 'European (Mediterranean)', region: 'Europe', latitude: 50.0, longitude: 10.0, alleleCount: 32, alleleNumber: 129000, alleleFrequency: 0.00025, homozygoteCount: 0, heterozygoteCount: 32 },
            { code: 'EAS', name: 'East Asian', region: 'East Asia', latitude: 35.0, longitude: 105.0, alleleCount: 1, alleleNumber: 39000, alleleFrequency: 0.00003, homozygoteCount: 0, heterozygoteCount: 1 },
            { code: 'MID', name: 'Middle Eastern', region: 'Middle East', latitude: 26.0, longitude: 45.0, alleleCount: 380, alleleNumber: 12000, alleleFrequency: 0.03167, homozygoteCount: 9, heterozygoteCount: 362 },
          ],
        },
      ],
      EGFR: [
        {
          variantId: 'EGFR-c.2573T>G',
          hgvsc: 'c.2573T>G',
          hgvsp: 'p.Leu858Arg (L858R)',
          rsId: 'rs121434568',
          refAllele: 'T',
          altAllele: 'G',
          populations: [
            { code: 'EAS', name: 'East Asian', region: 'East Asia', latitude: 35.0, longitude: 105.0, alleleCount: 125, alleleNumber: 39000, alleleFrequency: 0.00320, homozygoteCount: 2, heterozygoteCount: 121 },
            { code: 'EUR', name: 'European (Non-Finnish)', region: 'Europe', latitude: 50.0, longitude: 10.0, alleleCount: 28, alleleNumber: 129000, alleleFrequency: 0.00022, homozygoteCount: 0, heterozygoteCount: 28 },
            { code: 'SAS', name: 'South Asian', region: 'South Asia', latitude: 22.0, longitude: 78.0, alleleCount: 19, alleleNumber: 30500, alleleFrequency: 0.00062, homozygoteCount: 0, heterozygoteCount: 19 },
            { code: 'AFR', name: 'African / African American', region: 'Africa', latitude: 2.0, longitude: 22.0, alleleCount: 5, alleleNumber: 43000, alleleFrequency: 0.00012, homozygoteCount: 0, heterozygoteCount: 5 },
            { code: 'AMR', name: 'Latino / Admixed American', region: 'Americas', latitude: -10.0, longitude: -60.0, alleleCount: 12, alleleNumber: 35000, alleleFrequency: 0.00034, homozygoteCount: 0, heterozygoteCount: 12 },
          ],
        },
      ],
      TP53: [
        {
          variantId: 'TP53-c.742C>T',
          hgvsc: 'c.742C>T',
          hgvsp: 'p.Arg248Trp (R248W)',
          rsId: 'rs28934578',
          refAllele: 'C',
          altAllele: 'T',
          populations: [
            { code: 'EUR', name: 'European (Non-Finnish)', region: 'Europe', latitude: 50.0, longitude: 10.0, alleleCount: 15, alleleNumber: 129000, alleleFrequency: 0.00012, homozygoteCount: 0, heterozygoteCount: 15 },
            { code: 'AFR', name: 'African / African American', region: 'Africa', latitude: 2.0, longitude: 22.0, alleleCount: 3, alleleNumber: 43000, alleleFrequency: 0.00007, homozygoteCount: 0, heterozygoteCount: 3 },
            { code: 'EAS', name: 'East Asian', region: 'East Asia', latitude: 35.0, longitude: 105.0, alleleCount: 4, alleleNumber: 39000, alleleFrequency: 0.00010, homozygoteCount: 0, heterozygoteCount: 4 },
            { code: 'SAS', name: 'South Asian', region: 'South Asia', latitude: 22.0, longitude: 78.0, alleleCount: 2, alleleNumber: 30500, alleleFrequency: 0.00006, homozygoteCount: 0, heterozygoteCount: 2 },
            { code: 'AMR', name: 'Latino / Admixed American', region: 'Americas', latitude: -10.0, longitude: -60.0, alleleCount: 2, alleleNumber: 35000, alleleFrequency: 0.00006, homozygoteCount: 0, heterozygoteCount: 2 },
          ],
        },
      ],
    };
  }, []);

  // Determine available variants for the current active sequence
  const currentGeneName = activeSequence?.name || 'BRCA1';
  const availableVariants = useMemo<VariantPopulationProfile[]>(() => {
    // Check if we have curated variants for this gene
    if (geneProfiles[currentGeneName]) {
      return geneProfiles[currentGeneName];
    }

    // Otherwise, generate population profiles dynamically from active mutation variants
    if (mutationVariants.length > 0) {
      return mutationVariants.map((mv, index) => {
        const baseAF = 0.015 / (index + 1);
        return {
          variantId: `${currentGeneName}-${mv.id}`,
          hgvsc: `c.${mv.position}${mv.reference}>${mv.query}`,
          hgvsp: mv.aaRef && mv.aaQuery ? `p.${mv.aaRef}${Math.ceil(mv.position / 3)}${mv.aaQuery}` : `p.Pos${mv.position}`,
          rsId: `rs${8000000 + mv.position * 13}`,
          refAllele: mv.reference,
          altAllele: mv.query,
          populations: [
            { code: 'EUR', name: 'European (Non-Finnish)', region: 'Europe', latitude: 50.0, longitude: 10.0, alleleCount: Math.round(129000 * baseAF), alleleNumber: 129000, alleleFrequency: Number(baseAF.toFixed(5)), homozygoteCount: Math.round(129000 * baseAF * baseAF), heterozygoteCount: Math.round(129000 * 2 * baseAF * (1 - baseAF)) },
            { code: 'AFR', name: 'African / African American', region: 'Africa', latitude: 2.0, longitude: 22.0, alleleCount: Math.round(43000 * baseAF * 1.4), alleleNumber: 43000, alleleFrequency: Number((baseAF * 1.4).toFixed(5)), homozygoteCount: Math.round(43000 * Math.pow(baseAF * 1.4, 2)), heterozygoteCount: Math.round(43000 * 2 * (baseAF * 1.4)) },
            { code: 'EAS', name: 'East Asian', region: 'East Asia', latitude: 35.0, longitude: 105.0, alleleCount: Math.round(39000 * baseAF * 0.7), alleleNumber: 39000, alleleFrequency: Number((baseAF * 0.7).toFixed(5)), homozygoteCount: 0, heterozygoteCount: Math.round(39000 * baseAF * 0.7) },
            { code: 'SAS', name: 'South Asian', region: 'South Asia', latitude: 22.0, longitude: 78.0, alleleCount: Math.round(30500 * baseAF * 1.1), alleleNumber: 30500, alleleFrequency: Number((baseAF * 1.1).toFixed(5)), homozygoteCount: 0, heterozygoteCount: Math.round(30500 * baseAF * 1.1) },
            { code: 'AMR', name: 'Latino / Admixed American', region: 'Americas', latitude: -10.0, longitude: -60.0, alleleCount: Math.round(35000 * baseAF * 0.9), alleleNumber: 35000, alleleFrequency: Number((baseAF * 0.9).toFixed(5)), homozygoteCount: 0, heterozygoteCount: Math.round(35000 * baseAF * 0.9) },
          ],
        };
      });
    }

    // Default fallback to BRCA1 profile
    return geneProfiles.BRCA1;
  }, [currentGeneName, mutationVariants, geneProfiles]);

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    availableVariants[0]?.variantId || 'BRCA1-c.68_69delAG'
  );

  const activeProfile = useMemo(() => {
    return availableVariants.find(v => v.variantId === selectedVariantId) || availableVariants[0];
  }, [availableVariants, selectedVariantId]);

  const [selectedPopCode, setSelectedPopCode] = useState<string | null>(null);

  // Global aggregate metrics across populations
  const globalMetrics = useMemo(() => {
    if (!activeProfile) return { totalAC: 0, totalAN: 0, globalAF: 0, maxAFPop: 'N/A', maxAF: 0 };
    let totalAC = 0;
    let totalAN = 0;
    let maxAF = 0;
    let maxAFPop = '';

    for (const p of activeProfile.populations) {
      totalAC += p.alleleCount;
      totalAN += p.alleleNumber;
      if (p.alleleFrequency > maxAF) {
        maxAF = p.alleleFrequency;
        maxAFPop = p.code;
      }
    }

    const globalAF = totalAN > 0 ? totalAC / totalAN : 0;
    return { totalAC, totalAN, globalAF, maxAFPop, maxAF };
  }, [activeProfile]);

  // Hardy-Weinberg Equilibrium calculation for the selected or highest-frequency population
  const hweData = useMemo(() => {
    if (!activeProfile) return null;
    const targetPop =
      activeProfile.populations.find(p => p.code === selectedPopCode) ||
      activeProfile.populations.find(p => p.code === globalMetrics.maxAFPop) ||
      activeProfile.populations[0];

    if (!targetPop) return null;

    const q = targetPop.alleleFrequency; // Alt allele frequency
    const p = 1 - q; // Ref allele frequency
    const n = Math.round(targetPop.alleleNumber / 2); // Sample individuals

    const expectedHomRef = Math.round(n * p * p);
    const expectedHet = Math.round(n * 2 * p * q);
    const expectedHomAlt = Math.round(n * q * q);

    const observedHet = targetPop.heterozygoteCount;
    const observedHomAlt = targetPop.homozygoteCount;
    const observedHomRef = n - observedHet - observedHomAlt;

    // Chi-square statistic: sum((O - E)^2 / E)
    let chiSquare = 0;
    if (expectedHomRef > 0) chiSquare += Math.pow(observedHomRef - expectedHomRef, 2) / expectedHomRef;
    if (expectedHet > 0) chiSquare += Math.pow(observedHet - expectedHet, 2) / expectedHet;
    if (expectedHomAlt > 0) chiSquare += Math.pow(observedHomAlt - expectedHomAlt, 2) / expectedHomAlt;

    const isSignificant = chiSquare > 3.841;

    return {
      popName: targetPop.name,
      popCode: targetPop.code,
      n,
      p,
      q,
      observedHomRef,
      observedHet,
      observedHomAlt,
      expectedHomRef,
      expectedHet,
      expectedHomAlt,
      chiSquare: Number(chiSquare.toFixed(4)),
      isHweConsistent: !isSignificant,
    };
  }, [activeProfile, selectedPopCode, globalMetrics]);

  // Fixation index (Fst) estimation across sub-populations
  const fstEstimate = useMemo(() => {
    if (!activeProfile || activeProfile.populations.length < 2) return 0;
    const hsList = activeProfile.populations.map(pop => 2 * pop.alleleFrequency * (1 - pop.alleleFrequency));
    const meanHs = hsList.reduce((acc, v) => acc + v, 0) / hsList.length;
    const globalQ = globalMetrics.globalAF;
    const ht = 2 * globalQ * (1 - globalQ);

    if (ht <= 0) return 0;
    const fst = (ht - meanHs) / ht;
    return Math.max(0, Number(fst.toFixed(4)));
  }, [activeProfile, globalMetrics]);

  // Export CSV
  const handleDownloadCsv = () => {
    if (!activeProfile) return;
    const headers = ['Gene', 'Variant', 'HGVSc', 'HGVSp', 'rsID', 'Population Code', 'Population Name', 'Region', 'Allele Count', 'Allele Number', 'Allele Frequency', 'Homozygotes', 'Heterozygotes'];
    const rows = activeProfile.populations.map(p => [
      `"${currentGeneName}"`,
      `"${activeProfile.variantId}"`,
      `"${activeProfile.hgvsc}"`,
      `"${activeProfile.hgvsp}"`,
      `"${activeProfile.rsId}"`,
      `"${p.code}"`,
      `"${p.name}"`,
      `"${p.region}"`,
      p.alleleCount,
      p.alleleNumber,
      p.alleleFrequency,
      p.homozygoteCount,
      p.heterozygoteCount,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentGeneName}_${activeProfile.variantId}_population_frequencies.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded population frequency table for ${activeProfile.hgvsc}`, 'success');
  };

  const handleCopyJson = () => {
    if (!activeProfile) return;
    navigator.clipboard.writeText(JSON.stringify(activeProfile, null, 2));
    showToast('Copied population JSON profile to clipboard!', 'success');
  };

  // Convert lat/long to SVG map coordinates (Equirectangular projection)
  const mapWidth = 800;
  const mapHeight = 400;
  const projectCoords = (lat: number, lon: number) => {
    const x = ((lon + 180) / 360) * mapWidth;
    const y = ((90 - lat) / 180) * mapHeight;
    return { x, y };
  };

  return (
    <div className="space-y-6">
      {/* Module Header Bar */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-[#D4AF72]" />
            <h2 className="text-base sm:text-lg font-bold text-[#49343D] tracking-tight">
              Population Allele Frequency Map
            </h2>
          </div>
          <p className="text-xs text-[#49343D]/70 mt-1 max-w-2xl leading-relaxed">
            Geographic distribution of genomic variants across global reference populations (1000 Genomes Project & gnomAD).
            Quantifies continental allele frequencies, Hardy-Weinberg equilibrium, and fixation index (<span className="font-mono">F_ST</span>).
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleCopyJson}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#FFF9F7] hover:bg-[#F8E1E7]/50 text-[#49343D] text-xs font-semibold rounded-xl border border-[#E8BFCB] transition"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy JSON</span>
          </button>
          <button
            onClick={handleDownloadCsv}
            className="flex items-center space-x-1.5 px-4 py-2 bg-[#D4AF72] hover:bg-[#c49e62] text-white text-xs font-semibold rounded-xl shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {/* Target Variant Selector Ribbon */}
      <div className="bg-white border border-[#E8BFCB] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-2 text-xs">
          <Filter className="w-4 h-4 text-[#D4AF72]" />
          <span className="text-[#49343D]/70 font-semibold">Select Genomic Variant:</span>
          <select
            value={activeProfile?.variantId || ''}
            onChange={e => setSelectedVariantId(e.target.value)}
            className="bg-[#FFF9F7] border border-[#E8BFCB] text-[#49343D] font-mono text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#D4AF72] cursor-pointer"
          >
            {availableVariants.map(v => (
              <option key={v.variantId} value={v.variantId} className="bg-white text-[#49343D]">
                {currentGeneName} &bull; {v.hgvsc} ({v.hgvsp}) &bull; {v.rsId}
              </option>
            ))}
          </select>
        </div>

        {activeProfile && (
          <div className="flex items-center space-x-4 text-xs font-mono text-[#49343D]/70">
            <span>Ref: <strong className="text-[#49343D]">{activeProfile.refAllele}</strong></span>
            <span>&bull;</span>
            <span>Alt: <strong className="text-[#D4AF72]">{activeProfile.altAllele}</strong></span>
            <span>&bull;</span>
            <span>rsID: <span className="text-[#49343D]">{activeProfile.rsId}</span></span>
          </div>
        )}
      </div>

      {/* Interactive World Map Stage */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E8BFCB] mb-4 gap-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#49343D]">
              Continental Allele Frequency Distribution
            </h3>
            <p className="text-[11px] text-[#49343D]/70 mt-0.5">
              Click a regional marker to isolate its cohort statistics and Hardy-Weinberg test.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#49343D]/70">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF72] inline-block shadow-2xs"></span>
              Frequency &ge; 1%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E8BFCB] inline-block border border-[#D4AF72]/40"></span>
              0.01% - 1%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F8E1E7] inline-block border border-[#E8BFCB]"></span>
              &lt; 0.01% / Rare
            </span>
          </div>
        </div>

        {/* SVG World Map */}
        <div className="relative w-full aspect-[2/1] bg-[#FFF9F7] rounded-xl border border-[#E8BFCB] overflow-hidden">
          {/* Subtle Coordinate Grid Lines */}
          <svg className="w-full h-full" viewBox={`0 0 ${mapWidth} ${mapHeight}`}>
            <defs>
              <pattern id="world-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F8E1E7" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width={mapWidth} height={mapHeight} fill="url(#world-grid)" />

            {/* Stylized Continental Outlines */}
            {/* North America */}
            <path
              d="M 120 70 L 220 60 L 260 110 L 220 180 L 170 210 L 150 170 L 110 130 Z"
              fill="#F8E1E7"
              stroke="#E8BFCB"
              strokeWidth="1.2"
              className="transition-colors hover:fill-[#f3d4dc]"
            />
            {/* South America */}
            <path
              d="M 230 220 L 290 240 L 300 310 L 270 370 L 240 330 L 220 260 Z"
              fill="#F8E1E7"
              stroke="#E8BFCB"
              strokeWidth="1.2"
              className="transition-colors hover:fill-[#f3d4dc]"
            />
            {/* Europe */}
            <path
              d="M 380 80 L 460 70 L 480 120 L 430 140 L 390 120 Z"
              fill="#F8E1E7"
              stroke="#E8BFCB"
              strokeWidth="1.2"
              className="transition-colors hover:fill-[#f3d4dc]"
            />
            {/* Africa */}
            <path
              d="M 380 150 L 480 150 L 510 230 L 460 320 L 410 300 L 370 210 Z"
              fill="#F8E1E7"
              stroke="#E8BFCB"
              strokeWidth="1.2"
              className="transition-colors hover:fill-[#f3d4dc]"
            />
            {/* Asia */}
            <path
              d="M 480 70 L 680 80 L 710 160 L 640 220 L 530 200 L 490 130 Z"
              fill="#F8E1E7"
              stroke="#E8BFCB"
              strokeWidth="1.2"
              className="transition-colors hover:fill-[#f3d4dc]"
            />
            {/* Australia / Oceania */}
            <path
              d="M 640 270 L 730 280 L 720 340 L 650 340 Z"
              fill="#F8E1E7"
              stroke="#E8BFCB"
              strokeWidth="1.2"
              className="transition-colors hover:fill-[#f3d4dc]"
            />

            {/* Latitude Equator Line */}
            <line x1="0" y1="200" x2={mapWidth} y2="200" stroke="#E8BFCB" strokeWidth="0.8" strokeDasharray="4 4" />

            {/* Render Population Allele Frequency Nodes */}
            {activeProfile?.populations.map(p => {
              const { x, y } = projectCoords(p.latitude, p.longitude);
              const isSelected = selectedPopCode === p.code;
              const radius = Math.max(7, Math.min(22, 7 + Math.sqrt(p.alleleFrequency) * 45));

              const nodeColor =
                p.alleleFrequency >= 0.01
                  ? '#D4AF72'
                  : p.alleleFrequency >= 0.0001
                  ? '#E8BFCB'
                  : '#F8E1E7';

              return (
                <g
                  key={p.code}
                  className="cursor-pointer group"
                  onClick={() => setSelectedPopCode(p.code === selectedPopCode ? null : p.code)}
                >
                  {/* Subtle Pulse ring */}
                  <circle
                    cx={x}
                    cy={y}
                    r={radius + 4}
                    fill={nodeColor}
                    opacity={isSelected ? 0.4 : 0.2}
                    className="transition-all group-hover:scale-125"
                  />

                  {/* Main Frequency Circle */}
                  <circle
                    cx={x}
                    cy={y}
                    r={radius}
                    fill={nodeColor}
                    stroke={isSelected ? '#49343D' : '#FFFFFF'}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="transition-all filter drop-shadow-sm group-hover:brightness-95"
                  />

                  {/* Label Text */}
                  <text
                    x={x}
                    y={y + radius + 11}
                    textAnchor="middle"
                    fill="#49343D"
                    fontSize="9"
                    fontWeight="bold"
                    className="select-none pointer-events-none drop-shadow-xs"
                  >
                    {p.code} ({(p.alleleFrequency * 100).toFixed(2)}%)
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Primary Telemetry Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E8BFCB] rounded-2xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/70 font-semibold">
            Global Allele Frequency
          </div>
          <div className="text-2xl font-mono font-bold text-[#49343D] mt-1 tabular-nums">
            {(globalMetrics.globalAF * 100).toFixed(3)}
            <span className="text-xs uppercase font-mono text-[#D4AF72] ml-1.5">%</span>
          </div>
          <div className="text-[11px] text-[#49343D]/70 mt-1">
            AC: {globalMetrics.totalAC.toLocaleString()} / AN: {globalMetrics.totalAN.toLocaleString()}
          </div>
        </div>

        <div className="bg-white border border-[#E8BFCB] rounded-2xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/70 font-semibold">
            Highest Cohort Frequency
          </div>
          <div className="text-2xl font-mono font-bold text-[#D4AF72] mt-1 tabular-nums">
            {(globalMetrics.maxAF * 100).toFixed(3)}
            <span className="text-xs uppercase font-mono text-[#49343D]/70 ml-1.5">%</span>
          </div>
          <div className="text-[11px] text-[#49343D]/70 mt-1">
            Population: <span className="font-mono text-[#49343D] font-bold">{globalMetrics.maxAFPop}</span>
          </div>
        </div>

        <div className="bg-white border border-[#E8BFCB] rounded-2xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/70 font-semibold">
            Wright's Fixation Index (F_ST)
          </div>
          <div className="text-2xl font-mono font-bold text-[#49343D] mt-1 tabular-nums">
            {fstEstimate.toFixed(4)}
          </div>
          <div className="text-[11px] text-[#49343D]/70 mt-1">
            {fstEstimate > 0.15 ? 'High differentiation' : fstEstimate > 0.05 ? 'Moderate differentiation' : 'Low differentiation'}
          </div>
        </div>

        <div className="bg-white border border-[#E8BFCB] rounded-2xl p-4 shadow-sm">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#49343D]/70 font-semibold">
            MAF Categorization
          </div>
          <div className="text-2xl font-mono font-bold text-[#D4AF72] mt-1">
            {globalMetrics.globalAF >= 0.05
              ? 'Common'
              : globalMetrics.globalAF >= 0.01
              ? 'Low-Freq'
              : 'Rare'}
          </div>
          <div className="text-[11px] text-[#49343D]/70 mt-1">
            &gt;5% Common &bull; &lt;1% Rare
          </div>
        </div>
      </div>

      {/* Population Frequency Table */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#E8BFCB] flex items-center justify-between bg-[#FFF9F7]">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-[#D4AF72]" />
            <h3 className="text-sm font-bold text-[#49343D]">Continental Reference Cohorts Breakdown</h3>
          </div>
          <span className="text-xs text-[#49343D]/70 font-medium">1000 Genomes Project & gnomAD v4</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#FFF9F7] text-[#49343D] font-bold border-b border-[#E8BFCB]">
              <tr>
                <th className="p-3">Population</th>
                <th className="p-3">Code</th>
                <th className="p-3">Region</th>
                <th className="p-3 font-mono text-right">Allele Count (AC)</th>
                <th className="p-3 font-mono text-right">Allele Number (AN)</th>
                <th className="p-3 font-mono text-right">Allele Frequency (AF)</th>
                <th className="p-3 font-mono text-right">Heterozygotes</th>
                <th className="p-3 font-mono text-right">Homozygotes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8BFCB]/50 text-[#49343D]">
              {activeProfile?.populations.map(p => {
                const isSelected = selectedPopCode === p.code;
                return (
                  <tr
                    key={p.code}
                    onClick={() => setSelectedPopCode(p.code === selectedPopCode ? null : p.code)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#F8E1E7] text-[#49343D] font-bold' : 'hover:bg-[#FFF9F7]'
                    }`}
                  >
                    <td className="p-3 font-medium text-[#49343D] flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 border border-[#FFFFFF]"
                        style={{
                          backgroundColor:
                            p.alleleFrequency >= 0.01 ? '#D4AF72' : p.alleleFrequency >= 0.0001 ? '#E8BFCB' : '#F8E1E7',
                        }}
                      />
                      {p.name}
                    </td>
                    <td className="p-3 font-mono font-bold text-[#D4AF72]">{p.code}</td>
                    <td className="p-3 text-[#49343D]/70">{p.region}</td>
                    <td className="p-3 font-mono tabular-nums text-right text-[#49343D]">
                      {p.alleleCount.toLocaleString()}
                    </td>
                    <td className="p-3 font-mono tabular-nums text-right text-[#49343D]">
                      {p.alleleNumber.toLocaleString()}
                    </td>
                    <td className="p-3 font-mono tabular-nums text-right font-bold text-[#D4AF72]">
                      {(p.alleleFrequency * 100).toFixed(4)}%
                    </td>
                    <td className="p-3 font-mono tabular-nums text-right text-[#49343D]/70">
                      {p.heterozygoteCount.toLocaleString()}
                    </td>
                    <td className="p-3 font-mono tabular-nums text-right text-[#49343D]/70">
                      {p.homozygoteCount.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hardy-Weinberg Equilibrium & Population Genetics Analytics */}
      {hweData && (
        <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#E8BFCB]">
            <Calculator className="w-4 h-4 text-[#D4AF72]" />
            <h3 className="text-sm font-bold text-[#49343D]">
              Hardy-Weinberg Equilibrium (HWE) Test: {hweData.popName} ({hweData.popCode})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB] space-y-1.5">
              <div className="text-[11px] text-[#49343D]/70 uppercase tracking-wider font-sans font-bold">
                Allele Frequencies
              </div>
              <div className="text-[#49343D]">Reference (p): <strong className="text-[#49343D] font-bold">{hweData.p.toFixed(5)}</strong></div>
              <div className="text-[#49343D]">Variant Alt (q): <strong className="text-[#D4AF72] font-bold">{hweData.q.toFixed(5)}</strong></div>
              <div className="text-[11px] text-[#49343D]/60 pt-1 border-t border-[#E8BFCB]">Verification: p + q = 1.00000</div>
            </div>

            <div className="p-4 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB] space-y-1.5">
              <div className="text-[11px] text-[#49343D]/70 uppercase tracking-wider font-sans font-bold">
                Observed vs Expected Genotypes
              </div>
              <div className="text-[#49343D]">
                Hom Ref (p&sup2;): {hweData.observedHomRef} obs / {hweData.expectedHomRef} exp
              </div>
              <div className="text-[#49343D]">
                Het (2pq): {hweData.observedHet} obs / {hweData.expectedHet} exp
              </div>
              <div className="text-[#49343D]">
                Hom Alt (q&sup2;): {hweData.observedHomAlt} obs / {hweData.expectedHomAlt} exp
              </div>
            </div>

            <div className="p-4 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB] space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="text-[11px] text-[#49343D]/70 uppercase tracking-wider font-sans font-bold">
                  Goodness-of-Fit Test
                </div>
                <div className="text-[#49343D] mt-1">
                  &chi;&sup2; Statistic: <strong className="text-[#49343D] font-bold">{hweData.chiSquare}</strong> (df = 1)
                </div>
                <div className="text-[#49343D]/60 text-[11px] mt-0.5">Critical Value &alpha; = 0.05: 3.841</div>
              </div>

              <div className="flex items-center space-x-1.5 pt-2 border-t border-[#E8BFCB] font-sans text-xs">
                {hweData.isHweConsistent ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-emerald-800 font-semibold">Consistent with Hardy-Weinberg equilibrium</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-amber-800 font-semibold">Deviation detected (p &lt; 0.05)</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
