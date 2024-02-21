import { Router } from "express";
import MessagesManagerMN from "../src/dao/MN/MessagesManagerMN.js";

const messagesRouter = Router();
const messagesMN = new MessagesManagerMN();

messagesRouter.get ("/", async (req, res) => {
    res.render("chat.handlebars")
})

messagesRouter.post ("/", async (req, res) => {
    const { username, message } = req.body; 
    try {
        const result = await messagesMN.addChat(username, message); 
        res.json({ result: "success", payload: result }); 
    } catch (error) {
        console.error("Error al guardar el mensaje", error);
        
    }
});

export {messagesRouter, messagesMN};