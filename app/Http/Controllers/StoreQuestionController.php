<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\DB;
use App\Http\Requests\StoreQuestionRequest;
use App\Models\User;
use App\Models\Question;
use App\Models\Option;

class StoreQuestionController extends Controller
{
    public function store_question(StoreQuestionRequest $request){

        $question = new Question;

        $question->user_id = Auth::user()->id;

        ($request->subject_id) ? $question->subject_id = $request->subject_id
        : $response[''];

        $question->private = $request->private;
        
        $question->type = ucwords($request->type); // Capitaliza a primeira letra

        $request->statement = preg_replace('/\s+/', ' ', $request->statement);  // Tira espaços múltiplos
        $question->statement = $request->statement;


        $question->content = $request->content;
        trim($question->content);                                            // Tira espaços no início e fim
        $question->content = preg_replace('/\s+/', ' ', $question->content);  // Tira espaços múltiplos
        $question->content = filter_var($question->content, FILTER_SANITIZE_STRING);

        $question->n_lines = $request->n_lines;

        $question->answer_suggestion = $request->answer_suggestion;
        $question->answer_suggestion = filter_var($question->answer_suggestion, FILTER_SANITIZE_STRING);

        $question->image = $request->image;             // apenas por enquanto
        $question->other_terms = $request->other_terms; // apenas por enquanto
        
        $question->save();

        dd($question);

        for($i = 0; $i < count($request->options); $i++){
            $option = new Option;
            $option->id_quest = $question->id;
            $option->order = $request->options[$i]['order'];
            $option->content = $request->options[$i]['delta'];
            $option->correct = ''; // apenas por enquanto
        }

        // type: questType,                                                // Tipo da questão
        // statement: JSON.stringify(enunciado.getContents()),             // Enunciado. getContents() pega o delta do enunciado.
        // options: altDeltas,                                             // Alternativas. Envia os deltas coletados.
        // n_lines: nLines,                                                // Número de linhas
        // privacy: $("#new-quest :input[type='radio']:checked").val(),    // Opção de privacidade
        // subject: $('#subject').find(':selected').val(),                 // Disciplina. Envia o id, não o nome.
        // content: $('#content-tag').val(),                               // Conteúdo
        // other_terms: $('#other-terms').val(),                           // Outros termos
        // image: '',                                                      // Imagem
        // rightOption: '',                                                // Alternativa correta
        // answer: ''                                                      // Sugestão de resposta

        echo json_encode($question->statement);
    }
}
