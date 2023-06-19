<?php

    $object = $_GET['object'];
    $id = $_GET['id'];
    $name = $_GET['name'];

    $apiBase = 'https://gateway.marvel.com:443/v1/public/';
    $privAPIKey = 'apikey=';
    $pubAPIKey = 'apikey=';
    $baseOffset = 210;
    $ts = 1;
    $hash = md5('');

    switch ($object) {
        case 'allCharacters':
            $url = $apiBase.'characters?ts='.$ts.'&limit=9&offset='.$baseOffset.'&'.$pubAPIKey.'&hash='.$hash;
            break;
        case 'character':
            $url = $apiBase.'characters?id='.$id.'&ts='.$ts.'&'.$pubAPIKey.'&hash='.$hash;
            break;
        case 'characterByName':
            $url = $apiBase.'characters?name='.$name.'&ts='.$ts.'&'.$pubAPIKey.'&hash='.$hash;
            break;
        case 'allComics':
            $url = $apiBase.'comics?ts='.$ts.'&limit=8&offset='.$baseOffset.'&'.$pubAPIKey.'&hash='.$hash;
            break;
        case 'comic':
            $url = $apiBase.'comics/'.$id.'?ts='.$ts.'&limit=8&offset='.$baseOffset.'&'.$pubAPIKey.'&hash='.$hash;
            break;
    }
    
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    curl_setopt($ch, CURLOPT_URL, $url);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    echo $response;
?>