import dotenv from "dotenv";
import express from "express";
import bodyParser from 'body-parser'
import ParkingLotRoute from "./routes/parking-lots"
import TicketRoute from "./routes/tickets"

// initialize configuration
dotenv.config();

const app = express()
const port = process.env.SERVER_PORT; // default port to listen

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use("/parking-lots", ParkingLotRoute)
app.use("/tickets", TicketRoute)

app.listen(port, () => {
    console.log("start server at port:", port)
})