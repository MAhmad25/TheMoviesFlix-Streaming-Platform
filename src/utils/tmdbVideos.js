const VIDEO_TYPE_PRIORITY = { Trailer: 0, Teaser: 1 };

export function pickYouTubeTrailer(videos = []) {
      return videos
            .filter((video) => video?.site === "YouTube" && video.key && VIDEO_TYPE_PRIORITY[video.type] !== undefined)
            .sort((left, right) => {
                  const typePriority = VIDEO_TYPE_PRIORITY[left.type] - VIDEO_TYPE_PRIORITY[right.type];
                  if (typePriority !== 0) return typePriority;
                  if (Boolean(left.official) !== Boolean(right.official)) return left.official ? -1 : 1;
                  return new Date(right.published_at || 0).getTime() - new Date(left.published_at || 0).getTime();
            })[0] || null;
}
