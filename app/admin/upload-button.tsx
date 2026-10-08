"use client";

import { useRef, useState } from "react";

type WidgetResult = {
  event?: string;
  info?: { secure_url?: string } | string;
};
type WidgetError = { message?: string; statusText?: string } | string | null;
type Widget = { open: () => void; destroy?: () => void };

type CloudinaryGlobal = {
  createUploadWidget: (
    options: Record<string, unknown>,
    callback: (error: WidgetError, result: WidgetResult) => void,
  ) => Widget;
};

declare global {
  interface Window {
    cloudinary?: CloudinaryGlobal;
  }
}

const SCRIPT_SRC = "https://upload-widget.cloudinary.com/latest/global/all.js";
const CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dognbegiw";
const API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const FOLDER = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER || "portfolio";

let scriptPromise: Promise<CloudinaryGlobal> | null = null;

function loadWidgetScript(): Promise<CloudinaryGlobal> {
  if (window.cloudinary) return Promise.resolve(window.cloudinary);
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<CloudinaryGlobal>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () =>
      window.cloudinary
        ? resolve(window.cloudinary)
        : reject(new Error("Cloudinary widget unavailable"));
    s.onerror = () => reject(new Error("Could not load the Cloudinary widget"));
    document.head.appendChild(s);
  }).catch((e) => {
    scriptPromise = null; // allow retry
    throw e;
  });
  return scriptPromise;
}

const IMAGE_FORMATS = ["png", "jpg", "jpeg", "gif", "webp", "avif", "svg"];
const VIDEO_FORMATS = ["mp4", "webm", "mov", "m4v", "ogv"];

type Props = {
  onUploaded: (url: string) => void;
  /** "image" restricts to images (avatars); "any" allows images, GIFs and video. */
  accept?: "image" | "any";
  className?: string;
};

/**
 * Opens the Cloudinary Upload Widget (signed uploads) and hands back the
 * asset's secure_url. Renders nothing when the API key isn't configured so
 * the admin keeps working with pasted URLs.
 */
export function UploadButton({ onUploaded, accept = "any", className }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const widgetRef = useRef<Widget | null>(null);
  const cbRef = useRef(onUploaded);
  cbRef.current = onUploaded;

  if (!API_KEY) return null;

  async function open() {
    setError(null);
    setBusy(true);
    try {
      if (!widgetRef.current) {
        const cloudinary = await loadWidgetScript();
        widgetRef.current = cloudinary.createUploadWidget(
          {
            cloudName: CLOUD_NAME,
            apiKey: API_KEY,
            uploadSignature: (
              cb: (sig: string) => void,
              paramsToSign: Record<string, unknown>,
            ) => {
              fetch("/api/cloudinary/sign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paramsToSign }),
              })
                .then(async (r) => {
                  const d = (await r.json().catch(() => ({}))) as {
                    signature?: string;
                    error?: string;
                  };
                  if (!r.ok || !d.signature) {
                    throw new Error(d.error || `Signing failed (${r.status})`);
                  }
                  cb(d.signature);
                })
                .catch((e: unknown) => {
                  setError(e instanceof Error ? e.message : "Signing failed");
                  setBusy(false);
                });
            },
            folder: FOLDER,
            sources: ["local", "url", "camera"],
            multiple: false,
            resourceType: accept === "image" ? "image" : "auto",
            clientAllowedFormats:
              accept === "image"
                ? IMAGE_FORMATS
                : [...IMAGE_FORMATS, ...VIDEO_FORMATS],
          },
          (err, result) => {
            if (err) {
              const msg =
                typeof err === "string"
                  ? err
                  : err.message || err.statusText || "Upload failed";
              setError(msg);
              setBusy(false);
              return;
            }
            const ev = result?.event;
            if (ev === "success") {
              const info = result.info;
              if (info && typeof info === "object" && info.secure_url) {
                cbRef.current(info.secure_url);
              }
              setBusy(false);
            } else if (ev === "close" || ev === "abort") {
              setBusy(false);
            }
          },
        );
      }
      widgetRef.current.open();
      // Widget is now open; "UPLOADING…" covers load/sign until it reports.
      setBusy(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
      setBusy(false);
    }
  }

  return (
    <span className="inline-flex flex-col gap-1 shrink-0">
      <button
        type="button"
        onClick={open}
        disabled={busy}
        className={`admin-btn px-4 py-3 t-micro shrink-0 min-h-12${className ?? ""}`}
      >
        {busy ? "UPLOADING…" : "UPLOAD"}
      </button>
      {error && (
        <span role="alert" className="t-micro text-body max-w-[16rem]">
          {error}
        </span>
      )}
    </span>
  );
}
