import { useRef, useState, useEffect } from "react"
import './App.css'
import { useGoogleLogin } from '@react-oauth/google'

function StarIcon({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#f5c518" : "none"}
      stroke={filled ? "#f5c518" : "#fff"} strokeWidth="1.6" strokeLinejoin="round">
      <path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17.6l-6.1 3.4 1.5-6.8L2.2 9.5l6.9-.7z" />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg width="10" height="13" viewBox="0 0 10 13" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M10 0L0 6.5 10 13V0z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="currentColor">
      <path d="M4 2l12 7-12 7V2z" />
    </svg>
  )
}

function VideoPlayOverlay({ onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.35)", cursor: "pointer",
      }}
    >
      <div style={{
        width: "68px", height: "68px", borderRadius: "50%",
        background: "rgba(255,255,255,0.92)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
      }}>
        <svg width="26" height="26" viewBox="0 0 18 18" fill="#111" style={{ marginLeft: "3px" }}>
          <path d="M4 2l12 7-12 7V2z" />
        </svg>
      </div>
    </div>
  )
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="currentColor">
      <rect x="3" y="2" width="4" height="14" rx="1" />
      <rect x="11" y="2" width="4" height="14" rx="1" />
    </svg>
  )
}

function PrevIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
      <rect x="2" y="2" width="2" height="14" rx="1" />
      <path d="M16 2L5 9l11 7V2z" />
    </svg>
  )
}

function NextIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
      <rect x="14" y="2" width="2" height="14" rx="1" />
      <path d="M2 2l11 7-11 7V2z" />
    </svg>
  )
}

function VolumeIcon({ muted }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6.5h3l4-3.5v10l-4-3.5H2v-3z" fill="currentColor" stroke="none" />
      {muted
        ? <path d="M12 6l4 4M16 6l-4 4" />
        : <path d="M12.5 5.5a4 4 0 010 7" />}
    </svg>
  )
}

function MoreIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
      <circle cx="9" cy="3.5" r="1.6" />
      <circle cx="9" cy="9" r="1.6" />
      <circle cx="9" cy="14.5" r="1.6" />
    </svg>
  )
}

function formatTime(s) {
  if (!s || isNaN(s)) return "0:00"
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60).toString().padStart(2, "0")
  return `${m}:${sec}`
}

const NO_ARTWORK = `${import.meta.env.BASE_URL}nothing_artwork_01.jpg`

function Logo({ onClick }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}yekipod_logo.png`}
      style={{ height: "54px", cursor: "pointer" }}
      onClick={onClick}
    />
  )
}

const i18n = {
  en: {
    login: "Login with Google",
    recentlyUsed: "Recently Used Albums",
    allAlbums: "All Albums",
    youTubePlaylists: "YouTube Playlists",
    more: "more >>",
    back: "back",
    logout: "Logout",
    favorites: "Favorites",
    noFavorites: "No favorites yet. Star an album to add it here.",
    loading: "Loading…",
    openOnYoutube: "Open on YouTube ↗",
    closePlayer: "Close player",
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
    back: "戻る",
    logout: "ログアウト",
    favorites: "お気に入り",
    noFavorites: "まだお気に入りがありません。⭐でアルバムを追加できます。",
    loading: "読み込み中…",
    openOnYoutube: "YouTubeで開く ↗",
    closePlayer: "プレーヤーを閉じる",
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
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [prevVolume, setPrevVolume] = useState(1)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [showTrackMenu, setShowTrackMenu] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentAlbum, setCurrentAlbum] = useState(null)
  const [driveAlbums, setDriveAlbums] = useState([])
  const [favoritesFileId, setFavoritesFileId] = useState(null)
  const [favoriteIds, setFavoriteIds] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [embedError, setEmbedError] = useState(false)
  const [listView, setListView] = useState(null) // null | 'recent' | 'all' | 'youtube'
  const [expandedAlbumIds, setExpandedAlbumIds] = useState(new Set())
  const [listTracksCache, setListTracksCache] = useState({})
  const [expandedPlaylistIds, setExpandedPlaylistIds] = useState(new Set())
  const [playlistItemsCache, setPlaylistItemsCache] = useState({})
  const [selectedVideoId, setSelectedVideoId] = useState(null)
  const [videoStarted, setVideoStarted] = useState(false)

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

  const fetchPlaylistItems = async (playlistId) => {
    let all = []
    let nextPageToken = ''
    do {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&pageToken=${nextPageToken}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      const data = await res.json()
      all = [...all, ...(data.items || [])]
      nextPageToken = data.nextPageToken
    } while (nextPageToken)
    return all
  }

  const toggleExpandPlaylist = (pl) => {
    setExpandedPlaylistIds(prev => {
      const next = new Set(prev)
      next.has(pl.id) ? next.delete(pl.id) : next.add(pl.id)
      return next
    })
    if (!playlistItemsCache[pl.id]) {
      fetchPlaylistItems(pl.id).then(items =>
        setPlaylistItemsCache(prev => ({ ...prev, [pl.id]: items }))
      )
    }
  }

  const playVideo = (playlistId, videoId) => {
    setSelectedPlaylist(playlistId)
    setSelectedVideoId(videoId)
    setEmbedError(false)
    setVideoStarted(false)
  }

  const fetchAlbumTracks = (albumId) =>
    fetch(`https://www.googleapis.com/drive/v3/files?q='${albumId}'+in+parents&fields=files(id,name)&orderBy=name`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(res => res.json())
      .then(data => data.files
        .filter(f => f.name.match(/\.(mp3|flac|m4a|wav|mp4)$/i))
        .map((f, i) => ({
          number: i + 1,
          title: f.name.replace(/^\d+[\s._-]*/, '').replace(/\.[^/.]+$/, ''),
          src: `https://www.googleapis.com/drive/v3/files/${f.id}?alt=media`,
          id: f.id
        })))

  const selectAlbum = (album) => {
    setSelectedAlbum(album)
    window.scrollTo(0, 0)
    fetchAlbumTracks(album.id).then(tracks => setSelectedAlbum(prev => ({ ...prev, tracks })))
  }

  const toggleExpandAlbum = (album) => {
    setExpandedAlbumIds(prev => {
      const next = new Set(prev)
      next.has(album.id) ? next.delete(album.id) : next.add(album.id)
      return next
    })
    if (!listTracksCache[album.id]) {
      fetchAlbumTracks(album.id).then(tracks =>
        setListTracksCache(prev => ({ ...prev, [album.id]: tracks }))
      )
    }
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
    fetch(track.src, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(res => res.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob)
        setCurrentTrack({ ...track, src: url })
        setCurrentTime(0)
        setDuration(0)
      })
  }

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.src
      audioRef.current.volume = volume
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
    if (nextTrack) {
      playTrack(nextTrack)
      return
    }

    // Last track of the album: jump to the first track of the next album.
    const albumIndex = driveAlbums.findIndex(a => a.id === currentAlbum.id)
    const nextAlbum = albumIndex === -1 ? null : driveAlbums[albumIndex + 1]
    if (!nextAlbum) return
    fetchAlbumTracks(nextAlbum.id).then(nextTracks => {
      const firstTrack = nextTracks[0]
      if (!firstTrack) return
      setCurrentAlbum({ ...nextAlbum, tracks: nextTracks })
      playTrack(firstTrack)
    })
  }

  const playPrev = () => {
    if (!currentAlbum) return
    const tracks = currentAlbum.tracks || []
    const prevTrack = tracks.find(t => t.number === currentTrack.number - 1)
    if (prevTrack) playTrack(prevTrack)
  }

  const togglePlay = () => {
    if (!audioRef.current) return
    if (audioRef.current.paused) audioRef.current.play()
    else audioRef.current.pause()
  }

  const seekTo = (t) => {
    if (audioRef.current) audioRef.current.currentTime = t
    setCurrentTime(t)
  }

  const setVolumeLevel = (v) => {
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume)
      setVolumeLevel(0)
    } else {
      setVolumeLevel(prevVolume || 1)
    }
  }

  const closePlayer = () => {
    if (audioRef.current) audioRef.current.pause()
    setCurrentTrack(null)
    setShowTrackMenu(false)
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
    <div style={{
      background: `linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0)), linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${import.meta.env.BASE_URL}new_mano.png)`,
      backgroundSize: "100% 65vh, cover, cover",
      backgroundPosition: "top, center, center",
      backgroundAttachment: "fixed, fixed, fixed",
      backgroundRepeat: "no-repeat, no-repeat, no-repeat",
      minHeight: "100vh", color: "white", fontFamily: "sans-serif", paddingBottom: currentTrack ? "70px" : "0px"
    }}>

      {/* Login Button */}
      {!accessToken && (
        <button onClick={login} style={{
          position: "fixed", top: "24px", right: "16px", zIndex: 1000,
          padding: "8px 16px", color: "white", cursor: "pointer",
          fontFamily: "'Rajdhani', system-ui, Avenir, Helvetica, Arial, sans-serif",
          fontWeight: 600, letterSpacing: "0.02em", fontSize: "16px",
          background: "linear-gradient(135deg, rgba(96,138,180,0.85), rgba(32,58,90,0.85))",
          border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 8px rgba(0,0,0,0.35)",
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
                    backgroundImage: `url(${album.image || NO_ARTWORK})`,
                    backgroundSize: "cover", backgroundPosition: "center",
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
          }} style={backButtonStyle}>
<BackIcon /> {t.back}
          </button>
          <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }} className="album-detail-inner">
            <div style={{
              borderRadius: "8px",
              backgroundImage: `url(${selectedAlbum.image || NO_ARTWORK})`,
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
      ) : listView ? (
        <div style={{ padding: "24px", textAlign: "left" }}>
          <button onClick={() => setListView(null)} style={backButtonStyle}>
<BackIcon /> {t.back}
          </button>
          <h2 style={{ margin: "0 0 20px" }}>
            {listView === "recent" ? t.recentlyUsed : listView === "all" ? t.allAlbums : t.youTubePlaylists}
          </h2>

          {listView === "youtube" ? (
            <>
              {selectedPlaylist && (
                <div style={{ marginBottom: "24px", maxWidth: "800px" }}>
                  <div style={{ aspectRatio: "16 / 9", position: "relative" }}>
                    <iframe
                      width="100%"
                      height="100%"
                      src={(selectedVideoId
                        ? `https://www.youtube.com/embed/${selectedVideoId}?list=${selectedPlaylist}`
                        : `https://www.youtube.com/embed/videoseries?list=${selectedPlaylist}`)
                        + (videoStarted ? "&autoplay=1" : "")}
                      frameBorder="0"
                      allowFullScreen
                    />
                    {!videoStarted && <VideoPlayOverlay onClick={() => setVideoStarted(true)} />}
                  </div>
                  <a
                    href={selectedVideoId
                      ? `https://www.youtube.com/watch?v=${selectedVideoId}&list=${selectedPlaylist}`
                      : `https://www.youtube.com/playlist?list=${selectedPlaylist}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-block", marginTop: "8px", fontSize: "13px", color: "#aaa" }}
                  >
                    {t.openOnYoutube}
                  </a>
                </div>
              )}
              {playlists.map(pl => (
                <div key={pl.id} style={{ borderBottom: "1px solid #222" }}>
                  <div onClick={() => toggleExpandPlaylist(pl)} style={{
                    display: "flex", alignItems: "center", gap: "16px",
                    padding: "12px 0", cursor: "pointer",
                  }}>
                    <img src={pl.snippet.thumbnails.medium.url} alt={pl.snippet.title} style={{ width: "96px", borderRadius: "8px", flexShrink: 0 }} />
                    <span style={{ fontSize: "15px" }}>{pl.snippet.title}</span>
                  </div>
                  {expandedPlaylistIds.has(pl.id) && (
                    <div style={{ paddingLeft: "16px", paddingBottom: "12px" }}>
                      {playlistItemsCache[pl.id]
                        ? playlistItemsCache[pl.id].map(item => (
                          <div key={item.id} onClick={() => playVideo(pl.id, item.snippet.resourceId.videoId)} style={{
                            display: "flex", alignItems: "center", gap: "12px",
                            padding: "6px 0", cursor: "pointer", color: "#ccc",
                          }}>
                            <img src={item.snippet.thumbnails?.default?.url} alt="" style={{ width: "48px", borderRadius: "4px", flexShrink: 0 }} />
                            <span style={{ fontSize: "13px" }}>{item.snippet.title}</span>
                          </div>
                        ))
                        : <span style={{ color: "#666", fontSize: "13px" }}>{t.loading}</span>}
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : (
            (listView === "recent" ? driveAlbums.filter(a => favoriteIds.includes(a.id)) : driveAlbums).map(album => (
              <div key={album.id} style={{ borderBottom: "1px solid #222" }}>
                <div onClick={() => toggleExpandAlbum(album)} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "12px 0", cursor: "pointer" }}>
                  <div style={{
                    width: "64px", height: "64px", borderRadius: "8px", flexShrink: 0,
                    backgroundImage: `url(${album.image || NO_ARTWORK})`,
                    backgroundSize: "cover", backgroundPosition: "center",
                  }} />
                  <span style={{ fontSize: "15px" }}>{album.name}</span>
                </div>
                {expandedAlbumIds.has(album.id) && (
                  <div style={{ paddingLeft: "80px", paddingBottom: "12px" }}>
                    {listTracksCache[album.id]
                      ? listTracksCache[album.id].map(track => (
                        <div key={track.number} onClick={() => { playTrack(track); setCurrentAlbum(album) }} style={{
                          display: "flex", alignItems: "center", gap: "12px",
                          padding: "6px 0", cursor: "pointer", color: "#ccc", fontSize: "13px",
                        }}>
                          <span style={{ color: "#888", width: "20px", textAlign: "right" }}>{track.number}</span>
                          <span>{track.title}</span>
                        </div>
                      ))
                      : <span style={{ color: "#666", fontSize: "13px" }}>{t.loading}</span>}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <>
          {/* Header */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "16px 24px", borderBottom: "1px solid #333",
            position: "sticky", top: 0, background: "#111", zIndex: 10,
          }}>
            <Logo onClick={() => { setSelectedAlbum(null); window.scrollTo(0, 0) }} />
            <div onClick={() => { setDrawerOpen(true); setDrawerView("menu") }} style={{ cursor: "pointer", fontSize: "24px" }}>☰</div>
          </div>

          {/* Recently Used Albums */}
          <div style={{ padding: "24px 24px 0 24px", overflow: "hidden" }}>
            <div style={sectionHeaderRowStyle}>
              <h2 style={sectionHeadingStyle}>{t.recentlyUsed}</h2>
              <span onClick={() => setListView("recent")} style={{ fontSize: "13px", color: "#aaa", cursor: "pointer" }}>{t.more}</span>
            </div>
            <div ref={sliderRef} onMouseMove={handleMouseMove} className="h-scroll" style={{ display: "flex", overflowX: "auto", gap: "16px", paddingBottom: "20px", width: "100%" }}>
              {driveAlbums.filter(album => favoriteIds.includes(album.id)).map((album, i) => (
                <div key={album.id} onClick={() => selectAlbum(album)} className="favorite-album card-enter" style={{
                  minWidth: "80px", height: "80px", borderRadius: "50%",
                  overflow: "hidden", flexShrink: 0, cursor: "pointer",
                  animationDelay: `${i * 40}ms`,
                }}>
                  <div className="favorite-album-spin" style={{
                    width: "100%", height: "100%",
                    backgroundImage: `url(${album.image || NO_ARTWORK})`,
                    backgroundSize: "cover", backgroundPosition: "center",
                  }} />
                </div>
              ))}
            </div>
          </div>

          {/* All Albums */}
          <div style={{ padding: "24px" }}>
            <div style={sectionHeaderRowStyle}>
              <h2 style={sectionHeadingStyle}>{t.allAlbums}</h2>
              <span onClick={() => setListView("all")} style={{ fontSize: "13px", color: "#aaa", cursor: "pointer" }}>{t.more}</span>
            </div>
            <div className="all-albums-grid">
              {driveAlbums.map((album, i) => (
                <div key={album.id} className="card-enter" style={{ position: "relative", animationDelay: `${i * 25}ms` }}>
                  <button onClick={(e) => { e.stopPropagation(); toggleFavorite(album.id) }} style={{
                    position: "absolute", top: "4px", right: "4px",
                    background: "none", border: "none", padding: 0, cursor: "pointer", zIndex: 1,
                    lineHeight: 0, filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.7))"
                  }}>
                    <StarIcon filled={favoriteIds.includes(album.id)} />
                  </button>
                  <div onClick={() => selectAlbum(album)} style={{
                    aspectRatio: "1", borderRadius: "8px",
                    backgroundImage: `url(${album.image || NO_ARTWORK})`,
                    backgroundSize: "cover", backgroundPosition: "center", cursor: "pointer",
                  }} />
                </div>
              ))}
            </div>
          </div>

          {/* YouTube Playlists */}
          <div style={{ padding: "24px" }}>
            <div style={sectionHeaderRowStyle}>
              <h2 style={sectionHeadingStyle}>{t.youTubePlaylists}</h2>
              <span onClick={() => setListView("youtube")} style={{ fontSize: "13px", color: "#aaa", cursor: "pointer" }}>{t.more}</span>
            </div>
            {/* Play Area */}
            {selectedPlaylist && (
              <div style={{ marginTop: "24px", maxWidth: "800px" }}>
                <div style={{ aspectRatio: "16 / 9", position: "relative" }}>
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/videoseries?list=${selectedPlaylist}${videoStarted ? "&autoplay=1" : ""}`}
                    frameBorder="0"
                    allowFullScreen
                  />
                  {!videoStarted && <VideoPlayOverlay onClick={() => setVideoStarted(true)} />}
                </div>
                <a
                  href={`https://www.youtube.com/playlist?list=${selectedPlaylist}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-block", marginTop: "8px", fontSize: "13px", color: "#aaa" }}
                >
                  {t.openOnYoutube}
                </a>
              </div>
            )}
            {/* Playlist Grid */}
            <div ref={sliderRef}
              onMouseMove={handleMouseMove}
              className="youtube-playlists-grid h-scroll">
              {playlists.map((pl) => (
                <div
                  key={pl.id}
                  className="playlist-card"
                  onClick={() => {
                    setSelectedPlaylist(pl.id);
                    setSelectedVideoId(null);
                    setEmbedError(false);
                    setVideoStarted(false);
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
            background: "rgba(8, 8, 8, 0.72)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
            display: "flex", flexDirection: "column",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)", zIndex: 100,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 24px 0" }}>
              <span style={{ fontSize: "11px", color: "#999", minWidth: "32px", textAlign: "right" }}>{formatTime(currentTime)}</span>
              <input
                type="range" min="0" max={duration || 0} step="0.1" value={currentTime}
                onChange={e => seekTo(parseFloat(e.target.value))}
                className="seek-bar"
                style={{
                  flex: 1,
                  background: `linear-gradient(to right, #fff ${duration ? (currentTime / duration) * 100 : 0}%, rgba(255,255,255,0.25) ${duration ? (currentTime / duration) * 100 : 0}%)`,
                }}
              />
              <span style={{ fontSize: "11px", color: "#999", minWidth: "32px" }}>{formatTime(duration)}</span>
            </div>

            <div style={{ padding: "6px 24px 10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                <button onClick={playPrev} style={playerIconButtonStyle} aria-label="Previous"><PrevIcon /></button>
                <button onClick={togglePlay} style={playerPlayButtonStyle} aria-label="Play/Pause">
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>
                <button onClick={playNext} style={playerIconButtonStyle} aria-label="Next"><NextIcon /></button>
              </div>

              <span style={{
                color: "white", maxWidth: "min(320px, 40vw)", fontSize: "14px",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>{currentTrack.title}</span>

              <div
                style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <button onClick={toggleMute} style={playerIconButtonStyle} aria-label="Volume"><VolumeIcon muted={volume === 0} /></button>
                {showVolumeSlider && (
                  <input
                    type="range" min="0" max="1" step="0.05" value={volume}
                    onChange={e => setVolumeLevel(parseFloat(e.target.value))}
                    style={{ width: "80px", accentColor: "#fff" }}
                  />
                )}
              </div>

              <div style={{ position: "relative", flexShrink: 0 }}>
                <button onClick={() => setShowTrackMenu(v => !v)} style={playerIconButtonStyle} aria-label="More"><MoreIcon /></button>
                {showTrackMenu && (
                  <>
                    <div onClick={() => setShowTrackMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 100 }} />
                    <div style={{
                      position: "absolute", bottom: "36px", right: 0,
                      background: "#222", border: "1px solid #333", borderRadius: "8px",
                      minWidth: "170px", overflow: "hidden", zIndex: 101,
                    }}>
                      <button onClick={closePlayer} style={{ ...menuItemStyle, fontSize: "13px", padding: "10px 16px" }}>
                        {t.closePlayer}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <audio
              ref={audioRef}
              onEnded={playNext}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
              onLoadedMetadata={() => setDuration(audioRef.current.duration)}
              style={{ display: "none" }}
            />
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

const sectionHeaderRowStyle = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  gap: "16px", marginBottom: "16px", paddingBottom: "8px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.35)",
}

const sectionHeadingStyle = { margin: 0, border: "none", padding: 0 }

const backButtonStyle = {
  background: "none", border: "none", color: "white", fontSize: "16px",
  cursor: "pointer", marginBottom: "24px",
  display: "inline-flex", alignItems: "center", gap: "8px",
  fontFamily: "'Rajdhani', system-ui, Avenir, Helvetica, Arial, sans-serif",
  fontWeight: 600, letterSpacing: "0.03em",
}

const playerIconButtonStyle = {
  background: "none", border: "none", color: "white",
  cursor: "pointer", padding: "4px",
  display: "flex", alignItems: "center", justifyContent: "center",
}

const playerPlayButtonStyle = {
  ...playerIconButtonStyle,
  width: "34px", height: "34px", borderRadius: "50%",
  background: "#fff", color: "#111",
}
