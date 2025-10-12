<?php
namespace App\Sigapps\Filters;

use App\Sigapps\Fields\HasOptions;
use App\Sigapps\Fields\ChangesKeys;

class Optionable extends Filter
{
    use ChangesKeys,
        HasOptions;
}
