<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class MinimumOptions implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        if ($value == 'none') {
            return true;
        }
        else { // A questão deve no mínimo duas alternativas.
            $value = json_decode($value);
            return (count($value) > 1);
        }
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'A questão deve conter no mínimo duas alternativas.';
    }
}
