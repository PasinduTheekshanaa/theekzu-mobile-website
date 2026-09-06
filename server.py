#!/usr/bin/env python3
"""
Lightweight development server for Theekzu Mobile website.
Run this script using: python server.py
Then open http://localhost:8000 in your web browser.
"""

import http.server
import socketserver
import os
import sys
import webbrowser

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Cache control for development
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print("=" * 60)
        print("THEEKZU MOBILE - DEVELOPMENT SERVER")
        print("=" * 60)
        print(f"Serving at: {url}")
        print("Press Ctrl+C to stop the server.")
        print("=" * 60)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
            sys.exit(0)
