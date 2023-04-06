import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";

const rootDir = process.cwd();
const port = 3000;
const app = express();

app.use(cookieParser());

const cart = {};
const COFFEE_LIST = [{
  name: "Americano",
  image: "/static/img/americano.jpg",
  price: 999,
},
    { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999 },
    {
      name: "Espresso",
      image: "/static/img/espresso.jpg",
      price: 999
    },
    {
      name: "Flat White",
      image: "/static/img/flat-white.jpg",
      price: 999
    },
    {
      name: "Latte",
      image: "/static/img/latte.jpg",
      price: 999
    },
    {
      name: "Latte Macchiato",
      image: "/static/img/latte-macchiato.jpg",
      price: 999
    }]



app.use("/static", express.static("static"));
// Выбираем в качестве движка шаблонов Handlebars
app.set("view engine", "hbs");
// Настраиваем пути и дефолтный view
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultView: "default",
    layoutsDir: path.join(rootDir, "/views/layouts/"),
    partialsDir: path.join(rootDir, "/views/partials/"),
  })
);

app.get("/", (_, res) => {
  res.sendFile(path.join(rootDir, "/static/html/index.html"));
  res.redirect("/menu");
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: COFFEE_LIST
  });
});

app.get("/buy/:name", (req, res) => {
    let username = req.cookies?.name;
    if (username) {
        let name_drink = req.params.name;
        let drink = COFFEE_LIST.find((v) => v.name === name_drink);
        if (drink) {
            //cart[username].push(drink);
            cart[username] = drink;
            res.redirect("/menu");
        } else {
            res.status(404).end();
        }
    } else {
        res.redirect("/login");
    }
});

app.get("/cart", (req, res) => {
    let username = req.cookies?.name;
    if (username) {
        let c = cart[username];
        console.log(c)
        res.render("cart", {
            layout: "default",
            title: "Корзина",
            total_price: 999999,
            items: c,
        });
    }
});

app.post("/cart", (req, res) => {
    let username = req.cookies?.name;
    if (username) {
        try{
            cart[username].length = 0;
            res.redirect("/cart");
        }catch (TypeError){
            res.redirect("/menu");
        }
    } else {
        res.redirect("/login");
    }
});

app.get("/login", (req, res) => {
    let username = req.query?.username;
    if (username) {
        res.cookie("name", username);
    }

    res.render("login", {
        layout: "default",
        title: "Личный кабинет",
        username: username ?? "Аноним",
    });
});

app.listen(port, () => console.log(`App listening on port ${port}`));
