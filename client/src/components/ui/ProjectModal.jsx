import { useRef, useEffect, useCallback } from 'react';

/**
 * Validates that a URL uses https:// protocol.
 * Prevents javascript:, data:, blob: and other dangerous protocols.
 * @param {string} urlStr
 * @returns {boolean}
 */
function isValidUrl(urlStr) {
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Browser-frame modal for live project previews.
 * Iframe is sandboxed and only loads validated URLs.
 */
export default function ProjectModal({ isOpen, url, onClose }) {
  const currentUrl = url || '';
  const bodyRef = useRef(null);
  const validUrl = isValidUrl(currentUrl);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const handleReload = useCallback(() => {
    const body = bodyRef.current;
    if (!body || !validUrl) return;
    const iframe = body.querySelector('iframe');
    if (iframe) iframe.src = currentUrl;
  }, [currentUrl, validUrl]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!url) return null;

  // Sanitize display URL — show text only, never render as HTML
  const displayUrl = validUrl ? currentUrl : 'Invalid URL';

  return (
    <div className={`overlay ${isOpen ? 'open' : ''}`} onClick={handleOverlayClick}>
      <div className="modal">
        <div className="mbar">
          <div className="mdots">
            <span className="mdr" onClick={onClose} />
            <span className="mdy" />
            <span className="mdg" />
          </div>
          <div className="murl-w">
            <span className="mlock">{validUrl ? '🔒' : '⚠️'}</span>
            <span className="murltext">{displayUrl}</span>
          </div>
          <div className="mbtns">
            <button className="mbtn" onClick={handleReload} disabled={!validUrl}>↺</button>
            {validUrl && (
              <a href={currentUrl} className="mbtn" target="_blank" rel="noopener noreferrer">↗ Open</a>
            )}
            <button className="mbtn" onClick={onClose}>✕</button>
          </div>
        </div>
        <div id="modal-body" ref={bodyRef}>
          {isOpen && validUrl && (
            <>
              <div className="mpanel">
                <div style={{ fontSize: '2.5rem' }}>⚡</div>
                <div>Loading preview…</div>
                <div style={{ color: 'var(--a2)', fontSize: '.73rem', fontFamily: 'var(--mono)' }}>
                  {displayUrl}
                </div>
                <a href={currentUrl} target="_blank" rel="noopener noreferrer">
                  Open in new tab →
                </a>
                <small>
                  Some apps block iframe embedding — use the Open button if preview doesn't load.
                </small>
              </div>
              <iframe
                className="miframe"
                src={currentUrl}
                title="Live Preview"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                referrerPolicy="no-referrer"
                loading="lazy"
                onLoad={(e) => {
                  try {
                    void e.target.contentWindow.location.href;
                    const panel = e.target.previousElementSibling;
                    if (panel) panel.style.display = 'none';
                  } catch {
                    // cross-origin, keep placeholder visible
                  }
                }}
              />
            </>
          )}
          {isOpen && !validUrl && (
            <div className="mpanel">
              <div style={{ fontSize: '2.5rem' }}>⚠️</div>
              <div>Invalid or unsafe URL</div>
              <small>Only http:// and https:// URLs can be previewed.</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
