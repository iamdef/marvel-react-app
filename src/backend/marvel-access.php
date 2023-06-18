<?php

    $apiBase = 'https://gateway.marvel.com:443/v1/public/';
    $privAPIKey = 'apikey=';
    $pubAPIKey = 'apikey=';
    $baseOffset = 210;
    $ts = 1;
    $hash = md5('');
    
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    curl_setopt($ch, CURLOPT_URL, $apiBase.'characters?ts='.$ts.'&limit=9&offset='.$baseOffset.'&'.$pubAPIKey.'&hash='.$hash);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    echo $response;
?>