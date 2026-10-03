import { useState } from "react";
import { Dialog } from "radix-ui";
import { ArrowLeft, Download, ExternalLink, MonitorPlay, RotateCw, X } from "lucide-react";
import ShinyButton from "../effects/shiny-button/index.jsx";

const VIDVAULT_ORIGIN = "https://vidvault.to";

export default function DownloadModal({ mediaId, mediaType = "movie", title, season = 1, episode = 1 }) {
      const [open, setOpen] = useState(false);
      const [showWebView, setShowWebView] = useState(false);
      const [frameVersion, setFrameVersion] = useState(0);
      const [loading, setLoading] = useState(true);
      const [loadError, setLoadError] = useState(false);
      const contentPath = mediaType === "tv" ? `/tv/${encodeURIComponent(mediaId)}/${season}/${episode}` : `/movie/${encodeURIComponent(mediaId)}`;
      const downloadUrl = `${VIDVAULT_ORIGIN}${contentPath}`;
      const episodeLabel = mediaType === "tv" ? ` · Season ${season}, episode ${episode}` : "";

      const changeOpen = (nextOpen) => {
            setOpen(nextOpen);
            if (!nextOpen) setShowWebView(false);
      };

      const openWebView = () => {
            setLoading(true);
            setLoadError(false);
            setShowWebView(true);
      };

      const reloadWebView = () => {
            setLoading(true);
            setLoadError(false);
            setFrameVersion((version) => version + 1);
      };

      return (
            <Dialog.Root open={open} onOpenChange={changeOpen}>
                  <Dialog.Trigger asChild>
                        <ShinyButton label="Download" icon={Download} />
                  </Dialog.Trigger>
                  <Dialog.Portal>
                        <Dialog.Overlay className="download-overlay" />
                        <Dialog.Content className={`download-modal ${showWebView ? "download-modal--webview" : ""}`} data-lenis-prevent>
                              <header className="download-modal__header">
                                    <div className="min-w-0">
                                          <Dialog.Title className="download-modal__title">Download{showWebView ? " on VidVault" : ""}</Dialog.Title>
                                          <Dialog.Description className="download-modal__description">{title || "Your selected title"}{episodeLabel}</Dialog.Description>
                                    </div>
                                    <Dialog.Close className="download-icon-button" aria-label="Close download modal">
                                          <X size={20} aria-hidden="true" />
                                    </Dialog.Close>
                              </header>

                              {showWebView ? (
                                    <>
                                          <div className="download-webview__toolbar">
                                                <button type="button" className="download-text-button" onClick={() => setShowWebView(false)}>
                                                      <ArrowLeft size={16} aria-hidden="true" /> Options
                                                </button>
                                                <div className="flex items-center gap-2">
                                                      <button type="button" className="download-icon-button" onClick={reloadWebView} aria-label="Reload VidVault">
                                                            <RotateCw size={18} aria-hidden="true" />
                                                      </button>
                                                      <a className="download-text-button" href={downloadUrl} target="_blank" rel="noopener noreferrer">
                                                            Open in new tab <ExternalLink size={16} aria-hidden="true" />
                                                      </a>
                                                </div>
                                          </div>
                                          <div className="download-webview__frame" aria-busy={loading}>
                                                {loading && <p className="download-webview__status" role="status">Opening VidVault…</p>}
                                                {loadError ? (
                                                      <div className="download-webview__status" role="alert">
                                                            <p>VidVault couldn’t load here.</p>
                                                            <a className="download-text-button" href={downloadUrl} target="_blank" rel="noopener noreferrer">Open VidVault in a new tab <ExternalLink size={16} aria-hidden="true" /></a>
                                                      </div>
                                                ) : (
                                                      <iframe
                                                            key={`${downloadUrl}:${frameVersion}`}
                                                            src={downloadUrl}
                                                            title={`VidVault downloads for ${title || "selected title"}${episodeLabel}`}
                                                            referrerPolicy="no-referrer"
                                                            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"
                                                            allowFullScreen
                                                            onLoad={() => setLoading(false)}
                                                            onError={() => { setLoading(false); setLoadError(true); }}
                                                      />
                                                )}
                                          </div>
                                          <p className="download-webview__help">If the page stays blank or a download doesn’t start, open it in a new tab.</p>
                                    </>
                              ) : (
                                    <div className="download-modal__options">
                                          <p className="download-modal__intro">Choose how to open VidVault. Available files and qualities appear on its download page.</p>
                                          <button type="button" className="download-option" onClick={openWebView}>
                                                <MonitorPlay size={22} aria-hidden="true" />
                                                <span><strong>Open here</strong><span>Browse downloads inside MoviesFlix.</span></span>
                                                <ArrowLeft className="rotate-180" size={18} aria-hidden="true" />
                                          </button>
                                          <a className="download-option" href={downloadUrl} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink size={22} aria-hidden="true" />
                                                <span><strong>Open VidVault in a new tab</strong><span>Use your browser to download files.</span></span>
                                                <ExternalLink size={18} aria-hidden="true" />
                                          </a>
                                    </div>
                              )}

                              <footer className="download-modal__footer">
                                    <span>Downloads provided by VidVault</span>
                                    <Dialog.Close className="download-text-button">Close</Dialog.Close>
                              </footer>
                        </Dialog.Content>
                  </Dialog.Portal>
            </Dialog.Root>
      );
}
