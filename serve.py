"""Local preview with an explicit JavaScript MIME type (including on Windows)."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

if __name__ == '__main__':
    SimpleHTTPRequestHandler.extensions_map['.mjs'] = 'text/javascript'
    handler = partial(SimpleHTTPRequestHandler, directory=str(Path(__file__).resolve().parent))
    print('Item Linking Lab: http://127.0.0.1:8770/', flush=True)
    ThreadingHTTPServer(('127.0.0.1', 8770), handler).serve_forever()
