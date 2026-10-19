import React, { useState } from 'react';
import { useBio } from '../../context/BioContext';
import {
  GUI_FRAMEWORK_RECOMMENDATION,
  REQUIREMENTS_TXT_CONTENT,
  STARTER_MAIN_PY_CODE,
  STARTER_AUTH_PY_CODE,
  STARTER_STATE_PY_CODE,
} from '../../utils/pythonProjectData';
import {
  FolderGit2,
  CheckCircle2,
  Download,
  Copy,
  Layers,
  Terminal,
  FileCode2,
  Users,
  GitBranch,
  BookOpen,
} from 'lucide-react';

export const ArchitectureDocsPage: React.FC = () => {
  const { showToast } = useBio();
  const [activeSubTab, setActiveSubTab] = useState<'FRAMEWORK' | 'ARCHITECTURE' | 'FOLDERS' | 'COMMUNICATION' | 'CODE_STARTER'>('FRAMEWORK');

  const copyCode = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard!`, 'success');
  };

  const downloadTextFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base sm:text-lg font-bold text-[#49343D]">
              Software Architecture & Modular Python Blueprint
            </h2>
          </div>
          <p className="text-xs text-[#49343D]/70 mt-1 max-w-2xl leading-relaxed">
            Technical documentation: PySide6 vs Streamlit trade-offs, architecture diagrams, requirements.txt, and decoupled state contracts.
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex flex-wrap gap-1 bg-[#FFF9F7] p-1.5 rounded-xl border border-[#E8BFCB]">
          <button
            onClick={() => setActiveSubTab('FRAMEWORK')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeSubTab === 'FRAMEWORK'
                ? 'bg-[#D4AF72] text-white shadow-xs'
                : 'text-[#49343D]/70 hover:text-[#49343D]'
            }`}
          >
            GUI Framework
          </button>
          <button
            onClick={() => setActiveSubTab('ARCHITECTURE')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeSubTab === 'ARCHITECTURE'
                ? 'bg-[#D4AF72] text-white shadow-xs'
                : 'text-[#49343D]/70 hover:text-[#49343D]'
            }`}
          >
            Architecture
          </button>
          <button
            onClick={() => setActiveSubTab('FOLDERS')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeSubTab === 'FOLDERS'
                ? 'bg-[#D4AF72] text-white shadow-xs'
                : 'text-[#49343D]/70 hover:text-[#49343D]'
            }`}
          >
            Folders & Tools
          </button>
          <button
            onClick={() => setActiveSubTab('COMMUNICATION')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeSubTab === 'COMMUNICATION'
                ? 'bg-[#D4AF72] text-white shadow-xs'
                : 'text-[#49343D]/70 hover:text-[#49343D]'
            }`}
          >
            Intercommunication
          </button>
          <button
            onClick={() => setActiveSubTab('CODE_STARTER')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeSubTab === 'CODE_STARTER'
                ? 'bg-[#D4AF72] text-white shadow-xs'
                : 'text-[#49343D]/70 hover:text-[#49343D]'
            }`}
          >
            Starter Code
          </button>
        </div>
      </div>

      {/* 1 & 2. FRAMEWORK RECOMMENDATION */}
      {activeSubTab === 'FRAMEWORK' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8E1E7] text-[#49343D] text-xs font-bold mb-3 border border-[#E8BFCB]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF72]" />
              Final Verdict: Recommend PySide6 (Qt for Python)
            </div>
            <h3 className="text-lg font-bold text-[#49343D] mb-2">
              Why PySide6 is Superior to Streamlit for an Academic Bioinformatics Desktop Software Suite
            </h3>
            <p className="text-xs text-[#49343D]/80 leading-relaxed">
              While Streamlit is popular for rapid single-file data science prototypes, <strong className="text-[#49343D] font-bold">PySide6 is strongly recommended</strong> for this academic project. 
              The requirements demand an offline standalone desktop tool with secure user Excel records, 
              intricate pairwise alignment visualizations, background thread execution, and independent modular development.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {GUI_FRAMEWORK_RECOMMENDATION.comparisonPoints.map((pt, idx) => (
                <div key={idx} className="p-4 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB] space-y-2">
                  <h4 className="text-xs font-bold text-[#D4AF72] uppercase tracking-wider">{pt.criteria}</h4>
                  <div className="text-xs text-[#49343D]">
                    <strong className="text-[#49343D] font-semibold">PySide6:</strong> {pt.pyside6}
                  </div>
                  <div className="text-xs text-[#49343D]/70 pt-1 border-t border-[#E8BFCB]">
                    <strong className="text-rose-700 font-semibold">Streamlit Drawback:</strong> {pt.streamlit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. ARCHITECTURE DESIGN */}
      {activeSubTab === 'ARCHITECTURE' && (
        <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[#49343D] uppercase tracking-wider">
            Complete Software Architecture: Model-View-Controller + Observer Pattern
          </h3>
          <p className="text-xs text-[#49343D]/80 leading-relaxed">
            The software architecture isolates the presentation layer (PySide6 views), biological algorithm services (Biopython, scikit-learn, ReportLab), and persistent data storage (data/users.xlsx, models/). 
            The central <strong className="text-[#D4AF72] font-mono">SharedBioState</strong> operates as an event bus, ensuring that whenever a sequence is searched or uploaded, all downstream modules receive the data without user friction.
          </p>

          <div className="p-4 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB] font-mono text-xs text-[#49343D] leading-relaxed overflow-x-auto">
            <pre>{`
========================================================================================
                      BIOINFORMATICS ANALYSIS SUITE (BAS) ARCHITECTURE
========================================================================================

    [ USER AUTHENTICATION ]
           |
           +---> data/users.xlsx (SHA-256 Hashing, User ID BIO001...)
           |
    [ MAIN DASHBOARD & SCROLLABLE SIDEBAR ]
           |
    [ NCBI / FASTA SEARCH ]
           |
           v (Emits: sequence_loaded)
+--------------------------------------------------------------------------------------+
|                     CENTRAL SHARED APPLICATION STATE (Mediator)                      |
|           Holds: active_sequence, current_user, alignment, mutations, vcf            |
+--------------------------------------------------------------------------------------+
       |                                |                               |
       v (Subscribed)                   v (Subscribed)                  v (Subscribed)
+--------------------------+  +--------------------------+  +--------------------------+
|  CORE ANALYTICS SUBSYSTEM|  |  VARIANT & GENOMICS SUITE|  |  ML & REPORT GENERATION  |
|--------------------------|  |--------------------------|  |--------------------------|
| - dna_analysis.py        |  | - alignment.py (N-W DP)  |  | - machine_learning.py    |
| - protein_analysis.py    |  | - mutation.py (SNVs/Ind) |  |   (Random Forest models) |
| - orf.py (6-Frame Finder)|  | - vcf_generator.py       |  | - visualization.py       |
| - motif.py (Highlighter) |  |   (Standard VCFv4.2)     |  |   (Matplotlib charts)    |
| - translation.py         |  | - population_map.py      |  | - report.py (ReportLab)  |
+--------------------------+  +--------------------------+  +--------------------------+
`}</pre>
          </div>
        </div>
      )}

      {/* 4-6. FOLDER STRUCTURE & SOFTWARE */}
      {activeSubTab === 'FOLDERS' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#49343D] mb-3">
              Standard Python Desktop Project Folder Structure
            </h3>
            <div className="p-4 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB] font-mono text-xs text-[#49343D] overflow-x-auto">
              <pre>{`
Bioinformatics_Analysis_Suite/
├── main.py                     # Central application entry point & QMainWindow
├── requirements.txt            # Python dependencies (Biopython, PySide6, scikit-learn, etc.)
├── README.md                   # Installation instructions & academic documentation
├── data/
│   ├── users.xlsx              # Excel database of registered users (BIO001, hashes)
│   └── sample_sequences/       # Curated FASTA files (BRCA1, TP53, HBB)
├── models/
│   └── rf_dna_classifier.joblib # Trained Random Forest model weights
├── modules/
│   ├── __init__.py
│   ├── state_manager.py        # Central SharedBioState (Mediator/Observer)
│   ├── authentication.py       # Login, Signup, BIO ID generator, Excel IO
│   ├── database_search.py      # NCBI Entrez query & FASTA retrieval
│   ├── fasta_handler.py        # .fasta/.fa/.fna parser & format validation
│   ├── dna_analysis.py         # Nucleotide counts, GC%, AT%, Tm, Mw
│   ├── protein_analysis.py     # Amino acids, pI, Mw, GRAVY, charge
│   ├── orf.py                  # 6-frame ORF Finder (+1 to -3)
│   ├── motif.py                # Motif searching & coordinate highlighter
│   ├── translation.py          # Standard genetic code codon translation
│   ├── alignment.py            # Needleman-Wunsch global alignment
│   ├── mutation.py             # Substitution/Indel calling & AA effect
│   ├── vcf_generator.py        # VCFv4.2 file generation & download
│   ├── population_map.py       # Global allele frequencies & HWE test
│   ├── machine_learning.py     # Feature extraction & Random Forest
│   ├── visualization.py        # Scientific graphics & charts
│   └── report.py               # ReportLab publication PDF compiler
└── ui/
    ├── styles.qss              # Qt stylesheet (consistent laboratory theme)
    └── icons/                  # Visual assets
`}</pre>
            </div>
          </div>

          <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#49343D] mb-2">Software & Environment Requirements</h3>
            <ul className="text-xs text-[#49343D]/80 space-y-2 list-disc list-inside">
              <li><strong className="text-[#49343D]">Python 3.10 or 3.11:</strong> Modern typing and performance.</li>
              <li><strong className="text-[#49343D]">PySide6:</strong> Official Qt for Python framework for the GUI desktop application.</li>
              <li><strong className="text-[#49343D]">Biopython:</strong> Sequence parsing (SeqIO), PairwiseAligner, CodonTable, IUPAC.</li>
              <li><strong className="text-[#49343D]">Pandas & OpenPyXL:</strong> Reading/writing data/users.xlsx without corrupting formulas.</li>
              <li><strong className="text-[#49343D]">Scikit-learn:</strong> RandomForestClassifier, train_test_split, classification_report, confusion_matrix.</li>
              <li><strong className="text-[#49343D]">Matplotlib & Seaborn:</strong> Visualizing nucleotide composition and confusion matrix heatmaps.</li>
              <li><strong className="text-[#49343D]">ReportLab:</strong> Direct PDF creation with SimpleDocTemplate, Paragraph, and Table styles.</li>
            </ul>
          </div>
        </div>
      )}

      {/* 8. COMMUNICATION CONTRACTS */}
      {activeSubTab === 'COMMUNICATION' && (
        <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[#49343D] uppercase tracking-wider">
            Subsystem Communication & Event-Driven State Architecture
          </h3>
          <p className="text-xs text-[#49343D]/80 leading-relaxed">
            To prevent merge conflicts and tightly coupled code where changing one file breaks downstream analytics, the platform utilizes a <strong className="text-[#D4AF72] font-semibold">Mediator / Observer Pattern</strong> implemented in <code className="bg-[#FFF9F7] px-1 py-0.5 rounded text-[#49343D] border border-[#E8BFCB]">modules/state_manager.py</code>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB] space-y-1.5">
              <span className="font-bold text-[#D4AF72]">Step 1: Input & Sequence Search &rarr; State</span>
              <p className="text-[#49343D]/80">
                When a user searches or uploads a FASTA file in the search UI, it calls <code className="text-[#49343D] font-mono">state.set_active_sequence(seq_data)</code>. 
                This emits a Qt signal <code className="text-[#D4AF72] font-mono">sequence_loaded</code>.
              </p>
            </div>

            <div className="p-4 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB] space-y-1.5">
              <span className="font-bold text-[#D4AF72]">Step 2: Core Analytics Subsystem Reacts</span>
              <p className="text-[#49343D]/80">
                Analytics views subscribe to <code className="text-[#D4AF72] font-mono">sequence_loaded</code>. 
                DNA Analysis automatically calculates GC%, ORFs are detected across all 6 frames, and translation is immediately ready.
              </p>
            </div>

            <div className="p-4 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB] space-y-1.5">
              <span className="font-bold text-[#D4AF72]">Step 3: Alignment Feeds into VCF</span>
              <p className="text-[#49343D]/80">
                The Alignment module outputs an alignment object. 
                The Mutation module receives this alignment and outputs a variant list, which the VCF module converts into a valid VCF file without retyping mutations.
              </p>
            </div>

            <div className="p-4 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB] space-y-1.5">
              <span className="font-bold text-[#D4AF72]">Step 4: Report Module Synthesizes Everything</span>
              <p className="text-[#49343D]/80">
                The Report module reads the already-populated fields in <code className="text-[#49343D] font-mono">state</code> (User ID, Gene Name, GC%, ORFs, Mutations, VCF, and ML metrics) to compile the final publication PDF.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7 & 9. STARTER CODE INSPECTOR & DOWNLOADS */}
      {activeSubTab === 'CODE_STARTER' && (
        <div className="space-y-6">
          {/* requirements.txt */}
          <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <FileCode2 className="w-4 h-4 text-[#D4AF72]" />
                <h3 className="text-sm font-bold text-[#49343D] uppercase tracking-wider">
                  requirements.txt
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyCode(REQUIREMENTS_TXT_CONTENT, 'requirements.txt')}
                  className="px-3 py-1 bg-[#FFF9F7] hover:bg-[#F8E1E7]/50 text-[#49343D] text-xs font-semibold rounded-lg border border-[#E8BFCB] flex items-center gap-1 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={() => downloadTextFile(REQUIREMENTS_TXT_CONTENT, 'requirements.txt')}
                  className="px-3 py-1 bg-[#D4AF72] hover:bg-[#c49e62] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <pre className="p-4 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB] font-mono text-xs text-[#49343D] overflow-x-auto">
              {REQUIREMENTS_TXT_CONTENT}
            </pre>
          </div>

          {/* main.py */}
          <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-[#D4AF72]" />
                <h3 className="text-sm font-bold text-[#49343D] uppercase tracking-wider">
                  main.py Starter Code
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyCode(STARTER_MAIN_PY_CODE, 'main.py')}
                  className="px-3 py-1 bg-[#FFF9F7] hover:bg-[#F8E1E7]/50 text-[#49343D] text-xs font-semibold rounded-lg border border-[#E8BFCB] flex items-center gap-1 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={() => downloadTextFile(STARTER_MAIN_PY_CODE, 'main.py')}
                  className="px-3 py-1 bg-[#D4AF72] hover:bg-[#c49e62] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <pre className="p-4 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB] font-mono text-xs text-[#49343D] overflow-x-auto max-h-72">
              {STARTER_MAIN_PY_CODE}
            </pre>
          </div>

          {/* modules/authentication.py */}
          <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-[#D4AF72]" />
                <h3 className="text-sm font-bold text-[#49343D] uppercase tracking-wider">
                  modules/authentication.py (User ID BIO001 & data/users.xlsx)
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyCode(STARTER_AUTH_PY_CODE, 'authentication.py')}
                  className="px-3 py-1 bg-[#FFF9F7] hover:bg-[#F8E1E7]/50 text-[#49343D] text-xs font-semibold rounded-lg border border-[#E8BFCB] flex items-center gap-1 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={() => downloadTextFile(STARTER_AUTH_PY_CODE, 'authentication.py')}
                  className="px-3 py-1 bg-[#D4AF72] hover:bg-[#c49e62] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <pre className="p-4 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB] font-mono text-xs text-[#49343D] overflow-x-auto max-h-72">
              {STARTER_AUTH_PY_CODE}
            </pre>
          </div>

          {/* modules/state_manager.py */}
          <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <GitBranch className="w-4 h-4 text-[#D4AF72]" />
                <h3 className="text-sm font-bold text-[#49343D] uppercase tracking-wider">
                  modules/state_manager.py (Subsystem Communication Observer)
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyCode(STARTER_STATE_PY_CODE, 'state_manager.py')}
                  className="px-3 py-1 bg-[#FFF9F7] hover:bg-[#F8E1E7]/50 text-[#49343D] text-xs font-semibold rounded-lg border border-[#E8BFCB] flex items-center gap-1 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={() => downloadTextFile(STARTER_STATE_PY_CODE, 'state_manager.py')}
                  className="px-3 py-1 bg-[#D4AF72] hover:bg-[#c49e62] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <pre className="p-4 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB] font-mono text-xs text-[#49343D] overflow-x-auto max-h-72">
              {STARTER_STATE_PY_CODE}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
