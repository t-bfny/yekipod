import { useRef, useState } from "react"

const albums = [
  { id: 1, title: "Album 1", image: "https://t-bfny.github.io/yekipod/artwork/abyss.jpg" },
  { id: 2, title: "Album 2", image: "https://t-bfny.github.io/yekipod/artwork/liveatthevillagevuanguard.jpg" },
  { id: 3, title: "Album 3", image: "https://t-bfny.github.io/yekipod/artwork/pilgrimage.jpg" },
  { id: 4, title: "Album 4", image: "https://t-bfny.github.io/yekipod/artwork/spark.jpg" },
  { id: 5, title: "Album 5", image: "https://t-bfny.github.io/yekipod/artwork/album5.jpg" },
  { id: 6, title: "Album 6", image: "https://t-bfny.github.io/yekipod/artwork/album6.jpg" },
  { id: 7, title: "Album 7", image: "https://t-bfny.github.io/yekipod/artwork/album7.jpg" },
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