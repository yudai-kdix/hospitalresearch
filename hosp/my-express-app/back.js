require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const app = express();

// CORSを全てのルートで有効化
app.use(cors());

app.use(express.json());

app.post("/fetch-gpt", async (req, res) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // 環境変数からAPIキーを取得
    },
    body: JSON.stringify(req.body), // フロントエンドから受け取ったリクエストボディをそのまま使用
  });
  const data = await response.json();
  res.send(data); // OpenAIからのレスポンスをクライアントに送り返す
});

// クライアントからのリクエストをプロキシするエンドポイント
app.post("/get-places", async (req, res) => {
  // クライアントから受け取ったパラメータを使用してURLを構築
  const { lat, lng, hospitalType } = req.body;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY; // 環境変数からAPIキーを取得
  const radius = 3000;

  // Google Places APIのURL
  let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&language=ja&keyword=${encodeURIComponent(
    hospitalType
  )}&key=${apiKey}`;

  try {
    const response = await fetch(url); // Google Places APIにリクエストを送信
    const data = await response.json(); // レスポンスのJSONを解析

    // レスポンスデータをクライアントに送信
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
