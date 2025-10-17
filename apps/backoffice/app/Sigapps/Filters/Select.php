<?php
namespace App\Sigapps\Filters;

class Select extends Optionable
{
    /**
     * Defines a filter type
     *
     * @return string
     */
    public function type() : string
    {
        return 'select';
    }
}
