
import express from "express";
import { prisma } from "./script";

const app = express();
app.use(express.json());

 const createUser = async () => {
    const user = await prisma.user.create({
        data: {
            nom: "Balde",
            prenoms: "Saliou",
            tel: "620000000",
            avatar: "image_url"
        }
    });
    return user
}

app.get("/", async (req, res) => {
    const user = await createUser();
        res.json({message : user })
});



app.listen(3000, () => {
    console.log(`Server is running on port`);
});