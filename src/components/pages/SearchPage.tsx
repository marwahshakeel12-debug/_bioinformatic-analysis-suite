import React, { useState, useMemo } from 'react';
import { useBio } from '../../context/BioContext';
import { BiologicalSequence, SequenceType } from '../../types/bio';
import {
  formatFasta,
  downloadFastaFile,
  detectBiologicalInputType,
  SearchFilterType,
} from '../../utils/ncbiService';
import { parseFasta, validateDnaSequence, validateProteinSequence } from '../../utils/bioAlgorithms';
import {
  Search,
  Database,
  Dna,
  Binary,
  ArrowRight,
  Download,
  Copy,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Upload,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const SearchPage: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    searchFilter,
    setSearchFilter,
    searchResults,
    isSearching,
    searchError,
    hasSearched,
    selectedRecordForDetails,
    setSelectedRecordForDetails,
    executeSearch,
    selectRecordAndAnalyze,
    showToast,
  } = useBio();

  const [inputVal, setInputVal] = useState(searchQuery || '');
  const [filterVal, setFilterVal] = useState<SearchFilterType>(searchFilter || 'AUTO');
  const [showFastaUpload, setShowFastaUpload] = useState(false);

  // File upload state for local .fasta files
  const [fileError, setFileError] = useState('');
  const [fileSuccess, setFileSuccess] = useState('');

  // Detect input type
  const detected = useMemo(() => {
    return detectBiologicalInputType(inputVal);
  }, [inputVal]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) {
      showToast('Please enter a gene name, accession ID, or sequence.', 'info');
      return;
    }
    await executeSearch(inputVal.trim(), filterVal);
  };

  const copyToClipboard = (text: string, label: string = 'FASTA sequence') => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard!`, 'success');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    setFileSuccess('');

    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = ['.fasta', '.fa', '.fna'];
    const fileName = file.name.toLowerCase();
    const hasValidExt = validExtensions.some(ext => fileName.endsWith(ext));

    if (!hasValidExt) {
      setFileError('Invalid file format. Allowed extensions: .fasta, .fa, .fna');
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      if (!text || !text.trim()) {
        setFileError('The uploaded FASTA file is empty.');
        return;
      }

      const parsed = parseFasta(text);
      if (!parsed.sequence) {
        setFileError('Could not parse any valid sequence lines from the FASTA file.');
        return;
      }

      const dnaCheck = validateDnaSequence(parsed.sequence);
      const isDna = dnaCheck.isValid;
      const protCheck = validateProteinSequence(parsed.sequence);

      if (!isDna && !protCheck.isValid) {
        setFileError('Sequence rejected: detected invalid characters that are neither standard DNA nucleotides nor amino acids.');
        return;
      }

      const seqType: SequenceType = isDna ? 'DNA' : 'PROTEIN';
      const cleanSequence = isDna ? dnaCheck.cleanSeq : protCheck.cleanSeq;

      const newRecord: BiologicalSequence = {
        id: `UPLOAD_${Date.now()}`,
        name: parsed.header.split(' ')[0] || file.name.replace(/\.[^/.]+$/, ''),
        accession: 'LOCAL_UPLOAD',
        organism: 'User-Supplied',
        description: parsed.header || file.name,
        type: seqType,
        sequence: cleanSequence,
        length: cleanSequence.length,
        source: 'FILE_UPLOAD',
        fastaHeader: parsed.header,
      };

      setSelectedRecordForDetails(newRecord);
      setFileSuccess(`Validated ${seqType} FASTA file: ${file.name} (${newRecord.length} ${seqType === 'DNA' ? 'bp' : 'aa'}).`);
      selectRecordAndAnalyze(newRecord);
    };

    reader.onerror = () => {
      setFileError('Failed to read local file.');
    };

    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Search Header Bar */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-5 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#D4AF72] absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Search a gene, DNA sequence, protein, or accession ID..."
              className="w-full bg-[#FFF9F7] border border-[#E8BFCB] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#49343D] placeholder-[#49343D]/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF72] transition"
            />
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Search Type Selector */}
            <div className="flex items-center bg-[#FFF9F7] border border-[#E8BFCB] rounded-xl px-2.5 py-1.5 text-xs">
              <span className="text-[#49343D]/60 mr-1.5 hidden sm:inline font-medium">Type:</span>
              <select
                value={filterVal}
                onChange={e => setFilterVal(e.target.value as SearchFilterType)}
                className="bg-transparent text-[#49343D] font-semibold focus:outline-none cursor-pointer"
              >
                <option value="AUTO">Auto-detect</option>
                <option value="GENE">Gene</option>
                <option value="DNA">DNA</option>
                <option value="PROTEIN">Protein</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="px-5 py-2.5 bg-[#D4AF72] hover:bg-[#c49e62] text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center space-x-1.5 shrink-0 disabled:opacity-50 cursor-pointer"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Real-time Detection Tag */}
        {inputVal.trim() && (
          <div className="mt-2.5 pt-2 border-t border-[#E8BFCB]/40 flex items-center space-x-2 text-xs text-[#49343D]/70">
            <span className="font-medium">Detected query type:</span>
            <span className="px-2 py-0.5 rounded-full bg-[#F8E1E7] text-[#49343D] border border-[#E8BFCB] font-semibold">
              {detected.label}
            </span>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isSearching && (
        <div className="bg-white border border-[#E8BFCB] rounded-2xl p-12 text-center shadow-sm space-y-3">
          <Loader2 className="w-8 h-8 text-[#D4AF72] animate-spin mx-auto" />
          <h3 className="text-sm font-bold text-[#49343D]">Querying Biological Databases</h3>
          <p className="text-xs text-[#49343D]/70 max-w-md mx-auto">
            Searching public biological repositories (NCBI Entrez nucleotide databases & UniProtKB protein records)...
          </p>
        </div>
      )}

      {/* API Error State */}
      {searchError && !isSearching && (
        <div className="bg-[#F8E1E7] border border-rose-300 rounded-2xl p-4 sm:p-5 flex items-start space-x-3 text-rose-900 shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <div className="font-bold">Search Notice</div>
            <div className="mt-0.5 leading-relaxed">{searchError}</div>
          </div>
        </div>
      )}

      {/* Main Results & Record Details Stage */}
      {!isSearching && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Results List (Column 1) */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-[#D4AF72]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#49343D]">
                  Matching Records ({searchResults.length})
                </h3>
              </div>
              <span className="text-[11px] text-[#49343D]/60">Select a record to inspect</span>
            </div>

            {searchResults.length === 0 ? (
              <div className="bg-white border border-[#E8BFCB] rounded-2xl p-8 text-center text-[#49343D]/70 shadow-sm space-y-2">
                <Dna className="w-10 h-10 text-[#D4AF72]/60 mx-auto" />
                <div className="text-sm font-bold text-[#49343D]">No Matching Records Found</div>
                <p className="text-xs max-w-sm mx-auto">
                  {hasSearched
                    ? 'No biological records match your query. Try a standard gene symbol (e.g. BRCA1, TP53, EGFR), accession number, or paste a DNA/protein sequence.'
                    : 'Enter a search term above to locate biological records.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-[#E8BFCB]">
                {searchResults.map(record => {
                  const isSelected = selectedRecordForDetails?.id === record.id;
                  const isDna = record.type === 'DNA';

                  return (
                    <div
                      key={record.id}
                      onClick={() => setSelectedRecordForDetails(record)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'bg-[#F8E1E7]/60 border-[#D4AF72] ring-1 ring-[#D4AF72] shadow-sm'
                          : 'bg-white border-[#E8BFCB] hover:bg-[#FFF9F7] shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-bold text-[#49343D]">{record.name}</span>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                                isDna
                                  ? 'bg-blue-50 text-blue-900 border-blue-200'
                                  : 'bg-amber-50 text-amber-900 border-amber-200'
                              }`}
                            >
                              {record.type}
                            </span>
                            <span className="text-[10px] font-mono text-[#49343D]/70">
                              {record.length} {isDna ? 'bp' : 'aa'}
                            </span>
                          </div>
                          <div className="text-xs font-mono font-semibold text-[#D4AF72] mt-0.5">
                            {record.accession}
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center space-x-1">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              selectRecordAndAnalyze(record);
                            }}
                            className="px-3 py-1.5 bg-[#D4AF72] hover:bg-[#c49e62] text-white text-xs font-semibold rounded-xl shadow-2xs transition flex items-center space-x-1"
                            title="Analyze this sequence immediately"
                          >
                            <span>Analyze</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-xs text-[#49343D]/80 mt-2 line-clamp-2 leading-relaxed">
                        {record.description}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#49343D]/60 mt-3 pt-2 border-t border-[#E8BFCB]/50">
                        <span>{record.organism}</span>
                        <span className="font-mono uppercase font-medium">{record.source}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Record Details & FASTA Viewer (Column 2) */}
          <div className="lg:col-span-6">
            {selectedRecordForDetails ? (
              <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm sticky top-4 space-y-5">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8BFCB]">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-[#49343D]">
                        {selectedRecordForDetails.name}
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#F8E1E7] text-[#49343D] border border-[#E8BFCB]">
                        {selectedRecordForDetails.type}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-[#D4AF72] font-semibold mt-0.5">
                      {selectedRecordForDetails.accession} &bull; {selectedRecordForDetails.organism}
                    </div>
                  </div>

                  {/* Prominent "Analyze this sequence" button */}
                  <button
                    onClick={() => selectRecordAndAnalyze(selectedRecordForDetails)}
                    className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-[#D4AF72] hover:bg-[#c49e62] text-white text-xs font-semibold rounded-xl shadow-sm transition shrink-0 cursor-pointer"
                  >
                    <span>Analyze this sequence</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Biological Description */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#49343D]/70 mb-1">
                    Biological Description
                  </h4>
                  <p className="text-xs text-[#49343D] leading-relaxed bg-[#FFF9F7] p-3 rounded-xl border border-[#E8BFCB]">
                    {selectedRecordForDetails.description}
                  </p>
                </div>

                {/* Quick Attributes Grid */}
                <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                  <div className="p-3 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB]">
                    <div className="text-[10px] text-[#49343D]/60 uppercase font-bold">Length</div>
                    <div className="text-base font-bold text-[#49343D] mt-0.5 font-mono">
                      {selectedRecordForDetails.length} {selectedRecordForDetails.type === 'DNA' ? 'bp' : 'aa'}
                    </div>
                  </div>
                  <div className="p-3 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB]">
                    <div className="text-[10px] text-[#49343D]/60 uppercase font-bold">Source</div>
                    <div className="text-base font-bold text-[#D4AF72] mt-0.5">
                      {selectedRecordForDetails.source}
                    </div>
                  </div>
                  <div className="p-3 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB]">
                    <div className="text-[10px] text-[#49343D]/60 uppercase font-bold">Format</div>
                    <div className="text-base font-bold text-[#49343D] mt-0.5">
                      FASTA Ready
                    </div>
                  </div>
                </div>

                {/* Automatic FASTA Retrieval & Preview */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#49343D]/70 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#D4AF72]" />
                      <span>Retrieved FASTA Sequence</span>
                    </h4>
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => copyToClipboard(formatFasta(selectedRecordForDetails), 'FASTA')}
                        className="flex items-center space-x-1 px-2.5 py-1 text-xs bg-[#FFF9F7] hover:bg-[#F8E1E7] border border-[#E8BFCB] rounded-lg text-[#49343D] transition cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                      <button
                        onClick={() => downloadFastaFile(selectedRecordForDetails)}
                        className="flex items-center space-x-1 px-2.5 py-1 text-xs bg-[#FFF9F7] hover:bg-[#F8E1E7] border border-[#E8BFCB] rounded-lg text-[#49343D] transition cursor-pointer"
                      >
                        <Download className="w-3 h-3 text-[#D4AF72]" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>

                  <pre className="p-3.5 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB] font-mono text-[11px] text-[#49343D] max-h-52 overflow-y-auto whitespace-pre-wrap break-all leading-relaxed scrollbar-thin scrollbar-thumb-[#E8BFCB]">
                    {formatFasta(selectedRecordForDetails)}
                  </pre>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => selectRecordAndAnalyze(selectedRecordForDetails)}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 bg-[#D4AF72] hover:bg-[#c49e62] text-white text-xs font-semibold rounded-xl shadow-sm transition cursor-pointer"
                  >
                    <span>Analyze this sequence in Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-[#E8BFCB] rounded-2xl p-12 text-center text-[#49343D]/60 shadow-sm">
                <FileText className="w-8 h-8 text-[#D4AF72]/60 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-[#49343D]">No Record Selected</h4>
                <p className="text-xs mt-1">Select any matching record on the left to preview its details and FASTA sequence.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Optional Secondary Local FASTA File Upload Accordion (Preserved) */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-4 shadow-sm">
        <button
          onClick={() => setShowFastaUpload(prev => !prev)}
          className="w-full flex items-center justify-between text-left text-xs font-semibold text-[#49343D] hover:text-[#D4AF72] transition"
        >
          <div className="flex items-center space-x-2">
            <Upload className="w-4 h-4 text-[#D4AF72]" />
            <span>Optional: Upload Local FASTA File (.fasta, .fa, .fna)</span>
          </div>
          <span className="text-[11px] text-[#49343D]/60">{showFastaUpload ? 'Hide' : 'Show'}</span>
        </button>

        {showFastaUpload && (
          <div className="mt-3 pt-3 border-t border-[#E8BFCB]/50 space-y-3">
            <p className="text-xs text-[#49343D]/70">
              Have a local file from your lab or sequencing instrument? You can directly validate and load standard FASTA nucleotide or peptide files.
            </p>
            <input
              type="file"
              accept=".fasta,.fa,.fna"
              onChange={handleFileUpload}
              className="text-xs text-[#49343D] file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border file:border-[#E8BFCB] file:text-xs file:font-semibold file:bg-[#FFF9F7] file:text-[#49343D] hover:file:bg-[#F8E1E7] cursor-pointer"
            />
            {fileError && <div className="text-xs text-rose-700">{fileError}</div>}
            {fileSuccess && <div className="text-xs text-emerald-800">{fileSuccess}</div>}
          </div>
        )}
      </div>
    </div>
  );
};
