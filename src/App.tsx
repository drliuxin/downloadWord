import React, { useState } from "react";
import { 
  FileText, 
  Wand2, 
  Download, 
  Settings, 
  RefreshCw, 
  Copy, 
  Check, 
  Type, 
  Layout, 
  Sparkles 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { generateContent, formatContent } from "./services/gemini";
import { exportToWord } from "./services/wordExport";

const SAMPLE_CONTENT = `
# Project Proposal: AI-Powered Document Workflow

## Overview
This project aims to streamline the creation and formatting of professional documents using advanced AI models. By integrating LLMs with document generation libraries, we can significantly reduce the time spent on manual formatting.

## Key Features
1. Instant content generation based on user prompts.
2. Intelligent formatting according to predefined templates or custom instructions.
3. Seamless export to Microsoft Word (.docx) format.
4. Real-time preview and editing capabilities.

## Conclusion
We believe this tool will be essential for professionals who need to produce high-quality documents quickly and efficiently.
`;

const SAMPLE_INSTRUCTIONS = `
Format this as a formal business proposal. 
- Ensure all headings are clear.
- Use professional language.
- Add a summary section at the beginning.
- Use bullet points for features.
`;

export default function App() {
  const [content, setContent] = useState(SAMPLE_CONTENT);
  const [instructions, setInstructions] = useState(SAMPLE_INSTRUCTIONS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "format">("content");

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = "Write a short, professional introduction for a software development project called 'WordFlow AI'. Include a mission statement and three core values.";
      const result = await generateContent(prompt);
      if (result) setContent(result);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFormat = async () => {
    setIsFormatting(true);
    try {
      const result = await formatContent(content, instructions);
      if (result) setContent(result);
    } catch (error) {
      console.error("Formatting failed:", error);
    } finally {
      setIsFormatting(false);
    }
  };

  const handleExport = async () => {
    await exportToWord(content, "WordFlow_Document");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <FileText className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">WordFlow AI</h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Document Generation Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md active:scale-95"
          >
            <Download className="w-4 h-4" />
            Export to Word
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Controls */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-gray-900">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold">AI Actions</h2>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 border border-gray-200 p-4 rounded-xl transition-all group active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm group-hover:border-blue-200 transition-colors">
                    <RefreshCw className={`w-5 h-5 text-blue-600 ${isGenerating ? 'animate-spin' : ''}`} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">Generate Content</p>
                    <p className="text-xs text-gray-500">Create new text with AI</p>
                  </div>
                </div>
                <Wand2 className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </button>

              <button 
                onClick={handleFormat}
                disabled={isFormatting}
                className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 border border-gray-200 p-4 rounded-xl transition-all group active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm group-hover:border-blue-200 transition-colors">
                    <Layout className={`w-5 h-5 text-blue-600 ${isFormatting ? 'animate-pulse' : ''}`} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">Format with AI</p>
                    <p className="text-xs text-gray-500">Apply styling instructions</p>
                  </div>
                </div>
                <Wand2 className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-gray-900">
              <Settings className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold">Formatting Template</h2>
            </div>
            <p className="text-xs text-gray-500 mb-3">Provide instructions for how the AI should structure your document.</p>
            <textarea 
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full h-48 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none font-mono"
              placeholder="Enter formatting instructions..."
            />
          </div>
        </aside>

        {/* Main Editor Area */}
        <section className="lg:col-span-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-180px)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setActiveTab("content")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'content' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Editor
                </button>
                <button 
                  onClick={() => setActiveTab("format")}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'format' ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Formatting Preview
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleCopy}
                  className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-500 hover:text-blue-600 border border-transparent hover:border-gray-200"
                  title="Copy to clipboard"
                >
                  {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <div className="h-4 w-[1px] bg-gray-200 mx-1" />
                <Type className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400 font-mono">{content.length} chars</span>
              </div>
            </div>

            <div className="flex-1 relative">
              <AnimatePresence mode="wait">
                {activeTab === "content" ? (
                  <motion.textarea
                    key="editor"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full h-full p-8 text-lg leading-relaxed outline-none resize-none font-serif text-gray-800 placeholder:text-gray-300"
                    placeholder="Paste your content here or generate it using AI..."
                  />
                ) : (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="w-full h-full p-8 overflow-y-auto bg-gray-50/30 prose prose-blue max-w-none"
                  >
                    <div className="bg-white shadow-lg border border-gray-200 rounded-lg p-12 min-h-full max-w-3xl mx-auto">
                      <pre className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-gray-800">
                        {content}
                      </pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {(isGenerating || isFormatting) && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-20">
                  <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                      <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-blue-600 animate-pulse" />
                    </div>
                    <p className="font-medium text-gray-900">AI is working its magic...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer Status */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 flex items-center justify-between text-[10px] text-gray-400 uppercase tracking-[0.2em] font-semibold">
        <div className="flex items-center gap-4">
          <span>Status: Ready</span>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
        </div>
        <div>
          WordFlow AI Engine v1.0.0
        </div>
      </footer>
    </div>
  );
}
