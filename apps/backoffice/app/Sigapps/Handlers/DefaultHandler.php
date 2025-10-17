<?php

namespace App\Sigapps\Handlers;

class DefaultHandler implements TypeHandlerInterface
{
    public function handle($rule)
    {
        return $rule['value'] ?? '';
    }
}