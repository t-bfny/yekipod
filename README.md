# Yekipod

A personal music player that connects to your Google Drive.

## Features

- Log in with Google OAuth to stream music from your Google Drive Music folder
- Mark albums as favorites to pin them at the top
- Favorites are synced across all devices via `Music/config/favorites.json` on your Drive
- Mobile friendly

## Google Drive Structure

```
My Drive/
└── Music/
    ├── config/
    │   └── favorites.json  (auto-generated)
    ├── artwork/
    │   └── AlbumName.jpg
    └── AlbumName/
        ├── 01_TrackName.mp3
        └── 02_TrackName.mp3
```

## Usage

Visit `https://t-bfny.github.io/yekipod/` and log in with your Google account.

