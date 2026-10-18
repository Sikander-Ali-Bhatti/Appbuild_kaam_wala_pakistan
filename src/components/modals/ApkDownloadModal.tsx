import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  ShieldCheck,
  FileCode,
  Sparkles,
  ArrowDownToLine,
  HelpCircle,
} from 'lucide-react';

interface ApkDownloadModalProps {
  onClose: () => void;
  onOpenSimulator: () => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({
  onClose,
  onOpenSimulator,
}) => {
  const [apkInfo, setApkInfo] = useState<{
    exists: boolean;
    filename: string;
    version: string;
    package: string;
    sizeMb: string;
    downloadUrl: string;
  } | null>(null);

  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    fetch('/api/download/apk/info')
      .then(res => res.json())
      .then(data => {
        if (data.exists) setApkInfo(data);
      })
      .catch(() => {});
  }, []);

  const handleDownload = () => {
    setDownloadStarted(true);
    // Trigger direct download
    const link = document.createElement('a');
    link.href = '/api/download/apk';
    link.download = 'kaam-wala-pakistan.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative my-6 text-slate-800 animate-in fade-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-700/20">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Kaam Wala Pakistan Android App
              </h2>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                APK Ready
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Official Native Android Application • Direct Free Download
            </p>
          </div>
        </div>

        {/* APK Metadata Card */}
        <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Package</span>
              <span className="font-mono font-bold text-slate-800 text-[11px] truncate block">
                {apkInfo?.package || 'com.kaamwalapakistan.app'}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Version</span>
              <span className="font-bold text-slate-800">
                v{apkInfo?.version || '1.0.0'} (Release)
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">File Size</span>
              <span className="font-bold text-teal-700">
                {apkInfo?.sizeMb || '33 KB'} (Ultra-light)
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600">
            <span className="flex items-center space-x-1 text-emerald-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Signed with Android v1 & v2 Scheme</span>
            </span>
            <span className="text-slate-400">Android 5.0 to 14+</span>
          </div>
        </div>

        {/* Download Action Buttons */}
        <div className="mt-5 space-y-2.5">
          <button
            onClick={handleDownload}
            className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black text-sm shadow-md shadow-teal-600/30 flex items-center justify-center space-x-2 transition cursor-pointer"
          >
            <ArrowDownToLine className="w-5 h-5 text-emerald-200" />
            <span>Download Android APK (kaam-wala-pakistan.apk)</span>
          </button>

          {downloadStarted && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Download started! Check your browser downloads for <strong>kaam-wala-pakistan.apk</strong>.</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                onClose();
                onOpenSimulator();
              }}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold flex items-center justify-center space-x-1.5 transition"
            >
              <Smartphone className="w-4 h-4 text-teal-600" />
              <span>Test in Simulator</span>
            </button>

            <a
              href="/downloads/kaam-wala-pakistan.apk"
              download="kaam-wala-pakistan.apk"
              className="py-2.5 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold flex items-center justify-center space-x-1.5 transition text-center"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Direct Link</span>
            </a>
          </div>
        </div>

        {/* Beginner-friendly Installation Steps */}
        <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
          <h4 className="font-extrabold text-xs text-slate-900 flex items-center space-x-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
            <span>Simple Steps to Install on Your Android Phone:</span>
          </h4>

          <ol className="text-xs text-slate-600 space-y-2 pl-4 list-decimal">
            <li className="leading-relaxed">
              <strong>Tap "Download Android APK"</strong> above.
            </li>
            <li className="leading-relaxed">
              When Android Chrome shows <em>"File might be harmful"</em> (standard security notice for all APKs outside Google Play), tap <strong>"Download anyway"</strong>.
            </li>
            <li className="leading-relaxed">
              Open the downloaded file from your notifications bar or <strong>Downloads</strong> folder.
            </li>
            <li className="leading-relaxed">
              If prompted, tap <strong>Settings</strong> and turn ON <strong>"Allow from this source"</strong> (Install unknown apps).
            </li>
            <li className="leading-relaxed">
              Tap <strong>"Install"</strong>, then <strong>"Open"</strong> to launch Kaam Wala Pakistan!
            </li>
          </ol>
        </div>

        {/* Expo & React Native note */}
        <div className="mt-4 p-2.5 bg-slate-100/80 rounded-xl text-[10px] text-slate-500 flex items-center justify-between">
          <span>React Native + Expo project source code also available in <code>/mobile</code>.</span>
          <span className="font-mono text-teal-700 font-bold">Expo 52</span>
        </div>
      </div>
    </div>
  );
};
