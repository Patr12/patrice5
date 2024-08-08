from http.server import SimpleHTTPRequestHandler, HTTPServer
import json

class MyServer(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.path = '/templates/index.html'
        return super().do_GET()

    def do_POST(self):
        if self.path == '/simulate':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            data = json.loads(post_data)

            # Logiki ya mchanganyiko wa kemikali
            chemical1 = data.get('chemical1')
            chemical2 = data.get('chemical2')

            if chemical1 == 'H2O' and chemical2 == 'Na':
                response = {
                    'result': 'success',
                    'reaction': 'Explosive',
                    'color': 'yellow',
                    'smoke': True
                }
            elif chemical1 == 'HCl' and chemical2 == 'NaOH':
                response = {
                    'result': 'success',
                    'reaction': 'Neutralization',
                    'color': 'clear',
                    'smoke': False
                }
            elif chemical1 == 'C2H5OH' and chemical2 == 'O2':
                response = {
                    'result': 'success',
                    'reaction': 'Combustion',
                    'color': 'blue',
                    'smoke': True
                }
            else:
                response = {
                    'result': 'failure',
                    'reaction': 'No Reaction',
                    'color': 'white',
                    'smoke': False
                }

            # Rudisha majibu kama JSON
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))

if __name__ == "__main__":
    server_address = ('', 8080)
    httpd = HTTPServer(server_address, MyServer)
    print("Server running on port 8080...")
    httpd.serve_forever()
