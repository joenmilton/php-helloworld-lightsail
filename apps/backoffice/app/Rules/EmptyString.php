<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class EmptyString implements Rule
{
    public function passes($attribute, $value)
    {
        return $value == '';
    }

    public function message()
    {
        return 'The :attribute must be an empty string.';
    }
}

