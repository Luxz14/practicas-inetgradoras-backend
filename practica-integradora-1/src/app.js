import express from "express";
import path from 'path';
import handlebars from 'express-handlebars';
import mongoose from "mongoose";
import { fileURLToPath } from 'url'
import {dirname} from 'path'
import { Server } from "socket.io";

import {ProductManager} from "../src/dao/fs/ProductManager.js"
import {CartManager} from "../src/dao/fs/CartManager.js"
import {messagesRouter, messagesMN} from "../routes/messages.router.js"
import routerCarts from "../routes/fs/carts.router.js"
import routerProducts from "../routes/fs/products.router.js"


const app = express();
const PORT = 8080;

app.use(express.json());

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use(express.static(path.join(__dirname, '/public')))

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/views'))
app.use(express.static(path.join(__dirname, "public")))

app.use(express.urlencoded({ extended: true }));

app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);
app.use('/api/chat', messagesRouter);

const pathProducts = './data/products.json';
const pathCarts = './data/carts.json';
export const productManager = new ProductManager(pathProducts);
export const cartManager = new CartManager(pathCarts);

const httpsServer = app.listen(PORT, () => {
    console.log(`Servidor con express online en el Port: ${PORT}`);
})

const io = new Server(httpsServer);

const users = {};

io.on ("connection", (socket)=>{
    console.log("Un nuevo usuario se ha conectado")
    socket.on("newUser", (username)=>{
        users[socket.id] = username
        io.emit("userConnected", username)
    })

    socket.on("chatMessage", async (data) => {
        const { username, message } = data;
        try {
            await messagesMN.addChat(username, message);
            io.emit("message", { username, message });
        } catch (error) {
            console.error("Error al procesar el mensaje del chat, intentalo de nuevo", error);
        }
    });

    socket.on("disconnect", ()=>{
        const username = users[socket.id]
        delete users[socket.id]
        io.emit("userDisconnected", username)
    })
})

mongoose.connect("mongodb+srv://hamiltonprop03:2BVWOVIyMW5j0pmY@cluster0.f5bo2kd.mongodb.net/ecommerce?retryWrites=true&w=majority")
.then(() => {
    console.log("Connected to the database");
})
.catch(error => {
    console.error("Error connecting to the database", error);
})