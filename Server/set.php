<?php
    if (!file_exists('./currentTime.txt')) {
	file_put_contents("./currentTime.txt", '{}', LOCK_EX);
    }

    $post = file_get_contents('php://input');
    $dict = json_decode($post, true);

    $pre_data = json_decode(file_get_contents("./currentTime.txt"), true);
    $pre_data["host"] = $dict["udid"];
    file_put_contents("./currentTime.txt", json_encode($pre_data));

    echo "ok";
?>