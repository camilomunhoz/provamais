<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class EmptyOptions implements Rule
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
        else {
            $value = json_decode($value);   
            $ok = true;
            foreach ($value as $v) {
                $delta = json_decode($v->delta);
                if (preg_match('/^(?:\s+)?\\n$/', $delta->ops[0]->insert)) {
                    $ok = false;
                    break;
                }
            }
            return $ok;
        }
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'Preencha todas as alternativas. ';
    }
}
