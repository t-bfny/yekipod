import { useRef, useState } from "react"

const albums = [
  {
    id: 1,
    title: "abyss",
    artist: "Chihiro Yamanaka",
    year: 2007,
    image: "https://t-bfny.github.io/yekipod/artwork/abyss.jpg",
    isFavorite: true,
    tracks: [
      { number: 1, title: "Lucky Southern" },
      { number: 2, title: "The Root of the Light" },
      { number: 3, title: "Sing, Sing, Sing ~ Give Me a Break" },
      { number: 4, title: "Take Me in Your Arms" },
      { number: 5, title: "For Heaven's Sake" },
      { number: 6, title: "Giant Steps" },
      { number: 7, title: "I'm Gonna Go Fishin'" },
      { number: 8, title: "Forest Star" },
      { number: 9, title: "Being Cold" },
      { number: 10, title: "Downtown Loop" },
    ]
  },
  {
    id: 2,
    title: "Live at the Village Vanguard",
    artist: "Christian Mcbride Trio",
    year: 2015,
    image: "https://t-bfny.github.io/yekipod/artwork/liveatthevillagevanguard.jpg",
    isFavorite: true,
    tracks: [
      { number: 1, title: "Fried Pies" },
      { number: 2, title: "Band Introduction" },
      { number: 3, title: "Interlude" },
      { number: 4, title: "Sand Dune" },
      { number: 5, title: "The Lady in My Life" },
      { number: 6, title: "Cherokee" },
      { number: 7, title: "Good Morning Heartache" },
      { number: 8, title: "Down by the Riverside" },
      { number: 9, title: "Car Wash" },
    ]
  },
  {
    id: 3,
    title: "pilgrimage",
    artist: "Michael Brecker",
    year: 2007,
    image: "https://t-bfny.github.io/yekipod/artwork/pilgrimage.jpg",
    isFavorite: true,
    tracks: [
      { number: 1, title: "The Mean Time" },
      { number: 2, title: "Five Months from Midnight" },
      { number: 3, title: "Anagram" },
      { number: 4, title: "Tumbleweed" },
      { number: 5, title: "When Can I Kiss You Again" },
      { number: 6, title: "Cardinal Rule" },
      { number: 7, title: "Half Moon Lane" },
      { number: 8, title: "Loose Threads" },
      { number: 9, title: "Pilgrimage" },
    ]
  },
  {
    id: 4,
    title: "SPARK",
    artist: "Hiromi",
    year: 2016,
    image: "https://t-bfny.github.io/yekipod/artwork/spark.jpg",
    isFavorite: true,
    tracks: [
      { number: 1, title: "Spark", src: "https://t-bfny.github.io/yekipod/album/Spark/01%20Spark.m4a" },
      { number: 2, title: "In a Trance ", src: "https://t-bfny.github.io/yekipod/album/Spark/02%20In%20a%20Trance.m4a" },
      { number: 3, title: "Take Me Away", src: "https://t-bfny.github.io/yekipod/album/Spark/03%20Take%20Me%20Away.m4a" },
      { number: 4, title: "Wonderland", src: "https://t-bfny.github.io/yekipod/album/Spark/04%20Wonderland.m4a" },
      { number: 5, title: "Indulgence", src: "https://t-bfny.github.io/yekipod/album/Spark/05%20Indulgence.m4a" },
      { number: 6, title: "Dilemma", src: "https://t-bfny.github.io/yekipod/album/Spark/06%20Dilemma.m4a" },
      { number: 7, title: "What Will Be, Will Be", src: "https://t-bfny.github.io/yekipod/album/Spark/07%20What%20Will%20Be,%20Will%20Be.m4a" },
      { number: 8, title: "Wake Up and Dream ", src: "https://t-bfny.github.io/yekipod/album/Spark/08%20Wake%20Up%20and%20Dream.m4a" },
      { number: 9, title: "All's Well", src: "https://t-bfny.github.io/yekipod/album/Spark/09%20All's%20Well.m4a" },
    ]
  },
  { id: 5, title: "Album 5", image: "https://t-bfny.github.io/yekipod/mano_1400.png" },
  { id: 6, title: "Album 6", image: "https://t-bfny.github.io/yekipod/mano_1400.png" },
  { id: 7, title: "Album 7", image: "https://t-bfny.github.io/yekipod/mano_1400.png" },
  { id: 8, title: "Album 8", image: "https://t-bfny.github.io/yekipod/mano_1400.png" },
  { id: 9, title: "Album 9", image: "https://t-bfny.github.io/yekipod/mano_1400.png" },
  { id: 10, title: "Album 10", image: "https://t-bfny.github.io/yekipod/mano_1400.png" },
  { id: 11, title: "Album 11", image: "https://t-bfny.github.io/yekipod/mano_1400.png" },
  { id: 12, title: "Album 12", image: "https://t-bfny.github.io/yekipod/mano_1400.png" },
  { id: 13, title: "Album 13", image: "https://t-bfny.github.io/yekipod/mano_1400.png" },
  { id: 14, title: "Album 14", image: "https://t-bfny.github.io/yekipod/mano_1400.png" },
  { id: 15, title: "Album 15", image: "https://t-bfny.github.io/yekipod/mano_1400.png" },
  { id: 16, title: "Album 16", image: "https://t-bfny.github.io/yekipod/mano_1400.png" },
]

const allAlbums = Array.from({ length: 28 }, (_, i) => ({
  id: i + 1,
  title: `Album ${i + 1}`,
  image: "https://t-bfny.github.io/yekipod/mitama.png",
}))

export default function App() {
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const sliderRef = useRef(null)
  const [currentTrack, setCurrentTrack] = useState(null)
  const audioRef = useRef(null)

  const handleMouseMove = (e) => {
    const slider = sliderRef.current
    const rect = slider.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width
    const zone = width * 0.15

    if (x < zone) {
      slider.scrollLeft -= 20
    } else if (x > width - zone) {
      slider.scrollLeft += 20
    }
  }

  if (selectedAlbum) {
    return (
      <div style={{ background: "#111", minHeight: "100vh", color: "white", fontFamily: "sans-serif", padding: "24px" }}>
        <button onClick={() => setSelectedAlbum(null)} style={{ background: "none", border: "none", color: "white", fontSize: "16px", cursor: "pointer", marginBottom: "24px" }}>
          ← 戻る
        </button>
        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
          <div style={{
            width: "200px",
            height: "200px",
            borderRadius: "8px",
            backgroundImage: `url(${selectedAlbum.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            flexShrink: 0,
          }} />
          <div>
            <h1>{selectedAlbum.title}</h1>
            <div style={{ marginTop: "8px" }}>

              {(selectedAlbum.tracks || []).map((track) => (
                <div key={track.number} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "10px 0",
                  borderBottom: "1px solid #222",
                  cursor: "pointer",
                }} onClick={() => {
                  setCurrentTrack(track);
                }}>
                  <span style={{ color: "#aaa", width: "20px", textAlign: "right" }}>{track.number}</span>
                  <span>{track.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: "#111", minHeight: "100vh", color: "white", fontFamily: "sans-serif" }}>

      {/* ヘッダー */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 24px",
        borderBottom: "1px solid #333",
        position: "sticky",
        top: 0,
        background: "#111",
        zIndex: 10,
      }}>
        <img
          src="https://t-bfny.github.io/yekipod/yekipod_logo.png"
          style={{ height: "32px" }}
        />
        <div style={{ cursor: "pointer", fontSize: "24px" }}>☰</div>
      </div>

      {/* よく使うアルバム */}
      <div style={{ padding: "24px 0 0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: "24px", marginBottom: "16px" }}>
          <h2 style={{ margin: 0, fontSize: "16px" }}>よく使うアルバム</h2>
          <span style={{ fontSize: "13px", color: "#aaa", cursor: "pointer" }}>more &gt;&gt;</span>
        </div>
        <div
          ref={sliderRef}
          onMouseMove={handleMouseMove}
          style={{
            display: "flex",
            overflowX: "hidden",
            gap: "16px",
            paddingBottom: "16px",
            width: "100vw",
          }}
        >
          {albums.map((album) => (
            <div
              key={album.id}
              onClick={() => setSelectedAlbum(album)}
              style={{
                minWidth: "160px",
                height: "160px",
                borderRadius: "50%",
                backgroundImage: `url(${album.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                flexShrink: 0,
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>

      {/* All Albums */}
      <div style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ margin: 0, fontSize: "16px" }}>All Albums</h2>
          <span style={{ fontSize: "13px", color: "#aaa", cursor: "pointer" }}>more &gt;&gt;</span>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "8px",
        }}>
          {allAlbums.map((album) => (
            <div
              key={album.id}
              style={{
                aspectRatio: "1",
                borderRadius: "8px",
                backgroundImage: `url(${album.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>

      {currentTrack && (
        <div style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#222",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          borderTop: "1px solid #333",
        }}>
          <span style={{ color: "white" }}>{currentTrack.title}</span>
          <audio
            ref={audioRef}
            src={currentTrack.src}
            controls
            autoPlay
            style={{ flex: 1 }}
          />
        </div>
      )}

    </div>
  )
}