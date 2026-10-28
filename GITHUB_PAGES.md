# GitHub Pagesへの公開

1. GitHubで公開用リポジトリ（例: resyuu）を作成します。
2. このZIPを展開し、index.htmlがリポジトリ直下になるよう全ファイルをアップロードします。ZIPそのものはアップロードしません。
3. Settings → Pages → Build and deploymentで「Deploy from a branch」を選び、main・/(root)を保存します。
4. 公開完了後、Pages画面に表示されるURLを開きます。
5. 学部・年度の選択、PDF読取、結果表示、ホーム画面追加を実機確認します。
6. 動作確認後、案内リンクを新URLへ変更します。旧Cloudflareサイトの停止は別途行います。

この版は静的ファイルのみで動作します。GitHub Pagesのサブディレクトリに対応したmanifest、GitHub向け配信元表記、同一ドメインの別サイトを巻き込まないService Worker解除を含みます。既存の独立PDF Workerと判定ルールは維持しています。オフライン動作は提供しません。

公開URLが変わるため、旧URLでホーム画面に追加していた場合は新URLから追加し直してください。
