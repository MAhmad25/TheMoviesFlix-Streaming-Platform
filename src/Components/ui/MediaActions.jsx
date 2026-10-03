import { Play, Clapperboard } from "lucide-react";
import { Link } from "react-router-dom";
import ShinyButton from "../effects/shiny-button/index.jsx";
import DownloadModal from "./DownloadModal";

export default function MediaActions({ mediaId, mediaType = "movie", title, watchTo, onWatch, showWatch = true, showTrailer = true, season = 1, episode = 1 }) {
      return (
            <div className="media-actions" aria-label="Watch, trailer and download actions" data-action-count={Number(showWatch) + Number(showTrailer) + 1} style={{ "--media-action-count": Number(showWatch) + Number(showTrailer) + 1 }}>
                  {showWatch && <ShinyButton as={watchTo ? Link : "button"} to={watchTo} onClick={onWatch} label="Watch" icon={Play} primary />}
                  {showTrailer && <ShinyButton as={Link} to="trailer" label="Trailer" icon={Clapperboard} />}
                  <DownloadModal key={`${mediaType}:${mediaId}:${season}:${episode}`} mediaId={mediaId} mediaType={mediaType} title={title} season={season} episode={episode} />
            </div>
      );
}
