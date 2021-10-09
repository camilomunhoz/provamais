<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class EmptyQuill implements Rule
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
        $value = json_decode($value);
        return (!preg_match('/^(?:\s+)?\\n$/', $value->ops[0]->insert));
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'Preencha esse campo.';
    }
}
