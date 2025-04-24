/* eslint-disable @next/next/no-img-element */
"use client";

import {
  AttachmentIcon,
  BotIcon,
  UserIcon,
  JsonIcon,
  SendIcon,
} from "@/components/icons";
import { useChat } from "ai/react";
import { DragEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import { Markdown } from "@/components/markdown";

// Theme toggle icon components
const SunIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

// Custom JSON curly bracket logo component
const JsonLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 40 40" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="bracketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
    </defs>
    <rect width="40" height="40" rx="8" fill="currentColor" />
    <path
      d="M13 6C10 6 8 8 8 11V15C8 17 7 18 5 18C7 18 8 19 8 21V29C8 32 10 34 13 34"
      stroke="url(#bracketGradient)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M27 6C30 6 32 8 32 11V15C32 17 33 18 35 18C33 18 32 19 32 21V29C32 32 30 34 27 34"
      stroke="url(#bracketGradient)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 20H23"
      stroke="url(#bracketGradient)"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const getTextFromDataUrl = (dataUrl: string) => {
  const base64 = dataUrl.split(",")[1];
  return window.atob(base64);
};

function TextFilePreview({ file }: { file: File }) {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      setContent(typeof text === "string" ? text.slice(0, 100) : "");
    };
    reader.readAsText(file);
  }, [file]);

  return (
    <div>
      {content}
      {content.length >= 100 && "..."}
    </div>
  );
}

function JsonSyntaxHighlight({ json }: { json: string }) {
  try {
    const obj = JSON.parse(json);
    const formattedJson = JSON.stringify(obj, null, 2);
    
    const coloredJson = formattedJson
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
        let cls = 'text-emerald-600'; // number
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'text-orange-600 font-medium'; // key
          } else {
            cls = 'text-blue-600'; // string
          }
        } else if (/true|false/.test(match)) {
          cls = 'text-amber-600'; // boolean
        } else if (/null/.test(match)) {
          cls = 'text-rose-600'; // null
        }
        return `<span class="${cls}">${match}</span>`;
      });
      
    return <pre className="font-mono text-sm overflow-auto p-4 bg-white dark:bg-white rounded-lg text-gray-800 border border-gray-200 dark:border-gray-200" dangerouslySetInnerHTML={{ __html: coloredJson }} />;
  } catch (e) {
    return <pre className="font-mono text-sm overflow-auto p-4 bg-white dark:bg-white rounded-lg text-rose-600 border border-gray-200 dark:border-gray-200">{json}</pre>;
  }
}

// CSV/Excel file icon component
const FileIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

export default function Home() {
  const { messages, input, handleSubmit, handleInputChange, isLoading } =
    useChat({
      onError: () =>
        toast.error("You've been rate limited, please try again later!"),
    });

  const [files, setFiles] = useState<FileList | null>(null);
  const [jsonExample, setJsonExample] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'chat' | 'examples'>('chat');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Effect to initialize theme from localStorage and system preference
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(systemPrefersDark);
    }
  }, []);

  // Effect to apply theme class to the document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const examples = [
    {
      title: "User Profile",
      description: "Basic user information structure",
      json: `{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "roles": ["admin", "editor"],
    "settings": {
      "notifications": true,
      "theme": "dark"
    }
  }
}`
    },
    {
      title: "API Response",
      description: "Standard API response format",
      json: `{
  "status": "success",
  "code": 200,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Product A",
        "price": 29.99
      },
      {
        "id": 2,
        "name": "Product B",
        "price": 49.99
      }
    ]
  },
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 10
  }
}`
    },
    {
      title: "Configuration",
      description: "Application configuration",
      json: `{
  "app": {
    "name": "My App",
    "version": "1.0.0",
    "environment": "production",
    "features": {
      "darkMode": true,
      "analytics": true,
      "subscription": false
    },
    "api": {
      "baseUrl": "https://api.example.com",
      "timeout": 5000,
      "retryAttempts": 3
    }
  }
}`
    }
  ];

  const isValidFileType = (file: File) => {
    // Check for CSV files
    if (file.type === "text/csv") return true;
    
    // Check for Excel files
    if (file.type === "application/vnd.ms-excel" || 
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") 
      return true;
    
    // Also accept files with .csv or .xlsx or .xls extensions
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'csv' || extension === 'xlsx' || extension === 'xls') 
      return true;
    
    return false;
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;

    if (items) {
      const files = Array.from(items)
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null);

      if (files.length > 0) {
        const validFiles = files.filter(isValidFileType);

        if (validFiles.length === files.length) {
          const dataTransfer = new DataTransfer();
          validFiles.forEach((file) => dataTransfer.items.add(file));
          setFiles(dataTransfer.files);
        } else {
          toast.error("Only CSV and Excel files are allowed");
        }
      }
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    const droppedFilesArray = Array.from(droppedFiles);
    if (droppedFilesArray.length > 0) {
      const validFiles = droppedFilesArray.filter(isValidFileType);

      if (validFiles.length === droppedFilesArray.length) {
        const dataTransfer = new DataTransfer();
        validFiles.forEach((file) => dataTransfer.items.add(file));
        setFiles(dataTransfer.files);
      } else {
        toast.error("Only CSV and Excel files are allowed!");
      }

      setFiles(droppedFiles);
    }
    setIsDragging(false);
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const validFiles = Array.from(selectedFiles).filter(isValidFileType);

      if (validFiles.length === selectedFiles.length) {
        const dataTransfer = new DataTransfer();
        validFiles.forEach((file) => dataTransfer.items.add(file));
        setFiles(dataTransfer.files);
      } else {
        toast.error("Only CSV and Excel files are allowed");
      }
    }
  };

  const useExample = (example: string) => {
    if (inputRef.current) {
      inputRef.current.value = `Generate JSON based on this example: ${example}`;
      handleInputChange({ target: inputRef.current } as any);
    }
  };

  return (
    <div
      className={`flex flex-col items-center min-h-dvh bg-gradient-to-b from-white to-gray-100 dark:from-white dark:to-gray-100`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <header className="w-full bg-white dark:bg-white shadow-sm py-4 px-6 flex justify-center sticky top-0 z-10 border-b border-gray-200 dark:border-gray-200">
        <div className="w-full max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-orange-500 dark:text-orange-500">
              <JsonLogo className="size-10 text-white dark:text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-transparent bg-clip-text">JSON Generator AI</h1>
              <p className="text-xs text-gray-500 dark:text-gray-500">Create structured data easily</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Theme toggle button */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-100 transition-colors focus:outline-none"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <SunIcon className="text-orange-500" />
              ) : (
                <MoonIcon className="text-gray-700" />
              )}
            </button>
            
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="fixed pointer-events-none dark:bg-white h-dvh w-dvw z-10 flex flex-col justify-center items-center gap-2 bg-gray-100/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white dark:bg-white shadow-lg rounded-xl p-8 flex flex-col items-center">
              <div className="mb-4 bg-orange-100 dark:bg-orange-100 p-3 rounded-full">
                <AttachmentIcon className="size-6 text-orange-500 dark:text-orange-500" />
              </div>
              <div className="text-lg font-medium mb-1">Drop files here</div>
              <div className="text-sm text-gray-500 dark:text-gray-500">
                Add CSV or Excel files as data sources
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full max-w-5xl flex flex-col md:flex-row gap-6 p-4 md:p-8 flex-grow">
        <div className={`flex-grow md:flex-1 ${activeTab === 'examples' && 'hidden md:block'}`}>
          {messages.length > 0 ? (
            <div className="flex flex-col gap-5 h-[calc(100vh-240px)] overflow-y-auto bg-white dark:bg-white rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-200">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  className={`flex gap-4 ${message.role === 'assistant' ? 'bg-orange-50 dark:bg-orange-50' : ''} p-4 rounded-lg ${index !== messages.length - 1 ? 'border-b border-gray-100 dark:border-gray-100 pb-5' : ''}`}
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <div className={`size-10 rounded-full flex justify-center items-center flex-shrink-0 ${message.role === 'assistant' ? 'bg-orange-100 dark:bg-orange-100 text-orange-600 dark:text-orange-600' : 'bg-gray-100 dark:bg-gray-100 text-gray-500 dark:text-gray-500'}`}>
                    {message.role === "assistant" ? <BotIcon className="size-5" /> : <UserIcon className="size-5" />}
                  </div>

                  <div className="flex-1 flex flex-col gap-3">
                    <div className={`text-sm font-medium ${message.role === 'assistant' ? 'text-orange-600 dark:text-orange-600' : 'text-gray-500 dark:text-gray-500'}`}>
                      {message.role === 'assistant' ? 'JSON Generator' : 'You'}
                    </div>
                    <div className="text-gray-800 dark:text-gray-800 flex flex-col gap-4 text-[15px]">
                      {message.content.includes('{') && message.content.includes('}') && message.role === 'assistant' ? (
                        <div>
                          <p className="mb-3 leading-relaxed">{message.content.split('{')[0]}</p>
                          <JsonSyntaxHighlight json={message.content.substring(message.content.indexOf('{'), message.content.lastIndexOf('}')+1)} />
                          {message.content.split('}').pop() && <p className="mt-3 leading-relaxed">{message.content.split('}').pop()}</p>}
                        </div>
                      ) : (
                        <Markdown>{message.content}</Markdown>
                      )}
                    </div>
                    <div className="flex flex-row gap-2 mt-1">
                      {message.experimental_attachments?.map((attachment) =>
                        attachment.contentType?.startsWith("image") ? (
                          <img
                            className="rounded-md w-40 mb-3 shadow-sm border border-gray-200"
                            key={attachment.name}
                            src={attachment.url}
                            alt={attachment.name}
                          />
                        ) : attachment.contentType?.startsWith("text") ? (
                          <div className="text-xs w-40 h-24 overflow-hidden text-gray-500 dark:text-gray-500 border border-gray-200 dark:border-gray-200 p-3 rounded-md bg-gray-50 dark:bg-gray-50 mb-3 shadow-sm">
                            {getTextFromDataUrl(attachment.url)}
                          </div>
                        ) : null
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isLoading &&
                messages[messages.length - 1].role !== "assistant" && (
                  <div className="flex gap-4 p-4">
                    <div className="size-10 rounded-full bg-orange-100 dark:bg-orange-100 flex justify-center items-center flex-shrink-0 text-orange-600 dark:text-orange-600">
                      <BotIcon className="size-5" />
                    </div>
                    <div className="flex gap-1.5 items-center h-6">
                      <div className="w-2.5 h-2.5 rounded-full bg-orange-300 dark:bg-orange-300 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-orange-400 dark:bg-orange-400 animate-bounce" style={{ animationDelay: "200ms" }}></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-orange-500 dark:bg-orange-500 animate-bounce" style={{ animationDelay: "400ms" }}></div>
                    </div>
                  </div>
                )}

              <div ref={messagesEndRef} />
            </div>
          ) : (
            <motion.div 
              className="flex flex-col items-center justify-center h-[calc(100vh-240px)] bg-white dark:bg-white rounded-xl shadow-sm p-8 border border-gray-200 dark:border-gray-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="size-32 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-100 dark:to-orange-200 rounded-full flex items-center justify-center mb-8 shadow-inner">
                <JsonLogo className="size-16 text-white dark:text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 text-transparent bg-clip-text mb-3">JSON Generator AI</h2>
              <p className="text-gray-500 dark:text-gray-500 text-center max-w-lg mb-10 leading-relaxed">
                Create perfectly structured JSON data with simple natural language. Describe what you need or use our examples to get started.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
                {examples.slice(0, 3).map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => useExample(example.json)}
                    className="flex flex-col p-5 border border-gray-200 dark:border-gray-200 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-50 transition-colors text-left group hover:border-orange-200 dark:hover:border-orange-200 hover:shadow-sm"
                  >
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-800 mb-1 group-hover:text-orange-500 dark:group-hover:text-orange-500">{example.title}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">{example.description}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          
          <form
            className="flex flex-col gap-2 my-5"
            onSubmit={(event) => {
              const options = files ? { experimental_attachments: files } : {};
              handleSubmit(event, options);
              setFiles(null);
            }}
          >
            <AnimatePresence>
              {files && files.length > 0 && (
                <div className="flex flex-row gap-3 mb-3 px-3 py-2 bg-orange-50 dark:bg-orange-50 rounded-lg border border-orange-100 dark:border-orange-100">
                  {Array.from(files).map((file) => (
                    <motion.div
                      key={file.name}
                      className="w-28 h-16 overflow-hidden text-gray-700 dark:text-gray-700 border border-gray-200 dark:border-gray-200 p-2 rounded-md bg-white dark:bg-white relative group flex flex-col items-center justify-center"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{
                        y: -10,
                        scale: 1.1,
                        opacity: 0,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <FileIcon className="size-6 text-orange-500 mb-1" />
                      <span className="text-xs font-medium truncate max-w-full px-1">
                        {file.name.length > 12 ? file.name.substring(0, 10) + '...' : file.name}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {file.name.split('.').pop()?.toUpperCase()}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>

            <input
              type="file"
              multiple
              accept=".csv,.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="flex items-center w-full bg-white dark:bg-white rounded-full px-5 py-4 shadow-sm border border-gray-200 dark:border-gray-200 focus-within:border-orange-300 dark:focus-within:border-orange-300 focus-within:ring-4 focus-within:ring-orange-100 dark:focus-within:ring-orange-100 transition-all">
              <button
                type="button"
                onClick={handleUploadClick}
                className="text-gray-400 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-500 focus:outline-none mr-3 transition-colors"
                aria-label="Upload Files"
              >
                <AttachmentIcon className="size-5" />
              </button>

              <input
                ref={inputRef}
                className="bg-transparent flex-grow outline-none text-gray-800 dark:text-gray-800 placeholder-gray-400 dark:placeholder-gray-400 text-[15px]"
                placeholder="Describe the JSON structure you need..."
                value={input}
                onChange={handleInputChange}
                onPaste={handlePaste}
              />
              
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`ml-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full p-2.5 transition-all ${(!input.trim() || isLoading) ? 'opacity-50 cursor-not-allowed' : 'shadow-md hover:shadow-lg'}`}
              >
                <SendIcon className="size-5" />
              </button>
            </div>
          </form>
        </div>
        
        <div className={`md:w-96 ${activeTab === 'chat' && 'hidden md:block'}`}>
          <div className="bg-white dark:bg-white rounded-xl shadow-sm p-5 md:sticky md:top-24 border border-gray-200 dark:border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-800 mb-5 flex items-center gap-2">
              <span className="w-1 h-5 bg-orange-500 rounded-full inline-block"></span>
              Example JSON Structures
            </h2>
            <div className="flex flex-col gap-4">
              {examples.map((example, idx) => (
                <div key={idx} className="border border-gray-200 dark:border-gray-200 rounded-xl overflow-hidden hover:border-orange-200 dark:hover:border-orange-200 transition-colors group">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-200 bg-gray-50 dark:bg-gray-50">
                    <h3 className="font-medium text-gray-800 dark:text-gray-800 group-hover:text-orange-500 dark:group-hover:text-orange-500 transition-colors">{example.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{example.description}</p>
                  </div>
                  <div className="p-2 h-44 overflow-auto">
                    <JsonSyntaxHighlight json={example.json} />
                  </div>
                  <div className="p-2 border-t border-gray-200 dark:border-gray-200 bg-gray-50 dark:bg-gray-50">
                    <button 
                      className="w-full py-2 text-sm font-medium text-orange-500 dark:text-orange-500 hover:text-orange-600 dark:hover:text-orange-600 transition-colors"
                      onClick={() => useExample(example.json)}
                    >
                      Use this example
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-50 dark:to-amber-50 rounded-xl border border-orange-100 dark:border-orange-100">
              <h3 className="font-medium text-orange-800 dark:text-orange-800 mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
                Tips for Better Results
              </h3>
              <ul className="text-sm text-orange-700 dark:text-orange-700 space-y-2 pl-4 list-disc marker:text-orange-500">
                <li>Be specific with field names and data types</li>
                <li>Mention nesting structure if needed</li>
                <li>Upload example data for reference</li>
                <li>Specify array items and their format</li>
                <li>Ask for specific validation requirements</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="w-full bg-white dark:bg-white py-5 px-6 mt-auto border-t border-gray-200 dark:border-gray-200">
        <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left flex items-center gap-2">
            <JsonLogo className="size-8 text-white dark:text-white" />
            <div>
              <div className="text-sm font-medium text-gray-800 dark:text-gray-800">JSON Generator AI</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">Create structured data with AI assistance</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-gray-500 dark:text-gray-500">
              © {new Date().getFullYear()} · Built with Next.js & Tailwind CSS
            </div>
            {/* Mobile theme toggle */}
            <button 
              onClick={toggleTheme} 
              className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-100 transition-colors focus:outline-none"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <SunIcon className="text-orange-500" />
              ) : (
                <MoonIcon className="text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </footer>
      
      {/* Mobile Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-white shadow-lg border-t border-gray-200 dark:border-gray-200 flex z-10">
        <button 
          onClick={() => setActiveTab('chat')} 
          className={`flex-1 py-4 flex flex-col items-center ${activeTab === 'chat' ? 'text-orange-500 dark:text-orange-500' : 'text-gray-500 dark:text-gray-500'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span className="text-xs mt-1 font-medium">Conversation</span>
        </button>
        <button 
          onClick={() => setActiveTab('examples')} 
          className={`flex-1 py-4 flex flex-col items-center ${activeTab === 'examples' ? 'text-orange-500 dark:text-orange-500' : 'text-gray-500 dark:text-gray-500'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <path d="M14 2v6h6"/>
            <path d="M16 13H8"/>
            <path d="M16 17H8"/>
            <path d="M10 9H8"/>
          </svg>
          <span className="text-xs mt-1 font-medium">Examples</span>
        </button>
      </div>
    </div>
  );
}