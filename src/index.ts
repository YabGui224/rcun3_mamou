
import express from "express";
import userRoute from "./routes/users";
import contactRoute from "./routes/contacts";
import notificationRoute from "./routes/notifications";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { login, logout, profil, refreshToken } from "./controllers/login";
import { createUser, resetPasswordWithEmail, verifyOtpAndResetPassword } from "./controllers/users";

const app = express();
app.use(express.json());


app.post('/send-otp', resetPasswordWithEmail);
app.post('/verify-otp', verifyOtpAndResetPassword);
app.use('/login', login);
app.post('/register', createUser);
app.use('/profil', [isAuthenticated], profil);
app.get('/refresh-token', refreshToken);
app.use('/logout',[isAuthenticated], logout);
app.use('/api/users', userRoute);
app.use('/api/contacts',[isAuthenticated], contactRoute);
app.use('/api/notifications',[isAuthenticated], notificationRoute);

app.listen(3000, () => {
    console.log(`Server is running on port`);
});