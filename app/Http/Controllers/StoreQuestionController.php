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
        // dd($request);
        $question = new Question;

        // Owner
        $question->user_id = Auth::user()->id;

        // Identificador
        $question->identifier = $request->identifier;

        // Privacidade
        $question->private = $request->private;
        
        // Tipo da questão
        $question->type = ucwords($request->type); // Capitaliza a primeira letra

        // Enunciado
        $request->statement = preg_replace('/\s+/', ' ', $request->statement);  // Tira espaços múltiplos
        $question->statement = $request->statement;
        
        // Disciplina
        $question->subject_id = $request->subject_id;

        // Conteúdo
        $question->content = $request->content;
        trim($question->content);                                             // Tira espaços no início e fim
        $question->content = preg_replace('/\s+/', ' ', $question->content);  // Tira espaços múltiplos
        $question->content = ucwords($question->content);                     // Capitaliza as primeiras letras
        $question->content = filter_var($question->content, FILTER_SANITIZE_STRING);

        // Número de linhas
        $question->n_lines = $request->n_lines;

        // Sugestão de resposta
        $question->answer_suggestion = $request->answer_suggestion;
        $question->answer_suggestion = filter_var($question->answer_suggestion, FILTER_SANITIZE_STRING);

        // Imagem
        if($request->hasFile('image') && $request->image_flag){
            if($request->file('image')->isValid()){
                $img = $request->image;
                $img_ext = $img->extension();
                $img_name = md5($img->getClientOriginalName() . strtotime("now")) . '.' . $img_ext;
                
                $img->move(public_path('img/questions_images'), $img_name);  
                $question->image = $img_name;
            }
        } else {
            $question->image = NULL;
        }
        
        // Outros termos para busca
        $question->other_terms = $request->other_terms; // apenas por enquanto
        
        // Salvando a questão...
        $question->save();

        // Para questões alternativas
        if ($question->type == 'Objetiva') {
            
            $options = json_decode($request->options);
            // dd($options);

            // Selecionando o id da questão recém salva para referenciar nas alternativas...
            $quest = Question::select('id')->firstWhere('identifier', $question->identifier);
            
            // Salvando as alternativas...
            for($o = 0; $o < count($options); $o++){
                $option = new Option;
                $option->question_id = $quest->id;
                $option->content = $options[$o]->delta;
                if ($options[$o]->order == $request->correct) {
                    $option->correct = 1; //true
                }
                $option->order = $options[$o]->order;
                $option->timestamps = false;
                $option->save();
            }
        }
    }
}
