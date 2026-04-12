import { useRef, useState, useEffect } from "react"
import './App.css'
import { useGoogleLogin } from '@react-oauth/google'

const i18n = {
  en: {
    login: "Login with Google",
    recentlyUsed: "Recently Used Albums",
    allAlbums: "All Albums",
    youTubePlaylists: "YouTube Playlists",
    more: "more >>",
    back: "← Back",
    logout: "Logout",
    favorites: "Favorites",
    noFavorites: "No favorites yet. Star an album to add it here.",
    language: "日本語",
    portfolio: "Links",
    rights: "© All rights reserved",
  },
  ja: {
    login: "Googleでログイン",
    recentlyUsed: "よく使うアルバム",
    allAlbums: "すべてのアルバム",
    youTubePlaylists: "YouTubeプレイリスト",
    more: "more >>",
    back: "← 戻る",
    logout: "ログアウト",
    favorites: "お気に入り",
    noFavorites: "まだお気に入りがありません。⭐でアルバムを追加できます。",
    language: "English",
    portfolio: "Links",
    rights: "© All rights reserved",
  }
}

export default function App() {
  const [accessToken, setAccessToken] = useState(null)
  const [lang, setLang] = useState("en")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerView, setDrawerView] = useState("menu") // "menu" | "favorites"
  const t = i18n[lang]

  const login = useGoogleLogin({
    onSuccess: (response) => setAccessToken(response.access_token),
    scope: 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/youtube.readonly'
  })

  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const sliderRef = useRef(null)
  const [currentTrack, setCurrentTrack] = useState(null)
  const audioRef = useRef(null)
  const [currentAlbum, setCurrentAlbum] = useState(null)
  const [driveAlbums, setDriveAlbums] = useState([])
  const [favoritesFileId, setFavoritesFileId] = useState(null)
  const [favoriteIds, setFavoriteIds] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [embedError, setEmbedError] = useState(false)

  const fetchAllPlaylists = async () => {
    let all = []
    let nextPageToken = ''
    do {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&maxResults=25&pageToken=${nextPageToken}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )
      const data = await res.json()
      all = [...all, ...data.items]
      nextPageToken = data.nextPageToken
    } while (nextPageToken)
    setPlaylists(all)
  }

  useEffect(() => {
    if (!accessToken) return
    fetchAllPlaylists()
  }, [accessToken])

  const selectAlbum = (album) => {
    setSelectedAlbum(album)
    window.scrollTo(0, 0)

    fetch(`https://www.googleapis.com/drive/v3/files?q='${album.id}'+in+parents&fields=files(id,name)&orderBy=name`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(res => res.json())
      .then(data => {
        const tracks = data.files
          .filter(f => f.name.match(/\.(mp3|flac|m4a|wav|mp4)$/i))
          .map((f, i) => ({
            number: i + 1,
            title: f.name.replace(/^\d+[\s._-]*/, '').replace(/\.[^/.]+$/, ''),
            src: `https://www.googleapis.com/drive/v3/files/${f.id}?alt=media`,
            id: f.id
          }))
        setSelectedAlbum(prev => ({ ...prev, tracks }))
      })
  }

  const toggleFavorite = (albumId) => {
    const newIds = favoriteIds.includes(albumId)
      ? favoriteIds.filter(id => id !== albumId)
      : [...favoriteIds, albumId]
    setFavoriteIds(newIds)
    fetch(`https://www.googleapis.com/upload/drive/v3/files/${favoritesFileId}?uploadType=media`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newIds)
    }).then(res => res.json()).then(data => console.log('favorites保存:', data))
  }

  const playTrack = (track) => {
    fetch(`https://www.googleapis.com/drive/v3/files/${track.id}?alt=media`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(res => res.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob)
        setCurrentTrack({ ...track, src: url })
        setCurrentAlbum(selectedAlbum)
      })
  }

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.src
      audioRef.current.play()
    }
  }, [currentTrack])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedAlbum]);

  useEffect(() => {
    if (!accessToken) return
    const musicFolderId = '1c1z8Wj7ld420FVUG__qGYNN9q9X310y1'
    const artworkFolderId = '1tRI2Vb4DryCfrV9hPJN8IikNON2jPfRR'
    const configFolderId = '1GSuRQ7pW0T-uR3kIuCbR8ZJQNym4oj1p'

    Promise.all([
      fetch(`https://www.googleapis.com/drive/v3/files?q='${musicFolderId}'+in+parents+and+mimeType='application/vnd.google-apps.folder'&fields=files(id,name)`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      }).then(res => res.json()),
      fetch(`https://www.googleapis.com/drive/v3/files?q='${artworkFolderId}'+in+parents&fields=files(id,name)`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      }).then(res => res.json()),
      fetch(`https://www.googleapis.com/drive/v3/files?q='${configFolderId}'+in+parents+and+name='favorites.json'&fields=files(id,name)`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      }).then(res => res.json())
    ]).then(([albumData, artworkData, favData]) => {

      if (favData.files.length === 0) {
        const metadata = { name: 'favorites.json', parents: [configFolderId], mimeType: 'application/json' }
        const body = JSON.stringify([])
        fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/related; boundary=boundary'
          },
          body: `--boundary\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(metadata)}\r\n--boundary\r\nContent-Type: application/json\r\n\r\n${body}\r\n--boundary--`
        }).then(res => res.json()).then(file => setFavoritesFileId(file.id))
      } else {
        setFavoritesFileId(favData.files[0].id)
        fetch(`https://www.googleapis.com/drive/v3/files/${favData.files[0].id}?alt=media`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        }).then(res => res.json()).then(data => setFavoriteIds(data))
      }

      const artworkMap = {}
      artworkData.files.forEach(f => {
        const name = f.name.replace(/\.[^/.]+$/, '')
        artworkMap[name] = `https://drive.google.com/thumbnail?id=${f.id}&sz=w400`
      })

      const albums = albumData.files
        .filter(f => f.name !== 'artwork' && f.name !== 'config')
        .map(f => ({ ...f, image: artworkMap[f.name] || null }))

      setDriveAlbums(albums)
    })
  }, [accessToken])

  const playNext = () => {
    if (!currentAlbum) return
    const tracks = currentAlbum.tracks || []
    const nextTrack = tracks.find(t => t.number === currentTrack.number + 1)
    if (nextTrack) playTrack(nextTrack)
  }

  const playPrev = () => {
    if (!currentAlbum) return
    const tracks = currentAlbum.tracks || []
    const prevTrack = tracks.find(t => t.number === currentTrack.number - 1)
    if (prevTrack) playTrack(prevTrack)
  }

  const handleMouseMove = (e) => {
    const slider = sliderRef.current
    const rect = slider.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width
    const zone = width * 0.15
    if (x < zone) slider.scrollLeft -= 20
    else if (x > width - zone) slider.scrollLeft += 20
  }

  const favoriteAlbums = driveAlbums.filter(a => favoriteIds.includes(a.id))

  const fetchPlaylists = async () => {
    const res = await fetch(
      'https://www.googleapis.com/youtube/v3/playlists?part=snippet&mine=true&maxResults=10',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
    const data = await res.json()
    return data.items
  }

  return (
    <div style={{ background: "#111", minHeight: "100vh", color: "white", fontFamily: "sans-serif", paddingBottom: currentTrack ? "70px" : "0px" }}>

      {/* Login Button */}
      {!accessToken && (
        <button onClick={login} style={{
          position: "fixed", top: "16px", right: "16px", zIndex: 1000,
          padding: "8px 16px", background: "#4285f4", color: "white",
          border: "none", borderRadius: "4px", cursor: "pointer"
        }}>
          {t.login}
        </button>
      )}

      {/* Drawer Overlay */}
      {drawerOpen && (
        <div
          onClick={() => { setDrawerOpen(false); setDrawerView("menu") }}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            zIndex: 200,
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, height: "100%",
        width: "280px",
        background: "#1a1a1a",
        zIndex: 201,
        transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.25s ease",
        display: "flex", flexDirection: "column",
        borderLeft: "1px solid #333",
      }}>
        {/* Drawer Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #333" }}>
          {drawerView === "favorites" ? (
            <button onClick={() => setDrawerView("menu")} style={{ background: "none", border: "none", color: "#aaa", fontSize: "14px", cursor: "pointer", padding: 0 }}>← {lang === "en" ? "Menu" : "メニュー"}</button>
          ) : (
            <span style={{ color: "#aaa", fontSize: "14px" }}>Menu</span>
          )}
          <button onClick={() => { setDrawerOpen(false); setDrawerView("menu") }} style={{ background: "none", border: "none", color: "white", fontSize: "22px", cursor: "pointer", lineHeight: 1 }}>✕</button>
        </div>

        {/* Menu View */}
        {drawerView === "menu" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "8px 0" }}>
            {/* Switch Language */}
            <button onClick={() => setLang(lang === "en" ? "ja" : "en")} style={menuItemStyle}>
              {t.language}
            </button>

            {/* Favorites */}
            <button onClick={() => setDrawerView("favorites")} style={menuItemStyle}>
              {t.favorites}
            </button>

            {/* Spacer */}
            <div style={{ height: "1px", background: "#333", margin: "8px 20px" }} />

            {/* Portfolio */}
            <a
              href="https://yekipo.tech"
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...menuItemStyle, textDecoration: "none", display: "block" }}
            >
              {t.portfolio}
            </a>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Logout */}
            {accessToken && (
              <button onClick={() => {
                setAccessToken(null)
                setDriveAlbums([])
                setFavoriteIds([])
                setSelectedAlbum(null)
                setCurrentTrack(null)
                setDrawerOpen(false)
              }} style={{ ...menuItemStyle, color: "#ff6b6b" }}>
                {t.logout}
              </button>
            )}

            {/* All rights reserved */}
            <div style={{ padding: "16px 20px", color: "#555", fontSize: "11px", textAlign: "center" }}>
              {t.rights}
            </div>
          </div>
        )}

        {/* Favorites View */}
        {drawerView === "favorites" && (
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
            {favoriteAlbums.length === 0 ? (
              <p style={{ color: "#666", fontSize: "13px", padding: "20px", textAlign: "center" }}>{t.noFavorites}</p>
            ) : (
              favoriteAlbums.map(album => (
                <div key={album.id} onClick={() => {
                  selectAlbum(album)
                  setDrawerOpen(false)
                  setDrawerView("menu")
                }} style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "10px 20px", cursor: "pointer",
                  borderBottom: "1px solid #222",
                  transition: "background 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#2a2a2a"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "6px", flexShrink: 0,
                    backgroundImage: album.image ? `url(${album.image})` : "none",
                    backgroundSize: "cover", backgroundPosition: "center",
                    backgroundColor: album.image ? "transparent" : "#333",
                  }} />
                  <span style={{ fontSize: "13px", color: "#eee", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{album.name}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Album Detail or Home */}
      {selectedAlbum ? (
        <div style={{ padding: "24px", textAlign: "left" }} className="album-detail">
          <button onClick={() => {
            setSelectedAlbum(null)
            window.scrollTo(0, 0)
            setTimeout(() => window.scrollTo(0, 0), 200)
          }} style={{ background: "none", border: "none", color: "white", fontSize: "16px", cursor: "pointer", marginBottom: "24px" }}>
            {t.back}
          </button>
          <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }} className="album-detail-inner">
            <div style={{
              borderRadius: "8px",
              backgroundImage: selectedAlbum.image
                ? `url(${selectedAlbum.image})`
                : `url(https://drive.google.com/thumbnail?id=1SwH5I9w0qgsylJH5YffEzMmSPzu7hmOv&sz=w400)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              flexShrink: 0,
            }} className="album-jacket" />
            <div style={{ minWidth: 0, width: "100%" }}>
              <h2>{selectedAlbum.name}</h2>
              <div style={{ marginTop: "8px" }}>
                {(selectedAlbum.tracks || []).map((track) => (
                  <div key={track.number} style={{
                    display: "flex", alignItems: "center", gap: "16px",
                    padding: "10px 0", borderBottom: "1px solid #222", cursor: "pointer",
                  }} onClick={() => { playTrack(track); setCurrentAlbum(selectedAlbum) }}>
                    <span style={{ color: "#aaa", width: "20px", textAlign: "right" }}>{track.number}</span>
                    <span className="track-title">{track.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "16px 24px", borderBottom: "1px solid #333",
            position: "sticky", top: 0, background: "#111", zIndex: 10,
          }}>
            <img
              src="https://t-bfny.github.io/yekipod/yekipod_logo.png"
              style={{ height: "32px", cursor: "pointer" }}
              onClick={() => { setSelectedAlbum(null); window.scrollTo(0, 0) }}
            />
            <div onClick={() => { setDrawerOpen(true); setDrawerView("menu") }} style={{ cursor: "pointer", fontSize: "24px" }}>☰</div>
          </div>

          {/* Recently Used Albums */}
          <div style={{ padding: "24px 24px 0 24px", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
              <h2 style={{ margin: 0, fontSize: "16px" }}>{t.recentlyUsed}</h2>
              <span style={{ fontSize: "13px", color: "#aaa", cursor: "pointer" }}>{t.more}</span>
            </div>
            <div ref={sliderRef} onMouseMove={handleMouseMove} style={{ display: "flex", overflowX: "auto", gap: "16px", paddingBottom: "16px", width: "100%" }}>
              {driveAlbums.filter(album => favoriteIds.includes(album.id)).map(album => (
                <div key={album.id} onClick={() => selectAlbum(album)} className="favorite-album" style={{
                  minWidth: "80px", height: "80px", borderRadius: "50%",
                  backgroundImage: `url(${album.image})`, backgroundSize: "cover",
                  backgroundPosition: "center", flexShrink: 0, cursor: "pointer",
                }} />
              ))}
            </div>
          </div>

          {/* All Albums */}
          <div style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ margin: 0, fontSize: "16px" }}>{t.allAlbums}</h2>
              <span style={{ fontSize: "13px", color: "#aaa", cursor: "pointer" }}>{t.more}</span>
            </div>
            <div className="all-albums-grid">
              {driveAlbums.map(album => (
                <div key={album.id} style={{ position: "relative" }}>
                  <button onClick={(e) => { e.stopPropagation(); toggleFavorite(album.id) }} style={{
                    position: "absolute", top: "4px", right: "4px",
                    background: "none", border: "none", fontSize: "18px", cursor: "pointer", zIndex: 1
                  }}>
                    {favoriteIds.includes(album.id) ? '⭐' : '☆'}
                  </button>
                  <div onClick={() => selectAlbum(album)} style={{
                    aspectRatio: "1", borderRadius: "8px", background: "#333",
                    backgroundImage: `url(${album.image || 'https://drive.google.com/thumbnail?id=1SwH5I9wOqgsylJH5YffEzMmSPzu7hmOv&sz=w400'})`,
                    backgroundSize: "cover", backgroundPosition: "center", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "8px", textAlign: "center", fontSize: "12px"
                  }}>
                    {album.image ? null : album.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* YouTube Playlists */}
          <div style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ margin: 0, fontSize: "16px" }}>{t.youTubePlaylists}</h2>
              <span style={{ fontSize: "13px", color: "#aaa", cursor: "pointer" }}>{t.more}</span>
            </div>
            {/* Play Area */}
            {selectedPlaylist && (
              <div style={{ marginTop: "24px" }}>
                <iframe
                  width="100%"
                  height="400"
                  src={`https://www.youtube.com/embed/videoseries?list=${selectedPlaylist}`}
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
            )}
            {/* Playlist Grid */}
            <div ref={sliderRef}
              onMouseMove={handleMouseMove}
              className="youtube-playlists-grid">
              {playlists.map((pl) => (
                <div
                  key={pl.id}
                  className="playlist-card"
                  onClick={() => {
                    setSelectedPlaylist(pl.id);
                    setEmbedError(false);
                  }}
                >
                  <img
                    src={pl.snippet.thumbnails.medium.url}
                    alt={pl.snippet.title}
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                  <div style={{ fontSize: "12px", marginTop: "6px" }}>
                    {pl.snippet.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )
      }

      {/* 再生バー */}
      {
        currentTrack && (
          <div className="player-bar" style={{
            position: "fixed", bottom: 0, left: 0, right: 0,
            background: "#222", padding: "12px 24px",
            display: "flex", alignItems: "center", gap: "16px",
            borderTop: "1px solid #333", zIndex: 100,
          }}>
            <button onClick={playPrev} style={{ background: "none", border: "none", color: "white", fontSize: "20px", cursor: "pointer" }}>⏮</button>
            <button onClick={playNext} style={{ background: "none", border: "none", color: "white", fontSize: "20px", cursor: "pointer" }}>⏭</button>
            <span style={{ color: "white" }}>{currentTrack.title}</span>
            <audio ref={audioRef} controls style={{ width: "100%" }} onEnded={playNext} />
          </div>
        )
      }
    </div >
  )
}

const menuItemStyle = {
  display: "block", width: "100%", textAlign: "left",
  padding: "14px 20px", background: "none", border: "none",
  color: "white", fontSize: "15px", cursor: "pointer",
  transition: "background 0.15s",
}
