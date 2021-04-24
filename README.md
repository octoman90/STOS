## STOS Team Organisation System

STOS is a web-based, Kanban-style, list-making application with support of selected Scrum features.

## Installation
1. Install MongoDB, and make it available on port `27017`.
2. Execute this line in the `backend` directory:
```bash
go build
```
3. Execute these lines in the `frontend` directory:
```bash
yarn install
yarn build
```
4. Install Nginx or Apache or something similar, then point it to serve files from the `frontend/build` directory and pass `/api` requests to port `8000`. Here's an example snippet for Nginx:
```
server {
	listen 80;
	server_name local;

	root /path/to/www;

	location /api/ {
		proxy_pass http://127.0.0.1:8000/;
	}

	location / {
		index index.html;
		try_files $uri /index.html;
	}
}
```

## Running
1. Run MongoDB and Nginx.
2. Run this line from the `backend` directory:
```bash
./backend
```
3. Visit http://localhost:80 and voilà.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[GNU General Public License v3.0](LICENSE)
