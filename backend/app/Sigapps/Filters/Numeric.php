<?php
namespace App\Sigapps\Filters;

class Numeric extends Filter
{
    /**
     * Defines a filter type
     *
     * @return string
     */
    public function type() : string
    {
        return 'numeric';
    }
}
