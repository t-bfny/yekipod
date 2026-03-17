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
      { number: 1, title: "Spark" },
      { number: 2, title: "In a Trance" },
      { number: 3, title: "Take Me Away" },
      { number: 4, title: "Wonderland" },
      { number: 5, title: "Indulgence" },
      { number: 6, title: "Dilemma" },
      { number: 7, title: "What Will Be, Will Be" },
      { number: 8, title: "Wake Up and Dream" },
      { number: 9, title: "All's Well" },
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
  image: "https://t-bfny.github.io/yekipod/mano_1400.png",
}))

export default function App() {
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const sliderRef = useRef(null)

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
              {[
                "Arch Linux", "X1", "Arista", "Impreza", "Picoflex",
                "Reordering", "Destination", "Lanner", "Implicit deny",
                "Room 1002", "Grand Front", "KOGANEI", "Eucalyptus Night"
              ].map((track, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  padding: "10px 0",
                  borderBottom: "1px solid #222",
                  cursor: "pointer",
                }}>
                  <span style={{ color: "#aaa", width: "20px", textAlign: "right" }}>{i + 1}</span>
                  <span>{track}</span>
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
        <h1 style={{ margin: 0, fontSize: "20px" }}>YekiPod</h1>
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

    </div>
  )
}