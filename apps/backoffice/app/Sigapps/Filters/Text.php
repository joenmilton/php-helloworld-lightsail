<?php
namespace App\Sigapps\Filters;

class Text extends Filter
{
    /**
     * Defines a filter type
     *
     * @return string
     */
    public function type() : string
    {
        return 'text';
    }
}
