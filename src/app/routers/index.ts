import express from 'express';

const routes = express.Router();
function getUser() {
  // console.log("object");
}

const moduleRoutes = [
  {
    path: '/',
    route: getUser,
  },
];
moduleRoutes.forEach(route => routes.use(route.path, route.route));
export default routes;
