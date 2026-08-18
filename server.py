#!/usr/bin/env python3
"""
OmniFlow Smart Warehouse - Local Development HTTP Server
Runs a lightweight, zero-dependency HTTP server with CORS and cache-busting headers.
"""

import http.server
import socketserver
import os
import sys
import webbrowser

PORT = 3000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def run_server(port=PORT):
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    handler = CustomHTTPRequestHandler
    
    for test_port in [port, 3001, 8000, 8080, 5000]:
        try:
            with socketserver.TCPServer(("", test_port), handler) as httpd:
                url = f"http://localhost:{test_port}"
                print("\n" + "="*60)
                print(f"[OK] OMNIFLOW SMART WAREHOUSE DASHBOARDS RUNNING")
                print(f"[URL] Access URL: {url}")
                print(f"[DIR] Root Dir:   {os.getcwd()}")
                print("="*60 + "\n")
                
                try:
                    webbrowser.open(url)
                except Exception:
                    pass
                
                httpd.serve_forever()
        except OSError as e:
            if "Address already in use" in str(e) or "Only one usage of each socket address" in str(e):
                continue
            else:
                raise e

if __name__ == '__main__':
    port_arg = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    run_server(port_arg)
