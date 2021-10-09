<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\EmptyQuill;

class StoreQuestionRequest extends FormRequest
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
            'subject_id' => 'required',
            'type' => 'required',
            'content' => 'required',
            'statement' => [new EmptyQuill],
            'n_lines' => 'max:99|numeric|min:1',
            'correct' => 'required',
        ];
    }
    public function messages(){
        return [
            'correct.required' => 'Selecione.',
        ];
    }
}
