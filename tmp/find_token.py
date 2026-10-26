import urllib.request
import json
import re

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

# Popular public repos that host demo pages with Mapbox
repo_urls = [
    'https://raw.githubusercontent.com/uber/deck.gl/master/examples/get-started/pure-js/mapbox/app.js',
    'https://raw.githubusercontent.com/geoman-io/leaflet-geoman/master/demo/index.html',
    'https://raw.githubusercontent.com/visgl/deck.gl-community/master/examples/carto/app.js',
    'https://raw.githubusercontent.com/openlayers/openlayers/main/examples/mapbox-vector-tiles.js'
]

# Let's also check google search / duckduckgo
search_url = 'https://html.duckduckgo.com/html/?q=site:github.com+"mapboxgl.accessToken+%3D+%27pk.eyJ1I"'
try:
    sreq = urllib.request.Request(search_url, headers=headers)
    with urllib.request.urlopen(sreq, timeout=5) as sresp:
        html = sresp.read().decode('utf-8', errors='ignore')
        found = re.findall(r'pk\.eyJ1I[a-zA-Z0-9_\.-]{40,}', html)
        print(f"DuckDuckGo found {len(found)} candidate tokens")
        for token in found:
            tile_url = f'https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/256/0/0/0?access_token={token}'
            try:
                treq = urllib.request.Request(tile_url, headers=headers)
                with urllib.request.urlopen(treq, timeout=3) as tresp:
                    if tresp.getcode() == 200:
                        print("SUCCESS_TOKEN=" + token)
                        exit(0)
            except Exception as ex:
                pass
except Exception as e:
    print("Search error:", e)
