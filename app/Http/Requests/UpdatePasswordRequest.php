<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Password;

class UpdatePasswordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'token' => 'required',
            'email' => 'required|max:255|email:rfc,dns',
            'password' => 'required|max:255|min:8|regex:/^(?=.*[A-Z])(?=.*\d)[A-z\d]/|confirmed',
            'password_confirmation' => 'required|max:255',
        ];
    }

    public function messages() {
        return [
            'password.confirmed' => 'A confirmação de senha não correspondeu.',
            'password.min' => 'A senha deve ter tamanho mínimo de 8 caracteres.',
            'password.regex' => 'A senha não cumpriu os requisitos.',
            'password.required' => 'Preencha a senha',
        ];
    }
}
