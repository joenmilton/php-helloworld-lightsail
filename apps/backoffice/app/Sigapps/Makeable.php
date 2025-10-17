<?php
namespace App\Sigapps;

trait Makeable
{
    public static function make(...$params) : static
    {
        return new static(...$params);
    }
}
