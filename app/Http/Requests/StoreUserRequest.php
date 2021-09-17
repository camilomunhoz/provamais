<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Password;
use App\Rules\FullName;

class StoreUserRequest extends FormRequest
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
            'name' => ['required', 'max:146', new FullName, 'regex:/^[A-z\sãÃéÉâÂüÜöÖóÓçÇ]+$/'],
            'cpf' => 'required|max:14|unique:users,cpf|regex:/^\d{3}[.]\d{3}[.]\d{3}[-]\d{2}/',
            'email' => 'required|max:255|email:rfc,dns|unique:users,email',
            'password' => 'required|max:255|min:8|regex:/^(?=.*[A-Z])(?=.*\d)[A-z\d]/|confirmed',
            'password_confirmation' => 'required|max:255',
        ];
    }
    public function messages(){
        return [
            'name.regex' => 'O nome deve conter apenas letras.',
            'email.email' => 'E-mail inválido.',
            'email.unique' => 'Este e-mail já está cadastrado.',
            'cpf.unique' => 'Este CPF já está cadastrado.',
            'cpf.regex' => 'O formato do CPF deve ser 000.000.000-00.',
            'password.confirmed' => 'A confirmação de senha não correspondeu.',
            'password.regex' => ' ',
            'password.min' => ' ',
            'password.required' => ' '
        ];
    }
}
