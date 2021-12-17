const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const app = express();

// ============== Rate limiting ==============
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB or API Gateway, Nginx, etc)
// see https://expressjs.com/zh-tw/guide/behind-proxies.html
// app.set('trust proxy', 1);
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,   // 10 Mins
    max: 100                      // limit each IP to 100 requests per windowMs
});
//  apply to all requests
app.use(limiter);
app.set("trust proxy", 1);

// ============== Set staatic folder ==============
// 參考網址：https://expressjs.com/zh-tw/starter/static-files.html
app.use(express.static("public"));

// ============== Routes ==============
app.use("/api", require("./routes/index"));

app.use(cors());

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});