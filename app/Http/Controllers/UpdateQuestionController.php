<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; 
use Illuminate\Support\Facades\DB;
use App\Http\Requests\UpdateQuestionRequest;
use App\Models\User;
use App\Models\Question;
use App\Models\Option;

class UpdateQuestionController extends Controller
{
    public function update_question(UpdateQuestionRequest $request){

        // Seleciona a questão pre-existente através de seu identificador
        $question = Question::firstWhere('identifier', $request->identifier);

                                // Caso o tipo da questão seja mudado de objetiva para dissertativa, apaga as alternativas 
                                if ($question->type == 'Objetiva' && $request->type == 'dissertativa') {
                                    foreach ($question->options as $o) {
                                        $o->delete();
                                    }
                                }

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

        /****************************************************************************************************************/
        /**************************************   Para questões objetivas    ********************************************/
        /****************************************************************************************************************/

        if ($question->type == 'Objetiva') {
            
            $options = json_decode($request->options);
            // dd($options);

            // Selecionando o id da questão recém salva para referenciar nas alternativas...
            $quest = Question::select('id')->firstWhere('identifier', $question->identifier);

            // Apagando as alternativas que não vieram no post...
            $quest->options; // Puxando as options do banco
            for ($o = 0; $o < count($quest->options); $o++) { // Percorre todas as options pre-existentes da questão

                // Procura um id dentre as options enviadas que não coincida com os ids do banco
                for ($i = 0; $i < count($options); $i++) {

                    // Caso os ids coincidam, quebra esse laço e vai para o próximo id
                    if ($options[$i]->id == $quest->options[$o]->id) break;

                    // Se chega na última iteração e não executou o break, significa que a option do banco não existe mais
                    if ($i == count($options)-1) {
                        $option_to_delete = Option::firstWhere('id', $quest->options[$o]->id);
                        $option_to_delete->delete();
                    }
                }
            }
            
            // Salvando as alternativas...
            for ($o = 0; $o < count($options); $o++) {

                // Se a opção tiver id, vai modificar, se não, vai criar outra
                $option = $options[$o]->id ? Option::firstWhere('id', $options[$o]->id) : new Option;

                // Caso a option não tenha id, ela não existe ainda, então necessita do quest_id referente a esta questão
                if (!$options[$o]->id) $option->question_id = $quest->id;
                    
                // Conteúdo da option
                $option->content = $options[$o]->delta;

                // É correta ou não
                if ($options[$o]->order == $request->correct) {
                    $option->correct = 1; //true
                }
                else { $option->correct = NULL; }

                // Order da option
                $option->order = $options[$o]->order;

                // Salvando...
                $option->timestamps = false;
                $option->save();
            }
        }
    }
}
