## Available Scripts

In the project directory, you can run:

### `yarn start:front`

Runs fronted on React development server.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn start:back`

Builds and runs API backend.<br />
It can be accessed from [http://localhost:8000](http://localhost:8000).

### `yarn build:front`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

### `yarn build:back`

Compiles the server binary and puts into the `build` folder.

### `yarn build`

Runs both `yarn build:front` and `yarn build:back`.

### Example nginx configuration:
```
server {
	listen 80;
	server_name stos;

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
