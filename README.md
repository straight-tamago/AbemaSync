# AbemaSync
AbemaTV用のFireFox拡張機能です。複数台で同期視聴することができます。（友達と通話しながら一緒に見れます）  

自分用に作りましたが、公開します。  
Firefoxクライアント、PHPサーバーが必要です。（websocketは使用しません）（lolipopの無料お試しがいいと思います）

# 使用方法
- Serverの中身をPHPサーバーに配置してください。
- Firefoxへのインストールは、ハンバーガー > アドオンとテーマ > 歯車 > アドオンをデバッグ > 一時的なアドオンを読み込む > manifest.jsonを指定
- 拡張機能の設定で、index.phpのurlを指定する。
- 複数台で同時に開いて同期されているか確認する。
- 終わりです。

# 使用上の注意点
- このプログラムの使用によって生じたいかなる他の損害に対して、作者は一切責任を負いません。
