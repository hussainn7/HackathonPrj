import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Globe, 
  Sparkles, 
  Download, 
  Eye,
  FileText
} from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScrollSaved?: (scrollData: {
    title: string;
    author?: string;
    language: string;
    description?: string;
    category?: string;
    transcript?: string;
    summary?: string;
  }) => void;
}

interface ProcessingResult {
  transcript?: string;
  detected_language?: string;
  iso_code?: string;
  translation_to_english?: string;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onScrollSaved }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const languages = [
    { code: "English", name: "English" },
    { code: "Spanish", name: "Spanish (Español)" },
    { code: "French", name: "French (Français)" },
    { code: "German", name: "German (Deutsch)" },
    { code: "Italian", name: "Italian (Italiano)" },
    { code: "Portuguese", name: "Portuguese (Português)" },
    { code: "Russian", name: "Russian (Русский)" },
    { code: "Chinese", name: "Chinese (中文)" },
    { code: "Japanese", name: "Japanese (日本語)" },
    { code: "Korean", name: "Korean (한국어)" },
    { code: "Arabic", name: "Arabic (العربية)" },
    { code: "Hindi", name: "Hindi (हिन्दी)" },
    { code: "Dutch", name: "Dutch (Nederlands)" },
    { code: "Swedish", name: "Swedish (Svenska)" },
    { code: "Norwegian", name: "Norwegian (Norsk)" },
    { code: "Danish", name: "Danish (Dansk)" },
    { code: "Finnish", name: "Finnish (Suomi)" },
    { code: "Greek", name: "Greek (Ελληνικά)" },
    { code: "Turkish", name: "Turkish (Türkçe)" },
    { code: "Polish", name: "Polish (Polski)" }
  ];

  const resetModal = () => {
    setFile(null);
    setProcessing(false);
    setResult(null);
    setShowLanguageSelection(false);
    setSelectedLanguage('');
    setSummary('');
    setSummaryLoading(false);
    setError('');
    setProgress(0);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      processFile(droppedFile);
    } else {
      setError('Please upload a PDF file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      processFile(selectedFile);
    }
  };

  const processFile = async (file: File) => {
    setProcessing(true);
    setError('');
    setProgress(20);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';
      const formData = new FormData();
      formData.append('file', file);

      setProgress(40);

      const response = await fetch(`${backendUrl}/api/pdf-language`, {
        method: 'POST',
        body: formData,
      });

      setProgress(70);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to process PDF');
      }

      const data = await response.json();
      setResult(data);
      setProgress(100);
      
      if (data.transcript) {
        setShowLanguageSelection(true);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to process PDF');
    } finally {
      setProcessing(false);
    }
  };

  const generateSummary = async () => {
    if (!selectedLanguage || !result?.transcript) {
      setError('Please select a language and ensure transcript is available');
      return;
    }

    setSummaryLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001'}/api/generate-summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: result.transcript,
          language: selectedLanguage,
          detected_language: result.detected_language
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }
      
      const data = await response.json();
      setSummary(data.summary);
    } catch (e: any) {
      setError(e.message || 'Failed to generate summary');
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleSaveToLibrary = () => {
    if (!file || !result || !onScrollSaved) return;

    // Create scroll data from the upload results
    const scrollData = {
      title: file.name.replace('.pdf', ''),
      language: result.detected_language || 'Unknown',
      description: result.translation_to_english || summary || 'Recently uploaded scroll',
      transcript: result.transcript,
      summary: summary,
      category: 'literature' // Default category, could be enhanced with AI categorization
    };

    // Save to library
    onScrollSaved(scrollData);

    // Show success message and close modal
    alert('Scroll successfully saved to library!');
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-blue-50/95 to-indigo-50/95 backdrop-blur-xl border-2 border-blue-200/50 shadow-2xl">
        <DialogHeader className="text-center pb-6 border-b border-blue-200/30">
          <DialogTitle className="text-3xl font-cinzel text-blue-900 flex items-center justify-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            Preserve Ancient Knowledge
          </DialogTitle>
          <p className="text-blue-700 mt-2 text-lg">Upload your scroll to the eternal library</p>
        </DialogHeader>

        <div className="space-y-8 pt-6">
          {/* Enhanced Upload Area */}
          {!file && (
            <div className="relative">
              <div
                className={`relative border-3 border-dashed rounded-2xl p-16 text-center transition-all duration-500 cursor-pointer overflow-hidden ${
                  isDragging
                    ? 'border-blue-400 bg-gradient-to-br from-blue-100 to-indigo-100 scale-105 shadow-lg'
                    : 'border-blue-300/60 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:scale-102 hover:shadow-md'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 left-4 w-8 h-8 border-2 border-blue-400 rounded-full animate-pulse"></div>
                  <div className="absolute top-12 right-8 w-4 h-4 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute bottom-8 left-12 w-6 h-6 border-2 border-indigo-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <div className="absolute bottom-4 right-4 w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
                </div>

                <div className="relative z-10">
                  <div className="mb-6">
                    <div className="inline-flex p-4 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mb-4 shadow-lg">
                      <Upload className="h-12 w-12 text-white animate-pulse" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-blue-900 mb-3 font-cinzel">
                    {isDragging ? 'Release to Upload' : 'Drop Your Ancient Scroll'}
                  </h3>
                  
                  <p className="text-blue-700 mb-6 text-lg">
                    Drag & drop your PDF here, or click to browse
                  </p>
                  
                  <div className="flex flex-col items-center gap-4">
                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <FileText className="mr-3 h-5 w-5" />
                      Choose PDF File
                    </Button>
                    
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Supports PDF files up to 50MB</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {/* File Selected State */}
          {file && !processing && !result && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500 rounded-full">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-blue-900 mb-1">{file.name}</h3>
                  <p className="text-blue-700">Ready to process • {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <Button 
                  onClick={() => setFile(null)}
                  variant="outline" 
                  size="sm"
                  className="text-blue-600 border-blue-300 hover:bg-blue-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Enhanced Processing State */}
          {processing && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-8 relative overflow-hidden">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-100/20 to-indigo-100/20">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-indigo-400 animate-pulse"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-purple-500 animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-purple-900 font-cinzel">Deciphering Ancient Text</h3>
                    <p className="text-purple-700">Extracting wisdom from your scroll...</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-800 font-medium">Progress</span>
                    <span className="text-purple-600 text-sm">{progress}%</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500 ease-out relative"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-purple-600">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span>Using ancient AI wisdom to detect language and extract knowledge</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="glass-card border-red-400/30 bg-red-50/80">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-semibold">Error:</span>
                  <span>{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Results */}
          {result && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 relative overflow-hidden">
              {/* Success Animation */}
              <div className="absolute top-4 right-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <div className="pr-20">
                <h3 className="text-3xl font-bold text-green-900 font-cinzel mb-2">Knowledge Preserved!</h3>
                <p className="text-green-700 text-lg mb-8">Your ancient scroll has been successfully decoded</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-green-200">
                    <label className="text-sm font-bold text-green-800 uppercase tracking-wide mb-2 block">Detected Language</label>
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <span className="text-lg font-semibold text-blue-800">{result.detected_language || 'Unknown'}</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-green-200">
                    <label className="text-sm font-bold text-green-800 uppercase tracking-wide mb-2 block">ISO Code</label>
                    <span className="text-lg font-mono font-semibold text-indigo-800 bg-indigo-100 px-3 py-1 rounded-lg">
                      {result.iso_code || 'N/A'}
                    </span>
                  </div>
                  
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-green-200">
                    <label className="text-sm font-bold text-green-800 uppercase tracking-wide mb-2 block">Status</label>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-lg font-semibold text-green-800">Preserved</span>
                    </div>
                  </div>
                </div>

                {result.translation_to_english && (
                  <div className="mb-6">
                    <label className="text-lg font-bold text-green-800 mb-3 block">📜 English Preview</label>
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border-2 border-green-200 shadow-inner">
                      <p className="text-green-900 leading-relaxed">{result.translation_to_english}</p>
                    </div>
                  </div>
                )}

                {result.transcript && (
                  <div>
                    <label className="text-lg font-bold text-green-800 mb-3 block">📋 Full Transcript</label>
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border-2 border-green-200 shadow-inner max-h-40 overflow-y-auto">
                      <p className="text-green-900 leading-relaxed text-sm">{result.transcript}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Language Selection */}
          {showLanguageSelection && !summary && (
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-8">
              <div className="text-center mb-8">
                <div className="inline-flex p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-orange-900 font-cinzel mb-2">Choose Your Language</h3>
                <p className="text-orange-700 text-lg">In what language shall we present this ancient wisdom?</p>
              </div>
              
              <div className="max-w-md mx-auto space-y-6">
                <div className="relative">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full p-4 text-lg border-2 border-orange-300 rounded-xl bg-white/80 backdrop-blur-sm text-orange-900 font-semibold appearance-none cursor-pointer hover:border-orange-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  >
                    <option value="">🌍 Select a language...</option>
                    {languages.map((lang) => {
                      const isDetectedLang = lang.code.toLowerCase() === (result?.detected_language || '').toLowerCase();
                      return (
                        <option key={lang.code} value={lang.code}>
                          {lang.name} {isDetectedLang ? '✨ (Original)' : ''}
                        </option>
                      );
                    })}
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full"></div>
                  </div>
                </div>

                <Button
                  onClick={generateSummary}
                  disabled={!selectedLanguage || summaryLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {summaryLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                      <span>Crafting Summary...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      {selectedLanguage && (selectedLanguage.toLowerCase() === (result?.detected_language || '').toLowerCase() || 
                      (selectedLanguage === 'English' && result?.translation_to_english)) ? (
                        <>
                          <Eye className="h-5 w-5" />
                          <span>Show Original Content</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          <span>Generate Summary</span>
                        </>
                      )}
                    </div>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Summary Results */}
          {summary && (
            <Card className="glass-card border-[hsl(var(--scroll-glow))]/20">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[hsl(var(--scroll-glow))]" />
                    Summary in {selectedLanguage}
                  </h3>
                  <Button
                    onClick={() => {
                      setSummary('');
                      setSelectedLanguage('');
                      setShowLanguageSelection(true);
                    }}
                    variant="outline"
                    size="sm"
                    className="glass-button"
                  >
                    Change Language
                  </Button>
                </div>
                
                <div className="bg-blue-50/80 backdrop-blur-sm p-4 rounded-lg border border-blue-200">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-blue-900">
                    {summary}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleSaveToLibrary}
                    className="flex-1 glass-button"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Save to Library
                  </Button>
                  <Button variant="outline" className="glass-button">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
