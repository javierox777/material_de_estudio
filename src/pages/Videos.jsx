// src/pages/Videos.jsx
import React from "react";

export default function Videos() {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-xl overflow-hidden">
      <div className="p-6 space-y-4">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Videos</h2>
        <p className="text-slate-600 dark:text-slate-300">ponganle weno cauros</p>

        {/* Video individual embebido (CORRECTO) */}
        <div className="aspect-video w-full rounded-xl overflow-hidden border dark:border-slate-800">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/8rpUp9kK6Cc"
            title="Video nodejs express"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>

        {/* Ejemplos adicionales */}
        <div className="grid md:grid-cols-2 gap-4">
        <div className="aspect-video rounded-xl overflow-hidden border dark:border-slate-800">
  <iframe
    className="w-full h-full"
    src="https://www.youtube.com/embed/5EOxUCLraX8"
    title="Video 1"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowFullScreen
    loading="lazy"
  ></iframe>
</div>
          <div className="aspect-video rounded-xl overflow-hidden border dark:border-slate-800">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/ysz5S6PUM-U"
              title="Video 2"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
