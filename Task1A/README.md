# TIC3001 Task1A

Task1A is split into 3 parts. 

Install [nodejs](https://nodejs.org/en/download/); select "Automatically install necessary tools ..." in the installation wizard.

Clone the repository
```sh
git clone https://github.com/TIC3001-AY2223S2/Task1A.git
cd Task1A
```

## 1.1 - Dockerize node app in `app` folder

In the `app/public/index.html` file, search for "TODO" and fill in the blanks.

Follow these guide to Dockerize the sample node app.
- [https://nodejs.org/en/docs/guides/nodejs-docker-webapp/](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

Extra: Learning how to render HTML file using express.js
- [https://expressjs.com/en/starter/hello-world.html](https://expressjs.com/en/starter/hello-world.html)
- [https://codeforgeek.com/render-html-file-expressjs/](https://codeforgeek.com/render-html-file-expressjs/)

## 1.2 - Dockerize NGINX reverse proxy in `nginx-sample` folder

Read up on reverse proxy [here](https://www.upguard.com/blog/reverse-proxy-vs-load-balancer).

In the `nginx-sample/index.html` file, search for "TODO" and fill in the blanks.

Follow these guide to dockerise the sample NGINX reverse proxy to serve the static HTML in `nginx-sample/index.html`.
- [https://docs.nginx.com/nginx/admin-guide/web-server/serving-static-content/](https://docs.nginx.com/nginx/admin-guide/web-server/serving-static-content/)
- [https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- [https://www.nginx.com/blog/deploying-nginx-nginx-plus-docker/](https://www.nginx.com/blog/deploying-nginx-nginx-plus-docker/)

## 1.3 - Use NGINX to serve the node app using `docker-compose`

Create a new NGINX conf file and Dockerfile in `nginx` folder. Run the application stack in `app` and `nginx` using `docker-compose`.

Follow this guide to use NGINX to act as a reverse proxy such that when a browser makes a HTTP request, the request first goes to the reverse proxy and then sends the request to the appropriate web server. Your final task, you have to server the node app in `app` folder. Use a separate config file from A1.2.
- [https://ashwin9798.medium.com/nginx-with-docker-and-node-js-a-beginners-guide-434fe1216b6b](https://ashwin9798.medium.com/nginx-with-docker-and-node-js-a-beginners-guide-434fe1216b6b)
