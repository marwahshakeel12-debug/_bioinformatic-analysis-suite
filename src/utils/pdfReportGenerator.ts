import {
  BiologicalSequence,
  UserRecord,
  DnaAnalysisResult,
  ProteinAnalysisResult,
  OrfResult,
  MotifResult,
  AlignmentResult,
  MutationVariant,
  MLMetrics,
  MLPredictionResult,
} from '../types/bio';

export interface FullReportData {
  user: UserRecord | null;
  sequence: BiologicalSequence | null;
  dnaAnalysis: DnaAnalysisResult | null;
  proteinAnalysis: ProteinAnalysisResult | null;
  orfs: OrfResult[];
  motifResult: MotifResult | null;
  translatedProtein: string;
  alignment: AlignmentResult | null;
  mutations: MutationVariant[];
  vcf: string;
  mlMetrics: MLMetrics | null;
  mlPrediction: MLPredictionResult | null;
}

export function generateReportHtml(data: FullReportData): string {
  const now = new Date();
  const formattedDate = now.toLocaleString();
  const user = data.user || { userId: 'BIO001', username: 'Guest Analyst', registrationDate: 'N/A' };
  const seq: BiologicalSequence = data.sequence || {
    id: 'FALLBACK',
    name: 'N/A',
    accession: 'N/A',
    organism: 'N/A',
    length: 0,
    sequence: '',
    description: 'No sequence loaded',
    type: 'DNA',
    source: 'MANUAL',
    fastaHeader: '',
  };

  const orfsListHtml = data.orfs
    .slice(0, 6)
    .map(
      (o, idx) => `
    <tr>
      <td style="padding: 6px 10px; border: 1px solid #cbd5e1;">#${o.id} ${o.isLongest ? '<strong>(Longest)</strong>' : ''}</td>
      <td style="padding: 6px 10px; border: 1px solid #cbd5e1; font-weight: bold;">${o.frame}</td>
      <td style="padding: 6px 10px; border: 1px solid #cbd5e1;">${o.start}</td>
      <td style="padding: 6px 10px; border: 1px solid #cbd5e1;">${o.stop}</td>
      <td style="padding: 6px 10px; border: 1px solid #cbd5e1;">${o.length} bp</td>
      <td style="padding: 6px 10px; border: 1px solid #cbd5e1; font-family: monospace; font-size: 11px;">${o.translatedProtein.substring(0, 30)}...</td>
    </tr>
  `
    )
    .join('');

  const mutationsHtml = data.mutations
    .map(
      m => `
    <tr>
      <td style="padding: 6px 10px; border: 1px solid #cbd5e1; font-weight: bold;">${m.position}</td>
      <td style="padding: 6px 10px; border: 1px solid #cbd5e1; font-family: monospace; color: #1e40af;">${m.reference}</td>
      <td style="padding: 6px 10px; border: 1px solid #cbd5e1; font-family: monospace; color: #b91c1c;">${m.query}</td>
      <td style="padding: 6px 10px; border: 1px solid #cbd5e1;"><span style="background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${m.mutationType}</span></td>
      <td style="padding: 6px 10px; border: 1px solid #cbd5e1;">${m.subtype || '-'}</td>
      <td style="padding: 6px 10px; border: 1px solid #cbd5e1;">${m.impact || '-'}</td>
      <td style="padding: 6px 10px; border: 1px solid #cbd5e1; font-family: monospace;">${m.aaRef ? `${m.aaRef} &rarr; ${m.aaQuery}` : '-'}</td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Bioinformatics Analysis Report - ${seq.name} (${seq.accession})</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      color: #0f172a;
      background: #ffffff;
      padding: 30px;
      margin: 0;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
      .page-break { page-break-before: always; }
    }
    .header-box {
      border-bottom: 3px solid #D4AF72;
      padding-bottom: 15px;
      margin-bottom: 25px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge-primary { background: #F8E1E7; color: #49343D; }
    .badge-success { background: #dcfce7; color: #15803d; }
    h1 { margin: 0 0 6px 0; font-size: 24px; color: #49343D; }
    h2 { font-size: 16px; margin: 24px 0 10px 0; color: #49343D; border-left: 4px solid #D4AF72; padding-left: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
    .card { background: #FFF9F7; border: 1px solid #E8BFCB; border-radius: 6px; padding: 14px; }
    .metric-val { font-size: 20px; font-weight: bold; color: #49343D; margin-top: 4px; }
    .metric-label { font-size: 11px; text-transform: uppercase; color: #49343D; opacity: 0.7; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
    th { background: #F8E1E7; text-align: left; padding: 8px 10px; border: 1px solid #E8BFCB; font-size: 11px; text-transform: uppercase; color: #49343D; }
    pre { background: #FFF9F7; color: #49343D; border: 1px solid #E8BFCB; padding: 12px; border-radius: 6px; font-family: "JetBrains Mono", Consolas, monospace; font-size: 11px; overflow-x: auto; white-space: pre-wrap; word-break: break-all; }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; display: flex; gap: 10px; justify-content: flex-end;">
    <button onclick="window.print()" style="background: #D4AF72; color: #fff; border: none; padding: 10px 18px; border-radius: 6px; font-weight: 600; cursor: pointer;">Print / Save as PDF</button>
    <button onclick="window.close()" style="background: #F8E1E7; color: #49343D; border: 1px solid #E8BFCB; padding: 10px 18px; border-radius: 6px; font-weight: 600; cursor: pointer;">Close</button>
  </div>

  <div class="header-box">
    <div>
      <h1 style="color: #49343D;">Bioinformatics Analysis Suite (BAS) Report</h1>
      <div style="font-size: 13px; color: #49343D; opacity: 0.8;">
        Integrated Platform for Biological Sequence Analysis &bull; Automated Pipeline Output
      </div>
    </div>
    <div style="text-align: right; font-size: 12px; color: #49343D; opacity: 0.7;">
      <div><strong>Report Generated:</strong> ${formattedDate}</div>
      <div><strong>System Version:</strong> v1.0.0 (Bioinformatics Analysis Suite - BAS)</div>
    </div>
  </div>

  <!-- SECTION 1: USER INFORMATION -->
  <h2>1. User & Authentication Records</h2>
  <div class="grid-4">
    <div class="card">
      <div class="metric-label">User ID</div>
      <div class="metric-val" style="color: #2563eb;">${user.userId}</div>
    </div>
    <div class="card">
      <div class="metric-label">Username</div>
      <div class="metric-val">${user.username}</div>
    </div>
    <div class="card">
      <div class="metric-label">Session Status</div>
      <div class="metric-val"><span class="badge badge-success">Verified & Active</span></div>
    </div>
    <div class="card">
      <div class="metric-label">Registration Date</div>
      <div class="metric-val" style="font-size: 14px;">${user.registrationDate || '2026-09-01'}</div>
    </div>
  </div>

  <!-- SECTION 2: SEQUENCE INFORMATION -->
  <h2>2. Biological Sequence Metadata</h2>
  <div class="card">
    <div class="grid-2" style="margin-bottom: 10px;">
      <div><strong>Target Gene / Protein:</strong> ${seq.name}</div>
      <div><strong>Accession Number:</strong> ${seq.accession}</div>
      <div><strong>Source Organism:</strong> ${seq.organism}</div>
      <div><strong>Sequence Type & Length:</strong> <span class="badge badge-primary">${seq.type}</span> (${seq.length} ${seq.type === 'DNA' ? 'bp' : 'aa'})</div>
    </div>
    <div style="font-size: 13px; color: #334155; margin-bottom: 10px;"><strong>Biological Description:</strong> ${seq.description}</div>
    <div class="metric-label">FASTA Record:</div>
    <pre>&gt;${seq.fastaHeader || `${seq.accession} ${seq.name}`}&#10;${seq.sequence.match(/.{1,70}/g)?.join('\n') || seq.sequence}</pre>
  </div>

  <!-- SECTION 3: DNA & PROTEIN CORE ANALYSIS -->
  <h2>3. Core Sequence Analytics</h2>
  ${
    data.dnaAnalysis
      ? `
    <div class="grid-4" style="margin-bottom: 12px;">
      <div class="card">
        <div class="metric-label">GC Content</div>
        <div class="metric-val" style="color: #059669;">${data.dnaAnalysis.gcPercent}%</div>
      </div>
      <div class="card">
        <div class="metric-label">AT Content</div>
        <div class="metric-val" style="color: #d97706;">${data.dnaAnalysis.atPercent}%</div>
      </div>
      <div class="card">
        <div class="metric-label">Melting Temp (Tm)</div>
        <div class="metric-val">${data.dnaAnalysis.meltingTempTm} &deg;C</div>
      </div>
      <div class="card">
        <div class="metric-label">Molecular Weight</div>
        <div class="metric-val">${data.dnaAnalysis.molecularWeight.toLocaleString()} Da</div>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Nucleotide Base</th>
          <th>Count</th>
          <th>Percentage</th>
          <th>Role / Classification</th>
        </tr>
      </thead>
      <tbody>
        ${data.dnaAnalysis.nucleotideComposition
          .map(
            n => `
          <tr>
            <td style="font-weight: 600; padding: 6px 10px; border: 1px solid #cbd5e1;">${n.base}</td>
            <td style="padding: 6px 10px; border: 1px solid #cbd5e1;">${n.count}</td>
            <td style="padding: 6px 10px; border: 1px solid #cbd5e1;">${n.percentage}%</td>
            <td style="padding: 6px 10px; border: 1px solid #cbd5e1;">${n.base.includes('A') || n.base.includes('G') ? 'Purine' : 'Pyrimidine'}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `
      : ''
  }

  ${
    data.proteinAnalysis
      ? `
    <div style="margin-top: 15px;">
      <strong>Protein Physicochemical Properties:</strong>
      <div class="grid-4" style="margin-top: 8px;">
        <div class="card">
          <div class="metric-label">Isoelectric Point (pI)</div>
          <div class="metric-val" style="color: #7c3aed;">${data.proteinAnalysis.isoelectricPoint}</div>
        </div>
        <div class="card">
          <div class="metric-label">Molecular Weight</div>
          <div class="metric-val">${data.proteinAnalysis.molecularWeight.toLocaleString()} Da</div>
        </div>
        <div class="card">
          <div class="metric-label">GRAVY (Hydropathy)</div>
          <div class="metric-val">${data.proteinAnalysis.gravy}</div>
        </div>
        <div class="card">
          <div class="metric-label">Charge at pH 7.4</div>
          <div class="metric-val">${data.proteinAnalysis.chargeAtPh74}</div>
        </div>
      </div>
    </div>
  `
      : ''
  }

  <!-- SECTION 4: ORF FINDER & TRANSLATION -->
  <h2>4. Open Reading Frames (ORFs) & Translation</h2>
  <div>
    <strong>Detected Open Reading Frames Across 6 Frames (+1, +2, +3, -1, -2, -3):</strong>
    ${
      data.orfs.length > 0
        ? `
      <table>
        <thead>
          <tr>
            <th>ORF ID</th>
            <th>Frame</th>
            <th>Start (5')</th>
            <th>Stop (3')</th>
            <th>Length</th>
            <th>Translated Peptide Preview</th>
          </tr>
        </thead>
        <tbody>${orfsListHtml}</tbody>
      </table>
    `
        : '<p>No ORFs detected above 30 bp threshold.</p>'
    }
  </div>

  <div style="margin-top: 12px;">
    <strong>Selected Protein Translation:</strong>
    <pre>&gt;Translated_${seq.name}&#10;${data.translatedProtein.match(/.{1,70}/g)?.join('\n') || data.translatedProtein}</pre>
  </div>

  <!-- SECTION 5: ALIGNMENT & MUTATION DETECTION -->
  <h2>5. Sequence Alignment & Mutation Analysis</h2>
  ${
    data.alignment
      ? `
    <div class="grid-4" style="margin-bottom: 12px;">
      <div class="card">
        <div class="metric-label">Alignment Score</div>
        <div class="metric-val">${data.alignment.score}</div>
      </div>
      <div class="card">
        <div class="metric-label">Identity</div>
        <div class="metric-val" style="color: #2563eb;">${data.alignment.identityPercentage}%</div>
      </div>
      <div class="card">
        <div class="metric-label">Mismatches</div>
        <div class="metric-val" style="color: #dc2626;">${data.alignment.mismatches}</div>
      </div>
      <div class="card">
        <div class="metric-label">Gaps Inserted</div>
        <div class="metric-val">${data.alignment.gaps}</div>
      </div>
    </div>
    <div class="card" style="margin-bottom: 14px;">
      <div class="metric-label">Needleman-Wunsch Alignment Representation:</div>
      <pre style="font-size: 11px;">
REF:   ${data.alignment.alignedRef.substring(0, 100)}...
       ${data.alignment.consensus.substring(0, 100)}...
QUERY: ${data.alignment.alignedQuery.substring(0, 100)}...
      </pre>
    </div>
  `
      : '<p>No alignment computed.</p>'
  }

  <div>
    <strong>Identified Variant Calls:</strong>
    ${
      data.mutations.length > 0
        ? `
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Ref</th>
            <th>Query</th>
            <th>Type</th>
            <th>Subtype</th>
            <th>Impact</th>
            <th>AA Effect</th>
          </tr>
        </thead>
        <tbody>${mutationsHtml}</tbody>
      </table>
    `
        : '<p>No mutations detected between sequences.</p>'
    }
  </div>

  <!-- SECTION 6: VCF & MACHINE LEARNING -->
  <h2>6. Variant Call Format (VCF) & Machine Learning Evaluation</h2>
  <div class="grid-2">
    <div>
      <strong>VCF v4.2 Excerpt:</strong>
      <pre style="height: 140px; overflow-y: auto;">${data.vcf.substring(0, 500)}...</pre>
    </div>
    <div>
      <strong>Machine Learning Classification (Random Forest):</strong>
      ${
        data.mlPrediction
          ? `
        <div class="card" style="height: 140px;">
          <div><strong>Predicted Class:</strong> <span class="badge badge-primary" style="font-size: 13px;">${data.mlPrediction.classification}</span></div>
          <div style="margin-top: 6px;"><strong>Probability:</strong> ${(data.mlPrediction.probability * 100).toFixed(1)}%</div>
          <div style="margin-top: 6px; font-size: 12px; color: #475569;">${data.mlPrediction.featuresExtracted.kmerSignature}</div>
          <div style="margin-top: 6px; font-size: 11px; color: #64748b;">Ensemble Random Forest with 15 Bagged Biological Decision Trees</div>
        </div>
      `
          : '<p>Model not yet evaluated.</p>'
      }
    </div>
  </div>

  ${
    data.mlMetrics
      ? `
    <div style="margin-top: 14px;">
      <strong>Model Validation Metrics (Test Split):</strong>
      <div class="grid-4" style="margin-top: 6px;">
        <div class="card"><div class="metric-label">Accuracy</div><div class="metric-val">${(data.mlMetrics.accuracy * 100).toFixed(1)}%</div></div>
        <div class="card"><div class="metric-label">Precision</div><div class="metric-val">${(data.mlMetrics.precision * 100).toFixed(1)}%</div></div>
        <div class="card"><div class="metric-label">Recall</div><div class="metric-val">${(data.mlMetrics.recall * 100).toFixed(1)}%</div></div>
        <div class="card"><div class="metric-label">F1-Score</div><div class="metric-val">${(data.mlMetrics.f1Score * 100).toFixed(1)}%</div></div>
      </div>
    </div>
  `
      : ''
  }

  <div style="margin-top: 30px; border-top: 1px solid #E8BFCB; padding-top: 15px; font-size: 11px; color: #49343D; opacity: 0.7; text-align: center;">
    Bioinformatics Analysis Suite (BAS) &bull; Integrated Platform for Biological Sequence Analysis &bull; Evaluation Copy
  </div>
</body>
</html>
  `;
}

export function openReportWindow(data: FullReportData): void {
  const html = generateReportHtml(data);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  }
}

export function downloadReportHtml(data: FullReportData): void {
  const html = generateReportHtml(data);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Bioinformatics_Report_${data.sequence?.name || 'Analysis'}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
