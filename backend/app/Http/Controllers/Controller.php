<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\MessageBag;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function __construct() {
    }

    public function response($data, $message = "", $errors = [], $response_code = 200) {
        $response = [
            'httpCode' => $response_code,
            'message' => $message,
            'errors' => $errors
        ];

        if(is_null($data))
            $response['data'] = null;
        else
            $response['data'] = $data;

        return response()->json($response);
    }

    public function appResponse($data, MessageBag $errors = null, $response_code = 200, $message = "") {
        $response = [
            'httpCode'  => $response_code,
            'message'   => $message,
            'errors'    => '',
            'error'     => ''
        ];
        if($errors instanceof MessageBag) {
            $response['errors'] = $errors;
            $response['error']  = implode(', ', $errors->all());
        }
        
        if(is_null($data))
            $response['data'] = null;
        else
            $response['data'] = $data;

        return response()->json($response);
    }
}
