import { useLayoutEffect } from "react";

const DetailLoader = () => {
      useLayoutEffect(() => {
            window.scrollTo(0, 0);
      }, []);

      return (
            <section role="status" aria-label="Loading title details" aria-busy="true" className="detail-loading">
                  <div className="detail-loading__poster" aria-hidden="true" />
                  <div className="detail-loading__copy" aria-hidden="true">
                        <div className="detail-loading__line detail-loading__line--title" />
                        <div className="detail-loading__line detail-loading__line--tagline" />
                        <div className="detail-loading__chips"><i /><i /><i /></div>
                        <div className="detail-loading__line detail-loading__line--rating" />
                        <div className="detail-loading__line detail-loading__line--overview" />
                        <div className="detail-loading__line detail-loading__line--overview detail-loading__line--short" />
                  </div>
                  <div className="detail-loading__actions" aria-hidden="true"><i /><i /><i /></div>
            </section>
      );
};

export default DetailLoader;

export function DetailLoadError({ onRetry }) {
      return (
            <section role="alert" className="detail-load-error">
                  <h1>We couldn’t load this title.</h1>
                  <p>Check your connection and try again.</p>
                  <button type="button" onClick={onRetry}>Try again</button>
            </section>
      );
}
