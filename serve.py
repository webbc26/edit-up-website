#!/usr/bin/env python3
"""
Edit Up Local Development Server
Domain: edit-up.com
Emulates Nginx VPS 'try_files' behavior for Apple Universal Links and /video-templates/{id} routing.
"""
import http.server
import socketserver
import os
import sys

DEFAULT_PORT = 8080

class EditUpDevHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Clean query parameters and anchors
        req_path = self.path.split('?')[0].split('#')[0]

        # 1. Apple App Site Association (AASA) without extension
        if req_path in ['/.well-known/apple-app-site-association', '/apple-app-site-association']:
            file_path = '.' + req_path
            if not os.path.exists(file_path):
                file_path = './.well-known/apple-app-site-association'
            if os.path.exists(file_path):
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                with open(file_path, 'rb') as f:
                    content = f.read()
                self.send_header('Content-Length', str(len(content)))
                self.end_headers()
                self.wfile.write(content)
                return

        # 2. Dynamic Video Template Universal Links (/video-templates/{id})
        # If the requested path is under /video-templates/ and does not exist on disk,
        # rewrite to /video-templates/index.html (emulating Nginx try_files $uri $uri/ /video-templates/index.html)
        if req_path.startswith('/video-templates/') and not os.path.exists('.' + req_path):
            self.path = '/video-templates/index.html'

        # 3. Legacy /templates/{id} -> redirect to /video-templates/{id}
        elif req_path.startswith('/templates/'):
            template_id = req_path.replace('/templates/', '')
            self.send_response(301)
            self.send_header('Location', f'/video-templates/{template_id}')
            self.end_headers()
            return

        # 4. Global 404 fallback for missing non-asset paths -> /404.html
        elif not os.path.exists('.' + req_path) and not os.path.exists('.' + req_path + '/index.html'):
            if not req_path.startswith('/assets/'):
                if os.path.exists('./404.html'):
                    self.path = '/404.html'

        return super().do_GET()

def run_server(port=DEFAULT_PORT):
    socketserver.TCPServer.allow_reuse_address = True
    try:
        httpd = socketserver.TCPServer(('', port), EditUpDevHandler)
    except OSError as e:
        if e.errno == 98: # Address already in use
            print(f"⚠️  Port {port} is already in use by another process.")
            alt_port = port + 1
            print(f"🔄 Trying alternate port {alt_port}...")
            return run_server(alt_port)
        raise e

    print("\n" + "=" * 64)
    print(f"🚀 Edit Up Local Server running at http://localhost:{port}")
    print("=" * 64)
    print(f" • Homepage:            http://localhost:{port}/")
    print(f" • Dynamic Template:    http://localhost:{port}/video-templates/1235")
    print(f" • Preset Template:     http://localhost:{port}/video-templates/beat-sync")
    print(f" • Apple AASA File:     http://localhost:{port}/.well-known/apple-app-site-association")
    print("=" * 64)
    print("Press Ctrl+C to stop the server.\n")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        httpd.server_close()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_PORT
    run_server(port)
