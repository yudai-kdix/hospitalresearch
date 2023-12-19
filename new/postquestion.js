document.addEventListener("DOMContentLoaded", (event) => {
  document
    .getElementById("submit-symptoms")
    .addEventListener("click", function () {
      var symptoms = document.getElementById("symptoms-input").value;

      // deno-lint-ignore no-var
      var requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "以下の症状に最適な病院の種類は何ですか？ 単語のみで答えてください(例:耳鼻科)" +
                symptoms,
            },
          ],
          max_tokens: 50,
          temperature: 0.2,
        }),
      };

      fetch("http://localhost:3000/fetch-gpt", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          // ChatGPTのレスポンスから病院の種類を取得
          // deno-lint-ignore no-var
          var hospitalType = data.choices[0].message.content.trim();

          // Google Maps検索ページへのリンクを生成
          // deno-lint-ignore no-var
          var searchPageUrl =
            "search-page.html?hospitalType=" + encodeURIComponent(hospitalType);
          // リンクを表示
          window.location.href = searchPageUrl;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
});

