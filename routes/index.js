const url = require("url");
const express = require("express");
const router = express.Router();
const needle = require("needle");
const apicache = require("apicache");

// ============== Env vars ==============
const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;
const API_KEY_VALUE = process.env.API_KEY_VALUE;

// ============== Init cache ==============
let cache = apicache.middleware;

// ============== 設定路由 ==============
router.get("/", cache("2 minutes"), async (req, res) => {
    // res.json({ success: true })
    try{
        // 1. 從url字串中擷取query部分，並回傳物件格式
        console.log(url.parse(req.url, true).query);            // /api?city=taipei&name=allen  轉成  { city: 'taipei', name: 'allen' }

        // 2. URLSearchParams內部以物件形式代入，從url string的query的物件透過 "展開運算子" 與 api-key合併
            //例如：  { A:'a', ...{B:'b', C:'c'} }  展開運算子後變成  { A:'a', B:'b', C:'c' }
        const params = new URLSearchParams({
            [API_KEY_NAME]: API_KEY_VALUE,
            ...url.parse(req.url, true).query,
        })
        console.log(params);

        const apiRes = await needle('get', `${API_BASE_URL}?${params}`);
        // promise物件內的body: { cod:..., message:...}
        const data = apiRes.body;

        // Log the request to the public API
        if(process.env.NODE_ENV !== "production") {
            console.log(`REQUEST: ${API_BASE_URL}?${params}`);
        }

        // 將送出response的資料轉成json並回傳至前端
        res.status(200).json(data);
    } catch(error) {
        res.status(500).json(error);
    }
})

module.exports = router;