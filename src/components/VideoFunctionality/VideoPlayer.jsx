import { useEffect, useRef, useState } from "react";
import {
  FaExpand,
  FaPause,
  FaPlay,
  FaStepBackward,
  FaStepForward,
  FaVolumeMute,
  FaVolumeUp
} from "react-icons/fa";

export default function VideoPlayer({
  videoUrl,
  thumbnailUrl,
  onNext,
  onPrevious,
  onBack, // <-- for back button callback
  title,
}) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [controlsVisible, setControlsVisible] = useState(true);
  const [duration, setDuration] = useState("0:00");

  useEffect(() => {
    document.addEventListener("fullscreenchange", () => {
      setIsFullscreen(!!document.fullscreenElement);
    });
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.load();
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime("0:00");
      setVideoError(false);
      setControlsVisible(true);
      setDuration("0:00");
    }
  }, [videoUrl]);

  const handleFullscreen = () => {
    const player = playerRef.current;
    if (!player) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      player.requestFullscreen?.();
    }
    setControlsVisible(true);
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
    setControlsVisible(true);
  };

  const handleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
    setControlsVisible(true);
  };

  const handleProgress = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    setProgress((current / total) * 100);
    const m = Math.floor(current / 60);
    const s = Math.floor(current % 60).toString().padStart(2, "0");
    setCurrentTime(`${m}:${s}`);
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const newTime = (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(e.target.value);
    setControlsVisible(true);
  };

  const handleVideoError = () => setVideoError(true);

  useEffect(() => {
    const updateDuration = () => {
      const dur = videoRef.current?.duration;
      if (!isNaN(dur)) {
        const m = Math.floor(dur / 60);
        const s = Math.floor(dur % 60).toString().padStart(2, "0");
        setDuration(`${m}:${s}`);
      }
    };
    videoRef.current?.addEventListener("loadedmetadata", updateDuration);
    return () => videoRef.current?.removeEventListener("loadedmetadata", updateDuration);
  }, [videoUrl]);

  return (
    <div className="relative bg-white p-4 rounded-xl shadow-xl w-full">
     

      <div
        ref={playerRef}
        className="relative w-full rounded-lg overflow-hidden bg-black"
        onMouseMove={() => setControlsVisible(true)}
        onMouseLeave={() => isPlaying && setControlsVisible(false)}
      >
        {/* Video Wrapper */}
        <div className="relative w-full pb-[56.25%]">
          {!videoError ? (
            <video
              ref={videoRef}
              src={videoUrl}
              poster={thumbnailUrl}
              className="absolute top-0 left-0 w-full h-full object-contain"
              onClick={handlePlayPause}
              onTimeUpdate={handleProgress}
              controlsList="nodownload"
              onError={handleVideoError}
            />
          ) : (
            <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-white text-black">
              <p className="text-center">Video unavailable. Please check the source.</p>
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div
          className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 px-4 py-3 bg-gradient-to-t from-black/80 to-transparent ${
            controlsVisible || !isPlaying ? "opacity-100" : "opacity-0"
          }`}
        >
          <input
            type="range"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1 rounded bg-gray-700 accent-[#1E88E5]"
          />

          <div className="flex justify-between items-center text-white text-sm mt-1 font-mono">
            <span>{currentTime}</span>
            <span>{duration}</span>
          </div>

          <div className="flex justify-between items-center mt-3 text-white">
            <div className="flex items-center gap-3">
              <button
                onClick={onPrevious}
                className="p-2 rounded-full bg-gray-800 hover:bg-[#1E88E5] transition hover:scale-110"
              >
                <FaStepBackward />
              </button>
              <button
                onClick={handlePlayPause}
                className="p-2 rounded-full bg-gray-800 hover:bg-[#1E88E5] transition hover:scale-110"
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button
                onClick={onNext}
                className="p-2 rounded-full bg-gray-800 hover:bg-[#1E88E5] transition hover:scale-110"
              >
                <FaStepForward />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleMute}
                className="hidden sm:block p-2 rounded-full bg-gray-800 hover:bg-[#1E88E5] transition hover:scale-110"
              >
                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
              <button
                onClick={handleFullscreen}
                className="p-2 rounded-full bg-gray-800 hover:bg-[#1E88E5] transition hover:scale-110"
              >
                <FaExpand />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
