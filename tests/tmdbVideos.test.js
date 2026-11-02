import test from "node:test";
import assert from "node:assert/strict";
import { pickYouTubeTrailer } from "../src/utils/tmdbVideos.js";

test("pickYouTubeTrailer prefers official trailers and ignores non-YouTube videos", () => {
      const videos = [
            { site: "Vimeo", type: "Trailer", key: "vimeo-key", official: true },
            { site: "YouTube", type: "Teaser", key: "teaser-key", official: true },
            { site: "YouTube", type: "Trailer", key: "unofficial-key", official: false },
            { site: "YouTube", type: "Trailer", key: "official-key", official: true },
      ];

      assert.equal(pickYouTubeTrailer(videos)?.key, "official-key");
});

test("pickYouTubeTrailer returns null when TMDB has no playable trailer or teaser", () => {
      assert.equal(pickYouTubeTrailer([]), null);
      assert.equal(pickYouTubeTrailer([{ site: "YouTube", type: "Clip", key: "clip-key" }]), null);
});
