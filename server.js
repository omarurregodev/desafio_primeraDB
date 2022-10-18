const Productos = require("./api/productos");
const Mensajes = require("./api/mensajes");
const {options} = require("./connection");
const startTable = require("./api/tables");

const express = require("express");
const router = express.Router();
const PORT = 8000;
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);


let prod = new Productos("productos", options.mysql);
let msg = new Mensajes("mensajes", options.sqlite3)

app.use(express.static("./public"));
app.get("/", (req, res) => {
    res.sendFile("index.html", { root: __dirname })
});

// const productos = [
//     {
//         nombre: "Primer prod",
//         precio: 234.54,
//         url: "www.google.co"
//     }
// ];

// const mensajes = [
//     {
//         author: "Juan@gmail.com",
//         date: new Date().toLocaleString(),
//         text: "Hola que tal"
//     },
//     {
//         author: "Maria@gmail.com",
//         date: new Date().toLocaleString(),
//         text: "bien y tu"
//     },
//     {
//         author: "Juan@gmail.com",
//         date: new Date().toLocaleString(),
//         text: "Me alegra"
//     }
// ];


io.on("connection", async (socket) => {
    console.log("Se conectó un usuario!");

    let productos = await prod.listarAll();
    let mensajes = await msg.listarAll();

    socket.emit("productos", productos);
    
    socket.on("new-product", async (data) => {
        // productos.push(data);
        await prod.guardar(data);
        io.sockets.emit("productos", productos)
    })
    
    socket.emit("messages", mensajes);
    
    socket.on("new-message", (data) => {
        mensajes.push(data);
        msg.addMessage(data);
        io.sockets.emit("messages", mensajes)
    })
}) 


app.set("socketio", io);


app.use("/", router);


router.use(express.json());
router.use(express.urlencoded({ extended: true }));


// Agrega el producto a la base de datos mysql
router.post("/", (req, res) => {
	const producto = req.body;
	prod.guardar(producto);
	res.redirect("/");
});


// Ejecuto funcion para creacion de trablas
async function start(){
    const inicio =  new startTable();

    let prod = await inicio.prod();
    let mess = await inicio.mess();
}

start();

const connectedServer = httpServer.listen(PORT, () => {
    console.log("Server On")
});    

//establecemos la configuración de ejs

app.set("view engine", "ejs");
app.set("views", "./views");