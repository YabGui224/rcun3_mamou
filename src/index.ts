
import express from "express";
import { prisma } from "./script";
import userRoute from "./routes/users";

const app = express();
app.use(express.json());

app.use('/api/users', userRoute );


app.listen(3000, () => {
    console.log(`Server is running on port`);
});